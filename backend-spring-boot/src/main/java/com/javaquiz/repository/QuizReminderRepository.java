package com.javaquiz.repository;

import com.javaquiz.entity.QuizReminder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizReminderRepository extends JpaRepository<QuizReminder, Long> {
    List<QuizReminder> findByParticipantIdOrderByCreatedAtDesc(Long participantId);
}
