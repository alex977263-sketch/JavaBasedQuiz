package com.javaquiz.cli;

import com.javaquiz.entity.OptionKey;
import com.javaquiz.entity.Question;
import com.javaquiz.entity.QuestionOption;
import com.javaquiz.entity.Quiz;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Pure Core Java timed CLI quiz runner demonstrating ScheduledExecutorService countdown timers,
 * thread-safe AtomicBoolean timeout flags, and question shuffling.
 */
public class ConsoleQuizRunner {

    public void runInteractiveSession(Quiz quiz) {
        List<Question> questions = new ArrayList<>(quiz.getQuestions());
        Collections.shuffle(questions);

        AtomicBoolean timeExpired = new AtomicBoolean(false);
        ScheduledExecutorService timerExecutor = Executors.newSingleThreadScheduledExecutor();
        long durationSeconds = quiz.getDurationMinutes() * 60L;

        timerExecutor.schedule(() -> {
            timeExpired.set(true);
            System.out.println("\n[TIMER EXPIRED] Time is up! Auto-submitting quiz...");
        }, durationSeconds, TimeUnit.SECONDS);

        int correct = 0;
        int totalPoints = 0;
        int maxPoints = quiz.getTotalMarks();

        try (Scanner scanner = new Scanner(System.in)) {
            System.out.println("====================================================");
            System.out.println("  JAVA QUIZ: " + quiz.getTitle());
            System.out.println("  Duration: " + quiz.getDurationMinutes() + " min | Pass: " + quiz.getPassingPercentage() + "%");
            System.out.println("====================================================");

            for (int i = 0; i < questions.size(); i++) {
                if (timeExpired.get()) {
                    break;
                }
                Question q = questions.get(i);
                System.out.printf("%nQ%d (%d pts): %s%n", i + 1, q.getPoints(), q.getQuestionText());
                if (q.getCodeSnippet() != null && !q.getCodeSnippet().isBlank()) {
                    System.out.println("--- Java Snippet ---");
                    System.out.println(q.getCodeSnippet());
                    System.out.println("--------------------");
                }
                for (QuestionOption opt : q.getOptions()) {
                    System.out.printf("  %s) %s%n", opt.getOptionKey(), opt.getOptionText());
                }

                System.out.print("Your answer (A/B/C/D or S to skip): ");
                String input = scanner.nextLine().trim().toUpperCase();
                if (timeExpired.get()) {
                    break;
                }
                if (!input.isEmpty() && !"S".equals(input)) {
                    try {
                        OptionKey selected = OptionKey.valueOf(input);
                        if (selected == q.getCorrectOptionKey()) {
                            correct++;
                            totalPoints += q.getPoints();
                        }
                    } catch (IllegalArgumentException ignored) {
                        System.out.println("Invalid key ignored; counted as unanswered.");
                    }
                }
            }
        } finally {
            timerExecutor.shutdownNow();
        }

        double pct = maxPoints > 0 ? (totalPoints * 100.0) / maxPoints : 0.0;
        boolean passed = pct >= quiz.getPassingPercentage();

        System.out.println("\n==================== QUIZ REPORT ====================");
        System.out.printf("Correct: %d / %d%n", correct, questions.size());
        System.out.printf("Score:   %d / %d (%.2f%%)%n", totalPoints, maxPoints, pct);
        System.out.println("Status:  " + (passed ? "PASSED" : "FAILED"));
        System.out.println("=====================================================");
    }
}
