package com.javaquiz.repository;

import com.javaquiz.entity.InteractionStatus;
import com.javaquiz.entity.ParticipantCreatorInteraction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InteractionRepository extends JpaRepository<ParticipantCreatorInteraction, Long> {
    List<ParticipantCreatorInteraction> findByParticipantIdOrderByCreatedAtDesc(Long participantId);
    List<ParticipantCreatorInteraction> findByQuizCreatedByIdOrderByCreatedAtDesc(Long creatorId);
    List<ParticipantCreatorInteraction> findByStatusOrderByCreatedAtDesc(InteractionStatus status);
    List<ParticipantCreatorInteraction> findAllByOrderByCreatedAtDesc();
}
