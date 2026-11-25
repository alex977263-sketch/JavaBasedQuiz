# Java-Based Online Quiz Platform (Spring Boot, JPA, Security & MySQL)

Production-grade **Java 17** online quiz platform engineered with **Spring Boot 3.2**, **Spring Security 6 (JWT + BCrypt)**, **Spring Data JPA / Hibernate**, **MySQL 8.0**, **JUnit 5 + MockMvc**, plus a **Core Java CLI Runner** and **Java Swing Desktop Client**.

---

## Architecture & Java Packages (`com.javaquiz`)

| Package | Responsibility |
| :--- | :--- |
| `com.javaquiz.entity` | 14 JPA entities & enums (`User`, `Role`, `Category`, `Quiz`, `Question`, `QuestionOption`, `QuizAttempt`, `SubmittedAnswer`, `ParticipantCreatorInteraction`, `QuizReminder`, `SystemSettings`, `SystemAlert`, `AuditLog`) |
| `com.javaquiz.repository` | 12 Spring Data JPA repositories with JPQL search & role queries |
| `com.javaquiz.service` | Business logic: `AuthService`, `AdminService`, `QuizCreatorService`, `QuizAttemptService`, `ParticipantPortalService`, `QuizCatalogService`, `QuizAnalyticsService`, `ReportExportService`, `AuditLogService`, `QuestionBankService` |
| `com.javaquiz.controller` | 6 REST controllers (`AuthController`, `QuizCatalogController`, `QuizAttemptController`, `ParticipantController`, `CreatorController`, `AdminController`) |
| `com.javaquiz.security` | Spring Security 6 `SecurityFilterChain`, `JwtTokenProvider`, `JwtAuthenticationFilter`, `CustomUserDetailsService`, `UserPrincipal` |
| `com.javaquiz.exception` | `@RestControllerAdvice` global exception handler & custom domain exceptions |
| `com.javaquiz.config` | `DataInitializer` seeding 3 roles, users, 7 CS categories, 7 quizzes, settings & alerts |
| `com.javaquiz.cli` | `ConsoleQuizRunner` — Core Java timed CLI runner using `ScheduledExecutorService` |
| `com.javaquiz.desktop` | `JavaQuizDesktopApp` — Java Swing GUI client powered by `java.net.http.HttpClient` |

---

## 1. MySQL Database Setup

```sql
CREATE DATABASE IF NOT EXISTS `quiz_platform_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'quiz_user'@'localhost' IDENTIFIED BY 'quiz_secure_password_2026';
GRANT ALL PRIVILEGES ON `quiz_platform_db`.* TO 'quiz_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 2. Build, Test & Run Commands (Maven)

```bash
cd backend-spring-boot

# Run full JUnit 5 & MockMvc test suite (uses H2 in-memory MySQL mode)
mvn clean verify

# Run Spring Boot REST API on port 8080 (/api/v1)
mvn spring-boot:run
```

---

## 3. Demo Credentials (3 Official User Roles)

| Role | Email | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** (`ROLE_ADMIN`) | `admin@javaquiz.com` | `Admin@2026!` | User management, quiz approval/rejection, system settings, alerts, analytics, audit logs |
| **Quiz Creator** (`ROLE_CREATOR`) | `creator@javaquiz.com` | `Creator@2026!` | Create/edit quizzes, author questions, grade attempts, reply to participant doubts |
| **Participant** (`ROLE_PARTICIPANT`) | `participant@javaquiz.com` | `Participant@2026!` | Take timed quizzes, view score reports & explanations, set reminders, contact creators |
