package com.javaquiz.oop;

import com.javaquiz.entity.OptionKey;
import com.javaquiz.entity.Question;

/**
 * Standard scoring policy: awards full points for correct answers and zero for incorrect/unanswered.
 */
public class StandardScoringPolicy extends AbstractScoringPolicy {

    @Override
    public String getPolicyName() {
        return "Standard Positive Scoring";
    }

    @Override
    protected int computeQuestionScore(Question question, OptionKey selectedOption) {
        if (selectedOption != null && selectedOption == question.getCorrectOptionKey()) {
            return question.getPoints() != null ? question.getPoints() : 10;
        }
        return 0;
    }
}
