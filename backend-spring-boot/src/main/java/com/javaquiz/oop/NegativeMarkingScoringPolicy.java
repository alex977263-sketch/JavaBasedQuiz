package com.javaquiz.oop;

import com.javaquiz.entity.OptionKey;
import com.javaquiz.entity.Question;

/**
 * Competitive exam scoring policy: deducts penalty points for incorrect selections
 * while leaving unanswered questions neutral.
 */
public class NegativeMarkingScoringPolicy extends AbstractScoringPolicy {

    private final int penaltyPerWrongAnswer;

    public NegativeMarkingScoringPolicy(int penaltyPerWrongAnswer) {
        this.penaltyPerWrongAnswer = Math.max(1, penaltyPerWrongAnswer);
    }

    @Override
    public String getPolicyName() {
        return "Negative Marking (-" + penaltyPerWrongAnswer + " per wrong answer)";
    }

    @Override
    protected int computeQuestionScore(Question question, OptionKey selectedOption) {
        if (selectedOption == null) {
            return 0;
        }
        if (selectedOption == question.getCorrectOptionKey()) {
            return question.getPoints() != null ? question.getPoints() : 10;
        }
        return -penaltyPerWrongAnswer;
    }
}
