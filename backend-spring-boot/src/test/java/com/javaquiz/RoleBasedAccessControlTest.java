package com.javaquiz;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class RoleBasedAccessControlTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void publicCatalogIsAccessibleWithoutAuthentication() throws Exception {
        mockMvc.perform(get("/quizzes")).andExpect(status().isOk());
        mockMvc.perform(get("/categories")).andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "participant@javaquiz.com", roles = {"PARTICIPANT"})
    void participantCannotAccessAdminOrCreatorEndpoints() throws Exception {
        mockMvc.perform(get("/admin/users")).andExpect(status().isForbidden());
        mockMvc.perform(get("/creator/quizzes")).andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "creator@javaquiz.com", roles = {"CREATOR"})
    void creatorCannotAccessAdminEndpoints() throws Exception {
        mockMvc.perform(get("/admin/users")).andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@javaquiz.com", roles = {"ADMIN"})
    void adminCanAccessAdminEndpoints() throws Exception {
        mockMvc.perform(get("/admin/users")).andExpect(status().isOk());
        mockMvc.perform(get("/admin/analytics")).andExpect(status().isOk());
    }
}
