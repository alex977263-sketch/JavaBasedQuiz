package com.javaquiz;

import com.javaquiz.dto.*;
import com.javaquiz.entity.OptionKey;
import com.javaquiz.entity.Quiz;
import com.javaquiz.entity.User;
import com.javaquiz.exception.DuplicateSubmissionException;
import com.javaquiz.repository.QuizRepository;
import com.javaquiz.repository.UserRepository;
import com.javaquiz.service.QuizAttemptService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class QuizAttemptServiceIntegrationTest {

    @Autowired
    private QuizAttemptService attemptService;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void startEvaluateAndPreventDuplicateSubmission() {
        User participant = userRepository.findByEmail("participant@javaquiz.com").orElseThrow();
        Quiz quiz = quizRepository.findBySlug("java-core-variables-control-flow").orElseThrow();

        StartAttemptResponse started = attemptService.startQuizAttempt(participant.getId(), quiz.getId(), true);
        assertThat(started.getAttemptToken()).isNotBlank();
        assertThat(started.getQuestions()).hasSize(quiz.getQuestions().size());

        // Prepare 100% correct answers from persisted entities
        Map<Long, OptionKey> answers = new HashMap<>();
        quiz.getQuestions().forEach(q -> answers.put(q.getId(), q.getCorrectOptionKey()));

        SubmitQuizRequest submitRequest = SubmitQuizRequest.builder()
                .attemptToken(started.getAttemptToken())
                .answers(answers)
                .timeTakenSeconds(120)
                .build();

        QuizAttemptResultDto result = attemptService.submitQuiz(participant.getId(), quiz.getId(), submitRequest);
        assertThat(result.getIsPassed()).isTrue();
        assertThat(result.getPercentage().doubleValue()).isEqualTo(100.0);
        assertThat(result.getCorrectAnswersCount()).isEqualTo(quiz.getQuestions().size());
        assertThat(result.getReviews()).hasSize(quiz.getQuestions().size());

        // Attempting to resubmit the same attemptToken must throw DuplicateSubmissionException
        assertThatThrownBy(() -> attemptService.submitQuiz(participant.getId(), quiz.getId(), submitRequest))
                .isInstanceOf(DuplicateSubmissionException.class);
    }
}
