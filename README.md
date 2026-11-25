# Java-Based Online Quiz Platform

A full-stack **Java 17** educational quiz platform built with **Spring Boot 3.2**, **Spring Security 6 (JWT + BCrypt)**, **JDBC (`Connection`, `PreparedStatement`, `ResultSet`, `DriverManager`)**, **Spring Data JPA / Hibernate**, **Jakarta `HttpServlet`**, **Java Swing Desktop Client**, **Core Java CLI Runner**, and **MySQL 8.0**, paired with a responsive web interface.

---

## Key Features & Official User Roles

| Role | Demo Credentials | Core Capabilities |
| :--- | :--- | :--- |
| **Administrator** (`ROLE_ADMIN`) | `admin@javaquiz.com` / `Admin@2026!` | User account management & role control, approve/reject quizzes, manage system settings & alerts, view platform analytics, audit logs & CSV reports |
| **Quiz Creator** (`ROLE_CREATOR`) | `creator@javaquiz.com` / `Creator@2026!` | Author quizzes & 4-option Java coding questions, review & grade participant attempts, reply to participant doubts, view quiz analytics |
| **Participant** (`ROLE_PARTICIPANT`) | `participant@javaquiz.com` / `Participant@2026!` | Search/filter quizzes by category & difficulty, take timed quizzes with countdown auto-submit, review answers & explanations, track history, leaderboard & reminders |

---

## Course Marking Rubric Mapping

| Rubric Criterion | Implementation in Repository |
| :--- | :--- |
| **OOP: Interfaces & Inheritance** | `com.javaquiz.oop.ScoringPolicy` (interface), `AbstractScoringPolicy` (abstract template base class), `JavaQuizDesktopApp extends JFrame`, `QuizPlatformServlet extends HttpServlet` |
| **OOP: Polymorphism** | `StandardScoringPolicy` and `NegativeMarkingScoringPolicy` overriding `computeQuestionScore(...)` via `ScoringPolicy` polymorphism |
| **OOP: Exception Handling** | `GlobalExceptionHandler` (`@RestControllerAdvice`), `ResourceNotFoundException`, `BadRequestException`, `DuplicateSubmissionException`, `UnauthorizedAccessException` |
| **Collections & Generics** | `GenericScoreCache<K, V>`, `ApiResponse<T>`, `List`, `Set`, `Map`, `ConcurrentHashMap`, `Deque`, `Collections.shuffle(...)`, `Comparator` |
| **Multithreading & Synchronization** | `QuizSessionMonitor` (`ScheduledExecutorService`, `ConcurrentHashMap`, `AtomicInteger`, `synchronized` locks), `ConsoleQuizRunner` (`ScheduledExecutorService`, `AtomicBoolean`), `JavaQuizDesktopApp` (`SwingWorker`) |
| **Database Connectivity (JDBC) & DAO Classes** | `JdbcConnectionManager` (`DataSource` & `DriverManager`), `JdbcQuizDao` (`Connection`, `PreparedStatement`, `ResultSet`, `SQLException` try-with-resources), `schema.sql` & `data.sql` |
| **Servlet & Web Integration** | `QuizPlatformServlet` (`jakarta.servlet.http.HttpServlet` with `doGet` & `doPost`), registered via `ServletConfig` at `/api/v1/servlet/quizzes`, plus 7 `@RestController` endpoints |
| **Java GUI & CLI** | `JavaQuizDesktopApp` (Java Swing GUI using `java.net.http.HttpClient`), `ConsoleQuizRunner` (timed Core Java CLI runner) |
| **Code Quality & Automated Testing** | 21 JUnit 5 & MockMvc integration/unit test classes under `backend-spring-boot/src/test/java/com/javaquiz/` (`mvn -B clean verify`) |

---

## Project Structure

```text
.
├── .github/workflows/
│   ├── backend-ci.yml                  # Maven build & JUnit 5 / MockMvc CI workflow
│   └── deploy-pages.yml                # GitHub Pages frontend deployment workflow
├── backend-spring-boot/
│   ├── pom.xml                         # Spring Boot 3.2.3, Java 17, Security, JPA, MySQL, H2, JJWT
│   ├── Dockerfile
│   └── src/
│       ├── main/
│       │   ├── java/com/javaquiz/
│       │   │   ├── cli/                # ConsoleQuizRunner (Core Java CLI quiz session)
│       │   │   ├── config/             # DataInitializer, ExtendedQuizSeeder, ServletConfig
│       │   │   ├── concurrent/         # QuizSessionMonitor (multithreading & synchronization)
│       │   │   ├── controller/         # 7 Spring REST Controllers (/api/v1/*)
│       │   │   ├── desktop/            # JavaQuizDesktopApp (Java Swing GUI client)
│       │   │   ├── dto/                # Request/Response DTOs with Jakarta Bean Validation
│       │   │   ├── entity/             # 14 JPA Entities & Enums
│       │   │   ├── exception/          # GlobalExceptionHandler & custom exceptions
│       │   │   ├── jdbc/               # JdbcConnectionManager & JdbcQuizDao (raw JDBC)
│       │   │   ├── oop/                # ScoringPolicy hierarchy & GenericScoreCache<K, V>
│       │   │   ├── repository/         # 12 Spring Data JPA Repositories
│       │   │   ├── security/           # JWT & Spring Security 6 configuration
│       │   │   ├── service/            # Core business logic & CSV/analytics services
│       │   │   ├── servlet/            # QuizPlatformServlet (Jakarta HttpServlet)
│       │   │   └── util/               # QuizValidationUtils
│       │   └── resources/
│       │       ├── application.yml     # MySQL & JWT configuration
│       │       ├── schema.sql          # MySQL 8.0 relational schema (14 tables)
│       │       └── data.sql            # Seed roles, users, categories & settings
│       └── test/
│           ├── java/com/javaquiz/      # JUnit 5 unit, JDBC, Servlet, Concurrency & MockMvc tests
│           └── resources/application.yml
├── src/                                # Responsive Web Frontend (React + TypeScript + Tailwind)
├── docker-compose.yml                  # Full-stack MySQL + Spring Boot + Frontend orchestration
├── DEPLOYMENT.md                       # Deployment guide
└── README.md
```

---

## Setup & Running Locally

### 1. MySQL Database Setup (Optional for local production run; tests use H2 in MySQL mode)
```sql
CREATE DATABASE IF NOT EXISTS `quiz_platform_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'quiz_user'@'localhost' IDENTIFIED BY 'quiz_secure_password_2026';
GRANT ALL PRIVILEGES ON `quiz_platform_db`.* TO 'quiz_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Run Java Backend Tests & Server
```bash
cd backend-spring-boot

# Run full JUnit 5, JDBC, HttpServlet, Concurrency, and MockMvc suite
mvn -B clean verify

# Start Spring Boot REST + HttpServlet backend on http://localhost:8080/api/v1
mvn spring-boot:run
```

### 3. Run Java Swing Desktop GUI Client
With the backend running on port `8080`:
```bash
cd backend-spring-boot
mvn exec:java -Dexec.mainClass="com.javaquiz.desktop.JavaQuizDesktopApp"
```

### 4. Run Web Frontend
```bash
npm install
npm run dev
```

### 5. Run Full Stack with Docker Compose
```bash
docker compose up --build
```
