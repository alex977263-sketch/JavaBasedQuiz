package com.javaquiz.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.javaquiz.concurrent.QuizSessionMonitor;
import com.javaquiz.jdbc.JdbcQuizDao;
import com.javaquiz.servlet.QuizPlatformServlet;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Registers the standard Jakarta HttpServlet alongside Spring DispatcherServlet.
 */
@Configuration
public class ServletConfig {

    @Bean
    public QuizPlatformServlet quizPlatformServlet(
            JdbcQuizDao jdbcQuizDao,
            QuizSessionMonitor sessionMonitor,
            ObjectMapper objectMapper
    ) {
        return new QuizPlatformServlet(jdbcQuizDao, sessionMonitor, objectMapper);
    }

    @Bean
    public ServletRegistrationBean<QuizPlatformServlet> quizPlatformServletRegistration(
            QuizPlatformServlet servlet
    ) {
        ServletRegistrationBean<QuizPlatformServlet> registration =
                new ServletRegistrationBean<>(servlet, "/servlet/quizzes");
        registration.setName("quizPlatformServlet");
        registration.setLoadOnStartup(1);
        return registration;
    }
}
