package com.javaquiz.service;

import com.javaquiz.dto.*;
import com.javaquiz.entity.*;
import com.javaquiz.exception.BadRequestException;
import com.javaquiz.exception.ResourceNotFoundException;
import com.javaquiz.exception.UnauthorizedAccessException;
import com.javaquiz.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParticipantPortalService {

    private final QuizAttemptRepository attemptRepository;
    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final InteractionRepository interactionRepository;
    private final QuizReminderRepository reminderRepository;
    private final SystemSettingsRepository settingsRepository;
    private final DtoMapper mapper;

    @Transactional(readOnly = true)
    public ParticipantStatsDto getParticipantStats(Long userId) {
        List<QuizAttempt> attempts = attemptRepository.findByUserIdAndStatusOrderBySubmittedAtDesc(
                userId, AttemptStatus.SUBMITTED);

        if (attempts.isEmpty()) {
            return ParticipantStatsDto.builder()
                    .quizzesAttempted(0)
                    .quizzesPassed(0)
                    .averageScore(0.0)
                    .bestScore(0.0)
                    .totalTimeSpentSeconds(0)
                    .categoryProficiency(Map.of())
                    .build();
        }

        long passed = attempts.stream().filter(a -> Boolean.TRUE.equals(a.getIsPassed())).count();
        double avg = attempts.stream().mapToDouble(a -> a.getPercentage().doubleValue()).average().orElse(0.0);
        double best = attempts.stream().mapToDouble(a -> a.getPercentage().doubleValue()).max().orElse(0.0);
        long totalTime = attempts.stream().mapToLong(QuizAttempt::getTimeTakenSeconds).sum();

        Map<String, List<Double>> categoryScores = new LinkedHashMap<>();
        for (QuizAttempt attempt : attempts) {
            String catName = attempt.getQuiz().getCategory().getName();
            categoryScores.computeIfAbsent(catName, k -> new ArrayList<>())
                    .add(attempt.getPercentage().doubleValue());
        }

        Map<String, ParticipantStatsDto.CategoryProficiency> proficiencyMap = new LinkedHashMap<>();
        categoryScores.forEach((catName, scores) -> {
            double catAvg = scores.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
            proficiencyMap.put(catName, ParticipantStatsDto.CategoryProficiency.builder()
                    .attempted(scores.size())
                    .avgPercentage(Math.round(catAvg * 100.0) / 100.0)
                    .build());
        });

        return ParticipantStatsDto.builder()
                .quizzesAttempted(attempts.size())
                .quizzesPassed(passed)
                .averageScore(Math.round(avg * 100.0) / 100.0)
                .bestScore(Math.round(best * 100.0) / 100.0)
                .totalTimeSpentSeconds(totalTime)
                .categoryProficiency(proficiencyMap)
                .build();
    }

    @Transactional(readOnly = true)
    public List<LeaderboardEntryDto> getLeaderboard() {
        List<QuizAttempt> allSubmitted = attemptRepository.findByStatusOrderBySubmittedAtDesc(AttemptStatus.SUBMITTED);
        Map<Long, List<QuizAttempt>> grouped = allSubmitted.stream()
                .collect(Collectors.groupingBy(a -> a.getUser().getId()));

        List<LeaderboardEntryDto> entries = new ArrayList<>();
        for (Map.Entry<Long, List<QuizAttempt>> entry : grouped.entrySet()) {
            List<QuizAttempt> userAttempts = entry.getValue();
            User user = userAttempts.get(0).getUser();
            int totalPoints = userAttempts.stream().mapToInt(QuizAttempt::getScore).sum();
            int passedCount = (int) userAttempts.stream().filter(a -> Boolean.TRUE.equals(a.getIsPassed())).count();
            double avgPct = userAttempts.stream()
                    .mapToDouble(a -> a.getPercentage().doubleValue())
                    .average()
                    .orElse(0.0);
            avgPct = Math.round(avgPct * 100.0) / 100.0;

            String badge = avgPct >= 90 ? "Java Grandmaster"
                    : avgPct >= 80 ? "Senior Architect"
                    : avgPct >= 70 ? "Certified Developer"
                    : "Rising Learner";

            entries.add(LeaderboardEntryDto.builder()
                    .userId(user.getId())
                    .userName(user.getFullName())
                    .userEmail(user.getEmail())
                    .quizzesAttempted(userAttempts.size())
                    .quizzesPassed(passedCount)
                    .totalPoints(totalPoints)
                    .averagePercentage(avgPct)
                    .badge(badge)
                    .build());
        }

        entries.sort(Comparator.comparingInt(LeaderboardEntryDto::getTotalPoints)
                .thenComparingDouble(LeaderboardEntryDto::getAveragePercentage)
                .reversed());

        for (int i = 0; i < entries.size(); i++) {
            entries.get(i).setRank(i + 1);
        }
        return entries;
    }

    @Transactional(readOnly = true)
    public List<InteractionDto> getMyInteractions(Long participantId) {
        return interactionRepository.findByParticipantIdOrderByCreatedAtDesc(participantId).stream()
                .map(mapper::toInteractionDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public InteractionDto sendInteraction(Long participantId, CreateInteractionRequest request) {
        SystemSettings settings = settingsRepository.findById(1L).orElse(null);
        if (settings != null && Boolean.FALSE.equals(settings.getAllowParticipantInteractions())) {
            throw new BadRequestException("Participant-Creator interactions are currently disabled by administrator.");
        }

        User participant = userRepository.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("Participant not found"));
        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + request.getQuizId()));

        ParticipantCreatorInteraction interaction = ParticipantCreatorInteraction.builder()
                .participant(participant)
                .creator(quiz.getCreatedBy())
                .quiz(quiz)
                .subject(request.getSubject().trim())
                .message(request.getMessage().trim())
                .status(InteractionStatus.OPEN)
                .build();

        return mapper.toInteractionDto(interactionRepository.save(interaction));
    }

    @Transactional(readOnly = true)
    public List<QuizReminderDto> getMyReminders(Long participantId) {
        return reminderRepository.findByParticipantIdOrderByCreatedAtDesc(participantId).stream()
                .map(mapper::toReminderDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public QuizReminderDto addReminder(Long participantId, CreateReminderRequest request) {
        User participant = userRepository.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("Participant not found"));
        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + request.getQuizId()));

        QuizReminder reminder = QuizReminder.builder()
                .participant(participant)
                .quiz(quiz)
                .reminderDateTime(request.getReminderDateTime().trim())
                .note(request.getNote())
                .isCompleted(false)
                .build();

        return mapper.toReminderDto(reminderRepository.save(reminder));
    }

    @Transactional
    public QuizReminderDto toggleReminderCompleted(Long participantId, Long reminderId) {
        QuizReminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with ID: " + reminderId));
        if (!reminder.getParticipant().getId().equals(participantId)) {
            throw new UnauthorizedAccessException("Cannot modify another participant's reminder.");
        }
        reminder.setIsCompleted(!Boolean.TRUE.equals(reminder.getIsCompleted()));
        return mapper.toReminderDto(reminderRepository.save(reminder));
    }

    @Transactional
    public void deleteReminder(Long participantId, Long reminderId) {
        QuizReminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with ID: " + reminderId));
        if (!reminder.getParticipant().getId().equals(participantId)) {
            throw new UnauthorizedAccessException("Cannot delete another participant's reminder.");
        }
        reminderRepository.delete(reminder);
    }
}
