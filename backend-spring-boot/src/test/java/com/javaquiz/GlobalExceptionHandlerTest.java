package com.javaquiz;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaquiz.dto.LoginRequest;
import com.javaquiz.security.CustomUserDetailsService;
import com.javaquiz.security.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Test
    void invalidLoginReturns401StructuredError() throws Exception {
        LoginRequest badCreds = new LoginRequest("admin@javaquiz.com", "WrongPassword!");
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badCreds)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Authentication Failed"));
    }

    @Test
    void validationFailureReturns400WithFieldErrors() throws Exception {
        LoginRequest emptyLogin = new LoginRequest("", "");
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(emptyLogin)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.validationErrors.emailOrUsername").exists())
                .andExpect(jsonPath("$.validationErrors.password").exists());
    }

    @Test
    void missingQuizReturns404ResourceNotFound() throws Exception {
        mockMvc.perform(get("/quizzes/999999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Resource Not Found"));
    }

    @Test
    void integrityAuditEndpointPassesForAllSeededQuizzes() throws Exception {
        var userDetails = userDetailsService.loadUserByUsername("admin@javaquiz.com");
        var auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        String token = "Bearer " + jwtTokenProvider.generateToken(auth);

        mockMvc.perform(get("/admin/quizzes/integrity-audit").header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].valid").value(true));
    }
}
