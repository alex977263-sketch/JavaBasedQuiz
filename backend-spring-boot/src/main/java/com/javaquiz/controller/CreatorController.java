package com.javaquiz.controller;

import com.javaquiz.dto.*;
import com.javaquiz.security.UserPrincipal;
import com.javaquiz.service.QuestionBankService;
import com.javaquiz.service.QuizAnalyticsService;
import com.javaquiz.service.QuizCatalogService;
import com.javaquiz.service.QuizCreatorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/creator")
@PreAuthorize("hasAnyRole('CREATOR', 'ADMIN')")
@RequiredArgsConstructor
public class CreatorController {

    private final QuizCreatorService creatorService;
    private final QuizCatalogService catalogService;
    private final QuestionBankService questionBankService;
    private final QuizAnalyticsService analyticsService;

    @GetMapping("/quizzes")
    public ResponseEntity<ApiResponse<List<QuizSummaryDto>>> getMyQuizzes(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Creator quizzes retrieved",
                creatorService.getCreatorQuizzes(principal.getId())
        ));
    }

    @PostMapping("/quizzes")
    public ResponseEntity<ApiResponse<QuizSummaryDto>> createQuiz(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateQuizRequest request
    ) {
        QuizSummaryDto created = creatorService.createQuiz(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Quiz created successfully", created));
    }

    @PutMapping("/quizzes/{quizId}")
    public ResponseEntity<ApiResponse<QuizSummaryDto>> updateQuiz(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long quizId,
            @Valid @RequestBody UpdateQuizRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Quiz updated successfully",
                creatorService.updateQuiz(principal.getId(), isAdmin(principal), quizId, request)
        ));
    }

    @DeleteMapping("/quizzes/{quizId}")
    public ResponseEntity<ApiResponse<Void>> deleteQuiz(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long quizId
    ) {
        creatorService.deleteQuiz(principal.getId(), isAdmin(principal), quizId);
        return ResponseEntity.ok(ApiResponse.ok("Quiz deleted successfully", null));
    }

    @GetMapping("/quizzes/{quizId}/questions")
    public ResponseEntity<ApiResponse<List<QuestionAdminDto>>> getQuizQuestions(@PathVariable Long quizId) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Quiz questions retrieved",
                catalogService.getQuizQuestionsForAuthorOrAdmin(quizId)
        ));
    }

    @PostMapping("/quizzes/{quizId}/questions")
    public ResponseEntity<ApiResponse<QuestionAdminDto>> addQuestion(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long quizId,
            @Valid @RequestBody CreateQuestionRequest request
    ) {
        QuestionAdminDto created = creatorService.addQuestionToQuiz(
                principal.getId(), isAdmin(principal), quizId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Question added successfully", created));
    }

    @DeleteMapping("/quizzes/{quizId}/questions/{questionId}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long quizId,
            @PathVariable Long questionId
    ) {
        creatorService.deleteQuestion(principal.getId(), isAdmin(principal), quizId, questionId);
        return ResponseEntity.ok(ApiResponse.ok("Question deleted successfully", null));
    }

    @GetMapping("/attempts")
    public ResponseEntity<ApiResponse<List<QuizAttemptResultDto>>> getAttemptsToReview(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Submitted attempts retrieved for creator review",
                creatorService.getAttemptsForCreatorReview(principal.getId(), isAdmin(principal))
        ));
    }

    @PostMapping("/attempts/{attemptId}/grade")
    public ResponseEntity<ApiResponse<QuizAttemptResultDto>> gradeAttempt(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long attemptId,
            @Valid @RequestBody GradeAttemptRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Feedback and grade saved successfully",
                creatorService.gradeAttempt(principal.getId(), attemptId, request)
        ));
    }

    @GetMapping("/interactions")
    public ResponseEntity<ApiResponse<List<InteractionDto>>> getInteractions(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Participant interactions retrieved",
                creatorService.getInteractionsForCreator(principal.getId(), isAdmin(principal))
        ));
    }

    @PostMapping("/interactions/{interactionId}/reply")
    public ResponseEntity<ApiResponse<InteractionDto>> replyToInteraction(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long interactionId,
            @Valid @RequestBody ReplyInteractionRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Reply sent and interaction marked as RESOLVED",
                creatorService.replyToInteraction(principal.getId(), interactionId, request)
        ));
    }

    @GetMapping("/question-templates")
    public ResponseEntity<ApiResponse<List<CreateQuestionRequest>>> getQuestionTemplates() {
        return ResponseEntity.ok(ApiResponse.ok(
                "Curated Java question templates retrieved",
                questionBankService.getCuratedJavaTemplates()
        ));
    }

    @GetMapping("/quizzes/{quizId}/analytics")
    public ResponseEntity<ApiResponse<QuizPerformanceReportDto>> getQuizAnalytics(@PathVariable Long quizId) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Quiz performance report generated",
                analyticsService.generateQuizReport(quizId)
        ));
    }

    private boolean isAdmin(UserPrincipal principal) {
        return principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}
