package com.javaquiz.dto;

import com.javaquiz.entity.Difficulty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateQuizRequest {
    private String title;
    private String description;
    private Long categoryId;
    private Difficulty difficulty;

    @Min(1)
    @Max(180)
    private Integer durationMinutes;

    @Min(1)
    @Max(100)
    private Integer passingPercentage;

    private Boolean isActive;
}
