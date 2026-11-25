package com.javaquiz.service;

import com.javaquiz.dto.*;
import com.javaquiz.entity.*;
import com.javaquiz.exception.BadRequestException;
import com.javaquiz.exception.ResourceNotFoundException;
import com.javaquiz.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final QuizRepository quizRepository;
    private final QuizAttemptRepository attemptRepository;
    private final SystemSettingsRepository settingsRepository;
    private final SystemAlertRepository alertRepository;
    private final PasswordEncoder passwordEncoder;
    private final DtoMapper mapper;
    private final AuditLogService auditLogService;

    // -------------------------------------------------------------------------
    // 1. User Management
    // -------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(mapper::toUserDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        String username = (request.getUsername() != null && !request.getUsername().isBlank())
                ? request.getUsername().trim()
                : request.getEmail().split("@")[0].toLowerCase();

        if (userRepository.existsByUsername(username)) {
            username = username + "_" + (System.currentTimeMillis() % 10000);
        }

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.getRole()));

        String rawPassword = (request.getPassword() != null && !request.getPassword().isBlank())
                ? request.getPassword()
                : "JavaQuiz@2026!";

        User user = User.builder()
                .username(username)
                .email(request.getEmail().trim().toLowerCase())
                .fullName(request.getFullName().trim())
                .passwordHash(passwordEncoder.encode(rawPassword))
                .collegeOrCompany(request.getCollegeOrCompany())
                .isEnabled(request.getIsEnabled() != null ? request.getIsEnabled() : true)
                .roles(new HashSet<>(Set.of(role)))
                .build();

        User savedUser = userRepository.save(user);
        auditLogService.record("admin@javaquiz.com", "ROLE_ADMIN", "CREATE_USER", "User", savedUser.getId(),
                "Created user " + savedUser.getEmail() + " with role " + request.getRole());
        return mapper.toUserDto(savedUser);
    }

    @Transactional
    public UserDto updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            user.setEmail(request.getEmail().trim().toLowerCase());
        }
        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            user.setUsername(request.getUsername().trim());
        }
        if (request.getCollegeOrCompany() != null) {
            user.setCollegeOrCompany(request.getCollegeOrCompany());
        }
        if (request.getIsEnabled() != null) {
            user.setIsEnabled(request.getIsEnabled());
        }
        if (request.getRole() != null) {
            Role role = roleRepository.findByName(request.getRole())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.getRole()));
            user.getRoles().clear();
            user.getRoles().add(role);
        }

        return mapper.toUserDto(userRepository.save(user));
    }

    @Transactional
    public UserDto toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        user.setIsEnabled(!Boolean.TRUE.equals(user.getIsEnabled()));
        return mapper.toUserDto(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
    }

    // -------------------------------------------------------------------------
    // 2. Quiz Content Management & Approval Workflow
    // -------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<QuizSummaryDto> getAllQuizzesForAdmin() {
        return quizRepository.findAll().stream()
                .map(mapper::toQuizSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public QuizSummaryDto approveQuiz(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + quizId));
        quiz.setApprovalStatus(ApprovalStatus.APPROVED);
        quiz.setRejectionReason(null);
        quiz.setIsActive(true);

        Quiz saved = quizRepository.save(quiz);

        alertRepository.save(SystemAlert.builder()
                .title("Quiz Content Approved")
                .message("Quiz \"" + saved.getTitle() + "\" has been approved and published for participants.")
                .alertType(AlertType.INFO)
                .build());

        auditLogService.record("admin@javaquiz.com", "ROLE_ADMIN", "APPROVE_QUIZ", "Quiz", saved.getId(),
                "Approved quiz: " + saved.getTitle());

        return mapper.toQuizSummaryDto(saved);
    }

    @Transactional
    public QuizSummaryDto rejectQuiz(Long quizId, String reason) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + quizId));
        quiz.setApprovalStatus(ApprovalStatus.REJECTED);
        quiz.setRejectionReason(reason);
        quiz.setIsActive(false);

        Quiz saved = quizRepository.save(quiz);

        alertRepository.save(SystemAlert.builder()
                .title("Quiz Content Rejected")
                .message("Quiz \"" + saved.getTitle() + "\" was rejected. Reason: " + reason)
                .alertType(AlertType.WARNING)
                .build());

        auditLogService.record("admin@javaquiz.com", "ROLE_ADMIN", "REJECT_QUIZ", "Quiz", saved.getId(),
                "Rejected quiz: " + saved.getTitle() + " | Reason: " + reason);

        return mapper.toQuizSummaryDto(saved);
    }

    // -------------------------------------------------------------------------
    // 3. System Settings
    // -------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public SystemSettingsDto getSystemSettings() {
        SystemSettings settings = settingsRepository.findById(1L)
                .orElseGet(() -> SystemSettings.builder().id(1L).build());
        return mapper.toSystemSettingsDto(settings);
    }

    @Transactional
    public SystemSettingsDto updateSystemSettings(SystemSettingsDto dto) {
        SystemSettings settings = settingsRepository.findById(1L)
                .orElseGet(() -> SystemSettings.builder().id(1L).build());

        if (dto.getPlatformTitle() != null) settings.setPlatformTitle(dto.getPlatformTitle());
        if (dto.getDefaultDurationMinutes() != null) settings.setDefaultDurationMinutes(dto.getDefaultDurationMinutes());
        if (dto.getDefaultPassingPercentage() != null) settings.setDefaultPassingPercentage(dto.getDefaultPassingPercentage());
        if (dto.getAutoApproveQuizzes() != null) settings.setAutoApproveQuizzes(dto.getAutoApproveQuizzes());
        if (dto.getAllowParticipantInteractions() != null) settings.setAllowParticipantInteractions(dto.getAllowParticipantInteractions());
        if (dto.getRegistrationOpen() != null) settings.setRegistrationOpen(dto.getRegistrationOpen());
        if (dto.getMaintenanceMode() != null) settings.setMaintenanceMode(dto.getMaintenanceMode());
        if (dto.getSystemAnnouncement() != null) settings.setSystemAnnouncement(dto.getSystemAnnouncement());

        return mapper.toSystemSettingsDto(settingsRepository.save(settings));
    }

    // -------------------------------------------------------------------------
    // 4. System Alerts
    // -------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<SystemAlertDto> getAllAlerts() {
        return alertRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(mapper::toSystemAlertDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SystemAlertDto createAlert(CreateSystemAlertRequest request) {
        SystemAlert alert = SystemAlert.builder()
                .title(request.getTitle())
                .message(request.getMessage())
                .alertType(request.getType())
                .isDismissed(false)
                .build();
        return mapper.toSystemAlertDto(alertRepository.save(alert));
    }

    @Transactional
    public void dismissAlert(Long alertId) {
        SystemAlert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with ID: " + alertId));
        alert.setIsDismissed(true);
        alertRepository.save(alert);
    }

    // -------------------------------------------------------------------------
    // 5. Performance Reports & Platform Analytics
    // -------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public PlatformAnalyticsDto getPlatformAnalytics() {
        List<User> users = userRepository.findAll();
        List<Quiz> quizzes = quizRepository.findAll();
        List<QuizAttempt> submitted = attemptRepository.findByStatusOrderBySubmittedAtDesc(AttemptStatus.SUBMITTED);

        long admins = users.stream().filter(u -> u.getPrimaryRole() == RoleName.ROLE_ADMIN).count();
        long creators = users.stream().filter(u -> u.getPrimaryRole() == RoleName.ROLE_CREATOR).count();
        long participants = users.stream().filter(u -> u.getPrimaryRole() == RoleName.ROLE_PARTICIPANT).count();

        long approved = quizzes.stream().filter(q -> q.getApprovalStatus() == ApprovalStatus.APPROVED).count();
        long pending = quizzes.stream().filter(q -> q.getApprovalStatus() == ApprovalStatus.PENDING).count();
        long rejected = quizzes.stream().filter(q -> q.getApprovalStatus() == ApprovalStatus.REJECTED).count();

        long passed = submitted.stream().filter(a -> Boolean.TRUE.equals(a.getIsPassed())).count();
        double passRate = submitted.isEmpty() ? 0.0 : Math.round((passed * 10000.0) / submitted.size()) / 100.0;
        double avgScore = submitted.isEmpty() ? 0.0 : Math.round(
                submitted.stream().mapToDouble(a -> a.getPercentage().doubleValue()).average().orElse(0.0) * 100.0
        ) / 100.0;

        Map<String, Long> byCategory = new LinkedHashMap<>();
        for (QuizAttempt attempt : submitted) {
            String cat = attempt.getQuiz().getCategory().getName();
            byCategory.merge(cat, 1L, Long::sum);
        }

        return PlatformAnalyticsDto.builder()
                .totalUsers(users.size())
                .totalAdmins(admins)
                .totalCreators(creators)
                .totalParticipants(participants)
                .totalQuizzes(quizzes.size())
                .approvedQuizzes(approved)
                .pendingQuizzes(pending)
                .rejectedQuizzes(rejected)
                .totalAttempts(submitted.size())
                .totalPassedAttempts(passed)
                .overallPassRate(passRate)
                .averagePlatformScore(avgScore)
                .attemptsByCategory(byCategory)
                .build();
    }

    @Transactional(readOnly = true)
    public List<QuizAttemptResultDto> getAllSubmittedAttempts() {
        return attemptRepository.findByStatusOrderBySubmittedAtDesc(AttemptStatus.SUBMITTED).stream()
                .map(a -> mapper.toAttemptResultDto(a, false))
                .collect(Collectors.toList());
    }
}
