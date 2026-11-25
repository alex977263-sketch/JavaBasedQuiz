package com.javaquiz.controller;

import com.javaquiz.dto.*;
import com.javaquiz.entity.Difficulty;
import com.javaquiz.service.AdminService;
import com.javaquiz.service.QuizCatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class QuizCatalogController {

    private final QuizCatalogService catalogService;
    private final AdminService adminService;

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.ok("Categories retrieved", catalogService.getAllCategories()));
    }

    @GetMapping("/quizzes")
    public ResponseEntity<ApiResponse<List<QuizSummaryDto>>> searchQuizzes(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Quizzes retrieved",
                catalogService.searchAvailableQuizzes(categoryId, difficulty, keyword)
        ));
    }

    @GetMapping("/quizzes/{quizId}")
    public ResponseEntity<ApiResponse<QuizSummaryDto>> getQuizDetails(@PathVariable Long quizId) {
        return ResponseEntity.ok(ApiResponse.ok("Quiz details retrieved", catalogService.getQuizSummary(quizId)));
    }

    @GetMapping("/system/public/settings")
    public ResponseEntity<ApiResponse<SystemSettingsDto>> getPublicSettings() {
        return ResponseEntity.ok(ApiResponse.ok("System settings retrieved", adminService.getSystemSettings()));
    }
}
