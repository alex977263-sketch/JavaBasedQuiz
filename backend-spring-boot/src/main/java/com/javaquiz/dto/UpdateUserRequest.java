package com.javaquiz.dto;

import com.javaquiz.entity.RoleName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String fullName;
    private String email;
    private String username;
    private RoleName role;
    private String collegeOrCompany;
    private Boolean isEnabled;
}
