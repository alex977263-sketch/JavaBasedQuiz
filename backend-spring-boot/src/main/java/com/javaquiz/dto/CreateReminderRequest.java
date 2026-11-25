package com.javaquiz.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateReminderRequest {
    @NotNull(message = "Quiz ID is required")
    private Long quizId;

    @NotBlank(message = "Reminder date and time is required")
    private String reminderDateTime;

    private String note;
}
