package com.javaquiz;

import com.javaquiz.dto.*;
import com.javaquiz.entity.OptionKey;
import com.javaquiz.entity.Quiz;
import com.javaquiz.entity.User;
import com.javaquiz.repository.QuizRepository;
import com.javaquiz.repository.UserRepository;
import com.javaquiz.service.ParticipantPortalService;
import com.javaquiz.service.QuizAttemptService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class ParticipantPortalServiceIntegrationTest {

    @Autowired
    private ParticipantPortalService portalService;

    @Autowired
    private QuizAttemptService attemptService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Test
    void calculatesStatsLeaderboardAndManagesReminders() {
        User participant = userRepository.findByEmail("participant@javaquiz.com").orElseThrow();
        Quiz quiz = quizRepository.findBySlug("oop-in-java").orElseThrow();

        StartAttemptResponse started = attemptService.startQuizAttempt(participant.getId(), quiz.getId(), false);
        Map<Long, OptionKey> answers = new HashMap<>();
        quiz.getQuestions().forEach(q -> answers.put(q.getId(), q.getCorrectOptionKey()));

        attemptService.submitQuiz(participant.getId(), quiz.getId(), SubmitQuizRequest.builder()
                .attemptToken(started.getAttemptToken())
                .answers(answers)
                .timeTakenSeconds(150)
                .build());

        ParticipantStatsDto stats = portalService.getParticipantStats(participant.getId());
        assertThat(stats.getQuizzesAttempted()).isGreaterThanOrEqualTo(1);
        assertThat(stats.getBestScore()).isEqualTo(100.0);
        assertThat(stats.getCategoryProficiency()).containsKey("Object-Oriented Programming");

        List<LeaderboardEntryDto> leaderboard = portalService.getLeaderboard();
        assertThat(leaderboard).isNotEmpty();
        assertThat(leaderboard.get(0).getRank()).isEqualTo(1);

        QuizReminderDto reminder = portalService.addReminder(
                participant.getId(),
                new CreateReminderRequest(quiz.getId(), "2026-12-15T10:00", "Final revision")
        );
        assertThat(reminder.getIsCompleted()).isFalse();

        QuizReminderDto toggled = portalService.toggleReminderCompleted(participant.getId(), reminder.getId());
        assertThat(toggled.getIsCompleted()).isTrue();
    }
}
