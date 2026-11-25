package com.javaquiz;

import com.javaquiz.dto.*;
import com.javaquiz.entity.AlertType;
import com.javaquiz.entity.ApprovalStatus;
import com.javaquiz.entity.RoleName;
import com.javaquiz.repository.QuizRepository;
import com.javaquiz.service.AdminService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class AdminServiceIntegrationTest {

    @Autowired
    private AdminService adminService;

    @Autowired
    private QuizRepository quizRepository;

    @Test
    void adminCanManageUsersSettingsAlertsAndQuizRejections() {
        UserDto createdUser = adminService.createUser(CreateUserRequest.builder()
                .fullName("Ananya Roy")
                .email("ananya@javaquiz.com")
                .role(RoleName.ROLE_CREATOR)
                .collegeOrCompany("Java Academy")
                .build());
        assertThat(createdUser.getId()).isNotNull();
        assertThat(createdUser.getIsEnabled()).isTrue();

        UserDto toggled = adminService.toggleUserStatus(createdUser.getId());
        assertThat(toggled.getIsEnabled()).isFalse();

        SystemSettingsDto updatedSettings = adminService.updateSystemSettings(SystemSettingsDto.builder()
                .defaultDurationMinutes(20)
                .defaultPassingPercentage(75)
                .autoApproveQuizzes(true)
                .build());
        assertThat(updatedSettings.getDefaultDurationMinutes()).isEqualTo(20);
        assertThat(updatedSettings.getAutoApproveQuizzes()).isTrue();

        SystemAlertDto alert = adminService.createAlert(new CreateSystemAlertRequest(
                "Scheduled Maintenance",
                "Database backup at midnight UTC.",
                AlertType.WARNING
        ));
        assertThat(alert.getId()).isNotNull();

        var pendingQuiz = quizRepository.findBySlug("os-threads-deadlocks").orElseThrow();
        QuizSummaryDto rejected = adminService.rejectQuiz(pendingQuiz.getId(), "Add 2 more deadlock questions.");
        assertThat(rejected.getApprovalStatus()).isEqualTo(ApprovalStatus.REJECTED);
        assertThat(rejected.getRejectionReason()).contains("deadlock");

        PlatformAnalyticsDto analytics = adminService.getPlatformAnalytics();
        assertThat(analytics.getTotalUsers()).isGreaterThanOrEqualTo(6);
        assertThat(analytics.getTotalQuizzes()).isEqualTo(7);
    }
}
