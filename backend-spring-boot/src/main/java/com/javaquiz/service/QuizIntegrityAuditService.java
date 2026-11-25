package com.javaquiz.service;

import com.javaquiz.entity.OptionKey;
import com.javaquiz.entity.Question;
import com.javaquiz.entity.Quiz;
import com.javaquiz.repository.QuizRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Performs structural and pedagogical integrity checks across all quizzes in the database,
 * verifying question counts, four-option completeness, answer keys, and threshold bounds.
 */
@Service
@RequiredArgsConstructor
public class QuizIntegrityAuditService {

    private final QuizRepository quizRepository;

    @Data
    @Builder
    @AllArgsConstructor
    public static class QuizIntegrityReport {
        private Long quizId;
        private String quizTitle;
        private boolean valid;
        private List<String> issues;
    }

    @Transactional(readOnly = true)
    public List<QuizIntegrityReport> auditAllQuizzes() {
        List<Quiz> quizzes = quizRepository.findAll();
        List<QuizIntegrityReport> reports = new ArrayList<>();

        for (Quiz quiz : quizzes) {
            List<String> issues = new ArrayList<>();
            if (quiz.getQuestions() == null || quiz.getQuestions().isEmpty()) {
                issues.add("Quiz has zero questions.");
            } else {
                for (Question q : quiz.getQuestions()) {
                    if (q.getOptions() == null || q.getOptions().size() != 4) {
                        issues.add("Question #" + q.getQuestionNumber() + " does not have exactly 4 options.");
                    } else {
                        Set<OptionKey> keys = q.getOptions().stream()
                                .map(o -> o.getOptionKey())
                                .collect(Collectors.toSet());
                        if (!keys.contains(q.getCorrectOptionKey())) {
                            issues.add("Question #" + q.getQuestionNumber() + " correctOptionKey is missing from options.");
                        }
                    }
                    if (q.getExplanation() == null || q.getExplanation().isBlank()) {
                        issues.add("Question #" + q.getQuestionNumber() + " is missing an explanation.");
                    }
                }
            }
            if (quiz.getDurationMinutes() == null || quiz.getDurationMinutes() <= 0) {
                issues.add("Quiz duration must be positive.");
            }
            if (quiz.getPassingPercentage() == null || quiz.getPassingPercentage() < 1 || quiz.getPassingPercentage() > 100) {
                issues.add("Passing percentage must be between 1 and 100.");
            }

            reports.add(QuizIntegrityReport.builder()
                    .quizId(quiz.getId())
                    .quizTitle(quiz.getTitle())
                    .valid(issues.isEmpty())
                    .issues(issues)
                    .build());
        }
        return reports;
    }
}
