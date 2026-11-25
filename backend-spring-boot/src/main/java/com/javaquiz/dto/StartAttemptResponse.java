package com.javaquiz.dto;

import com.javaquiz.entity.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StartAttemptResponse {
    private Long attemptId;
    private String attemptToken;
    private Long quizId;
    private String quizTitle;
    private String categoryName;
    private Difficulty difficulty;
    private Integer durationMinutes;
    private Integer passingPercentage;
    private Instant startedAt;
    private Instant expiresAt;
    private List<QuestionForAttemptDto> questions;
}
