package com.javaquiz.dto;

import com.javaquiz.entity.RoleName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private RoleName role;
    private String collegeOrCompany;
    private Boolean isEnabled;
    private Instant createdAt;
}
