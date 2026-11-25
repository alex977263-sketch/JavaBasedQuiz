package com.javaquiz.config;

import com.javaquiz.entity.*;
import com.javaquiz.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Enriches seeded quizzes with additional Java, OOP, DSA, DBMS, OS, and Networking questions
 * after DataInitializer completes.
 */
@Component
@Order(2)
@RequiredArgsConstructor
public class ExtendedQuizSeeder implements CommandLineRunner {

    private final QuizRepository quizRepository;

    @Override
    @Transactional
    public void run(String... args) {
        enrichQuiz("java-core-variables-control-flow", 6,
                "What is the output of this Java switch expression with yield (Java 17)?",
                """
                        int day = 3;
                        String type = switch (day) {
                            case 1, 2, 3, 4, 5 -> "Weekday";
                            case 6, 7 -> "Weekend";
                            default -> "Invalid";
                        };
                        System.out.println(type);""",
                "Weekday", "Weekend", "Invalid", "Compilation error",
                OptionKey.A,
                "Java 14+ standardized switch expressions with arrow labels (->), which do not fall through and evaluate directly to \"Weekday\".",
                10, Difficulty.MEDIUM);

        enrichQuiz("java-core-variables-control-flow", 7,
                "Why is StringBuilder preferred over String concatenation inside a Java loop?",
                null,
                "StringBuilder is mutable and avoids allocating new String objects on every iteration",
                "StringBuilder executes on a separate thread automatically",
                "String cannot hold more than 256 characters",
                "StringBuilder stores characters in CPU registers",
                OptionKey.A,
                "Because String is immutable, concatenating in a loop creates O(n^2) temporary String objects. StringBuilder mutates an internal char/byte buffer in O(n) amortized time.",
                10, Difficulty.EASY);

        enrichQuiz("oop-in-java", 5,
                "What is the effect of marking a Java class as 'final' (e.g., java.lang.String)?",
                null,
                "No other class can extend/inherit from it",
                "Its instances cannot be garbage collected",
                "All of its fields become static",
                "It can only contain abstract methods",
                OptionKey.A,
                "A final class cannot be subclassed, which preserves immutability and security guarantees.",
                10, Difficulty.EASY);

        enrichQuiz("oop-in-java", 6,
                "Which design pattern ensures a class has only one instance and provides a global point of access?",
                null,
                "Builder Pattern",
                "Observer Pattern",
                "Singleton Pattern",
                "Decorator Pattern",
                OptionKey.C,
                "The Singleton Pattern restricts instantiation to a single shared object (commonly implemented via enum or thread-safe holder class in Java).",
                10, Difficulty.EASY);

        enrichQuiz("dsa-java-collections", 4,
                "What happens if two unequal Java objects return the same hashCode() when inserted into a HashMap?",
                null,
                "HashMap throws DuplicateKeyException",
                "Both entries remain in the same bucket, resolved via equals() comparisons",
                "The second entry overwrites the first entry",
                "HashMap resizes infinitely",
                OptionKey.B,
                "Hash collisions are normal. HashMap places colliding keys in the same bucket (linked list or balanced tree) and uses equals() to distinguish distinct keys.",
                10, Difficulty.MEDIUM);

        enrichQuiz("dsa-java-collections", 5,
                "What is the time complexity of binary search on a sorted Java array of size n?",
                null,
                "O(1)",
                "O(log n)",
                "O(n)",
                "O(n log n)",
                OptionKey.B,
                "Binary search halves the remaining search interval on every comparison, yielding O(log n) worst-case time complexity.",
                10, Difficulty.EASY);

        enrichQuiz("dbms-sql-jpa", 3,
                "In Hibernate / Spring Data JPA, what causes the N+1 select problem?",
                null,
                "Fetching N parent entities and executing an extra SQL query per parent to lazily load a child association",
                "Using a composite primary key",
                "Enabling BCrypt password hashing",
                "Adding a database index on a foreign key",
                OptionKey.A,
                "Loading a collection of N entities followed by N lazy queries for each entity's children triggers N+1 queries; JOIN FETCH or @EntityGraph resolves it in 1 query.",
                15, Difficulty.HARD);

        enrichQuiz("dbms-sql-jpa", 4,
                "Which database normal form eliminates transitive dependencies of non-key attributes on the primary key?",
                null,
                "First Normal Form (1NF)",
                "Second Normal Form (2NF)",
                "Third Normal Form (3NF)",
                "Denormalized Form",
                OptionKey.C,
                "A relation is in 3NF if it is in 2NF and no non-prime attribute is transitively dependent on a candidate key.",
                10, Difficulty.MEDIUM);

        enrichQuiz("computer-networks-tcp-http", 2,
                "Which protocol translates human-readable domain names like javaquiz.com into IP addresses?",
                null,
                "DHCP",
                "DNS",
                "ARP",
                "ICMP",
                OptionKey.B,
                "The Domain Name System (DNS) resolves domain names into IPv4/IPv6 addresses.",
                10, Difficulty.EASY);

        enrichQuiz("general-cs-git-architecture", 2,
                "Which Git command creates a new branch and immediately switches the working directory to it?",
                null,
                "git checkout -b feature/quiz",
                "git commit --amend",
                "git merge --squash",
                "git fetch --prune",
                OptionKey.A,
                "git checkout -b <branch> (or git switch -c <branch>) creates and checks out the new branch in one step.",
                10, Difficulty.EASY);
    }

    private void enrichQuiz(
            String slug,
            int questionNumber,
            String text,
            String codeSnippet,
            String optA, String optB, String optC, String optD,
            OptionKey correctKey,
            String explanation,
            int points,
            Difficulty difficulty
    ) {
        quizRepository.findBySlug(slug).ifPresent(quiz -> {
            boolean alreadyExists = quiz.getQuestions().stream()
                    .anyMatch(q -> q.getQuestionNumber() != null && q.getQuestionNumber() == questionNumber);
            if (!alreadyExists) {
                Question q = Question.builder()
                        .questionNumber(questionNumber)
                        .questionText(text)
                        .codeSnippet(codeSnippet)
                        .codeLanguage("java")
                        .correctOptionKey(correctKey)
                        .explanation(explanation)
                        .points(points)
                        .difficulty(difficulty)
                        .build();
                q.addOption(OptionKey.A, optA);
                q.addOption(OptionKey.B, optB);
                q.addOption(OptionKey.C, optC);
                q.addOption(OptionKey.D, optD);
                quiz.addQuestion(q);
                quizRepository.save(quiz);
            }
        });
    }
}
