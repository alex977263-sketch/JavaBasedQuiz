package com.javaquiz.dto;

import com.javaquiz.entity.Difficulty;
import com.javaquiz.entity.OptionKey;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionAdminDto {
    private Long id;
    private Long quizId;
    private Integer questionNumber;
    private String questionText;
    private String codeSnippet;
    private String codeLanguage;
    private Integer points;
    private Difficulty difficulty;
    private OptionKey correctOptionKey;
    private String explanation;
    private List<QuestionOptionDto> options;
}
