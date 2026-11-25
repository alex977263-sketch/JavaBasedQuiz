package com.javaquiz.repository;

import com.javaquiz.entity.AttemptStatus;
import com.javaquiz.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    Optional<QuizAttempt> findByAttemptToken(String attemptToken);
    List<QuizAttempt> findByUserIdAndStatusOrderBySubmittedAtDesc(Long userId, AttemptStatus status);
    List<QuizAttempt> findByUserIdOrderByStartedAtDesc(Long userId);
    List<QuizAttempt> findByQuizIdAndStatusOrderBySubmittedAtDesc(Long quizId, AttemptStatus status);
    List<QuizAttempt> findByStatusOrderBySubmittedAtDesc(AttemptStatus status);
    Optional<QuizAttempt> findFirstByQuizIdAndUserIdAndStatus(Long quizId, Long userId, AttemptStatus status);
}
