package com.javaquiz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDto {
    private int rank;
    private Long userId;
    private String userName;
    private String userEmail;
    private int quizzesAttempted;
    private int quizzesPassed;
    private int totalPoints;
    private double averagePercentage;
    private String badge;
}
