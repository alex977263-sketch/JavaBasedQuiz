package com.javaquiz;

import com.javaquiz.repository.CategoryRepository;
import com.javaquiz.repository.QuizRepository;
import com.javaquiz.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class OnlineQuizPlatformApplicationTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Test
    void contextLoadsAndSeedsInitialData() {
        assertThat(userRepository.count()).isGreaterThanOrEqualTo(5);
        assertThat(categoryRepository.count()).isEqualTo(7);
        assertThat(quizRepository.count()).isEqualTo(7);
    }
}
