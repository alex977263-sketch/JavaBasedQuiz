package com.javaquiz.dto;

import com.javaquiz.entity.GradeTag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GradeAttemptRequest {
    @NotBlank(message = "Feedback notes are required")
    private String feedbackNotes;

    @NotNull(message = "Grade tag is required")
    private GradeTag gradeTag;
}
