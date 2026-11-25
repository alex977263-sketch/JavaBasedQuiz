package com.javaquiz.service;

import com.javaquiz.entity.AuditLog;
import com.javaquiz.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service responsible for recording and querying platform audit trails.
 */
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional
    public void record(String actorEmail, String actorRole, String action, String targetEntity, Long targetId, String details) {
        AuditLog entry = AuditLog.builder()
                .actorEmail(actorEmail != null ? actorEmail : "system@javaquiz.com")
                .actorRole(actorRole != null ? actorRole : "SYSTEM")
                .action(action)
                .targetEntity(targetEntity)
                .targetId(targetId)
                .details(details)
                .build();
        auditLogRepository.save(entry);
    }

    @Transactional(readOnly = true)
    public List<AuditLog> getRecentAuditLogs() {
        return auditLogRepository.findTop50ByOrderByCreatedAtDescIdDesc();
    }

    @Transactional(readOnly = true)
    public List<AuditLog> getLogsForActor(String actorEmail) {
        return auditLogRepository.findByActorEmailOrderByCreatedAtDesc(actorEmail);
    }
}
