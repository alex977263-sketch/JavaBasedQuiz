package com.javaquiz.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quiz_attempts", indexes = {
        @Index(name = "idx_qa_user", columnList = "user_id"),
        @Index(name = "idx_qa_quiz", columnList = "quiz_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "attempt_token", nullable = false, unique = true, length = 64)
    private String attemptToken;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AttemptStatus status = AttemptStatus.IN_PROGRESS;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "submitted_at")
    private Instant submittedAt;

    @Column(name = "time_taken_seconds", nullable = false)
    @Builder.Default
    private Integer timeTakenSeconds = 0;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    @Column(name = "correct_answers_count", nullable = false)
    @Builder.Default
    private Integer correctAnswersCount = 0;

    @Column(name = "incorrect_answers_count", nullable = false)
    @Builder.Default
    private Integer incorrectAnswersCount = 0;

    @Column(name = "unanswered_count", nullable = false)
    @Builder.Default
    private Integer unansweredCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer score = 0;

    @Column(name = "max_score", nullable = false)
    private Integer maxScore;

    @Column(nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal percentage = BigDecimal.ZERO;

    @Column(name = "is_passed", nullable = false)
    @Builder.Default
    private Boolean isPassed = false;

    @Column(name = "creator_feedback_notes", columnDefinition = "TEXT")
    private String creatorFeedbackNotes;

    @Enumerated(EnumType.STRING)
    @Column(name = "creator_grade_tag", length = 20)
    private GradeTag creatorGradeTag;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "graded_by")
    private User gradedBy;

    @Column(name = "graded_at")
    private Instant gradedAt;

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SubmittedAnswer> submittedAnswers = new ArrayList<>();
}
