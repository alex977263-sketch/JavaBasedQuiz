package com.javaquiz;

import com.javaquiz.entity.OptionKey;
import com.javaquiz.entity.Question;
import com.javaquiz.entity.Quiz;
import com.javaquiz.exception.BadRequestException;
import com.javaquiz.oop.*;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ScoringPolicyAndGenericsTest {

    private Quiz buildSampleQuiz() {
        Quiz quiz = Quiz.builder()
                .title("OOP Polymorphism Test Quiz")
                .passingPercentage(50)
                .build();

        Question q1 = Question.builder()
                .id(1L)
                .questionNumber(1)
                .questionText("Q1")
                .points(10)
                .correctOptionKey(OptionKey.A)
                .explanation("Exp 1")
                .build();
        Question q2 = Question.builder()
                .id(2L)
                .questionNumber(2)
                .questionText("Q2")
                .points(10)
                .correctOptionKey(OptionKey.B)
                .explanation("Exp 2")
                .build();
        quiz.addQuestion(q1);
        quiz.addQuestion(q2);
        return quiz;
    }

    @Test
    void polymorphicScoringPoliciesComputeDifferentTotalsForSameAnswers() {
        Quiz quiz = buildSampleQuiz();
        Map<Long, OptionKey> answers = Map.of(
                1L, OptionKey.A, // correct (+10)
                2L, OptionKey.C  // incorrect (0 in standard, -2 in negative)
        );

        ScoringPolicy standard = new StandardScoringPolicy();
        ScoringPolicy negative = new NegativeMarkingScoringPolicy(2);

        QuizEvaluationResult stdResult = standard.evaluate(quiz, answers);
        QuizEvaluationResult negResult = negative.evaluate(quiz, answers);

        assertThat(stdResult.getRawScore()).isEqualTo(10);
        assertThat(stdResult.getPercentage()).isEqualTo(50.0);
        assertThat(stdResult.isPassed()).isTrue();

        assertThat(negResult.getRawScore()).isEqualTo(8);
        assertThat(negResult.getPercentage()).isEqualTo(40.0);
        assertThat(negResult.isPassed()).isFalse();
    }

    @Test
    void abstractScoringPolicyRejectsEmptyQuiz() {
        ScoringPolicy policy = new StandardScoringPolicy();
        Quiz emptyQuiz = Quiz.builder().title("Empty").build();

        assertThatThrownBy(() -> policy.evaluate(emptyQuiz, Map.of()))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void genericScoreCacheEvictsOldestEntriesBeyondCapacity() {
        GenericScoreCache<String, Integer> cache = new GenericScoreCache<>(2);
        cache.put("q1", 80);
        cache.put("q2", 90);
        cache.put("q3", 100);

        assertThat(cache.size()).isEqualTo(2);
        assertThat(cache.get("q1")).isEmpty();
        assertThat(cache.get("q2")).contains(90);
        assertThat(cache.get("q3")).contains(100);
        assertThat(cache.snapshotValues()).containsExactlyInAnyOrder(90, 100);
    }
}
