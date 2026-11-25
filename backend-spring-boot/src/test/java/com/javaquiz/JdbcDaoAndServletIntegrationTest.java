package com.javaquiz;

import com.javaquiz.entity.Difficulty;
import com.javaquiz.jdbc.JdbcQuizDao;
import com.javaquiz.servlet.QuizPlatformServlet;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class JdbcDaoAndServletIntegrationTest {

    @Autowired
    private JdbcQuizDao jdbcQuizDao;

    @Autowired
    private QuizPlatformServlet quizPlatformServlet;

    @Test
    void jdbcDaoQueriesApprovedQuizzesCountsAndParticipantSummary() {
        List<JdbcQuizDao.JdbcQuizRow> approved = jdbcQuizDao.findApprovedActiveQuizzes();
        assertThat(approved).hasSize(6);

        int easyCount = jdbcQuizDao.countQuizzesByDifficulty(Difficulty.EASY);
        assertThat(easyCount).isGreaterThanOrEqualTo(2);

        var summary = jdbcQuizDao.fetchParticipantSummaryByEmail("participant@javaquiz.com");
        assertThat(summary).isPresent();
        assertThat(summary.get().getEmail()).isEqualTo("participant@javaquiz.com");

        Long firstQuizId = approved.get(0).getId();
        try {
            int updated = jdbcQuizDao.updateQuizActiveFlag(firstQuizId, false);
            assertThat(updated).isEqualTo(1);
        } finally {
            jdbcQuizDao.updateQuizActiveFlag(firstQuizId, true);
        }
    }

    @Test
    void jakartaHttpServletHandlesGetAndPostRequestsWithJdbcDao() throws Exception {
        MockHttpServletRequest getReq = new MockHttpServletRequest("GET", "/servlet/quizzes");
        getReq.setParameter("difficulty", "EASY");
        MockHttpServletResponse getResp = new MockHttpServletResponse();

        quizPlatformServlet.doGet(getReq, getResp);

        assertThat(getResp.getStatus()).isEqualTo(200);
        assertThat(getResp.getContentAsString()).contains("Jakarta HttpServlet + JDBC DAO");
        assertThat(getResp.getContentAsString()).contains("\"success\":true");

        MockHttpServletRequest badReq = new MockHttpServletRequest("GET", "/servlet/quizzes");
        badReq.setParameter("difficulty", "INVALID_LEVEL");
        MockHttpServletResponse badResp = new MockHttpServletResponse();
        quizPlatformServlet.doGet(badReq, badResp);
        assertThat(badResp.getStatus()).isEqualTo(400);

        MockHttpServletRequest postReq = new MockHttpServletRequest("POST", "/servlet/quizzes");
        postReq.setParameter("email", "participant@javaquiz.com");
        MockHttpServletResponse postResp = new MockHttpServletResponse();
        quizPlatformServlet.doPost(postReq, postResp);

        assertThat(postResp.getStatus()).isEqualTo(200);
        assertThat(postResp.getContentAsString()).contains("participant@javaquiz.com");
    }
}
