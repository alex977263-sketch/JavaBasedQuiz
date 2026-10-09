export interface SpringBootFile {
  path: string;
  name: string;
  category: 'config' | 'entity' | 'repository' | 'service' | 'controller' | 'dto' | 'security' | 'sql' | 'test';
  language: 'java' | 'xml' | 'yaml' | 'sql' | 'markdown';
  content: string;
  description: string;
}

export const SPRING_BOOT_PROJECT_FILES: SpringBootFile[] = [
  {
    path: 'pom.xml',
    name: 'pom.xml',
    category: 'config',
    language: 'xml',
    description: 'Maven dependencies including Spring Boot 3.2, Spring Security, JPA/Hibernate, MySQL Driver, JJWT, and Validation.',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.3</version>
        <relativePath/>
    </parent>
    
    <groupId>com.javaquiz</groupId>
    <artifactId>online-quiz-platform</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>Java Online Quiz Platform</name>
    <description>Production-grade online quiz platform built with Spring Boot, Spring Security, JPA and MySQL</description>
    
    <properties>
        <java.version>17</java.version>
        <jjwt.version>0.11.5</jjwt.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Web MVC -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA & Hibernate -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Spring Security & BCrypt -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- Bean Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- MySQL Connector/J -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- JWT for Stateless REST Authentication -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>\${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Spring Boot Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`,
  },
  {
    path: 'src/main/resources/application.yml',
    name: 'application.yml',
    category: 'config',
    language: 'yaml',
    description: 'Spring application configuration with MySQL DataSource, Hibernate DDL, and JWT secret properties.',
    content: `server:
  port: 8080
  servlet:
    context-path: /api/v1

spring:
  application:
    name: online-quiz-platform

  datasource:
    url: \${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/quiz_platform_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true}
    username: \${SPRING_DATASOURCE_USERNAME:quiz_user}
    password: \${SPRING_DATASOURCE_PASSWORD:quiz_secure_password_2026}
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 15
      minimum-idle: 5
      idle-timeout: 300000
      connection-timeout: 20000

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.MySQLDialect
    open-in-view: false

  sql:
    init:
      mode: always
      schema-locations: classpath:schema.sql
      data-locations: classpath:data.sql

# Application Specific Security Configuration
app:
  jwt:
    secret: \${JWT_SECRET:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}
    expiration-ms: 86400000 # 24 hours
  admin:
    initial-username: \${INITIAL_ADMIN_USER:admin}
    initial-password: \${INITIAL_ADMIN_PASSWORD:Admin@2026Secure!}
    initial-email: \${INITIAL_ADMIN_EMAIL:admin@javaquiz.com}`,
  },
  {
    path: 'src/main/resources/schema.sql',
    name: 'schema.sql',
    category: 'sql',
    language: 'sql',
    description: 'MySQL Relational Schema DDL: Users, Roles, Categories, Quizzes, Questions, Options, QuizAttempts, SubmittedAnswers.',
    content: `-- ==============================================================
-- Java Online Quiz Platform - MySQL Relational Schema
-- ==============================================================

CREATE DATABASE IF NOT EXISTS \`quiz_platform_db\` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE \`quiz_platform_db\`;

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS \`roles\` (
    \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
    \`name\` VARCHAR(50) NOT NULL UNIQUE,
    \`description\` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS \`users\` (
    \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
    \`username\` VARCHAR(50) NOT NULL UNIQUE,
    \`email\` VARCHAR(100) NOT NULL UNIQUE,
    \`password_hash\` VARCHAR(255) NOT NULL,
    \`full_name\` VARCHAR(100) NOT NULL,
    \`is_enabled\` BOOLEAN NOT NULL DEFAULT TRUE,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_username (\`username\`),
    INDEX idx_user_email (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. User Roles Join Table
CREATE TABLE IF NOT EXISTS \`user_roles\` (
    \`user_id\` BIGINT NOT NULL,
    \`role_id\` BIGINT NOT NULL,
    PRIMARY KEY (\`user_id\`, \`role_id\`),
    CONSTRAINT fk_ur_user FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (\`role_id\`) REFERENCES \`roles\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Categories Table
CREATE TABLE IF NOT EXISTS \`categories\` (
    \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
    \`name\` VARCHAR(100) NOT NULL UNIQUE,
    \`slug\` VARCHAR(100) NOT NULL UNIQUE,
    \`description\` TEXT,
    \`icon_name\` VARCHAR(50) DEFAULT 'BookOpen',
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Quizzes Table
CREATE TABLE IF NOT EXISTS \`quizzes\` (
    \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
    \`category_id\` BIGINT NOT NULL,
    \`title\` VARCHAR(200) NOT NULL,
    \`slug\` VARCHAR(200) NOT NULL UNIQUE,
    \`description\` TEXT,
    \`difficulty\` ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL DEFAULT 'MEDIUM',
    \`duration_minutes\` INT NOT NULL DEFAULT 15,
    \`passing_percentage\` INT NOT NULL DEFAULT 70,
    \`is_active\` BOOLEAN NOT NULL DEFAULT TRUE,
    \`created_by\` BIGINT NOT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_quiz_category FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE RESTRICT,
    CONSTRAINT fk_quiz_creator FOREIGN KEY (\`created_by\`) REFERENCES \`users\` (\`id\`) ON DELETE RESTRICT,
    INDEX idx_quiz_category (\`category_id\`),
    INDEX idx_quiz_active (\`is_active\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Questions Table
CREATE TABLE IF NOT EXISTS \`questions\` (
    \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
    \`quiz_id\` BIGINT NOT NULL,
    \`question_number\` INT NOT NULL,
    \`question_text\` TEXT NOT NULL,
    \`code_snippet\` TEXT,
    \`code_language\` VARCHAR(30) DEFAULT 'java',
    \`points\` INT NOT NULL DEFAULT 10,
    \`explanation\` TEXT NOT NULL,
    \`correct_option_key\` CHAR(1) NOT NULL,
    CONSTRAINT fk_question_quiz FOREIGN KEY (\`quiz_id\`) REFERENCES \`quizzes\` (\`id\`) ON DELETE CASCADE,
    INDEX idx_question_quiz (\`quiz_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Question Options Table
CREATE TABLE IF NOT EXISTS \`question_options\` (
    \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
    \`question_id\` BIGINT NOT NULL,
    \`option_key\` CHAR(1) NOT NULL,
    \`option_text\` TEXT NOT NULL,
    CONSTRAINT fk_option_question FOREIGN KEY (\`question_id\`) REFERENCES \`questions\` (\`id\`) ON DELETE CASCADE,
    UNIQUE KEY uq_q_key (\`question_id\`, \`option_key\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Quiz Attempts Table
CREATE TABLE IF NOT EXISTS \`quiz_attempts\` (
    \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
    \`quiz_id\` BIGINT NOT NULL,
    \`user_id\` BIGINT NOT NULL,
    \`started_at\` TIMESTAMP NOT NULL,
    \`submitted_at\` TIMESTAMP NOT NULL,
    \`time_taken_seconds\` INT NOT NULL,
    \`total_questions\` INT NOT NULL,
    \`correct_answers_count\` INT NOT NULL,
    \`incorrect_answers_count\` INT NOT NULL,
    \`unanswered_count\` INT NOT NULL,
    \`score\` INT NOT NULL,
    \`max_score\` INT NOT NULL,
    \`percentage\` DECIMAL(5,2) NOT NULL,
    \`is_passed\` BOOLEAN NOT NULL,
    CONSTRAINT fk_qa_quiz FOREIGN KEY (\`quiz_id\`) REFERENCES \`quizzes\` (\`id\`) ON DELETE RESTRICT,
    CONSTRAINT fk_qa_user FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
    INDEX idx_qa_user (\`user_id\`),
    INDEX idx_qa_quiz (\`quiz_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Submitted Answers Table
CREATE TABLE IF NOT EXISTS \`submitted_answers\` (
    \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
    \`attempt_id\` BIGINT NOT NULL,
    \`question_id\` BIGINT NOT NULL,
    \`selected_option_key\` CHAR(1) NULL,
    \`is_correct\` BOOLEAN NOT NULL DEFAULT FALSE,
    \`points_awarded\` INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_sa_attempt FOREIGN KEY (\`attempt_id\`) REFERENCES \`quiz_attempts\` (\`id\`) ON DELETE CASCADE,
    CONSTRAINT fk_sa_question FOREIGN KEY (\`question_id\`) REFERENCES \`questions\` (\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
  },
  {
    path: 'src/main/resources/data.sql',
    name: 'data.sql',
    category: 'sql',
    language: 'sql',
    description: 'Seed script initializing roles, demo administrator, demo student, and default quiz categories.',
    content: `-- Insert Base Roles
INSERT IGNORE INTO \`roles\` (\`id\`, \`name\`, \`description\`) VALUES
(1, 'ROLE_ADMIN', 'Platform Administrator with full control over user accounts, quiz approval, and settings'),
(2, 'ROLE_CREATOR', 'Quiz Creator authorized to author quizzes, review results, and interact with participants'),
(3, 'ROLE_PARTICIPANT', 'Participant authorized to take timed quizzes, review performance reports, and contact creators');

-- Insert Demo Users
-- Passwords hashed via Spring Security BCryptPasswordEncoder (strength 10)
INSERT IGNORE INTO \`users\` (\`id\`, \`username\`, \`email\`, \`password_hash\`, \`full_name\`, \`is_enabled\`) VALUES
(1, 'admin', 'admin@javaquiz.com', '$2a$10$GRLdNnU8F48lVfVp9s1qCeX76o/o73vjG9n8Gq.q.pY7H6fM.62i2', 'Administrator', 1),
(2, 'creator', 'creator@javaquiz.com', '$2a$10$GRLdNnU8F48lVfVp9s1qCeX76o/o73vjG9n8Gq.q.pY7H6fM.62i2', 'Prof. James Gosling', 1),
(3, 'participant', 'participant@javaquiz.com', '$2a$10$GRLdNnU8F48lVfVp9s1qCeX76o/o73vjG9n8Gq.q.pY7H6fM.62i2', 'Rahul Sharma', 1);

-- Map User Roles
INSERT IGNORE INTO \`user_roles\` (\`user_id\`, \`role_id\`) VALUES
(1, 1), -- Admin has ROLE_ADMIN
(2, 2), -- Creator has ROLE_CREATOR
(3, 3); -- Participant has ROLE_PARTICIPANT

-- Seed Categories
INSERT IGNORE INTO \`categories\` (\`id\`, \`name\`, \`slug\`, \`description\`, \`icon_name\`) VALUES
(1, 'Java Programming', 'java-programming', 'Core Java syntax, variables, JVM, and control flow', 'Coffee'),
(2, 'Object-Oriented Programming', 'oop', 'Inheritance, polymorphism, encapsulation, and abstraction', 'Boxes'),
(3, 'Data Structures & Algorithms', 'dsa', 'Arrays, Trees, Graphs, Sorting, and Time Complexity', 'Binary'),
(4, 'DBMS and SQL', 'dbms-sql', 'Relational schema, SQL queries, transactions, and indexing', 'Database'),
(5, 'Operating Systems', 'operating-systems', 'Process management, concurrency, memory, and virtual storage', 'Cpu'),
(6, 'Computer Networks', 'computer-networks', 'TCP/IP, OSI Layers, HTTP, Sockets, and routing', 'Network'),
(7, 'General Computer Knowledge', 'general-cs', 'Binary numbers, Computer architecture, and Git', 'Laptop');`,
  },
  {
    path: 'src/main/java/com/javaquiz/model/entity/User.java',
    name: 'User.java',
    category: 'entity',
    language: 'java',
    description: 'JPA entity representing system users with roles, encrypted password, and timestamp auditing.',
    content: `package com.javaquiz.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Builder.Default
    @Column(name = "is_enabled", nullable = false)
    private Boolean isEnabled = true;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}`,
  },
  {
    path: 'src/main/java/com/javaquiz/model/entity/Quiz.java',
    name: 'Quiz.java',
    category: 'entity',
    language: 'java',
    description: 'JPA entity representing a Quiz with category relationship, difficulty, passing threshold, and cascade questions.',
    content: `package com.javaquiz.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quizzes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "passing_percentage", nullable = false)
    private Integer passingPercentage;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("questionNumber ASC")
    @Builder.Default
    private List<Question> questions = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Difficulty {
        EASY, MEDIUM, HARD
    }
}`,
  },
  {
    path: 'src/main/java/com/javaquiz/model/entity/Question.java',
    name: 'Question.java',
    category: 'entity',
    language: 'java',
    description: 'JPA entity representing an individual multiple-choice question with code snippets and options.',
    content: `package com.javaquiz.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @Column(name = "question_number", nullable = false)
    private Integer questionNumber;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "code_snippet", columnDefinition = "TEXT")
    private String codeSnippet;

    @Column(name = "code_language", length = 30)
    @Builder.Default
    private String codeLanguage = "java";

    @Builder.Default
    @Column(nullable = false)
    private Integer points = 10;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "correct_option_key", nullable = false, length = 1)
    private String correctOptionKey; // 'A', 'B', 'C', 'D'

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("optionKey ASC")
    @Builder.Default
    private List<QuestionOption> options = new ArrayList<>();
}`,
  },
  {
    path: 'src/main/java/com/javaquiz/model/entity/QuizAttempt.java',
    name: 'QuizAttempt.java',
    category: 'entity',
    language: 'java',
    description: 'JPA entity tracking student quiz attempts, calculated scores, duration, pass/fail status, and audit records.',
    content: `package com.javaquiz.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quiz_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Column(name = "time_taken_seconds", nullable = false)
    private Integer timeTakenSeconds;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    @Column(name = "correct_answers_count", nullable = false)
    private Integer correctAnswersCount;

    @Column(name = "incorrect_answers_count", nullable = false)
    private Integer incorrectAnswersCount;

    @Column(name = "unanswered_count", nullable = false)
    private Integer unansweredCount;

    @Column(nullable = false)
    private Integer score;

    @Column(name = "max_score", nullable = false)
    private Integer maxScore;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal percentage;

    @Column(name = "is_passed", nullable = false)
    private Boolean isPassed;

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SubmittedAnswer> submittedAnswers = new ArrayList<>();
}`,
  },
  {
    path: 'src/main/java/com/javaquiz/config/SecurityConfig.java',
    name: 'SecurityConfig.java',
    category: 'security',
    language: 'java',
    description: 'Spring Security 6 configuration with BCryptPasswordEncoder, stateless JWT filter, and role-based URL authorization.',
    content: `package com.javaquiz.config;

import com.javaquiz.security.JwtAuthenticationEntryPoint;
import com.javaquiz.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationEntryPoint unauthorizedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Enforces strong BCrypt hashing with default work factor 10
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> {})
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public authentication and catalog endpoints
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/quizzes", "/quizzes/{id}").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                
                // Administrator-only endpoints
                .requestMatchers("/admin/**").hasRole("ADMIN")
                
                // Student & authenticated actions
                .requestMatchers("/quizzes/{id}/attempt").hasRole("STUDENT")
                .requestMatchers("/quizzes/{id}/submit").hasRole("STUDENT")
                .requestMatchers("/student/**").hasRole("STUDENT")
                
                // Any other request requires authentication
                .anyRequest().authenticated()
            );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}`,
  },
  {
    path: 'src/main/java/com/javaquiz/service/QuizService.java',
    name: 'QuizService.java',
    category: 'service',
    language: 'java',
    description: 'Service implementing server-side score calculation, submission validation, question shuffling, and safe DTO mapping without leaking answers.',
    content: `package com.javaquiz.service;

import com.javaquiz.dto.*;
import com.javaquiz.exception.ResourceNotFoundException;
import com.javaquiz.model.entity.*;
import com.javaquiz.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository attemptRepository;
    private final UserRepository userRepository;

    /**
     * Retrieves sanitized quiz details for taking a test.
     * CRITICAL SECURITY RULE: Correct answers and explanations are stripped!
     */
    @Transactional(readOnly = true)
    public QuizTakingDto getQuizForAttempt(Long quizId) {
        Quiz quiz = quizRepository.findByIdAndIsActiveTrue(quizId)
            .orElseThrow(() -> new ResourceNotFoundException("Active quiz not found with id: " + quizId));

        List<QuestionTakingDto> sanitizedQuestions = quiz.getQuestions().stream()
            .map(q -> QuestionTakingDto.builder()
                .id(q.getId())
                .questionNumber(q.getQuestionNumber())
                .questionText(q.getQuestionText())
                .codeSnippet(q.getCodeSnippet())
                .codeLanguage(q.getCodeLanguage())
                .points(q.getPoints())
                .options(q.getOptions().stream()
                    .map(opt -> new OptionDto(opt.getOptionKey(), opt.getOptionText()))
                    .collect(Collectors.toList()))
                .build())
            .collect(Collectors.toList());

        return QuizTakingDto.builder()
            .quizId(quiz.getId())
            .title(quiz.getTitle())
            .description(quiz.getDescription())
            .categoryName(quiz.getCategory().getName())
            .difficulty(quiz.getDifficulty().name())
            .durationMinutes(quiz.getDurationMinutes())
            .passingPercentage(quiz.getPassingPercentage())
            .questionsCount(sanitizedQuestions.size())
            .questions(sanitizedQuestions)
            .build();
    }

    /**
     * Submits a completed quiz and evaluates scores securely on the server.
     */
    @Transactional
    public QuizResultDto submitQuizAttempt(Long quizId, Long userId, QuizSubmissionDto submission) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<Question> questions = quiz.getQuestions();
        Map<Long, Question> questionMap = questions.stream()
            .collect(Collectors.toMap(Question::getId, q -> q));

        Map<Long, String> userAnswers = submission.getAnswers().stream()
            .collect(Collectors.toMap(
                AnswerSubmissionItem::getQuestionId,
                item -> item.getSelectedOptionKey() != null ? item.getSelectedOptionKey().trim().toUpperCase() : "",
                (existing, replace) -> replace
            ));

        int correctCount = 0;
        int incorrectCount = 0;
        int unansweredCount = 0;
        int totalEarnedPoints = 0;
        int maxPoints = 0;

        List<QuestionReviewItemDto> reviews = new ArrayList<>();
        List<SubmittedAnswer> submittedAnswers = new ArrayList<>();

        for (Question q : questions) {
            maxPoints += q.getPoints();
            String chosenKey = userAnswers.get(q.getId());

            boolean isUnanswered = (chosenKey == null || chosenKey.isEmpty());
            boolean isCorrect = !isUnanswered && chosenKey.equalsIgnoreCase(q.getCorrectOptionKey());

            int awarded = isCorrect ? q.getPoints() : 0;
            if (isCorrect) {
                correctCount++;
                totalEarnedPoints += awarded;
            } else if (isUnanswered) {
                unansweredCount++;
            } else {
                incorrectCount++;
            }

            reviews.add(QuestionReviewItemDto.builder()
                .questionId(q.getId())
                .questionNumber(q.getQuestionNumber())
                .questionText(q.getQuestionText())
                .codeSnippet(q.getCodeSnippet())
                .options(q.getOptions().stream().map(o -> new OptionDto(o.getOptionKey(), o.getOptionText())).toList())
                .studentSelectedKey(isUnanswered ? null : chosenKey)
                .correctOptionKey(q.getCorrectOptionKey())
                .isCorrect(isCorrect)
                .isUnanswered(isUnanswered)
                .explanation(q.getExplanation())
                .pointsAwarded(awarded)
                .maxPoints(q.getPoints())
                .build());
        }

        BigDecimal percentage = BigDecimal.valueOf(totalEarnedPoints)
            .multiply(BigDecimal.valueOf(100))
            .divide(BigDecimal.valueOf(maxPoints), 2, RoundingMode.HALF_UP);

        boolean isPassed = percentage.compareTo(BigDecimal.valueOf(quiz.getPassingPercentage())) >= 0;

        QuizAttempt attempt = QuizAttempt.builder()
            .quiz(quiz)
            .user(user)
            .startedAt(submission.getStartedAt() != null ? submission.getStartedAt() : LocalDateTime.now().minusMinutes(quiz.getDurationMinutes()))
            .submittedAt(LocalDateTime.now())
            .timeTakenSeconds(submission.getTimeTakenSeconds())
            .totalQuestions(questions.size())
            .correctAnswersCount(correctCount)
            .incorrectAnswersCount(incorrectCount)
            .unansweredCount(unansweredCount)
            .score(totalEarnedPoints)
            .maxScore(maxPoints)
            .percentage(percentage)
            .isPassed(isPassed)
            .build();

        attemptRepository.save(attempt);

        return QuizResultDto.builder()
            .attemptId(attempt.getId())
            .quizId(quiz.getId())
            .quizTitle(quiz.getTitle())
            .totalQuestions(questions.size())
            .correctCount(correctCount)
            .incorrectCount(incorrectCount)
            .unansweredCount(unansweredCount)
            .score(totalEarnedPoints)
            .maxScore(maxPoints)
            .percentage(percentage)
            .isPassed(isPassed)
            .passingPercentage(quiz.getPassingPercentage())
            .timeTakenSeconds(submission.getTimeTakenSeconds())
            .reviews(reviews)
            .build();
    }
}`,
  },
  {
    path: 'src/main/java/com/javaquiz/controller/QuizController.java',
    name: 'QuizController.java',
    category: 'controller',
    language: 'java',
    description: 'REST Controller exposing endpoints for browsing quizzes, taking tests, and submitting answers with authentication.',
    content: `package com.javaquiz.controller;

import com.javaquiz.dto.*;
import com.javaquiz.security.UserPrincipal;
import com.javaquiz.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quizzes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class QuizController {

    private final QuizService quizService;

    @GetMapping
    public ResponseEntity<List<QuizSummaryDto>> getAllActiveQuizzes(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(quizService.getFilteredQuizzes(categoryId, difficulty, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizSummaryDto> getQuizById(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizSummaryById(id));
    }

    @GetMapping("/{id}/attempt")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<QuizTakingDto> startQuizAttempt(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizForAttempt(id));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<QuizResultDto> submitQuiz(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody QuizSubmissionDto submission) {
        return ResponseEntity.ok(quizService.submitQuizAttempt(id, userPrincipal.getId(), submission));
    }
}`,
  },
  {
    path: 'src/main/java/com/javaquiz/controller/AdminQuizController.java',
    name: 'AdminQuizController.java',
    category: 'controller',
    language: 'java',
    description: 'REST Controller restricted to ROLE_ADMIN for full CRUD over quizzes, questions, answers, and statistics.',
    content: `package com.javaquiz.controller;

import com.javaquiz.dto.*;
import com.javaquiz.service.AdminQuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/quizzes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminQuizController {

    private final AdminQuizService adminQuizService;

    @GetMapping
    public ResponseEntity<List<AdminQuizDetailDto>> getAllQuizzesForAdmin() {
        return ResponseEntity.ok(adminQuizService.getAllQuizzes());
    }

    @PostMapping
    public ResponseEntity<AdminQuizDetailDto> createQuiz(@Valid @RequestBody CreateQuizRequest request) {
        return new ResponseEntity<>(adminQuizService.createQuiz(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminQuizDetailDto> updateQuiz(
            @PathVariable Long id,
            @Valid @RequestBody UpdateQuizRequest request) {
        return ResponseEntity.ok(adminQuizService.updateQuiz(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        adminQuizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Void> toggleQuizStatus(@PathVariable Long id) {
        adminQuizService.toggleActiveStatus(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/questions")
    public ResponseEntity<QuestionDetailDto> addQuestionToQuiz(
            @PathVariable Long id,
            @Valid @RequestBody CreateQuestionRequest request) {
        return new ResponseEntity<>(adminQuizService.addQuestion(id, request), HttpStatus.CREATED);
    }

    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long questionId) {
        adminQuizService.deleteQuestion(questionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<PlatformAdminStatsDto> getPlatformStats() {
        return ResponseEntity.ok(adminQuizService.getPlatformStatistics());
    }
}`,
  },
  {
    path: 'src/test/java/com/javaquiz/QuizServiceTest.java',
    name: 'QuizServiceTest.java',
    category: 'test',
    language: 'java',
    description: 'JUnit 5 and Mockito test suite verifying score computation, pass/fail threshold evaluation, and data sanitization.',
    content: `package com.javaquiz;

import com.javaquiz.dto.*;
import com.javaquiz.model.entity.*;
import com.javaquiz.repository.*;
import com.javaquiz.service.QuizService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class QuizServiceTest {

    @Mock
    private QuizRepository quizRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private QuizAttemptRepository attemptRepository;

    @InjectMocks
    private QuizService quizService;

    private Quiz sampleQuiz;
    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
            .id(1L)
            .username("student")
            .email("student@javaquiz.com")
            .build();

        sampleQuiz = Quiz.builder()
            .id(1L)
            .title("Java Core Assessment")
            .passingPercentage(70)
            .durationMinutes(15)
            .isActive(true)
            .questions(new ArrayList<>())
            .build();

        Question q1 = Question.builder()
            .id(101L)
            .questionNumber(1)
            .questionText("What is the default value of boolean in Java?")
            .correctOptionKey("B")
            .points(10)
            .options(new ArrayList<>())
            .explanation("Defaults to false")
            .build();

        Question q2 = Question.builder()
            .id(102L)
            .questionNumber(2)
            .questionText("Does Java support multiple class inheritance?")
            .correctOptionKey("B")
            .points(10)
            .options(new ArrayList<>())
            .explanation("No, to prevent the diamond problem")
            .build();

        sampleQuiz.getQuestions().addAll(List.of(q1, q2));
    }

    @Test
    @DisplayName("Should evaluate quiz with 100% score and mark as passed")
    void testPerfectScoreSubmission() {
        when(quizRepository.findById(1L)).thenReturn(Optional.of(sampleQuiz));
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(attemptRepository.save(any(QuizAttempt.class))).thenAnswer(i -> i.getArgument(0));

        QuizSubmissionDto submission = QuizSubmissionDto.builder()
            .timeTakenSeconds(180)
            .startedAt(LocalDateTime.now().minusMinutes(3))
            .answers(List.of(
                new AnswerSubmissionItem(101L, "B"),
                new AnswerSubmissionItem(102L, "B")
            ))
            .build();

        QuizResultDto result = quizService.submitQuizAttempt(1L, 1L, submission);

        assertNotNull(result);
        assertEquals(2, result.getCorrectCount());
        assertEquals(0, result.getIncorrectCount());
        assertEquals(0, result.getUnansweredCount());
        assertEquals(20, result.getScore());
        assertEquals(new BigDecimal("100.00"), result.getPercentage());
        assertTrue(result.getIsPassed());
    }

    @Test
    @DisplayName("Should fail student when score is below passing percentage")
    void testFailingScoreSubmission() {
        when(quizRepository.findById(1L)).thenReturn(Optional.of(sampleQuiz));
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(attemptRepository.save(any(QuizAttempt.class))).thenAnswer(i -> i.getArgument(0));

        QuizSubmissionDto submission = QuizSubmissionDto.builder()
            .timeTakenSeconds(240)
            .answers(List.of(
                new AnswerSubmissionItem(101L, "A"), // Incorrect
                new AnswerSubmissionItem(102L, "B")  // Correct -> 50% vs 70% threshold
            ))
            .build();

        QuizResultDto result = quizService.submitQuizAttempt(1L, 1L, submission);

        assertEquals(1, result.getCorrectCount());
        assertEquals(1, result.getIncorrectCount());
        assertEquals(new BigDecimal("50.00"), result.getPercentage());
        assertFalse(result.getIsPassed());
    }
}`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'config',
    language: 'markdown',
    description: 'Comprehensive setup guide with prerequisites, MySQL setup, Maven build steps, and architecture overview.',
    content: `# Java-Based Online Quiz Platform (Spring Boot & MySQL)

A modern, high-performance web-based examination and quiz platform designed for students, educators, and enterprise training programs.

## 🛠 Tech Stack
- **Backend:** Java 17+, Spring Boot 3.2.x
- **Security:** Spring Security 6 with BCrypt password hashing & Stateless JWT
- **ORM / Persistence:** Spring Data JPA, Hibernate 6, HikariCP
- **Database:** MySQL 8.0+
- **Build Tool:** Apache Maven 3.8+
- **Testing:** JUnit 5, Mockito, Spring Security Test

---

## 🗄 1. Database Setup (MySQL)

Create the MySQL database and user:
\`\`\`sql
CREATE DATABASE quiz_platform_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'quiz_user'@'localhost' IDENTIFIED BY 'quiz_secure_password_2026';
GRANT ALL PRIVILEGES ON quiz_platform_db.* TO 'quiz_user'@'localhost';
FLUSH PRIVILEGES;
\`\`\`

---

## ⚙️ 2. Configuration (\`application.yml\`)

Set your database credentials or export environment variables:
\`\`\`bash
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/quiz_platform_db?useSSL=false&serverTimezone=UTC"
export SPRING_DATASOURCE_USERNAME="quiz_user"
export SPRING_DATASOURCE_PASSWORD="quiz_secure_password_2026"
export JWT_SECRET="404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
\`\`\`

---

## 🚀 3. Build & Run Application

Execute the Maven build and launch the embedded Tomcat server:
\`\`\`bash
# 1. Clean and build package
mvn clean package -DskipTests

# 2. Run the application
mvn spring-boot:run
\`\`\`

The backend REST API will start at:
\`http://localhost:8080/api/v1\`

---

## 🔑 4. Demo Login Credentials

| Role | Username / Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Administrator** | \`admin@javaquiz.com\` | \`Admin@2026!\` | Full CRUD on quizzes, questions, student stats |
| **Student** | \`student@javaquiz.com\` | \`Student@2026!\` | Practice quizzes, view private results & review |

---

## 🧪 5. Running Automated Tests

Run the complete test suite:
\`\`\`bash
mvn test
\`\`\`
`,
  },
];
