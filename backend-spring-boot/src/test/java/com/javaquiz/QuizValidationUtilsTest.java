package com.javaquiz;

import com.javaquiz.entity.OptionKey;
import com.javaquiz.exception.BadRequestException;
import com.javaquiz.util.QuizValidationUtils;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class QuizValidationUtilsTest {

    @Test
    void toSlugNormalizesTitlesCleanly() {
        assertThat(QuizValidationUtils.toSlug("Java Core: Variables & Control Flow!"))
                .isEqualTo("java-core-variables-control-flow");
        assertThat(QuizValidationUtils.toSlug("   ")).isEqualTo("java-quiz");
    }

    @Test
    void isValidEmailValidatesFormats() {
        assertThat(QuizValidationUtils.isValidEmail("student@javaquiz.com")).isTrue();
        assertThat(QuizValidationUtils.isValidEmail("invalid-email")).isFalse();
        assertThat(QuizValidationUtils.isValidEmail(null)).isFalse();
    }

    @Test
    void validateFourOptionsRejectsMissingOrBlankOptions() {
        assertThatThrownBy(() -> QuizValidationUtils.validateFourOptions(Map.of(OptionKey.A, "Only one")))
                .isInstanceOf(BadRequestException.class);

        assertThatThrownBy(() -> QuizValidationUtils.validateFourOptions(Map.of(
                OptionKey.A, "Opt A",
                OptionKey.B, "   ",
                OptionKey.C, "Opt C",
                OptionKey.D, "Opt D"
        ))).isInstanceOf(BadRequestException.class);
    }

    @Test
    void formatDurationAndPerformanceBadgeWorkCorrectly() {
        assertThat(QuizValidationUtils.formatDurationSeconds(45)).isEqualTo("45s");
        assertThat(QuizValidationUtils.formatDurationSeconds(125)).isEqualTo("2m 5s");
        assertThat(QuizValidationUtils.resolvePerformanceBadge(92.5)).isEqualTo("Java Grandmaster");
        assertThat(QuizValidationUtils.resolvePerformanceBadge(84.0)).isEqualTo("Senior Architect");
        assertThat(QuizValidationUtils.resolvePerformanceBadge(72.0)).isEqualTo("Certified Developer");
        assertThat(QuizValidationUtils.resolvePerformanceBadge(50.0)).isEqualTo("Rising Learner");
    }
}
