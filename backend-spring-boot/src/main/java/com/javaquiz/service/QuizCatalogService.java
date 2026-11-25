package com.javaquiz.service;

import com.javaquiz.dto.CategoryDto;
import com.javaquiz.dto.QuestionAdminDto;
import com.javaquiz.dto.QuizSummaryDto;
import com.javaquiz.entity.Difficulty;
import com.javaquiz.entity.Quiz;
import com.javaquiz.exception.ResourceNotFoundException;
import com.javaquiz.repository.CategoryRepository;
import com.javaquiz.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizCatalogService {

    private final CategoryRepository categoryRepository;
    private final QuizRepository quizRepository;
    private final DtoMapper mapper;

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(mapper::toCategoryDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuizSummaryDto> searchAvailableQuizzes(Long categoryId, Difficulty difficulty, String keyword) {
        String normalizedKeyword = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        return quizRepository.searchApprovedActiveQuizzes(categoryId, difficulty, normalizedKeyword).stream()
                .map(mapper::toQuizSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QuizSummaryDto getQuizSummary(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + quizId));
        return mapper.toQuizSummaryDto(quiz);
    }

    @Transactional(readOnly = true)
    public List<QuestionAdminDto> getQuizQuestionsForAuthorOrAdmin(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + quizId));
        return quiz.getQuestions().stream()
                .map(mapper::toQuestionAdminDto)
                .collect(Collectors.toList());
    }
}
