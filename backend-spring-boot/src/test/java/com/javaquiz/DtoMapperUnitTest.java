package com.javaquiz;

import com.javaquiz.dto.QuizSummaryDto;
import com.javaquiz.dto.UserDto;
import com.javaquiz.entity.RoleName;
import com.javaquiz.repository.QuizRepository;
import com.javaquiz.repository.UserRepository;
import com.javaquiz.service.DtoMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class DtoMapperUnitTest {

    @Autowired
    private DtoMapper mapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Test
    void mapsUserEntityToUserDtoWithPrimaryRole() {
        var creator = userRepository.findByEmail("creator@javaquiz.com").orElseThrow();
        UserDto dto = mapper.toUserDto(creator);

        assertThat(dto.getEmail()).isEqualTo("creator@javaquiz.com");
        assertThat(dto.getFullName()).isEqualTo("Prof. James Gosling");
        assertThat(dto.getRole()).isEqualTo(RoleName.ROLE_CREATOR);
        assertThat(dto.getIsEnabled()).isTrue();
    }

    @Test
    void mapsQuizEntityToQuizSummaryDtoWithTotalMarks() {
        var quiz = quizRepository.findBySlug("java-core-variables-control-flow").orElseThrow();
        QuizSummaryDto dto = mapper.toQuizSummaryDto(quiz);

        assertThat(dto.getQuestionsCount()).isEqualTo(quiz.getQuestions().size());
        assertThat(dto.getTotalMarks()).isEqualTo(quiz.getTotalMarks());
        assertThat(dto.getCategoryName()).isEqualTo("Java Programming");
    }
}
