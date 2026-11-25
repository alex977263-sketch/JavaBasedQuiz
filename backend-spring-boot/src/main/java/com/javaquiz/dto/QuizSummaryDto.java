package com.javaquiz.dto;

import com.javaquiz.entity.ApprovalStatus;
import com.javaquiz.entity.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizSummaryDto {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private Long categoryId;
    private String categoryName;
    private Difficulty difficulty;
    private Integer durationMinutes;
    private Integer passingPercentage;
    private Boolean isActive;
    private ApprovalStatus approvalStatus;
    private String rejectionReason;
    private Long createdByUserId;
    private String createdByName;
    private Integer questionsCount;
    private Integer totalMarks;
    private Instant createdAt;
    private Instant updatedAt;
}
