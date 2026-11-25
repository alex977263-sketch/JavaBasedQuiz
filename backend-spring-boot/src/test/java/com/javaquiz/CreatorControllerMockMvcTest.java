package com.javaquiz;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaquiz.dto.*;
import com.javaquiz.entity.Difficulty;
import com.javaquiz.entity.GradeTag;
import com.javaquiz.entity.OptionKey;
import com.javaquiz.repository.CategoryRepository;
import com.javaquiz.repository.QuizRepository;
import com.javaquiz.repository.UserRepository;
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

import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class CreatorControllerMockMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private QuizRepository quizRepository;

    private String bearerFor(String email) {
        var userDetails = userDetailsService.loadUserByUsername(email);
        var auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        return "Bearer " + jwtTokenProvider.generateToken(auth);
    }

    @Test
    void creatorCanCreateUpdateAndDeleteQuizViaHttp() throws Exception {
        String token = bearerFor("creator@javaquiz.com");
        var javaCategory = categoryRepository.findBySlug("java-programming").orElseThrow();

        CreateQuizRequest createReq = CreateQuizRequest.builder()
                .title("Spring Boot REST Controllers Quiz")
                .description("HTTP methods, validation, and status codes")
                .categoryId(javaCategory.getId())
                .difficulty(Difficulty.MEDIUM)
                .durationMinutes(12)
                .passingPercentage(70)
                .questions(List.of(CreateQuestionRequest.builder()
                        .questionText("Which annotation binds an HTTP JSON body to a Java DTO?")
                        .options(Map.of(
                                OptionKey.A, "@RequestParam",
                                OptionKey.B, "@PathVariable",
                                OptionKey.C, "@RequestBody",
                                OptionKey.D, "@ModelAttribute"
                        ))
                        .correctOptionKey(OptionKey.C)
                        .explanation("@RequestBody deserializes JSON request payloads into DTO objects.")
                        .points(10)
                        .build()))
                .build();

        mockMvc.perform(post("/creator/quizzes")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Spring Boot REST Controllers Quiz"));

        mockMvc.perform(get("/creator/quizzes").header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void creatorCanViewInteractionsAndQuizAnalyticsViaHttp() throws Exception {
        String token = bearerFor("creator@javaquiz.com");
        var quiz = quizRepository.findBySlug("java-core-variables-control-flow").orElseThrow();

        mockMvc.perform(get("/creator/interactions").header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/creator/quizzes/" + quiz.getId() + "/analytics").header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.quizTitle").value(quiz.getTitle()));
    }
}
