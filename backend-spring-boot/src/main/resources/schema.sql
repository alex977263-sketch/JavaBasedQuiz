-- ==============================================================
-- Java Online Quiz Platform - MySQL 8.0 Relational Schema
-- ==============================================================

CREATE DATABASE IF NOT EXISTS `quiz_platform_db`
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `quiz_platform_db`;

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS `roles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `description` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `college_or_company` VARCHAR(150),
    `is_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_username (`username`),
    INDEX idx_user_email (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. User Roles Join Table
CREATE TABLE IF NOT EXISTS `user_roles` (
    `user_id` BIGINT NOT NULL,
    `role_id` BIGINT NOT NULL,
    PRIMARY KEY (`user_id`, `role_id`),
    CONSTRAINT fk_ur_user FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Categories Table
CREATE TABLE IF NOT EXISTS `categories` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT,
    `icon_name` VARCHAR(50) DEFAULT 'BookOpen',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Quizzes Table
CREATE TABLE IF NOT EXISTS `quizzes` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `category_id` BIGINT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(200) NOT NULL UNIQUE,
    `description` TEXT,
    `difficulty` ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL DEFAULT 'MEDIUM',
    `duration_minutes` INT NOT NULL DEFAULT 15,
    `passing_percentage` INT NOT NULL DEFAULT 70,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `approval_status` ENUM('APPROVED', 'PENDING', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `rejection_reason` VARCHAR(500),
    `created_by` BIGINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_quiz_category FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT,
    CONSTRAINT fk_quiz_creator FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    INDEX idx_quiz_category (`category_id`),
    INDEX idx_quiz_active (`is_active`),
    INDEX idx_quiz_approval (`approval_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Questions Table
CREATE TABLE IF NOT EXISTS `questions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `quiz_id` BIGINT NOT NULL,
    `question_number` INT NOT NULL,
    `question_text` TEXT NOT NULL,
    `code_snippet` TEXT,
    `code_language` VARCHAR(30) DEFAULT 'java',
    `points` INT NOT NULL DEFAULT 10,
    `difficulty` ENUM('EASY', 'MEDIUM', 'HARD') DEFAULT 'MEDIUM',
    `explanation` TEXT NOT NULL,
    `correct_option_key` CHAR(1) NOT NULL,
    CONSTRAINT fk_question_quiz FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE,
    INDEX idx_question_quiz (`quiz_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Question Options Table
CREATE TABLE IF NOT EXISTS `question_options` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `question_id` BIGINT NOT NULL,
    `option_key` CHAR(1) NOT NULL,
    `option_text` TEXT NOT NULL,
    CONSTRAINT fk_option_question FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
    UNIQUE KEY uq_q_key (`question_id`, `option_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Quiz Attempts Table
CREATE TABLE IF NOT EXISTS `quiz_attempts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `quiz_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `attempt_token` VARCHAR(64) NOT NULL UNIQUE,
    `status` ENUM('IN_PROGRESS', 'SUBMITTED', 'TIMED_OUT') NOT NULL DEFAULT 'IN_PROGRESS',
    `started_at` TIMESTAMP NOT NULL,
    `submitted_at` TIMESTAMP NULL,
    `time_taken_seconds` INT NOT NULL DEFAULT 0,
    `total_questions` INT NOT NULL,
    `correct_answers_count` INT NOT NULL DEFAULT 0,
    `incorrect_answers_count` INT NOT NULL DEFAULT 0,
    `unanswered_count` INT NOT NULL DEFAULT 0,
    `score` INT NOT NULL DEFAULT 0,
    `max_score` INT NOT NULL,
    `percentage` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    `is_passed` BOOLEAN NOT NULL DEFAULT FALSE,
    `creator_feedback_notes` TEXT,
    `creator_grade_tag` ENUM('EXCELLENT', 'GOOD', 'NEEDS_WORK'),
    `graded_by` BIGINT,
    `graded_at` TIMESTAMP NULL,
    CONSTRAINT fk_qa_quiz FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE RESTRICT,
    CONSTRAINT fk_qa_user FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT fk_qa_grader FOREIGN KEY (`graded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    INDEX idx_qa_user (`user_id`),
    INDEX idx_qa_quiz (`quiz_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Submitted Answers Table
CREATE TABLE IF NOT EXISTS `submitted_answers` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `attempt_id` BIGINT NOT NULL,
    `question_id` BIGINT NOT NULL,
    `selected_option_key` CHAR(1) NULL,
    `is_correct` BOOLEAN NOT NULL DEFAULT FALSE,
    `points_awarded` INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_sa_attempt FOREIGN KEY (`attempt_id`) REFERENCES `quiz_attempts` (`id`) ON DELETE CASCADE,
    CONSTRAINT fk_sa_question FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Participant-Creator Interactions Table
CREATE TABLE IF NOT EXISTS `participant_creator_interactions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `participant_id` BIGINT NOT NULL,
    `creator_id` BIGINT,
    `quiz_id` BIGINT NOT NULL,
    `subject` VARCHAR(200) NOT NULL,
    `message` TEXT NOT NULL,
    `reply` TEXT,
    `replied_at` TIMESTAMP NULL,
    `status` ENUM('OPEN', 'RESOLVED') NOT NULL DEFAULT 'OPEN',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pci_participant FOREIGN KEY (`participant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT fk_pci_creator FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    CONSTRAINT fk_pci_quiz FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Quiz Reminders Table
CREATE TABLE IF NOT EXISTS `quiz_reminders` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `participant_id` BIGINT NOT NULL,
    `quiz_id` BIGINT NOT NULL,
    `reminder_date_time` VARCHAR(50) NOT NULL,
    `note` VARCHAR(500),
    `is_completed` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_qr_participant FOREIGN KEY (`participant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT fk_qr_quiz FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. System Settings Table
CREATE TABLE IF NOT EXISTS `system_settings` (
    `id` BIGINT PRIMARY KEY,
    `platform_title` VARCHAR(150) NOT NULL,
    `default_duration_minutes` INT NOT NULL DEFAULT 15,
    `default_passing_percentage` INT NOT NULL DEFAULT 70,
    `auto_approve_quizzes` BOOLEAN NOT NULL DEFAULT FALSE,
    `allow_participant_interactions` BOOLEAN NOT NULL DEFAULT TRUE,
    `registration_open` BOOLEAN NOT NULL DEFAULT TRUE,
    `maintenance_mode` BOOLEAN NOT NULL DEFAULT FALSE,
    `system_announcement` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. System Alerts Table
CREATE TABLE IF NOT EXISTS `system_alerts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `message` TEXT NOT NULL,
    `alert_type` ENUM('INFO', 'WARNING', 'CRITICAL') NOT NULL DEFAULT 'INFO',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `is_dismissed` BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Audit Logs Table
CREATE TABLE IF NOT EXISTS `audit_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `actor_email` VARCHAR(100) NOT NULL,
    `actor_role` VARCHAR(30) NOT NULL,
    `action` VARCHAR(80) NOT NULL,
    `target_entity` VARCHAR(80),
    `target_id` BIGINT,
    `details` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_actor (`actor_email`),
    INDEX idx_audit_action (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
