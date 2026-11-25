package com.javaquiz.service;

import com.javaquiz.dto.*;
import com.javaquiz.entity.*;
import com.javaquiz.exception.BadRequestException;
import com.javaquiz.exception.ResourceNotFoundException;
import com.javaquiz.exception.UnauthorizedAccessException;
import com.javaquiz.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizCreatorService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final QuizAttemptRepository attemptRepository;
    private final InteractionRepository interactionRepository;
    private final SystemSettingsRepository settingsRepository;
    private final SystemAlertRepository alertRepository;
    private final DtoMapper mapper;

    @Transactional(readOnly = true)
    public List<QuizSummaryDto> getCreatorQuizzes(Long creatorId) {
        return quizRepository.findByCreatedByIdOrderByCreatedAtDesc(creatorId).stream()
                .map(mapper::toQuizSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public QuizSummaryDto createQuiz(Long creatorId, CreateQuizRequest request) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Creator not found"));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        SystemSettings settings = settingsRepository.findById(1L).orElse(null);
        boolean autoApprove = settings != null && Boolean.TRUE.equals(settings.getAutoApproveQuizzes());

        String slug = generateUniqueSlug(request.getTitle());

        Quiz quiz = Quiz.builder()
                .title(request.getTitle().trim())
                .slug(slug)
                .description(request.getDescription())
                .category(category)
                .difficulty(request.getDifficulty() != null ? request.getDifficulty() : Difficulty.MEDIUM)
                .durationMinutes(request.getDurationMinutes() != null ? request.getDurationMinutes() : 15)
                .passingPercentage(request.getPassingPercentage() != null ? request.getPassingPercentage() : 70)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .approvalStatus(autoApprove ? ApprovalStatus.APPROVED : ApprovalStatus.PENDING)
                .createdBy(creator)
                .build();

        if (request.getQuestions() != null) {
            int qNum = 1;
            for (CreateQuestionRequest qReq : request.getQuestions()) {
                Question question = buildQuestionEntity(qReq, qNum++);
                quiz.addQuestion(question);
            }
        }

        Quiz saved = quizRepository.save(quiz);

        if (!autoApprove) {
            alertRepository.save(SystemAlert.builder()
                    .title("New Quiz Submission Pending Approval")
                    .message("Quiz \"" + saved.getTitle() + "\" by " + creator.getFullName() + " requires admin review.")
                    .alertType(AlertType.INFO)
                    .build());
        }

        return mapper.toQuizSummaryDto(saved);
    }

    @Transactional
    public QuizSummaryDto updateQuiz(Long actorId, boolean isAdmin, Long quizId, UpdateQuizRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + quizId));
        enforceOwnershipOrAdmin(quiz, actorId, isAdmin);

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            quiz.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            quiz.setDescription(request.getDescription());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            quiz.setCategory(category);
        }
        if (request.getDifficulty() != null) {
            quiz.setDifficulty(request.getDifficulty());
        }
        if (request.getDurationMinutes() != null) {
            quiz.setDurationMinutes(request.getDurationMinutes());
        }
        if (request.getPassingPercentage() != null) {
            quiz.setPassingPercentage(request.getPassingPercentage());
        }
        if (request.getIsActive() != null) {
            quiz.setIsActive(request.getIsActive());
        }

        return mapper.toQuizSummaryDto(quizRepository.save(quiz));
    }

    @Transactional
    public void deleteQuiz(Long actorId, boolean isAdmin, Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + quizId));
        enforceOwnershipOrAdmin(quiz, actorId, isAdmin);
        quizRepository.delete(quiz);
    }

    @Transactional
    public QuestionAdminDto addQuestionToQuiz(Long actorId, boolean isAdmin, Long quizId, CreateQuestionRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + quizId));
        enforceOwnershipOrAdmin(quiz, actorId, isAdmin);

        int nextNumber = quiz.getQuestions().size() + 1;
        Question question = buildQuestionEntity(request, nextNumber);
        quiz.addQuestion(question);

        Quiz saved = quizRepository.save(quiz);
        Question savedQuestion = saved.getQuestions().get(saved.getQuestions().size() - 1);
        return mapper.toQuestionAdminDto(savedQuestion);
    }

    @Transactional
    public void deleteQuestion(Long actorId, boolean isAdmin, Long quizId, Long questionId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + quizId));
        enforceOwnershipOrAdmin(quiz, actorId, isAdmin);

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with ID: " + questionId));
        if (!question.getQuiz().getId().equals(quizId)) {
            throw new BadRequestException("Question does not belong to the specified quiz.");
        }

        quiz.getQuestions().remove(question);
        int idx = 1;
        for (Question q : quiz.getQuestions()) {
            q.setQuestionNumber(idx++);
        }
        quizRepository.save(quiz);
    }

    @Transactional(readOnly = true)
    public List<QuizAttemptResultDto> getAttemptsForCreatorReview(Long creatorId, boolean isAdmin) {
        List<QuizAttempt> attempts = attemptRepository.findByStatusOrderBySubmittedAtDesc(AttemptStatus.SUBMITTED);
        return attempts.stream()
                .filter(a -> isAdmin || a.getQuiz().getCreatedBy().getId().equals(creatorId))
                .map(a -> mapper.toAttemptResultDto(a, false))
                .collect(Collectors.toList());
    }

    @Transactional
    public QuizAttemptResultDto gradeAttempt(Long creatorId, Long attemptId, GradeAttemptRequest request) {
        User grader = userRepository.findById(creatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Creator not found"));
        QuizAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found with ID: " + attemptId));

        attempt.setCreatorFeedbackNotes(request.getFeedbackNotes().trim());
        attempt.setCreatorGradeTag(request.getGradeTag());
        attempt.setGradedBy(grader);
        attempt.setGradedAt(Instant.now());

        return mapper.toAttemptResultDto(attemptRepository.save(attempt), true);
    }

    @Transactional(readOnly = true)
    public List<InteractionDto> getInteractionsForCreator(Long creatorId, boolean isAdmin) {
        List<ParticipantCreatorInteraction> list = isAdmin
                ? interactionRepository.findAllByOrderByCreatedAtDesc()
                : interactionRepository.findByQuizCreatedByIdOrderByCreatedAtDesc(creatorId);
        return list.stream().map(mapper::toInteractionDto).collect(Collectors.toList());
    }

    @Transactional
    public InteractionDto replyToInteraction(Long creatorId, Long interactionId, ReplyInteractionRequest request) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Creator not found"));
        ParticipantCreatorInteraction interaction = interactionRepository.findById(interactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Interaction not found with ID: " + interactionId));

        interaction.setCreator(creator);
        interaction.setReply(request.getReplyText().trim());
        interaction.setRepliedAt(Instant.now());
        interaction.setStatus(InteractionStatus.RESOLVED);

        return mapper.toInteractionDto(interactionRepository.save(interaction));
    }

    private Question buildQuestionEntity(CreateQuestionRequest req, int questionNumber) {
        if (req.getOptions() == null || req.getOptions().size() < 4) {
            throw new BadRequestException("Every question must have 4 options (A, B, C, D).");
        }

        Question question = Question.builder()
                .questionNumber(questionNumber)
                .questionText(req.getQuestionText().trim())
                .codeSnippet(req.getCodeSnippet())
                .codeLanguage(req.getCodeLanguage() != null ? req.getCodeLanguage() : "java")
                .points(req.getPoints() != null ? req.getPoints() : 10)
                .difficulty(req.getDifficulty() != null ? req.getDifficulty() : Difficulty.MEDIUM)
                .correctOptionKey(req.getCorrectOptionKey())
                .explanation(req.getExplanation().trim())
                .build();

        for (OptionKey key : OptionKey.values()) {
            String optText = req.getOptions().get(key);
            if (optText == null || optText.isBlank()) {
                throw new BadRequestException("Option " + key + " text is required.");
            }
            question.addOption(key, optText.trim());
        }
        return question;
    }

    private void enforceOwnershipOrAdmin(Quiz quiz, Long actorId, boolean isAdmin) {
        if (!isAdmin && !quiz.getCreatedBy().getId().equals(actorId)) {
            throw new UnauthorizedAccessException("You do not have permission to modify another creator's quiz.");
        }
    }

    private String generateUniqueSlug(String title) {
        String base = title.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
        if (base.isBlank()) base = "java-quiz";
        String candidate = base;
        int counter = 1;
        while (quizRepository.findBySlug(candidate).isPresent()) {
            candidate = base + "-" + counter++;
        }
        return candidate;
    }
}
