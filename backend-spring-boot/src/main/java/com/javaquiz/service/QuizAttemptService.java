package com.javaquiz.service;

import com.javaquiz.concurrent.QuizSessionMonitor;
import com.javaquiz.dto.*;
import com.javaquiz.entity.*;
import com.javaquiz.exception.BadRequestException;
import com.javaquiz.exception.DuplicateSubmissionException;
import com.javaquiz.exception.ResourceNotFoundException;
import com.javaquiz.exception.UnauthorizedAccessException;
import com.javaquiz.repository.QuizAttemptRepository;
import com.javaquiz.repository.QuizRepository;
import com.javaquiz.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizAttemptService {

    private final QuizRepository quizRepository;
    private final UserRepository userRepository;
    private final QuizAttemptRepository attemptRepository;
    private final DtoMapper mapper;
    private final QuizSessionMonitor sessionMonitor;

    /**
     * Starts a timed quiz attempt for a participant.
     * Questions and options are optionally shuffled, and correct answers are never exposed.
     */
    @Transactional
    public StartAttemptResponse startQuizAttempt(Long userId, Long quizId, boolean shuffle) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + quizId));

        if (!Boolean.TRUE.equals(quiz.getIsActive()) || quiz.getApprovalStatus() != ApprovalStatus.APPROVED) {
            throw new BadRequestException("This quiz is not currently active or approved for attempts.");
        }
        if (quiz.getQuestions().isEmpty()) {
            throw new BadRequestException("Quiz contains no questions yet.");
        }

        // Reuse an active IN_PROGRESS attempt if present to avoid orphan sessions, or create fresh
        Optional<QuizAttempt> existingInProgress = attemptRepository
                .findFirstByQuizIdAndUserIdAndStatus(quizId, userId, AttemptStatus.IN_PROGRESS);
        if (existingInProgress.isPresent()) {
            QuizAttempt existing = existingInProgress.get();
            Instant expiresAt = existing.getStartedAt().plusSeconds(quiz.getDurationMinutes() * 60L);
            if (Instant.now().isBefore(expiresAt)) {
                return buildStartResponse(quiz, existing, shuffle);
            }
            // Mark expired attempt as TIMED_OUT before creating new one
            existing.setStatus(AttemptStatus.TIMED_OUT);
            existing.setSubmittedAt(expiresAt);
            attemptRepository.save(existing);
        }

        int maxScore = quiz.getTotalMarks();
        Instant now = Instant.now();

        QuizAttempt attempt = QuizAttempt.builder()
                .quiz(quiz)
                .user(user)
                .attemptToken(UUID.randomUUID().toString())
                .status(AttemptStatus.IN_PROGRESS)
                .startedAt(now)
                .totalQuestions(quiz.getQuestions().size())
                .maxScore(maxScore)
                .build();

        QuizAttempt saved = attemptRepository.save(attempt);
        sessionMonitor.registerSession(saved.getAttemptToken(), userId, quizId, quiz.getDurationMinutes());
        return buildStartResponse(quiz, saved, shuffle);
    }

    /**
     * Evaluates and persists a quiz submission on the server side.
     * Enforces duplicate submission prevention via attemptToken and AttemptStatus.
     */
    @Transactional
    public QuizAttemptResultDto submitQuiz(Long userId, Long quizId, SubmitQuizRequest request) {
        QuizAttempt attempt = attemptRepository.findByAttemptToken(request.getAttemptToken())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or unknown quiz attempt token."));

        if (!attempt.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("You cannot submit another user's quiz attempt.");
        }
        if (!attempt.getQuiz().getId().equals(quizId)) {
            throw new BadRequestException("Attempt token does not match the requested quiz.");
        }
        if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
            throw new DuplicateSubmissionException("This quiz attempt has already been submitted.");
        }

        Quiz quiz = attempt.getQuiz();
        Instant now = Instant.now();
        int maxAllowedSeconds = quiz.getDurationMinutes() * 60;
        long elapsedSeconds = Duration.between(attempt.getStartedAt(), now).getSeconds();
        int recordedTimeSeconds = request.getTimeTakenSeconds() != null
                ? Math.min(Math.max(0, request.getTimeTakenSeconds()), maxAllowedSeconds)
                : (int) Math.min(Math.max(0L, elapsedSeconds), maxAllowedSeconds);

        Map<Long, OptionKey> submittedMap = request.getAnswers() != null ? request.getAnswers() : Map.of();

        int correctCount = 0;
        int incorrectCount = 0;
        int unansweredCount = 0;
        int totalScore = 0;
        int maxScore = 0;

        attempt.getSubmittedAnswers().clear();

        for (Question question : quiz.getQuestions()) {
            maxScore += question.getPoints();
            OptionKey selectedKey = submittedMap.get(question.getId());

            boolean isUnanswered = (selectedKey == null);
            boolean isCorrect = !isUnanswered && selectedKey == question.getCorrectOptionKey();
            int awarded = isCorrect ? question.getPoints() : 0;

            if (isUnanswered) {
                unansweredCount++;
            } else if (isCorrect) {
                correctCount++;
                totalScore += awarded;
            } else {
                incorrectCount++;
            }

            SubmittedAnswer sa = SubmittedAnswer.builder()
                    .attempt(attempt)
                    .question(question)
                    .selectedOptionKey(selectedKey)
                    .isCorrect(isCorrect)
                    .pointsAwarded(awarded)
                    .build();
            attempt.getSubmittedAnswers().add(sa);
        }

        BigDecimal percentage = maxScore > 0
                ? BigDecimal.valueOf(totalScore)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(maxScore), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        boolean isPassed = percentage.compareTo(BigDecimal.valueOf(quiz.getPassingPercentage())) >= 0;

        attempt.setStatus(AttemptStatus.SUBMITTED);
        attempt.setSubmittedAt(now);
        attempt.setTimeTakenSeconds(recordedTimeSeconds);
        attempt.setTotalQuestions(quiz.getQuestions().size());
        attempt.setCorrectAnswersCount(correctCount);
        attempt.setIncorrectAnswersCount(incorrectCount);
        attempt.setUnansweredCount(unansweredCount);
        attempt.setScore(totalScore);
        attempt.setMaxScore(maxScore);
        attempt.setPercentage(percentage);
        attempt.setIsPassed(isPassed);

        QuizAttempt saved = attemptRepository.save(attempt);
        sessionMonitor.completeSession(saved.getAttemptToken());
        return mapper.toAttemptResultDto(saved, true);
    }

    @Transactional(readOnly = true)
    public List<QuizAttemptResultDto> getMyAttemptsHistory(Long userId) {
        return attemptRepository.findByUserIdAndStatusOrderBySubmittedAtDesc(userId, AttemptStatus.SUBMITTED)
                .stream()
                .map(a -> mapper.toAttemptResultDto(a, true))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QuizAttemptResultDto getAttemptReview(Long userId, boolean isAdminOrCreator, Long attemptId) {
        QuizAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found with ID: " + attemptId));

        if (!isAdminOrCreator && !attempt.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("Participants can only access their own quiz results.");
        }
        if (attempt.getStatus() == AttemptStatus.IN_PROGRESS) {
            throw new BadRequestException("Answers and explanations are hidden until the quiz is submitted.");
        }
        return mapper.toAttemptResultDto(attempt, true);
    }

    private StartAttemptResponse buildStartResponse(Quiz quiz, QuizAttempt attempt, boolean shuffle) {
        List<Question> questionList = new ArrayList<>(quiz.getQuestions());
        if (shuffle) {
            Collections.shuffle(questionList);
        }

        List<QuestionForAttemptDto> sanitizedQuestions = new ArrayList<>();
        int displayOrder = 1;
        for (Question q : questionList) {
            List<QuestionOptionDto> optionDtos = q.getOptions().stream()
                    .sorted(Comparator.comparing(QuestionOption::getOptionKey))
                    .map(mapper::toQuestionOptionDto)
                    .collect(Collectors.toList());
            if (shuffle) {
                Collections.shuffle(optionDtos);
            }

            sanitizedQuestions.add(QuestionForAttemptDto.builder()
                    .id(q.getId())
                    .questionNumber(displayOrder++)
                    .questionText(q.getQuestionText())
                    .codeSnippet(q.getCodeSnippet())
                    .codeLanguage(q.getCodeLanguage())
                    .points(q.getPoints())
                    .difficulty(q.getDifficulty())
                    .options(optionDtos)
                    .build());
        }

        Instant expiresAt = attempt.getStartedAt().plusSeconds(quiz.getDurationMinutes() * 60L);

        return StartAttemptResponse.builder()
                .attemptId(attempt.getId())
                .attemptToken(attempt.getAttemptToken())
                .quizId(quiz.getId())
                .quizTitle(quiz.getTitle())
                .categoryName(quiz.getCategory().getName())
                .difficulty(quiz.getDifficulty())
                .durationMinutes(quiz.getDurationMinutes())
                .passingPercentage(quiz.getPassingPercentage())
                .startedAt(attempt.getStartedAt())
                .expiresAt(expiresAt)
                .questions(sanitizedQuestions)
                .build();
    }
}
