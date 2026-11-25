package com.javaquiz.dto;

import com.javaquiz.entity.AlertType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemAlertDto {
    private Long id;
    private String title;
    private String message;
    private AlertType type;
    private Instant timestamp;
    private Boolean isDismissed;
}
