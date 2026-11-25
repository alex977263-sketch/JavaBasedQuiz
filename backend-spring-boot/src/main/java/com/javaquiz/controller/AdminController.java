package com.javaquiz.controller;

import com.javaquiz.dto.*;
import com.javaquiz.entity.AuditLog;
import com.javaquiz.service.AdminService;
import com.javaquiz.service.AuditLogService;
import com.javaquiz.service.ReportExportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final AuditLogService auditLogService;
    private final ReportExportService reportExportService;

    // -------------------------------------------------------------------------
    // User Management
    // -------------------------------------------------------------------------

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok("Users retrieved", adminService.getAllUsers()));
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<UserDto>> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDto created = adminService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("User account created successfully", created));
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
            @PathVariable Long userId,
            @RequestBody UpdateUserRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                "User account updated successfully",
                adminService.updateUser(userId, request)
        ));
    }

    @PatchMapping("/users/{userId}/toggle-status")
    public ResponseEntity<ApiResponse<UserDto>> toggleUserStatus(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(
                "User account status toggled",
                adminService.toggleUserStatus(userId)
        ));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.ok("User account deleted", null));
    }

    // -------------------------------------------------------------------------
    // Quiz Content Approval
    // -------------------------------------------------------------------------

    @GetMapping("/quizzes")
    public ResponseEntity<ApiResponse<List<QuizSummaryDto>>> getAllQuizzes() {
        return ResponseEntity.ok(ApiResponse.ok("All quizzes retrieved", adminService.getAllQuizzesForAdmin()));
    }

    @PostMapping("/quizzes/{quizId}/approve")
    public ResponseEntity<ApiResponse<QuizSummaryDto>> approveQuiz(@PathVariable Long quizId) {
        return ResponseEntity.ok(ApiResponse.ok("Quiz approved and published", adminService.approveQuiz(quizId)));
    }

    @PostMapping("/quizzes/{quizId}/reject")
    public ResponseEntity<ApiResponse<QuizSummaryDto>> rejectQuiz(
            @PathVariable Long quizId,
            @Valid @RequestBody RejectQuizRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Quiz rejected with feedback",
                adminService.rejectQuiz(quizId, request.getReason())
        ));
    }

    // -------------------------------------------------------------------------
    // System Settings & Alerts
    // -------------------------------------------------------------------------

    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<SystemSettingsDto>> getSystemSettings() {
        return ResponseEntity.ok(ApiResponse.ok("Settings retrieved", adminService.getSystemSettings()));
    }

    @PutMapping("/settings")
    public ResponseEntity<ApiResponse<SystemSettingsDto>> updateSystemSettings(@RequestBody SystemSettingsDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(
                "System settings updated successfully",
                adminService.updateSystemSettings(dto)
        ));
    }

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<List<SystemAlertDto>>> getAllAlerts() {
        return ResponseEntity.ok(ApiResponse.ok("System alerts retrieved", adminService.getAllAlerts()));
    }

    @PostMapping("/alerts")
    public ResponseEntity<ApiResponse<SystemAlertDto>> createAlert(
            @Valid @RequestBody CreateSystemAlertRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("System alert published", adminService.createAlert(request)));
    }

    @PatchMapping("/alerts/{alertId}/dismiss")
    public ResponseEntity<ApiResponse<Void>> dismissAlert(@PathVariable Long alertId) {
        adminService.dismissAlert(alertId);
        return ResponseEntity.ok(ApiResponse.ok("System alert dismissed", null));
    }

    // -------------------------------------------------------------------------
    // Performance Reports & Analytics
    // -------------------------------------------------------------------------

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<PlatformAnalyticsDto>> getPlatformAnalytics() {
        return ResponseEntity.ok(ApiResponse.ok(
                "Platform analytics retrieved",
                adminService.getPlatformAnalytics()
        ));
    }

    @GetMapping("/attempts")
    public ResponseEntity<ApiResponse<List<QuizAttemptResultDto>>> getAllSubmittedAttempts() {
        return ResponseEntity.ok(ApiResponse.ok(
                "All submitted quiz attempts retrieved",
                adminService.getAllSubmittedAttempts()
        ));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getRecentAuditLogs() {
        return ResponseEntity.ok(ApiResponse.ok(
                "Recent audit logs retrieved",
                auditLogService.getRecentAuditLogs()
        ));
    }

    @GetMapping("/reports/export")
    public ResponseEntity<byte[]> exportPlatformPerformanceCsv() {
        byte[] csvBytes = reportExportService.exportPlatformPerformanceCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=platform-quiz-report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvBytes);
    }
}
