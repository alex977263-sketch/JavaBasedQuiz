package com.javaquiz;

import com.javaquiz.dto.CategoryDto;
import com.javaquiz.dto.CreateQuestionRequest;
import com.javaquiz.dto.QuizSummaryDto;
import com.javaquiz.entity.Difficulty;
import com.javaquiz.entity.OptionKey;
import com.javaquiz.entity.User;
import com.javaquiz.exception.UnauthorizedAccessException;
import com.javaquiz.repository.CategoryRepository;
import com.javaquiz.repository.UserRepository;
import com.javaquiz.service.JavaCodingChallengeGenerator;
import com.javaquiz.service.QuizCatalogService;
import com.javaquiz.service.QuizCreatorService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class QuizCatalogAndCreatorServiceTest {

    @Autowired
    private QuizCatalogService catalogService;

    @Autowired
    private QuizCreatorService creatorService;

    @Autowired
    private JavaCodingChallengeGenerator challengeGenerator;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void searchesCatalogByKeywordCategoryAndDifficulty() {
        List<CategoryDto> categories = catalogService.getAllCategories();
        assertThat(categories).hasSize(7);

        List<QuizSummaryDto> easyQuizzes = catalogService.searchAvailableQuizzes(null, Difficulty.EASY, null);
        assertThat(easyQuizzes).isNotEmpty();
        assertThat(easyQuizzes).allMatch(q -> q.getDifficulty() == Difficulty.EASY);

        List<QuizSummaryDto> javaSearch = catalogService.searchAvailableQuizzes(null, null, "String");
        assertThat(javaSearch).isNotEmpty();
    }

    @Test
    void creatorCanAddAndDeleteQuestionsAndCannotModifyOthersQuiz() {
        User creator = userRepository.findByEmail("creator@javaquiz.com").orElseThrow();
        User anita = userRepository.findByEmail("anita@javaquiz.com").orElseThrow();
        var cat = categoryRepository.findBySlug("java-programming").orElseThrow();

        var createdQuiz = creatorService.createQuiz(creator.getId(), com.javaquiz.dto.CreateQuizRequest.builder()
                .title("Java Streams & Lambda Expressions")
                .description("Functional programming in Java")
                .categoryId(cat.getId())
                .difficulty(Difficulty.MEDIUM)
                .durationMinutes(15)
                .passingPercentage(70)
                .questions(challengeGenerator.generateCoreJavaChallenges())
                .build());

        assertThat(createdQuiz.getQuestionsCount()).isEqualTo(4);

        var addedQ = creatorService.addQuestionToQuiz(
                creator.getId(),
                false,
                createdQuiz.getId(),
                CreateQuestionRequest.builder()
                        .questionText("What does Stream.collect(Collectors.toList()) return?")
                        .options(Map.of(
                                OptionKey.A, "A List containing the stream elements",
                                OptionKey.B, "A primitive array",
                                OptionKey.C, "An Optional<Integer>",
                                OptionKey.D, "A HashMap"
                        ))
                        .correctOptionKey(OptionKey.A)
                        .explanation("Collectors.toList() accumulates stream elements into a List.")
                        .points(10)
                        .build()
        );
        assertThat(addedQ.getQuestionNumber()).isEqualTo(5);

        // Another non-admin creator cannot delete Prof. Gosling's quiz
        assertThatThrownBy(() -> creatorService.deleteQuiz(anita.getId(), false, createdQuiz.getId()))
                .isInstanceOf(UnauthorizedAccessException.class);

        creatorService.deleteQuestion(creator.getId(), false, createdQuiz.getId(), addedQ.getId());
        assertThat(catalogService.getQuizSummary(createdQuiz.getId()).getQuestionsCount()).isEqualTo(4);
    }
}
