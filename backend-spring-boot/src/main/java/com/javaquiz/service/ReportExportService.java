package com.javaquiz.service;

import com.javaquiz.dto.QuizAttemptResultDto;
import com.javaquiz.entity.AttemptStatus;
import com.javaquiz.entity.QuizAttempt;
import com.javaquiz.repository.QuizAttemptRepository;
import com.javaquiz.util.QuizValidationUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Generates downloadable CSV performance reports for Participants and Administrators.
 */
@Service
@RequiredArgsConstructor
public class ReportExportService {

    private final QuizAttemptRepository attemptRepository;
    private final DtoMapper mapper;

    @Transactional(readOnly = true)
    public byte[] exportParticipantHistoryCsv(Long userId) {
        List<QuizAttempt> attempts = attemptRepository.findByUserIdAndStatusOrderBySubmittedAtDesc(
                userId, AttemptStatus.SUBMITTED);
        return buildAttemptsCsv(attempts);
    }

    @Transactional(readOnly = true)
    public byte[] exportPlatformPerformanceCsv() {
        List<QuizAttempt> attempts = attemptRepository.findByStatusOrderBySubmittedAtDesc(AttemptStatus.SUBMITTED);
        return buildAttemptsCsv(attempts);
    }

    public byte[] buildAttemptsCsv(List<QuizAttempt> attempts) {
        StringBuilder sb = new StringBuilder();
        sb.append("AttemptID,QuizTitle,Category,Difficulty,ParticipantName,ParticipantEmail,")
          .append("TotalQuestions,Correct,Incorrect,Unanswered,Score,MaxScore,Percentage,Status,TimeTaken,CreatorGrade\n");

        for (QuizAttempt attempt : attempts) {
            QuizAttemptResultDto dto = mapper.toAttemptResultDto(attempt, false);
            sb.append(dto.getId()).append(',')
              .append(escapeCsv(dto.getQuizTitle())).append(',')
              .append(escapeCsv(dto.getCategoryName())).append(',')
              .append(dto.getDifficulty()).append(',')
              .append(escapeCsv(dto.getUserName())).append(',')
              .append(escapeCsv(dto.getUserEmail())).append(',')
              .append(dto.getTotalQuestions()).append(',')
              .append(dto.getCorrectAnswersCount()).append(',')
              .append(dto.getIncorrectAnswersCount()).append(',')
              .append(dto.getUnansweredCount()).append(',')
              .append(dto.getScore()).append(',')
              .append(dto.getMaxScore()).append(',')
              .append(dto.getPercentage()).append("%,")
              .append(Boolean.TRUE.equals(dto.getIsPassed()) ? "PASSED" : "FAILED").append(',')
              .append(QuizValidationUtils.formatDurationSeconds(dto.getTimeTakenSeconds())).append(',')
              .append(dto.getCreatorFeedback() != null ? dto.getCreatorFeedback().getGradeTag() : "N/A")
              .append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }
        boolean needsQuotes = value.contains(",") || value.contains("\"") || value.contains("\n");
        String escaped = value.replace("\"", "\"\"");
        return needsQuotes ? "\"" + escaped + "\"" : escaped;
    }
}
