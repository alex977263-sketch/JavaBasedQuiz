-- ==============================================================
-- Java Online Quiz Platform - MySQL Relational Schema
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
    `created_by` BIGINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_quiz_category FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT,
    CONSTRAINT fk_quiz_creator FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    INDEX idx_quiz_category (`category_id`),
    INDEX idx_quiz_active (`is_active`)
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
    `started_at` TIMESTAMP NOT NULL,
    `submitted_at` TIMESTAMP NOT NULL,
    `time_taken_seconds` INT NOT NULL,
    `total_questions` INT NOT NULL,
    `correct_answers_count` INT NOT NULL,
    `incorrect_answers_count` INT NOT NULL,
    `unanswered_count` INT NOT NULL,
    `score` INT NOT NULL,
    `max_score` INT NOT NULL,
    `percentage` DECIMAL(5,2) NOT NULL,
    `is_passed` BOOLEAN NOT NULL,
    CONSTRAINT fk_qa_quiz FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE RESTRICT,
    CONSTRAINT fk_qa_user FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
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
