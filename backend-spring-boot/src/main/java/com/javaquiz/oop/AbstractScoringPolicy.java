package com.javaquiz.oop;

import com.javaquiz.entity.OptionKey;
import com.javaquiz.entity.Question;
import com.javaquiz.entity.Quiz;
import com.javaquiz.exception.BadRequestException;

import java.util.Map;

/**
 * Abstract template-method base class implementing shared quiz evaluation validation
 * and delegating per-question scoring logic to concrete polymorphic subclasses.
 */
public abstract class AbstractScoringPolicy implements ScoringPolicy {

    @Override
    public final QuizEvaluationResult evaluate(Quiz quiz, Map<Long, OptionKey> submittedAnswers) {
        if (quiz == null || quiz.getQuestions() == null || quiz.getQuestions().isEmpty()) {
            throw new BadRequestException("Cannot evaluate an empty or null quiz.");
        }

        Map<Long, OptionKey> safeAnswers = submittedAnswers != null ? submittedAnswers : Map.of();
        int correct = 0;
        int incorrect = 0;
        int unanswered = 0;
        int score = 0;
        int maxScore = 0;

        for (Question q : quiz.getQuestions()) {
            int qPoints = q.getPoints() != null ? q.getPoints() : 10;
            maxScore += qPoints;
            OptionKey selected = safeAnswers.get(q.getId());

            if (selected == null) {
                unanswered++;
            } else if (selected == q.getCorrectOptionKey()) {
                correct++;
            } else {
                incorrect++;
            }
            score += computeQuestionScore(q, selected);
        }

        int clampedScore = Math.max(0, score);
        double pct = maxScore > 0 ? Math.round((clampedScore * 10000.0) / maxScore) / 100.0 : 0.0;
        int passThreshold = quiz.getPassingPercentage() != null ? quiz.getPassingPercentage() : 70;

        return QuizEvaluationResult.builder()
                .policyName(getPolicyName())
                .totalQuestions(quiz.getQuestions().size())
                .correctCount(correct)
                .incorrectCount(incorrect)
                .unansweredCount(unanswered)
                .rawScore(clampedScore)
                .maxScore(maxScore)
                .percentage(pct)
                .passed(pct >= passThreshold)
                .build();
    }

    protected abstract int computeQuestionScore(Question question, OptionKey selectedOption);
}
