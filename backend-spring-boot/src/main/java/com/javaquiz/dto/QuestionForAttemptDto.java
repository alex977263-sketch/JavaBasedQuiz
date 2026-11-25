package com.javaquiz.dto;

import com.javaquiz.entity.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Sanitized question DTO delivered during an active exam.
 * Intentionally omits correctOptionKey and explanation so answers cannot be inspected before submission.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionForAttemptDto {
    private Long id;
    private Integer questionNumber;
    private String questionText;
    private String codeSnippet;
    private String codeLanguage;
    private Integer points;
    private Difficulty difficulty;
    private List<QuestionOptionDto> options;
}
