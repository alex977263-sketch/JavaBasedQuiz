# Java-Based Online Quiz Platform

A full-stack **Java 17** educational quiz platform built with **Spring Boot 3.2**, **Spring Security 6 (JWT + BCrypt)**, **JDBC (`Connection`, `PreparedStatement`, `ResultSet`)**, **Spring Data JPA / Hibernate**, **Jakarta `HttpServlet`**, **Java Swing Desktop Client**, **Core Java CLI Runner**, and **MySQL 8.0** (with a responsive React + TypeScript web interface).

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
| **Code Quality & Automated Testing** | 23 JUnit 5 & MockMvc integration/unit test classes under `backend-spring-boot/src/test/java/com/javaquiz/` (`mvn -B clean verify`) |

---

## Official User Roles

1. **Administrator (`ROLE_ADMIN`)** — `admin@javaquiz.com` / `Admin@2026!`
   - User account CRUD & role assignment, quiz approval/rejection, system settings, system alerts, platform analytics, CSV export, and audit logs.
2. **Quiz Creator (`ROLE_CREATOR`)** — `creator@javaquiz.com` / `Creator@2026!`
   - Create and manage quizzes & 4-option Java questions, review and grade participant attempts, and reply to participant doubts.
3. **Participant (`ROLE_PARTICIPANT`)** — `participant@javaquiz.com` / `Participant@2026!`
   - Take timed quizzes with countdown auto-submit, review detailed explanations, track performance history & leaderboard standing, manage reminders, and message creators.

---

## Running Locally & Testing

### Java Spring Boot Backend + Tests
```bash
cd backend-spring-boot

# Run all JUnit 5, JDBC, Servlet, Concurrency, and MockMvc tests (H2 MySQL-mode)
mvn -B clean verify

# Start Spring Boot REST + Servlet server on http://localhost:8080/api/v1
mvn spring-boot:run
```

### Web Frontend
```bash
npm install
npm run dev
```

See `backend-spring-boot/README.md` and `DEPLOYMENT.md` for MySQL setup, Docker Compose, and GitHub Actions CI/CD details.
