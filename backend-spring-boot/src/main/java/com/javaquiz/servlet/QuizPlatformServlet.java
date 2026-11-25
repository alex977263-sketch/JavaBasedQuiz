package com.javaquiz.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaquiz.concurrent.QuizSessionMonitor;
import com.javaquiz.entity.Difficulty;
import com.javaquiz.jdbc.JdbcQuizDao;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Standard Jakarta HttpServlet implementation handling HTTP GET and POST requests
 * directly using Servlet API (HttpServletRequest, HttpServletResponse, PrintWriter)
 * backed by the JDBC DAO layer and concurrent session monitor.
 */
@RequiredArgsConstructor
public class QuizPlatformServlet extends HttpServlet {

    private final JdbcQuizDao jdbcQuizDao;
    private final QuizSessionMonitor sessionMonitor;
    private final ObjectMapper objectMapper;

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        String difficultyParam = req.getParameter("difficulty");
        List<JdbcQuizDao.JdbcQuizRow> rows = jdbcQuizDao.findApprovedActiveQuizzes();

        if (difficultyParam != null && !difficultyParam.isBlank()) {
            try {
                Difficulty diff = Difficulty.valueOf(difficultyParam.trim().toUpperCase());
                rows = rows.stream()
                        .filter(r -> diff.name().equalsIgnoreCase(r.getDifficulty()))
                        .toList();
            } catch (IllegalArgumentException ex) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                try (PrintWriter out = resp.getWriter()) {
                    out.write(objectMapper.writeValueAsString(Map.of(
                            "success", false,
                            "error", "Invalid difficulty filter: " + difficultyParam
                    )));
                }
                return;
            }
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("success", true);
        payload.put("source", "Jakarta HttpServlet + JDBC DAO");
        payload.put("activeTimedSessions", sessionMonitor.getActiveSessionCount());
        payload.put("quizCount", rows.size());
        payload.put("quizzes", rows);

        resp.setStatus(HttpServletResponse.SC_OK);
        try (PrintWriter out = resp.getWriter()) {
            out.write(objectMapper.writeValueAsString(payload));
        }
    }

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        String email = req.getParameter("email");
        if (email == null || email.isBlank()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            try (PrintWriter out = resp.getWriter()) {
                out.write(objectMapper.writeValueAsString(Map.of(
                        "success", false,
                        "error", "Parameter 'email' is required"
                )));
            }
            return;
        }

        var summaryOpt = jdbcQuizDao.fetchParticipantSummaryByEmail(email.trim().toLowerCase());
        if (summaryOpt.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            try (PrintWriter out = resp.getWriter()) {
                out.write(objectMapper.writeValueAsString(Map.of(
                        "success", false,
                        "error", "User not found: " + email
                )));
            }
            return;
        }

        resp.setStatus(HttpServletResponse.SC_OK);
        try (PrintWriter out = resp.getWriter()) {
            out.write(objectMapper.writeValueAsString(Map.of(
                    "success", true,
                    "summary", summaryOpt.get()
            )));
        }
    }
}
