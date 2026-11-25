package com.javaquiz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizReminderDto {
    private Long id;
    private Long participantId;
    private Long quizId;
    private String quizTitle;
    private String reminderDateTime;
    private String note;
    private Boolean isCompleted;
    private Instant createdAt;
}
