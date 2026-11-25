package com.javaquiz.dto;

import com.javaquiz.entity.ApprovalStatus;
import com.javaquiz.entity.Difficulty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateQuizRequest {
    @NotBlank(message = "Quiz title is required")
    private String title;

    private String description;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @Builder.Default
    private Difficulty difficulty = Difficulty.MEDIUM;

    @Min(value = 1, message = "Duration must be at least 1 minute")
    @Max(value = 180, message = "Duration cannot exceed 180 minutes")
    @Builder.Default
    private Integer durationMinutes = 15;

    @Min(value = 1, message = "Passing percentage must be at least 1%")
    @Max(value = 100, message = "Passing percentage cannot exceed 100%")
    @Builder.Default
    private Integer passingPercentage = 70;

    @Builder.Default
    private Boolean isActive = true;

    @Valid
    @Builder.Default
    private List<CreateQuestionRequest> questions = new ArrayList<>();
}
