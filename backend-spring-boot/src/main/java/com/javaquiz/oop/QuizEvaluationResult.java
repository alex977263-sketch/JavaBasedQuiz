package com.javaquiz.oop;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizEvaluationResult {
    private String policyName;
    private int totalQuestions;
    private int correctCount;
    private int incorrectCount;
    private int unansweredCount;
    private int rawScore;
    private int maxScore;
    private double percentage;
    private boolean passed;
}
