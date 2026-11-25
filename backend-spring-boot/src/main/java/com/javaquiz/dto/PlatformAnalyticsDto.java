package com.javaquiz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlatformAnalyticsDto {
    private long totalUsers;
    private long totalAdmins;
    private long totalCreators;
    private long totalParticipants;
    private long totalQuizzes;
    private long approvedQuizzes;
    private long pendingQuizzes;
    private long rejectedQuizzes;
    private long totalAttempts;
    private long totalPassedAttempts;
    private double overallPassRate;
    private double averagePlatformScore;
    private Map<String, Long> attemptsByCategory;
}
