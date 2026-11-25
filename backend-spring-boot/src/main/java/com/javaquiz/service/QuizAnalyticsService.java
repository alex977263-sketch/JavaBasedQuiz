package com.javaquiz.service;

import com.javaquiz.dto.QuizPerformanceReportDto;
import com.javaquiz.entity.AttemptStatus;
import com.javaquiz.entity.Question;
import com.javaquiz.entity.Quiz;
import com.javaquiz.entity.QuizAttempt;
import com.javaquiz.entity.SubmittedAnswer;
import com.javaquiz.exception.ResourceNotFoundException;
import com.javaquiz.repository.QuizAttemptRepository;
import com.javaquiz.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Computes detailed item-level accuracy and aggregate statistical reports for quizzes.
 */
@Service
@RequiredArgsConstructor
public class QuizAnalyticsService {

    private final QuizRepository quizRepository;
    private final QuizAttemptRepository attemptRepository;

    @Transactional(readOnly = true)
    public QuizPerformanceReportDto generateQuizReport(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + quizId));

        List<QuizAttempt> submitted = attemptRepository.findByQuizIdAndStatusOrderBySubmittedAtDesc(
                quizId, AttemptStatus.SUBMITTED);

        int total = submitted.size();
        int passed = (int) submitted.stream().filter(a -> Boolean.TRUE.equals(a.getIsPassed())).count();
        double passRate = total == 0 ? 0.0 : round2((passed * 100.0) / total);
        double avgScore = total == 0 ? 0.0 : round2(
                submitted.stream().mapToDouble(a -> a.getPercentage().doubleValue()).average().orElse(0.0));
        double maxScore = total == 0 ? 0.0 : round2(
                submitted.stream().mapToDouble(a -> a.getPercentage().doubleValue()).max().orElse(0.0));
        double minScore = total == 0 ? 0.0 : round2(
                submitted.stream().mapToDouble(a -> a.getPercentage().doubleValue()).min().orElse(0.0));
        int avgTime = total == 0 ? 0 : (int) Math.round(
                submitted.stream().mapToInt(QuizAttempt::getTimeTakenSeconds).average().orElse(0.0));

        List<QuizPerformanceReportDto.QuestionAccuracyDto> questionAccuracies = new ArrayList<>();
        for (Question q : quiz.getQuestions()) {
            int responses = 0;
            int correct = 0;
            for (QuizAttempt attempt : submitted) {
                for (SubmittedAnswer ans : attempt.getSubmittedAnswers()) {
                    if (ans.getQuestion().getId().equals(q.getId())) {
                        responses++;
                        if (Boolean.TRUE.equals(ans.getIsCorrect())) {
                            correct++;
                        }
                    }
                }
            }
            double accuracy = responses == 0 ? 0.0 : round2((correct * 100.0) / responses);
            questionAccuracies.add(QuizPerformanceReportDto.QuestionAccuracyDto.builder()
                    .questionId(q.getId())
                    .questionNumber(q.getQuestionNumber())
                    .questionText(q.getQuestionText())
                    .totalResponses(responses)
                    .correctResponses(correct)
                    .accuracyPercentage(accuracy)
                    .build());
        }

        return QuizPerformanceReportDto.builder()
                .quizId(quiz.getId())
                .quizTitle(quiz.getTitle())
                .categoryName(quiz.getCategory().getName())
                .totalAttempts(total)
                .passedAttempts(passed)
                .passRatePercentage(passRate)
                .averageScorePercentage(avgScore)
                .highestScorePercentage(maxScore)
                .lowestScorePercentage(minScore)
                .averageTimeTakenSeconds(avgTime)
                .questionAccuracies(questionAccuracies)
                .build();
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
