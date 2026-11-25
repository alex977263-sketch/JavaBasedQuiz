package com.javaquiz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizPerformanceReportDto {
    private Long quizId;
    private String quizTitle;
    private String categoryName;
    private int totalAttempts;
    private int passedAttempts;
    private double passRatePercentage;
    private double averageScorePercentage;
    private double highestScorePercentage;
    private double lowestScorePercentage;
    private int averageTimeTakenSeconds;
    private List<QuestionAccuracyDto> questionAccuracies;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionAccuracyDto {
        private Long questionId;
        private Integer questionNumber;
        private String questionText;
        private int totalResponses;
        private int correctResponses;
        private double accuracyPercentage;
    }
}
