package com.javaquiz.dto;

import com.javaquiz.entity.OptionKey;
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
public class SubmitQuizRequest {
    @NotBlank(message = "Attempt token is required to prevent duplicate submissions")
    private String attemptToken;

    @NotNull(message = "Answers map is required")
    private Map<Long, OptionKey> answers;

    private Integer timeTakenSeconds;

    @Builder.Default
    private Boolean autoSubmittedOnTimeout = false;
}
