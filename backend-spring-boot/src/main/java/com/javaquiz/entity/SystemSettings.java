package com.javaquiz.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "system_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemSettings {

    @Id
    private Long id;

    @Column(name = "platform_title", nullable = false, length = 150)
    @Builder.Default
    private String platformTitle = "Java-Based Online Quiz Platform";

    @Column(name = "default_duration_minutes", nullable = false)
    @Builder.Default
    private Integer defaultDurationMinutes = 15;

    @Column(name = "default_passing_percentage", nullable = false)
    @Builder.Default
    private Integer defaultPassingPercentage = 70;

    @Column(name = "auto_approve_quizzes", nullable = false)
    @Builder.Default
    private Boolean autoApproveQuizzes = false;

    @Column(name = "allow_participant_interactions", nullable = false)
    @Builder.Default
    private Boolean allowParticipantInteractions = true;

    @Column(name = "registration_open", nullable = false)
    @Builder.Default
    private Boolean registrationOpen = true;

    @Column(name = "maintenance_mode", nullable = false)
    @Builder.Default
    private Boolean maintenanceMode = false;

    @Column(name = "system_announcement", columnDefinition = "TEXT")
    private String systemAnnouncement;
}
