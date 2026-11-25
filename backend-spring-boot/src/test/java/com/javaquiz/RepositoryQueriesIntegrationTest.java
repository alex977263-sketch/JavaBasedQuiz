package com.javaquiz;

import com.javaquiz.entity.ApprovalStatus;
import com.javaquiz.entity.Difficulty;
import com.javaquiz.entity.RoleName;
import com.javaquiz.repository.CategoryRepository;
import com.javaquiz.repository.InteractionRepository;
import com.javaquiz.repository.QuizRepository;
import com.javaquiz.repository.UserRepository;
import com.javaquiz.service.QuizIntegrityAuditService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class RepositoryQueriesIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private InteractionRepository interactionRepository;

    @Autowired
    private QuizIntegrityAuditService integrityAuditService;

    @Test
    void queriesUsersByRoleNameCorrectly() {
        assertThat(userRepository.findAllByRoleName(RoleName.ROLE_ADMIN)).hasSize(1);
        assertThat(userRepository.findAllByRoleName(RoleName.ROLE_CREATOR)).hasSize(2);
        assertThat(userRepository.findAllByRoleName(RoleName.ROLE_PARTICIPANT)).hasSize(2);
    }

    @Test
    void searchesApprovedActiveQuizzesAndExcludesPending() {
        var approved = quizRepository.searchApprovedActiveQuizzes(null, null, null);
        assertThat(approved).hasSize(6);
        assertThat(approved).allMatch(q -> q.getApprovalStatus() == ApprovalStatus.APPROVED);

        var pending = quizRepository.findByApprovalStatusOrderByCreatedAtDesc(ApprovalStatus.PENDING);
        assertThat(pending).hasSize(1);
        assertThat(pending.get(0).getSlug()).isEqualTo("os-threads-deadlocks");

        var javaCat = categoryRepository.findBySlug("java-programming").orElseThrow();
        var easyJava = quizRepository.searchApprovedActiveQuizzes(javaCat.getId(), Difficulty.EASY, null);
        assertThat(easyJava).hasSize(1);
    }

    @Test
    void allSeededQuizzesPassIntegrityAudit() {
        var reports = integrityAuditService.auditAllQuizzes();
        assertThat(reports).hasSize(7);
        assertThat(reports).allMatch(QuizIntegrityAuditService.QuizIntegrityReport::isValid);
        assertThat(interactionRepository.findAllByOrderByCreatedAtDesc()).isNotEmpty();
    }
}
