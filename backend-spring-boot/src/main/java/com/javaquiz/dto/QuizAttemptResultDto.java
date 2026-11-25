package com.javaquiz.dto;

import com.javaquiz.entity.AttemptStatus;
import com.javaquiz.entity.Difficulty;
import com.javaquiz.entity.GradeTag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttemptResultDto {
    private Long id;
    private Long quizId;
    private String quizTitle;
    private String categoryName;
    private Difficulty difficulty;
    private Long userId;
    private String userName;
    private String userEmail;
    private AttemptStatus status;
    private Instant startedAt;
    private Instant submittedAt;
    private Integer timeTakenSeconds;
    private Integer totalQuestions;
    private Integer correctAnswersCount;
    private Integer incorrectAnswersCount;
    private Integer unansweredCount;
    private Integer score;
    private Integer maxScore;
    private BigDecimal percentage;
    private Boolean isPassed;
    private Integer passingPercentage;
    private CreatorFeedbackDto creatorFeedback;
    private List<QuestionReviewDto> reviews;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreatorFeedbackDto {
        private Long creatorId;
        private String creatorName;
        private String feedbackNotes;
        private GradeTag gradeTag;
        private Instant awardedAt;
    }
}
