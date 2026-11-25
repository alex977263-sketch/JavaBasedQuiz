package com.javaquiz.service;

import com.javaquiz.dto.*;
import com.javaquiz.entity.*;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DtoMapper {

    public UserDto toUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getPrimaryRole())
                .collegeOrCompany(user.getCollegeOrCompany())
                .isEnabled(user.getIsEnabled())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public CategoryDto toCategoryDto(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .iconName(category.getIconName())
                .build();
    }

    public QuizSummaryDto toQuizSummaryDto(Quiz quiz) {
        return QuizSummaryDto.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .slug(quiz.getSlug())
                .description(quiz.getDescription())
                .categoryId(quiz.getCategory().getId())
                .categoryName(quiz.getCategory().getName())
                .difficulty(quiz.getDifficulty())
                .durationMinutes(quiz.getDurationMinutes())
                .passingPercentage(quiz.getPassingPercentage())
                .isActive(quiz.getIsActive())
                .approvalStatus(quiz.getApprovalStatus())
                .rejectionReason(quiz.getRejectionReason())
                .createdByUserId(quiz.getCreatedBy().getId())
                .createdByName(quiz.getCreatedBy().getFullName())
                .questionsCount(quiz.getQuestions().size())
                .totalMarks(quiz.getTotalMarks())
                .createdAt(quiz.getCreatedAt())
                .updatedAt(quiz.getUpdatedAt())
                .build();
    }

    public QuestionAdminDto toQuestionAdminDto(Question q) {
        return QuestionAdminDto.builder()
                .id(q.getId())
                .quizId(q.getQuiz().getId())
                .questionNumber(q.getQuestionNumber())
                .questionText(q.getQuestionText())
                .codeSnippet(q.getCodeSnippet())
                .codeLanguage(q.getCodeLanguage())
                .points(q.getPoints())
                .difficulty(q.getDifficulty())
                .correctOptionKey(q.getCorrectOptionKey())
                .explanation(q.getExplanation())
                .options(q.getOptions().stream()
                        .sorted(Comparator.comparing(QuestionOption::getOptionKey))
                        .map(this::toQuestionOptionDto)
                        .collect(Collectors.toList()))
                .build();
    }

    public QuestionOptionDto toQuestionOptionDto(QuestionOption option) {
        return QuestionOptionDto.builder()
                .id(option.getId())
                .optionKey(option.getOptionKey())
                .optionText(option.getOptionText())
                .build();
    }

    public QuizAttemptResultDto toAttemptResultDto(QuizAttempt attempt, boolean includeReview) {
        QuizAttemptResultDto.CreatorFeedbackDto feedbackDto = null;
        if (attempt.getCreatorFeedbackNotes() != null && attempt.getCreatorGradeTag() != null) {
            feedbackDto = QuizAttemptResultDto.CreatorFeedbackDto.builder()
                    .creatorId(attempt.getGradedBy() != null ? attempt.getGradedBy().getId() : null)
                    .creatorName(attempt.getGradedBy() != null ? attempt.getGradedBy().getFullName() : "Quiz Creator")
                    .feedbackNotes(attempt.getCreatorFeedbackNotes())
                    .gradeTag(attempt.getCreatorGradeTag())
                    .awardedAt(attempt.getGradedAt())
                    .build();
        }

        List<QuestionReviewDto> reviews = includeReview
                ? attempt.getSubmittedAnswers().stream()
                .sorted(Comparator.comparing(sa -> sa.getQuestion().getQuestionNumber()))
                .map(sa -> {
                    Question q = sa.getQuestion();
                    return QuestionReviewDto.builder()
                            .questionId(q.getId())
                            .questionNumber(q.getQuestionNumber())
                            .questionText(q.getQuestionText())
                            .codeSnippet(q.getCodeSnippet())
                            .options(q.getOptions().stream()
                                    .sorted(Comparator.comparing(QuestionOption::getOptionKey))
                                    .map(this::toQuestionOptionDto)
                                    .collect(Collectors.toList()))
                            .selectedOptionKey(sa.getSelectedOptionKey())
                            .correctOptionKey(q.getCorrectOptionKey())
                            .isCorrect(sa.getIsCorrect())
                            .isUnanswered(sa.getSelectedOptionKey() == null)
                            .explanation(q.getExplanation())
                            .pointsAwarded(sa.getPointsAwarded())
                            .maxPoints(q.getPoints())
                            .build();
                })
                .collect(Collectors.toList())
                : List.of();

        return QuizAttemptResultDto.builder()
                .id(attempt.getId())
                .quizId(attempt.getQuiz().getId())
                .quizTitle(attempt.getQuiz().getTitle())
                .categoryName(attempt.getQuiz().getCategory().getName())
                .difficulty(attempt.getQuiz().getDifficulty())
                .userId(attempt.getUser().getId())
                .userName(attempt.getUser().getFullName())
                .userEmail(attempt.getUser().getEmail())
                .status(attempt.getStatus())
                .startedAt(attempt.getStartedAt())
                .submittedAt(attempt.getSubmittedAt())
                .timeTakenSeconds(attempt.getTimeTakenSeconds())
                .totalQuestions(attempt.getTotalQuestions())
                .correctAnswersCount(attempt.getCorrectAnswersCount())
                .incorrectAnswersCount(attempt.getIncorrectAnswersCount())
                .unansweredCount(attempt.getUnansweredCount())
                .score(attempt.getScore())
                .maxScore(attempt.getMaxScore())
                .percentage(attempt.getPercentage())
                .isPassed(attempt.getIsPassed())
                .passingPercentage(attempt.getQuiz().getPassingPercentage())
                .creatorFeedback(feedbackDto)
                .reviews(reviews)
                .build();
    }

    public InteractionDto toInteractionDto(ParticipantCreatorInteraction interaction) {
        return InteractionDto.builder()
                .id(interaction.getId())
                .participantId(interaction.getParticipant().getId())
                .participantName(interaction.getParticipant().getFullName())
                .participantEmail(interaction.getParticipant().getEmail())
                .creatorId(interaction.getCreator() != null ? interaction.getCreator().getId() : null)
                .creatorName(interaction.getCreator() != null ? interaction.getCreator().getFullName() : null)
                .quizId(interaction.getQuiz().getId())
                .quizTitle(interaction.getQuiz().getTitle())
                .subject(interaction.getSubject())
                .message(interaction.getMessage())
                .reply(interaction.getReply())
                .repliedAt(interaction.getRepliedAt())
                .status(interaction.getStatus())
                .createdAt(interaction.getCreatedAt())
                .build();
    }

    public QuizReminderDto toReminderDto(QuizReminder reminder) {
        return QuizReminderDto.builder()
                .id(reminder.getId())
                .participantId(reminder.getParticipant().getId())
                .quizId(reminder.getQuiz().getId())
                .quizTitle(reminder.getQuiz().getTitle())
                .reminderDateTime(reminder.getReminderDateTime())
                .note(reminder.getNote())
                .isCompleted(reminder.getIsCompleted())
                .createdAt(reminder.getCreatedAt())
                .build();
    }

    public SystemSettingsDto toSystemSettingsDto(SystemSettings settings) {
        return SystemSettingsDto.builder()
                .platformTitle(settings.getPlatformTitle())
                .defaultDurationMinutes(settings.getDefaultDurationMinutes())
                .defaultPassingPercentage(settings.getDefaultPassingPercentage())
                .autoApproveQuizzes(settings.getAutoApproveQuizzes())
                .allowParticipantInteractions(settings.getAllowParticipantInteractions())
                .registrationOpen(settings.getRegistrationOpen())
                .maintenanceMode(settings.getMaintenanceMode())
                .systemAnnouncement(settings.getSystemAnnouncement())
                .build();
    }

    public SystemAlertDto toSystemAlertDto(SystemAlert alert) {
        return SystemAlertDto.builder()
                .id(alert.getId())
                .title(alert.getTitle())
                .message(alert.getMessage())
                .type(alert.getAlertType())
                .timestamp(alert.getCreatedAt())
                .isDismissed(alert.getIsDismissed())
                .build();
    }
}
