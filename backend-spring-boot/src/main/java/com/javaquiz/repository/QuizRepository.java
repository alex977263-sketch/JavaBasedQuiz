package com.javaquiz.repository;

import com.javaquiz.entity.ApprovalStatus;
import com.javaquiz.entity.Difficulty;
import com.javaquiz.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Optional<Quiz> findBySlug(String slug);
    List<Quiz> findByCreatedByIdOrderByCreatedAtDesc(Long creatorId);
    List<Quiz> findByApprovalStatusOrderByCreatedAtDesc(ApprovalStatus status);

    @Query("""
            SELECT q FROM Quiz q
            WHERE q.isActive = true
              AND q.approvalStatus = 'APPROVED'
              AND (:categoryId IS NULL OR q.category.id = :categoryId)
              AND (:difficulty IS NULL OR q.difficulty = :difficulty)
              AND (:keyword IS NULL OR LOWER(q.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(q.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
            ORDER BY q.createdAt DESC
            """)
    List<Quiz> searchApprovedActiveQuizzes(
            @Param("categoryId") Long categoryId,
            @Param("difficulty") Difficulty difficulty,
            @Param("keyword") String keyword
    );
}
