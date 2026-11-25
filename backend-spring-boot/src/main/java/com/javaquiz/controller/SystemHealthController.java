package com.javaquiz.controller;

import com.javaquiz.concurrent.QuizSessionMonitor;
import com.javaquiz.dto.ApiResponse;
import com.javaquiz.repository.CategoryRepository;
import com.javaquiz.repository.QuizAttemptRepository;
import com.javaquiz.repository.QuizRepository;
import com.javaquiz.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Exposes platform runtime diagnostics and JVM metadata for Java Spring Boot verification.
 */
@RestController
@RequestMapping("/system/public")
@RequiredArgsConstructor
public class SystemHealthController {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final QuizRepository quizRepository;
    private final QuizAttemptRepository attemptRepository;
    private final QuizSessionMonitor sessionMonitor;

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealth() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("status", "UP");
        status.put("timestamp", Instant.now().toString());
        status.put("javaVersion", System.getProperty("java.version"));
        status.put("jvmName", System.getProperty("java.vm.name"));
        status.put("registeredUsers", userRepository.count());
        status.put("categoriesCount", categoryRepository.count());
        status.put("quizzesCount", quizRepository.count());
        status.put("attemptsCount", attemptRepository.count());
        status.put("activeTimedSessions", sessionMonitor.getActiveSessionCount());
        status.put("completedTimedSessions", sessionMonitor.getCompletedSessionsCount());
        return ResponseEntity.ok(ApiResponse.ok("Java Spring Boot backend healthy", status));
    }
}
