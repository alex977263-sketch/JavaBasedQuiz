package com.javaquiz.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RejectQuizRequest {
    @NotBlank(message = "Rejection reason is required")
    private String reason;
}
