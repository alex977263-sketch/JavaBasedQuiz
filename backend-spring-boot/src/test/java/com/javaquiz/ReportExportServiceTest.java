package com.javaquiz;

import com.javaquiz.dto.*;
import com.javaquiz.entity.OptionKey;
import com.javaquiz.entity.Quiz;
import com.javaquiz.entity.User;
import com.javaquiz.repository.QuizRepository;
import com.javaquiz.repository.UserRepository;
import com.javaquiz.service.QuizAttemptService;
import com.javaquiz.service.ReportExportService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class ReportExportServiceTest {

    @Autowired
    private ReportExportService reportExportService;

    @Autowired
    private QuizAttemptService attemptService;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void exportsParticipantCsvReportWithHeaderAndRows() {
        User participant = userRepository.findByEmail("participant@javaquiz.com").orElseThrow();
        Quiz quiz = quizRepository.findBySlug("java-core-variables-control-flow").orElseThrow();

        StartAttemptResponse started = attemptService.startQuizAttempt(participant.getId(), quiz.getId(), false);
        Map<Long, OptionKey> answers = new HashMap<>();
        quiz.getQuestions().forEach(q -> answers.put(q.getId(), q.getCorrectOptionKey()));

        attemptService.submitQuiz(participant.getId(), quiz.getId(), SubmitQuizRequest.builder()
                .attemptToken(started.getAttemptToken())
                .answers(answers)
                .timeTakenSeconds(90)
                .build());

        byte[] csvBytes = reportExportService.exportParticipantHistoryCsv(participant.getId());
        String csv = new String(csvBytes, StandardCharsets.UTF_8);

        assertThat(csv).contains("AttemptID,QuizTitle,Category,Difficulty");
        assertThat(csv).contains("Java Core: Variables, Data Types & Control Flow");
        assertThat(csv).contains("PASSED");
    }
}
