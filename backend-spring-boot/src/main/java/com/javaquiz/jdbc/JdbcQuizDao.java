package com.javaquiz.jdbc;

import com.javaquiz.entity.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Pure JDBC Data Access Object (DAO) using Connection, PreparedStatement, ResultSet,
 * and try-with-resources to execute relational SQL queries against MySQL/H2.
 */
@Repository
@RequiredArgsConstructor
public class JdbcQuizDao {

    private final JdbcConnectionManager connectionManager;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JdbcQuizRow {
        private Long id;
        private String title;
        private String slug;
        private String categoryName;
        private String difficulty;
        private int durationMinutes;
        private int passingPercentage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JdbcParticipantSummary {
        private Long userId;
        private String fullName;
        private String email;
        private int totalSubmittedAttempts;
        private double averagePercentage;
        private double bestPercentage;
    }

    public List<JdbcQuizRow> findApprovedActiveQuizzes() {
        String sql = """
                SELECT q.id, q.title, q.slug, c.name AS category_name,
                       q.difficulty, q.duration_minutes, q.passing_percentage
                FROM quizzes q
                INNER JOIN categories c ON q.category_id = c.id
                WHERE q.is_active = TRUE
                  AND q.approval_status = 'APPROVED'
                ORDER BY q.id ASC
                """;

        List<JdbcQuizRow> results = new ArrayList<>();
        try (Connection conn = connectionManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                results.add(JdbcQuizRow.builder()
                        .id(rs.getLong("id"))
                        .title(rs.getString("title"))
                        .slug(rs.getString("slug"))
                        .categoryName(rs.getString("category_name"))
                        .difficulty(rs.getString("difficulty"))
                        .durationMinutes(rs.getInt("duration_minutes"))
                        .passingPercentage(rs.getInt("passing_percentage"))
                        .build());
            }
        } catch (SQLException ex) {
            throw new IllegalStateException("JDBC query failed while fetching approved quizzes", ex);
        }
        return results;
    }

    public int countQuizzesByDifficulty(Difficulty difficulty) {
        String sql = "SELECT COUNT(*) FROM quizzes WHERE difficulty = ? AND is_active = TRUE";
        try (Connection conn = connectionManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, difficulty.name());
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? rs.getInt(1) : 0;
            }
        } catch (SQLException ex) {
            throw new IllegalStateException("JDBC count failed for difficulty " + difficulty, ex);
        }
    }

    public Optional<JdbcParticipantSummary> fetchParticipantSummaryByEmail(String email) {
        String sql = """
                SELECT u.id, u.full_name, u.email,
                       COUNT(qa.id) AS total_attempts,
                       COALESCE(AVG(qa.percentage), 0) AS avg_pct,
                       COALESCE(MAX(qa.percentage), 0) AS max_pct
                FROM users u
                LEFT JOIN quiz_attempts qa
                       ON qa.user_id = u.id AND qa.status = 'SUBMITTED'
                WHERE u.email = ?
                GROUP BY u.id, u.full_name, u.email
                """;

        try (Connection conn = connectionManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(JdbcParticipantSummary.builder()
                            .userId(rs.getLong("id"))
                            .fullName(rs.getString("full_name"))
                            .email(rs.getString("email"))
                            .totalSubmittedAttempts(rs.getInt("total_attempts"))
                            .averagePercentage(Math.round(rs.getDouble("avg_pct") * 100.0) / 100.0)
                            .bestPercentage(Math.round(rs.getDouble("max_pct") * 100.0) / 100.0)
                            .build());
                }
                return Optional.empty();
            }
        } catch (SQLException ex) {
            throw new IllegalStateException("JDBC participant summary query failed for " + email, ex);
        }
    }

    public int updateQuizActiveFlag(Long quizId, boolean active) {
        String sql = "UPDATE quizzes SET is_active = ? WHERE id = ?";
        try (Connection conn = connectionManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setBoolean(1, active);
            ps.setLong(2, quizId);
            return ps.executeUpdate();
        } catch (SQLException ex) {
            throw new IllegalStateException("JDBC update failed for quiz ID " + quizId, ex);
        }
    }
}
