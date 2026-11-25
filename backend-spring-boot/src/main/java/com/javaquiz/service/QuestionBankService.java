package com.javaquiz.service;

import com.javaquiz.dto.CreateQuestionRequest;
import com.javaquiz.entity.Difficulty;
import com.javaquiz.entity.OptionKey;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Provides curated, ready-to-import Java & Computer Science question templates
 * for Quiz Creators authoring new assessments.
 */
@Service
public class QuestionBankService {

    public List<CreateQuestionRequest> getCuratedJavaTemplates() {
        return List.of(
                CreateQuestionRequest.builder()
                        .questionText("What does the 'try-with-resources' statement introduced in Java 7 guarantee?")
                        .codeSnippet("""
                                try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
                                    return br.readLine();
                                }""")
                        .codeLanguage("java")
                        .points(10)
                        .difficulty(Difficulty.EASY)
                        .options(Map.of(
                                OptionKey.A, "Any resource implementing AutoCloseable is closed automatically when the try block exits",
                                OptionKey.B, "Checked exceptions are suppressed and never propagated",
                                OptionKey.C, "The block executes on a background daemon thread",
                                OptionKey.D, "Garbage collection runs immediately after the try block"
                        ))
                        .correctOptionKey(OptionKey.A)
                        .explanation("Any resource implementing java.lang.AutoCloseable declared in try(...) is guaranteed to have close() invoked automatically, even if an exception occurs.")
                        .build(),

                CreateQuestionRequest.builder()
                        .questionText("What is the output of the following Java Stream pipeline?")
                        .codeSnippet("""
                                List<Integer> nums = List.of(1, 2, 3, 4, 5);
                                int sum = nums.stream()
                                        .filter(n -> n % 2 == 0)
                                        .mapToInt(n -> n * n)
                                        .sum();
                                System.out.println(sum);""")
                        .codeLanguage("java")
                        .points(10)
                        .difficulty(Difficulty.MEDIUM)
                        .options(Map.of(
                                OptionKey.A, "15",
                                OptionKey.B, "20",
                                OptionKey.C, "35",
                                OptionKey.D, "55"
                        ))
                        .correctOptionKey(OptionKey.B)
                        .explanation("filter(n -> n % 2 == 0) keeps 2 and 4; mapToInt(n -> n * n) produces 4 and 16; sum() returns 4 + 16 = 20.")
                        .build(),

                CreateQuestionRequest.builder()
                        .questionText("Why should custom immutable classes in Java avoid exposing mutable collection references directly in getters?")
                        .codeSnippet("""
                                public final class Course {
                                    private final List<String> topics;
                                    public Course(List<String> topics) {
                                        this.topics = List.copyOf(topics);
                                    }
                                    public List<String> getTopics() { return topics; }
                                }""")
                        .codeLanguage("java")
                        .points(15)
                        .difficulty(Difficulty.HARD)
                        .options(Map.of(
                                OptionKey.A, "To prevent external callers from mutating internal state after construction",
                                OptionKey.B, "Because List cannot be serialized in Java",
                                OptionKey.C, "Because private final fields cannot store List objects",
                                OptionKey.D, "To reduce bytecode size in the JVM metaspace"
                        ))
                        .correctOptionKey(OptionKey.A)
                        .explanation("Defensive copying via List.copyOf() guarantees that callers cannot modify the original or returned list, preserving true immutability.")
                        .build(),

                CreateQuestionRequest.builder()
                        .questionText("Which Spring Data JPA annotation marks a service method to execute within a database transaction boundary?")
                        .codeSnippet(null)
                        .codeLanguage("java")
                        .points(10)
                        .difficulty(Difficulty.EASY)
                        .options(Map.of(
                                OptionKey.A, "@Transactional",
                                OptionKey.B, "@Repository",
                                OptionKey.C, "@RestController",
                                OptionKey.D, "@Autowired"
                        ))
                        .correctOptionKey(OptionKey.A)
                        .explanation("@Transactional instructs Spring's transaction manager to wrap the method in a database transaction, rolling back automatically on unchecked exceptions.")
                        .build(),

                CreateQuestionRequest.builder()
                        .questionText("What is the role of BCryptPasswordEncoder in Spring Security?")
                        .codeSnippet(null)
                        .codeLanguage("java")
                        .points(10)
                        .difficulty(Difficulty.MEDIUM)
                        .options(Map.of(
                                OptionKey.A, "Encrypts JWT payloads with AES-256 symmetric keys",
                                OptionKey.B, "Performs adaptive salted password hashing so plaintext passwords are never stored",
                                OptionKey.C, "Validates CORS origins on incoming HTTP requests",
                                OptionKey.D, "Generates MySQL primary keys"
                        ))
                        .correctOptionKey(OptionKey.B)
                        .explanation("BCryptPasswordEncoder uses the adaptive Blowfish-based bcrypt algorithm with a random per-password salt to securely hash and verify user passwords.")
                        .build(),

                CreateQuestionRequest.builder()
                        .questionText("What happens when an unchecked RuntimeException is thrown inside a Spring @RestController method?")
                        .codeSnippet(null)
                        .codeLanguage("java")
                        .points(10)
                        .difficulty(Difficulty.MEDIUM)
                        .options(Map.of(
                                OptionKey.A, "The JVM exits immediately",
                                OptionKey.B, "Spring routes the exception to matching @ExceptionHandler methods inside @RestControllerAdvice",
                                OptionKey.C, "Hibernate drops all database tables",
                                OptionKey.D, "Spring converts it automatically to HTTP 200 OK"
                        ))
                        .correctOptionKey(OptionKey.B)
                        .explanation("A @RestControllerAdvice class intercepts exceptions thrown by controllers and converts them into structured JSON error payloads with appropriate HTTP status codes.")
                        .build()
        );
    }
}
