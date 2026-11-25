package com.javaquiz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemSettingsDto {
    private String platformTitle;
    private Integer defaultDurationMinutes;
    private Integer defaultPassingPercentage;
    private Boolean autoApproveQuizzes;
    private Boolean allowParticipantInteractions;
    private Boolean registrationOpen;
    private Boolean maintenanceMode;
    private String systemAnnouncement;
}
