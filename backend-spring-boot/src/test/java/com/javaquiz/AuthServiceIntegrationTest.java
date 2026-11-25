package com.javaquiz;

import com.javaquiz.dto.AuthResponse;
import com.javaquiz.dto.LoginRequest;
import com.javaquiz.dto.RegisterRequest;
import com.javaquiz.entity.RoleName;
import com.javaquiz.exception.BadRequestException;
import com.javaquiz.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class AuthServiceIntegrationTest {

    @Autowired
    private AuthService authService;

    @Test
    void registerAndLoginParticipantSuccessfully() {
        RegisterRequest registerReq = RegisterRequest.builder()
                .fullName("Test Participant")
                .email("newparticipant@javaquiz.com")
                .password("SecurePass@123")
                .collegeOrCompany("Java University")
                .role(RoleName.ROLE_PARTICIPANT)
                .build();

        AuthResponse registered = authService.register(registerReq);
        assertThat(registered.getAccessToken()).isNotBlank();
        assertThat(registered.getUser().getRole()).isEqualTo(RoleName.ROLE_PARTICIPANT);

        AuthResponse loggedIn = authService.login(new LoginRequest("newparticipant@javaquiz.com", "SecurePass@123"));
        assertThat(loggedIn.getAccessToken()).isNotBlank();
        assertThat(loggedIn.getUser().getEmail()).isEqualTo("newparticipant@javaquiz.com");
    }

    @Test
    void duplicateEmailRegistrationThrowsBadRequest() {
        RegisterRequest duplicate = RegisterRequest.builder()
                .fullName("Duplicate Admin")
                .email("admin@javaquiz.com")
                .password("Admin@2026!")
                .role(RoleName.ROLE_ADMIN)
                .build();

        assertThatThrownBy(() -> authService.register(duplicate))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("already exists");
    }
}
