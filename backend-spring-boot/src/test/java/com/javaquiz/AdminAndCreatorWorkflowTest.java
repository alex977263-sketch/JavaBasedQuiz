package com.javaquiz;

import com.javaquiz.dto.*;
import com.javaquiz.entity.*;
import com.javaquiz.repository.CategoryRepository;
import com.javaquiz.repository.QuizRepository;
import com.javaquiz.repository.UserRepository;
import com.javaquiz.service.AdminService;
import com.javaquiz.service.ParticipantPortalService;
import com.javaquiz.service.QuizAttemptService;
import com.javaquiz.service.QuizCreatorService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class AdminAndCreatorWorkflowTest {

    @Autowired
    private QuizCreatorService creatorService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private QuizAttemptService attemptService;

    @Autowired
    private ParticipantPortalService portalService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Test
    void fullCreatorApprovalAttemptGradingAndInteractionWorkflow() {
        User creator = userRepository.findByEmail("creator@javaquiz.com").orElseThrow();
        User participant = userRepository.findByEmail("participant@javaquiz.com").orElseThrow();
        Category javaCat = categoryRepository.findBySlug("java-programming").orElseThrow();

        // 1. Creator creates a new quiz (defaults to PENDING when autoApproveQuizzes=false)
        CreateQuizRequest quizReq = CreateQuizRequest.builder()
                .title("Java 17 Records & Sealed Classes")
                .description("Modern Java language features")
                .categoryId(javaCat.getId())
                .difficulty(Difficulty.MEDIUM)
                .durationMinutes(10)
                .passingPercentage(70)
                .questions(List.of(CreateQuestionRequest.builder()
                        .questionText("Which keyword restricts which classes may extend a class or implement an interface?")
                        .options(Map.of(
                                OptionKey.A, "final",
                                OptionKey.B, "sealed",
                                OptionKey.C, "static",
                                OptionKey.D, "transient"
                        ))
                        .correctOptionKey(OptionKey.B)
                        .explanation("Sealed classes and interfaces use 'sealed' and 'permits' to control subtypes.")
                        .points(10)
                        .build()))
                .build();

        QuizSummaryDto createdQuiz = creatorService.createQuiz(creator.getId(), quizReq);
        assertThat(createdQuiz.getApprovalStatus()).isEqualTo(ApprovalStatus.PENDING);

        // 2. Admin approves quiz
        QuizSummaryDto approved = adminService.approveQuiz(createdQuiz.getId());
        assertThat(approved.getApprovalStatus()).isEqualTo(ApprovalStatus.APPROVED);

        // 3. Participant starts and submits the quiz
        StartAttemptResponse started = attemptService.startQuizAttempt(participant.getId(), approved.getId(), false);
        Long questionId = started.getQuestions().get(0).getId();
        QuizAttemptResultDto result = attemptService.submitQuiz(
                participant.getId(),
                approved.getId(),
                SubmitQuizRequest.builder()
                        .attemptToken(started.getAttemptToken())
                        .answers(Map.of(questionId, OptionKey.B))
                        .timeTakenSeconds(45)
                        .build()
        );
        assertThat(result.getIsPassed()).isTrue();

        // 4. Creator grades attempt with feedback
        QuizAttemptResultDto graded = creatorService.gradeAttempt(
                creator.getId(),
                result.getId(),
                new GradeAttemptRequest("Excellent grasp of Java 17 features!", GradeTag.EXCELLENT)
        );
        assertThat(graded.getCreatorFeedback()).isNotNull();
        assertThat(graded.getCreatorFeedback().getGradeTag()).isEqualTo(GradeTag.EXCELLENT);

        // 5. Participant sends interaction and creator replies
        InteractionDto sent = portalService.sendInteraction(
                participant.getId(),
                new CreateInteractionRequest(approved.getId(), "Question on permits clause", "Can records implement a sealed interface?")
        );
        assertThat(sent.getStatus()).isEqualTo(InteractionStatus.OPEN);

        InteractionDto replied = creatorService.replyToInteraction(
                creator.getId(),
                sent.getId(),
                new ReplyInteractionRequest("Yes! Java records are implicitly final, so they can directly implement sealed interfaces.")
        );
        assertThat(replied.getStatus()).isEqualTo(InteractionStatus.RESOLVED);
        assertThat(replied.getReply()).contains("implicitly final");
    }
}
