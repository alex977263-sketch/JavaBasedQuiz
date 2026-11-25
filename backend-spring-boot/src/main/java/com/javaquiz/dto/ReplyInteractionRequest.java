package com.javaquiz.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReplyInteractionRequest {
    @NotBlank(message = "Reply text is required")
    private String replyText;
}
