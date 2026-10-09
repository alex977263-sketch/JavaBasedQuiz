package com.javaquiz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class OnlineQuizPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(OnlineQuizPlatformApplication.class, args);
    }
}
