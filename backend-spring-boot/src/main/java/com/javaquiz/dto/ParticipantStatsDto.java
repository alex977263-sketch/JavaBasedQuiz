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
public class ParticipantStatsDto {
    private long quizzesAttempted;
    private long quizzesPassed;
    private double averageScore;
    private double bestScore;
    private long totalTimeSpentSeconds;
    private Map<String, CategoryProficiency> categoryProficiency;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryProficiency {
        private int attempted;
        private double avgPercentage;
    }
}
