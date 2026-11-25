package com.javaquiz.dto;

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
public class QuestionReviewDto {
    private Long questionId;
    private Integer questionNumber;
    private String questionText;
    private String codeSnippet;
    private List<QuestionOptionDto> options;
    private OptionKey selectedOptionKey;
    private OptionKey correctOptionKey;
    private Boolean isCorrect;
    private Boolean isUnanswered;
    private String explanation;
    private Integer pointsAwarded;
    private Integer maxPoints;
}
