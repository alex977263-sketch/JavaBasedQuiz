package com.javaquiz.dto;

import com.javaquiz.entity.InteractionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InteractionDto {
    private Long id;
    private Long participantId;
    private String participantName;
    private String participantEmail;
    private Long creatorId;
    private String creatorName;
    private Long quizId;
    private String quizTitle;
    private String subject;
    private String message;
    private String reply;
    private Instant repliedAt;
    private InteractionStatus status;
    private Instant createdAt;
}
