package com.javaquiz;

import com.javaquiz.dto.QuizPerformanceReportDto;
import com.javaquiz.dto.StartAttemptResponse;
import com.javaquiz.dto.SubmitQuizRequest;
import com.javaquiz.entity.OptionKey;
import com.javaquiz.entity.Quiz;
import com.javaquiz.entity.User;
import com.javaquiz.repository.QuizRepository;
import com.javaquiz.repository.UserRepository;
import com.javaquiz.service.QuizAnalyticsService;
import com.javaquiz.service.QuizAttemptService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class QuizAnalyticsServiceTest {

    @Autowired
    private QuizAnalyticsService analyticsService;

    @Autowired
    private QuizAttemptService attemptService;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void generatesPerQuizAndPerQuestionAccuracyReport() {
        User participant = userRepository.findByEmail("participant@javaquiz.com").orElseThrow();
        Quiz quiz = quizRepository.findBySlug("java-core-variables-control-flow").orElseThrow();

        StartAttemptResponse started = attemptService.startQuizAttempt(participant.getId(), quiz.getId(), false);
        Map<Long, OptionKey> answers = new HashMap<>();
        quiz.getQuestions().forEach(q -> answers.put(q.getId(), q.getCorrectOptionKey()));

        attemptService.submitQuiz(participant.getId(), quiz.getId(), SubmitQuizRequest.builder()
                .attemptToken(started.getAttemptToken())
                .answers(answers)
                .timeTakenSeconds(100)
                .build());

        QuizPerformanceReportDto report = analyticsService.generateQuizReport(quiz.getId());
        assertThat(report.getTotalAttempts()).isEqualTo(1);
        assertThat(report.getPassRatePercentage()).isEqualTo(100.0);
        assertThat(report.getQuestionAccuracies()).hasSize(quiz.getQuestions().size());
        assertThat(report.getQuestionAccuracies().get(0).getAccuracyPercentage()).isEqualTo(100.0);
    }
}
