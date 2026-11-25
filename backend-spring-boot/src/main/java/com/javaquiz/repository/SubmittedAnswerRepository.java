package com.javaquiz.repository;

import com.javaquiz.entity.SubmittedAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmittedAnswerRepository extends JpaRepository<SubmittedAnswer, Long> {
    List<SubmittedAnswer> findByAttemptId(Long attemptId);
}
