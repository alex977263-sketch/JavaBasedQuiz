package com.javaquiz.repository;

import com.javaquiz.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findTop50ByOrderByCreatedAtDesc();
    List<AuditLog> findTop50ByOrderByCreatedAtDescIdDesc();
    List<AuditLog> findByActorEmailOrderByCreatedAtDesc(String actorEmail);
}
