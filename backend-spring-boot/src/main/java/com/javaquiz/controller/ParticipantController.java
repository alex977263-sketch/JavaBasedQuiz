package com.javaquiz.controller;

import com.javaquiz.dto.*;
import com.javaquiz.security.UserPrincipal;
import com.javaquiz.service.ParticipantPortalService;
import com.javaquiz.service.ReportExportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/participant")
@RequiredArgsConstructor
public class ParticipantController {

    private final ParticipantPortalService portalService;
    private final ReportExportService reportExportService;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('PARTICIPANT', 'CREATOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<ParticipantStatsDto>> getMyStats(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Participant statistics retrieved",
                portalService.getParticipantStats(principal.getId())
        ));
    }

    @GetMapping("/leaderboard")
    @PreAuthorize("hasAnyRole('PARTICIPANT', 'CREATOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<LeaderboardEntryDto>>> getLeaderboard() {
        return ResponseEntity.ok(ApiResponse.ok("Leaderboard retrieved", portalService.getLeaderboard()));
    }

    @GetMapping("/interactions")
    @PreAuthorize("hasAnyRole('PARTICIPANT', 'CREATOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<InteractionDto>>> getMyInteractions(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Interactions retrieved",
                portalService.getMyInteractions(principal.getId())
        ));
    }

    @PostMapping("/interactions")
    @PreAuthorize("hasAnyRole('PARTICIPANT', 'CREATOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<InteractionDto>> sendInteraction(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateInteractionRequest request
    ) {
        InteractionDto created = portalService.sendInteraction(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Interaction sent to quiz creator", created));
    }

    @GetMapping("/reminders")
    @PreAuthorize("hasAnyRole('PARTICIPANT', 'CREATOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<QuizReminderDto>>> getMyReminders(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Quiz reminders retrieved",
                portalService.getMyReminders(principal.getId())
        ));
    }

    @PostMapping("/reminders")
    @PreAuthorize("hasAnyRole('PARTICIPANT', 'CREATOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<QuizReminderDto>> addReminder(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateReminderRequest request
    ) {
        QuizReminderDto created = portalService.addReminder(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Reminder added successfully", created));
    }

    @PatchMapping("/reminders/{reminderId}/toggle")
    @PreAuthorize("hasAnyRole('PARTICIPANT', 'CREATOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<QuizReminderDto>> toggleReminder(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long reminderId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Reminder status updated",
                portalService.toggleReminderCompleted(principal.getId(), reminderId)
        ));
    }

    @DeleteMapping("/reminders/{reminderId}")
    @PreAuthorize("hasAnyRole('PARTICIPANT', 'CREATOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteReminder(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long reminderId
    ) {
        portalService.deleteReminder(principal.getId(), reminderId);
        return ResponseEntity.ok(ApiResponse.ok("Reminder deleted", null));
    }

    @GetMapping("/reports/export")
    @PreAuthorize("hasAnyRole('PARTICIPANT', 'CREATOR', 'ADMIN')")
    public ResponseEntity<byte[]> exportMyReportCsv(@AuthenticationPrincipal UserPrincipal principal) {
        byte[] csvBytes = reportExportService.exportParticipantHistoryCsv(principal.getId());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=my-quiz-performance.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvBytes);
    }
}
