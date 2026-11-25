package com.javaquiz;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaquiz.dto.CreateInteractionRequest;
import com.javaquiz.dto.CreateReminderRequest;
import com.javaquiz.repository.QuizRepository;
import com.javaquiz.security.CustomUserDetailsService;
import com.javaquiz.security.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ParticipantControllerMockMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private QuizRepository quizRepository;

    private String bearerForParticipant() {
        var userDetails = userDetailsService.loadUserByUsername("participant@javaquiz.com");
        var auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        return "Bearer " + jwtTokenProvider.generateToken(auth);
    }

    @Test
    void participantCanStartQuizAndCannotSeeCorrectAnswersBeforeSubmission() throws Exception {
        String token = bearerForParticipant();
        var quiz = quizRepository.findBySlug("java-core-variables-control-flow").orElseThrow();

        mockMvc.perform(post("/attempts/quizzes/" + quiz.getId() + "/start")
                        .param("shuffle", "true")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.attemptToken").isNotEmpty())
                .andExpect(jsonPath("$.data.questions[0].correctOptionKey").doesNotExist())
                .andExpect(jsonPath("$.data.questions[0].explanation").doesNotExist());
    }

    @Test
    void participantCanCreateInteractionsRemindersAndFetchStatsViaHttp() throws Exception {
        String token = bearerForParticipant();
        var quiz = quizRepository.findBySlug("oop-in-java").orElseThrow();

        mockMvc.perform(get("/participant/stats").header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/participant/leaderboard").header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(post("/participant/interactions")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new CreateInteractionRequest(quiz.getId(), "Doubt on Interfaces", "Can interfaces have private helper methods in Java 9+?"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.status").value("OPEN"));

        mockMvc.perform(post("/participant/reminders")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new CreateReminderRequest(quiz.getId(), "2026-12-20T09:00", "Practice OOP quiz"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.isCompleted").value(false));
    }
}
