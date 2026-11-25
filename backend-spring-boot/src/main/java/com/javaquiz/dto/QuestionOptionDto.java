package com.javaquiz.dto;

import com.javaquiz.entity.OptionKey;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionOptionDto {
    private Long id;
    private OptionKey optionKey;
    private String optionText;
}
