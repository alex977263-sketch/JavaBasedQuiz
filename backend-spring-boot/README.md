# Java-Based Online Quiz Platform (Spring Boot, JPA & MySQL)

Production-grade online quiz platform engineered with Java 17, Spring Boot 3.2, Spring Security 6, Spring Data JPA, and MySQL.

---

## 🏗 Architecture & Design Patterns
- **Presentation Layer:** RESTful APIs with Spring Web MVC
- **Service Layer:** Business rules, server-side scoring verification, transactions (`@Transactional`)
- **Data Access Layer:** Spring Data JPA Repositories with Hibernate 6 ORM
- **Security:** Spring Security 6 with `BCryptPasswordEncoder` and stateless JSON Web Tokens (JJWT)
- **Database:** MySQL 8.0 InnoDB engine with normalized tables, foreign keys, and indexes

---

## 🗄 1. MySQL Database Setup

1. Open your MySQL client or terminal:
```bash
mysql -u root -p
```

2. Execute database & user provisioning:
```sql
CREATE DATABASE IF NOT EXISTS `quiz_platform_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'quiz_user'@'localhost' IDENTIFIED BY 'quiz_secure_password_2026';
GRANT ALL PRIVILEGES ON `quiz_platform_db`.* TO 'quiz_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## ⚙️ 2. Configuration (`src/main/resources/application.yml`)

Set the environment variables or update `application.yml`:
```bash
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/quiz_platform_db?useSSL=false&serverTimezone=UTC"
export SPRING_DATASOURCE_USERNAME="quiz_user"
export SPRING_DATASOURCE_PASSWORD="quiz_secure_password_2026"
export JWT_SECRET="404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
```

---

## 🚀 3. Commands to Build & Run Application

Using Maven:
```bash
# Clean and compile
mvn clean compile

# Execute test suite
mvn test

# Package to JAR
mvn clean package -DskipTests

# Run Spring Boot application
mvn spring-boot:run
```

The application will start on port `8080` with context path `/api/v1`.

---

## 🔑 4. Demo Login Credentials

| Role | Username / Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@javaquiz.com` | `Admin@2026!` | Manage quizzes, author questions, view reports |
| **Student** | `student@javaquiz.com` | `Student@2026!` | Take exams, view private results & review |

---

## 🛡 5. Security & Authorization Matrix

| Endpoint | Method | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/**` | POST | Public | Register, Login |
| `/api/v1/quizzes` | GET | Public / Student | Browse available tests |
| `/api/v1/quizzes/{id}/attempt` | GET | `ROLE_STUDENT` | Sanitized questions (no answers exposed) |
| `/api/v1/quizzes/{id}/submit` | POST | `ROLE_STUDENT` | Submit answers & server calculates score |
| `/api/v1/student/history` | GET | `ROLE_STUDENT` | Student's own attempt history |
| `/api/v1/admin/**` | ALL | `ROLE_ADMIN` | CRUD quizzes, questions, student stats |
