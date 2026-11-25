package com.javaquiz.util;

import com.javaquiz.entity.OptionKey;
import com.javaquiz.exception.BadRequestException;

import java.text.Normalizer;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Pure Java validation and formatting utilities for quiz authoring,
 * user account sanitization, and score calculations.
 */
public final class QuizValidationUtils {

    private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    private QuizValidationUtils() {
    }

    public static String toSlug(String input) {
        if (input == null || input.isBlank()) {
            return "java-quiz";
        }
        String noWhitespace = WHITESPACE.matcher(input.trim()).replaceAll("-");
        String normalized = Normalizer.normalize(noWhitespace, Normalizer.Form.NFD);
        String slug = NON_LATIN.matcher(normalized).replaceAll("");
        slug = slug.replaceAll("-{2,}", "-").replaceAll("^-|-$", "");
        return slug.isEmpty() ? "java-quiz" : slug.toLowerCase(Locale.ENGLISH);
    }

    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    public static void validatePasswordStrength(String password) {
        if (password == null || password.length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters long.");
        }
    }

    public static void validateFourOptions(Map<OptionKey, String> options) {
        if (options == null || options.size() != 4) {
            throw new BadRequestException("Exactly four options (A, B, C, D) must be provided.");
        }
        for (OptionKey key : OptionKey.values()) {
            String value = options.get(key);
            if (value == null || value.isBlank()) {
                throw new BadRequestException("Option " + key + " cannot be blank.");
            }
        }
    }

    public static String formatDurationSeconds(int totalSeconds) {
        if (totalSeconds < 0) {
            totalSeconds = 0;
        }
        int minutes = totalSeconds / 60;
        int seconds = totalSeconds % 60;
        if (minutes == 0) {
            return seconds + "s";
        }
        return minutes + "m " + seconds + "s";
    }

    public static String resolvePerformanceBadge(double averagePercentage) {
        if (averagePercentage >= 90.0) {
            return "Java Grandmaster";
        } else if (averagePercentage >= 80.0) {
            return "Senior Architect";
        } else if (averagePercentage >= 70.0) {
            return "Certified Developer";
        }
        return "Rising Learner";
    }
}
