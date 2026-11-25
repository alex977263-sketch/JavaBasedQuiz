package com.javaquiz.controller;

import com.javaquiz.dto.ApiResponse;
import com.javaquiz.dto.QuizAttemptResultDto;
import com.javaquiz.dto.StartAttemptResponse;
import com.javaquiz.dto.SubmitQuizRequest;
import com.javaquiz.security.UserPrincipal;
import com.javaquiz.service.QuizAttemptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attempts")
@RequiredArgsConstructor
public class QuizAttemptController {

    private final QuizAttemptService attemptService;

    @PostMapping("/quizzes/{quizId}/start")
    @PreAuthorize("hasAnyRole('PARTICIPANT', 'CREATOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<StartAttemptResponse>> startQuiz(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long quizId,
            @RequestParam(defaultValue = "false") boolean shuffle
    ) {
        StartAttemptResponse response = attemptService.startQuizAttempt(principal.getId(), quizId, shuffle);
        return ResponseEntity.ok(ApiResponse.ok("Timed quiz session started", response));
    }

    @PostMapping("/quizzes/{quizId}/submit")
    @PreAuthorize("hasAnyRole('PARTICIPANT', 'CREATOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<QuizAttemptResultDto>> submitQuiz(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long quizId,
            @Valid @RequestBody SubmitQuizRequest request
    ) {
        QuizAttemptResultDto result = attemptService.submitQuiz(principal.getId(), quizId, request);
        return ResponseEntity.ok(ApiResponse.ok("Quiz evaluated and submitted", result));
    }

    @GetMapping("/my-history")
    @PreAuthorize("hasAnyRole('PARTICIPANT', 'CREATOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<QuizAttemptResultDto>>> getMyHistory(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Attempt history retrieved",
                attemptService.getMyAttemptsHistory(principal.getId())
        ));
    }

    @GetMapping("/{attemptId}/review")
    @PreAuthorize("hasAnyRole('PARTICIPANT', 'CREATOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<QuizAttemptResultDto>> getAttemptReview(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long attemptId
    ) {
        boolean isPrivileged = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_CREATOR"));

        return ResponseEntity.ok(ApiResponse.ok(
                "Attempt review retrieved",
                attemptService.getAttemptReview(principal.getId(), isPrivileged, attemptId)
        ));
    }
}
