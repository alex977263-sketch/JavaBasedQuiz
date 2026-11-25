package com.javaquiz;

import com.javaquiz.dto.CreateQuestionRequest;
import com.javaquiz.entity.AuditLog;
import com.javaquiz.service.AuditLogService;
import com.javaquiz.service.QuestionBankService;
import com.javaquiz.util.QuizValidationUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class AuditAndQuestionBankTest {

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private QuestionBankService questionBankService;

    @Test
    void recordsAndQueriesAuditLogs() {
        auditLogService.record(
                "admin@javaquiz.com",
                "ROLE_ADMIN",
                "SYSTEM_CHECK",
                "SystemSettings",
                1L,
                "Verified audit logging repository"
        );

        List<AuditLog> recent = auditLogService.getRecentAuditLogs();
        assertThat(recent).isNotEmpty();
        assertThat(recent.get(0).getAction()).isEqualTo("SYSTEM_CHECK");
    }

    @Test
    void curatedJavaQuestionTemplatesPassValidationRules() {
        List<CreateQuestionRequest> templates = questionBankService.getCuratedJavaTemplates();
        assertThat(templates).hasSizeGreaterThanOrEqualTo(5);

        for (CreateQuestionRequest template : templates) {
            assertThat(template.getQuestionText()).isNotBlank();
            assertThat(template.getExplanation()).isNotBlank();
            assertThat(template.getCorrectOptionKey()).isNotNull();
            QuizValidationUtils.validateFourOptions(template.getOptions());
        }
    }
}
