package com.javaquiz.dto;

import com.javaquiz.entity.AlertType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSystemAlertRequest {
    @NotBlank(message = "Alert title is required")
    private String title;

    @NotBlank(message = "Alert message is required")
    private String message;

    @NotNull(message = "Alert type is required")
    private AlertType type = AlertType.INFO;
}
