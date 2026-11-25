package com.javaquiz.dto;

import com.javaquiz.entity.Difficulty;
import com.javaquiz.entity.OptionKey;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateQuestionRequest {
    @NotBlank(message = "Question text is required")
    private String questionText;

    private String codeSnippet;

    @Builder.Default
    private String codeLanguage = "java";

    @NotNull(message = "Points are required")
    @Min(value = 1, message = "Points must be at least 1")
    @Builder.Default
    private Integer points = 10;

    @Builder.Default
    private Difficulty difficulty = Difficulty.MEDIUM;

    @NotNull(message = "Four options (A, B, C, D) are required")
    private Map<OptionKey, String> options;

    @NotNull(message = "Correct option key is required")
    private OptionKey correctOptionKey;

    @NotBlank(message = "Explanation is required")
    private String explanation;
}
