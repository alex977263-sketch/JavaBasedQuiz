package com.javaquiz.oop;

import com.javaquiz.entity.OptionKey;
import com.javaquiz.entity.Quiz;

import java.util.Map;

/**
 * Defines a polymorphic evaluation strategy for grading quiz attempts.
 */
public interface ScoringPolicy {

    String getPolicyName();

    QuizEvaluationResult evaluate(Quiz quiz, Map<Long, OptionKey> submittedAnswers);
}
