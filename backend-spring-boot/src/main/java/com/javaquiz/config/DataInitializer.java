package com.javaquiz.config;

import com.javaquiz.entity.*;
import com.javaquiz.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Seeds initial roles, demo users (Admin, Quiz Creator, Participant),
 * 7 computer science categories, sample quizzes with Java code snippets,
 * system settings, and initial alerts on application startup.
 */
@Component
@Order(1)
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final QuizRepository quizRepository;
    private final SystemSettingsRepository settingsRepository;
    private final SystemAlertRepository alertRepository;
    private final InteractionRepository interactionRepository;
    private final QuizReminderRepository reminderRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.count() > 0) {
            return;
        }

        log.info("Initializing JavaQuiz Platform seed data...");

        Role adminRole = roleRepository.save(Role.builder()
                .name(RoleName.ROLE_ADMIN)
                .description("Platform Administrator with full control over users, quiz approval, and settings")
                .build());
        Role creatorRole = roleRepository.save(Role.builder()
                .name(RoleName.ROLE_CREATOR)
                .description("Quiz Creator authorized to author quizzes, review results, and interact with participants")
                .build());
        Role participantRole = roleRepository.save(Role.builder()
                .name(RoleName.ROLE_PARTICIPANT)
                .description("Participant authorized to take timed quizzes, view reports, and contact creators")
                .build());

        User admin = userRepository.save(User.builder()
                .username("admin")
                .email("admin@javaquiz.com")
                .passwordHash(passwordEncoder.encode("Admin@2026!"))
                .fullName("Administrator")
                .collegeOrCompany("Faculty of Software Systems")
                .isEnabled(true)
                .roles(new HashSet<>(Set.of(adminRole)))
                .build());

        User creator = userRepository.save(User.builder()
                .username("creator")
                .email("creator@javaquiz.com")
                .passwordHash(passwordEncoder.encode("Creator@2026!"))
                .fullName("Prof. James Gosling")
                .collegeOrCompany("Java Curriculum Lead")
                .isEnabled(true)
                .roles(new HashSet<>(Set.of(creatorRole)))
                .build());

        User anita = userRepository.save(User.builder()
                .username("anita_creator")
                .email("anita@javaquiz.com")
                .passwordHash(passwordEncoder.encode("Creator@2026!"))
                .fullName("Dr. Anita Borg")
                .collegeOrCompany("Systems & OS Department")
                .isEnabled(true)
                .roles(new HashSet<>(Set.of(creatorRole)))
                .build());

        User participant = userRepository.save(User.builder()
                .username("participant")
                .email("participant@javaquiz.com")
                .passwordHash(passwordEncoder.encode("Participant@2026!"))
                .fullName("Rahul Sharma")
                .collegeOrCompany("Computer Science & Engineering")
                .isEnabled(true)
                .roles(new HashSet<>(Set.of(participantRole)))
                .build());

        userRepository.save(User.builder()
                .username("priya_participant")
                .email("priya@javaquiz.com")
                .passwordHash(passwordEncoder.encode("Participant@2026!"))
                .fullName("Priya Patel")
                .collegeOrCompany("Software Technology Institute")
                .isEnabled(true)
                .roles(new HashSet<>(Set.of(participantRole)))
                .build());

        settingsRepository.save(SystemSettings.builder()
                .id(1L)
                .platformTitle("Java-Based Online Quiz Platform")
                .defaultDurationMinutes(15)
                .defaultPassingPercentage(70)
                .autoApproveQuizzes(false)
                .allowParticipantInteractions(true)
                .registrationOpen(true)
                .maintenanceMode(false)
                .systemAnnouncement("Welcome to JavaQuiz Platform! Timed quizzes and performance reports are active.")
                .build());

        Category javaCat = categoryRepository.save(Category.builder()
                .name("Java Programming")
                .slug("java-programming")
                .description("Core Java syntax, variables, data types, loops, JVM internals, and fundamentals.")
                .iconName("Coffee")
                .build());

        Category oopCat = categoryRepository.save(Category.builder()
                .name("Object-Oriented Programming")
                .slug("oop")
                .description("Encapsulation, inheritance, polymorphism, abstraction, and design principles in Java.")
                .iconName("Boxes")
                .build());

        Category dsaCat = categoryRepository.save(Category.builder()
                .name("Data Structures & Algorithms")
                .slug("dsa")
                .description("Arrays, LinkedLists, Trees, Hash tables, sorting, searching, and computational complexity.")
                .iconName("Binary")
                .build());

        Category dbmsCat = categoryRepository.save(Category.builder()
                .name("DBMS and SQL")
                .slug("dbms-sql")
                .description("Relational database concepts, normalization, SQL queries, indexing, and ACID transactions.")
                .iconName("Database")
                .build());

        Category osCat = categoryRepository.save(Category.builder()
                .name("Operating Systems")
                .slug("operating-systems")
                .description("Processes, threads, CPU scheduling, synchronization, memory management, and deadlock.")
                .iconName("Cpu")
                .build());

        Category cnCat = categoryRepository.save(Category.builder()
                .name("Computer Networks")
                .slug("computer-networks")
                .description("OSI/TCP-IP models, sockets, routing protocols, DNS, HTTP/HTTPS, and network security.")
                .iconName("Network")
                .build());

        Category genCat = categoryRepository.save(Category.builder()
                .name("General Computer Knowledge")
                .slug("general-cs")
                .description("Computer architecture, binary arithmetic, software engineering methodologies, and Git.")
                .iconName("Laptop")
                .build());

        // Quiz 1: Java Core
        Quiz javaCoreQuiz = buildQuiz(
                "Java Core: Variables, Data Types & Control Flow",
                "java-core-variables-control-flow",
                "Master Java primitives, autoboxing, String pool immutability, and JVM memory basics.",
                javaCat, Difficulty.EASY, 15, 70, ApprovalStatus.APPROVED, creator
        );
        addQ(javaCoreQuiz, 1,
                "What is the output of the following Java String pool comparison?",
                "String s1 = \"Java\";\nString s2 = new String(\"Java\");\nSystem.out.println((s1 == s2) + \" \" + s1.equals(s2));",
                OptionKey.A, "true true",
                OptionKey.B, "false true",
                OptionKey.C, "true false",
                OptionKey.D, "false false",
                OptionKey.B,
                "s1 refers to the literal in the String Constant Pool, whereas new String() allocates a separate object on the heap. Thus == returns false, while equals() compares character sequences and returns true.",
                10, Difficulty.EASY);
        addQ(javaCoreQuiz, 2,
                "What is the size and default value of a primitive 'int' field in a Java class?",
                null,
                OptionKey.A, "16-bit, default 0",
                OptionKey.B, "32-bit, default 0",
                OptionKey.C, "64-bit, default null",
                OptionKey.D, "32-bit, default -1",
                OptionKey.B,
                "In Java, an int is always a 32-bit signed two's complement integer, and class-level instance fields default to 0.",
                10, Difficulty.EASY);
        addQ(javaCoreQuiz, 3,
                "What happens when you compile and run this Java snippet?",
                "Integer a = 127;\nInteger b = 127;\nInteger c = 128;\nInteger d = 128;\nSystem.out.println((a == b) + \",\" + (c == d));",
                OptionKey.A, "true,true",
                OptionKey.B, "false,false",
                OptionKey.C, "true,false",
                OptionKey.D, "Compilation error",
                OptionKey.C,
                "Java caches Integer wrapper instances for values between -128 and 127 (IntegerCache). 127 reuses the same cached reference (true), while 128 creates two distinct objects (false).",
                10, Difficulty.MEDIUM);
        addQ(javaCoreQuiz, 4,
                "Which keyword prevents a method from being overridden by subclasses in Java?",
                null,
                OptionKey.A, "static",
                OptionKey.B, "abstract",
                OptionKey.C, "final",
                OptionKey.D, "volatile",
                OptionKey.C,
                "Declaring a method as final prevents any subclass from overriding it, ensuring consistent implementation.",
                10, Difficulty.EASY);
        addQ(javaCoreQuiz, 5,
                "Which component of the Java platform is responsible for converting bytecode into native machine instructions at runtime?",
                null,
                OptionKey.A, "javac Compiler",
                OptionKey.B, "JIT (Just-In-Time) Compiler inside the JVM",
                OptionKey.C, "Javadoc Generator",
                OptionKey.D, "Maven Surefire Plugin",
                OptionKey.B,
                "The JIT compiler inside the JVM profiles hot code paths at runtime and compiles Java bytecode directly to optimized native machine code.",
                10, Difficulty.EASY);
        quizRepository.save(javaCoreQuiz);

        // Quiz 2: OOP in Java
        Quiz oopQuiz = buildQuiz(
                "Object-Oriented Programming (OOP) in Java",
                "oop-in-java",
                "Deep dive into inheritance, dynamic method dispatch, interfaces, abstract classes, and SOLID principles.",
                oopCat, Difficulty.MEDIUM, 20, 70, ApprovalStatus.APPROVED, creator
        );
        addQ(oopQuiz, 1,
                "What is the output of this polymorphic method dispatch example?",
                "class Parent {\n    void show() { System.out.println(\"Parent\"); }\n}\nclass Child extends Parent {\n    @Override\n    void show() { System.out.println(\"Child\"); }\n}\nParent ref = new Child();\nref.show();",
                OptionKey.A, "Parent",
                OptionKey.B, "Child",
                OptionKey.C, "Compilation Error",
                OptionKey.D, "ClassCastException",
                OptionKey.B,
                "Method overriding uses dynamic (runtime) polymorphism in Java. Even though the reference type is Parent, the actual object on the heap is Child, so Child.show() is invoked.",
                10, Difficulty.MEDIUM);
        addQ(oopQuiz, 2,
                "Which statement accurately differentiates an interface from an abstract class in Java 17?",
                null,
                OptionKey.A, "An interface can hold mutable non-final instance fields",
                OptionKey.B, "A class can extend multiple abstract classes",
                OptionKey.C, "A class can implement multiple interfaces, while extending only one class",
                OptionKey.D, "Abstract classes cannot define constructors",
                OptionKey.C,
                "Java supports single class inheritance (extends one class) and multiple interface implementation (implements multiple interfaces). Abstract classes can have constructors and mutable instance fields.",
                10, Difficulty.MEDIUM);
        addQ(oopQuiz, 3,
                "Which SOLID principle states that objects of a superclass should be replaceable with objects of a subclass without breaking correctness?",
                null,
                OptionKey.A, "Single Responsibility Principle",
                OptionKey.B, "Open/Closed Principle",
                OptionKey.C, "Liskov Substitution Principle",
                OptionKey.D, "Dependency Inversion Principle",
                OptionKey.C,
                "The Liskov Substitution Principle (LSP) guarantees that subtypes honor the behavioral contracts of their base types.",
                10, Difficulty.MEDIUM);
        addQ(oopQuiz, 4,
                "What does the 'super()' call inside a Java subclass constructor do?",
                null,
                OptionKey.A, "Invokes the constructor of the immediate parent class",
                OptionKey.B, "Creates a second instance of the superclass",
                OptionKey.C, "Marks the subclass as immutable",
                OptionKey.D, "Calls garbage collection on parent fields",
                OptionKey.A,
                "super(...) chains constructor execution to the immediate parent class so inherited fields are initialized before the subclass body runs.",
                10, Difficulty.EASY);
        quizRepository.save(oopQuiz);

        // Quiz 3: Data Structures & Algorithms
        Quiz dsaQuiz = buildQuiz(
                "Data Structures & Algorithms with Java Collections",
                "dsa-java-collections",
                "Evaluate time complexities, HashMap internals, Binary Search Trees, and Java Collections Framework.",
                dsaCat, Difficulty.HARD, 25, 70, ApprovalStatus.APPROVED, creator
        );
        addQ(dsaQuiz, 1,
                "What is the average-case and worst-case time complexity of HashMap.get(key) in Java 8+?",
                null,
                OptionKey.A, "O(1) average, O(n) worst-case",
                OptionKey.B, "O(1) average, O(log n) worst-case with balanced tree buckets",
                OptionKey.C, "O(log n) average, O(n^2) worst-case",
                OptionKey.D, "O(n) average, O(n) worst-case",
                OptionKey.B,
                "Since Java 8, when a hash bucket exceeds TREEIFY_THRESHOLD (8 nodes), HashMap converts the linked list into a Red-Black Tree, bounding worst-case lookup to O(log n).",
                10, Difficulty.HARD);
        addQ(dsaQuiz, 2,
                "Which Java Collection guarantees insertion-order iteration while allowing O(1) average key lookups?",
                null,
                OptionKey.A, "HashMap",
                OptionKey.B, "TreeMap",
                OptionKey.C, "LinkedHashMap",
                OptionKey.D, "PriorityQueue",
                OptionKey.C,
                "LinkedHashMap maintains a doubly-linked list running through its entries to preserve predictable insertion (or access) order alongside O(1) hash lookups.",
                10, Difficulty.MEDIUM);
        addQ(dsaQuiz, 3,
                "Which traversal of a Binary Search Tree yields elements in ascending sorted order?",
                null,
                OptionKey.A, "Pre-order traversal",
                OptionKey.B, "In-order traversal",
                OptionKey.C, "Post-order traversal",
                OptionKey.D, "Level-order traversal",
                OptionKey.B,
                "In-order traversal visits Left subtree -> Root -> Right subtree, producing elements in non-decreasing sorted order for any valid BST.",
                10, Difficulty.EASY);
        quizRepository.save(dsaQuiz);

        // Quiz 4: DBMS & SQL
        Quiz dbmsQuiz = buildQuiz(
                "DBMS, SQL Queries & Spring Data JPA",
                "dbms-sql-jpa",
                "Relational schema design, ACID properties, JOINs, indexes, and Hibernate N+1 optimization.",
                dbmsCat, Difficulty.MEDIUM, 15, 70, ApprovalStatus.APPROVED, anita
        );
        addQ(dbmsQuiz, 1,
                "What does the 'I' in ACID database transactions stand for?",
                null,
                OptionKey.A, "Integrity",
                OptionKey.B, "Isolation",
                OptionKey.C, "Indexing",
                OptionKey.D, "Immutability",
                OptionKey.B,
                "ACID stands for Atomicity, Consistency, Isolation, and Durability. Isolation ensures concurrent transactions do not interfere with each other.",
                10, Difficulty.EASY);
        addQ(dbmsQuiz, 2,
                "Which SQL clause filters aggregated groups produced by GROUP BY?",
                null,
                OptionKey.A, "WHERE",
                OptionKey.B, "ORDER BY",
                OptionKey.C, "HAVING",
                OptionKey.D, "DISTINCT",
                OptionKey.C,
                "WHERE filters individual rows prior to grouping, whereas HAVING filters groups created by GROUP BY.",
                10, Difficulty.MEDIUM);
        quizRepository.save(dbmsQuiz);

        // Quiz 5: Operating Systems (Pending Admin Approval demo)
        Quiz osQuiz = buildQuiz(
                "Operating Systems: Threads, Scheduling & Deadlocks",
                "os-threads-deadlocks",
                "Processes vs threads, synchronization primitives, virtual memory, and Banker's algorithm.",
                osCat, Difficulty.HARD, 20, 70, ApprovalStatus.PENDING, creator
        );
        addQ(osQuiz, 1,
                "Which of the following is NOT one of the four Coffman conditions required for a deadlock?",
                null,
                OptionKey.A, "Mutual Exclusion",
                OptionKey.B, "Hold and Wait",
                OptionKey.C, "Preemption",
                OptionKey.D, "Circular Wait",
                OptionKey.C,
                "The four necessary conditions for deadlock are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.",
                10, Difficulty.MEDIUM);
        addQ(osQuiz, 2,
                "In Java, what does the 'synchronized' keyword guarantee when applied to an instance method?",
                null,
                OptionKey.A, "The method executes asynchronously on a ForkJoinPool",
                OptionKey.B, "Mutual exclusion via the object's intrinsic monitor lock and happens-before memory visibility",
                OptionKey.C, "Automatic database transaction rollback",
                OptionKey.D, "Prevention of all thread context switches",
                OptionKey.B,
                "Acquiring the intrinsic monitor lock ensures only one thread executes synchronized blocks on that object at a time and establishes a happens-before memory barrier.",
                10, Difficulty.HARD);
        quizRepository.save(osQuiz);

        // Quiz 6: Computer Networks
        Quiz cnQuiz = buildQuiz(
                "Computer Networks: TCP/IP, HTTP & Security",
                "computer-networks-tcp-http",
                "OSI 7-layer model, TCP 3-way handshake, REST/HTTP status codes, and TLS encryption.",
                cnCat, Difficulty.MEDIUM, 15, 70, ApprovalStatus.APPROVED, anita
        );
        addQ(cnQuiz, 1,
                "Which HTTP status code indicates that a request lacked valid authentication credentials?",
                null,
                OptionKey.A, "400 Bad Request",
                OptionKey.B, "401 Unauthorized",
                OptionKey.C, "403 Forbidden",
                OptionKey.D, "404 Not Found",
                OptionKey.B,
                "401 Unauthorized indicates missing or invalid authentication, while 403 Forbidden indicates the authenticated user lacks required permissions.",
                10, Difficulty.EASY);
        quizRepository.save(cnQuiz);

        // Quiz 7: General CS
        Quiz genQuiz = buildQuiz(
                "General CS: Git, Architecture & Clean Code",
                "general-cs-git-architecture",
                "Essential version control, binary arithmetic, REST architecture, and testing practices.",
                genCat, Difficulty.EASY, 10, 70, ApprovalStatus.APPROVED, admin
        );
        addQ(genQuiz, 1,
                "Which Maven lifecycle phase compiles source code, runs unit tests, and builds the executable JAR?",
                null,
                OptionKey.A, "mvn clean",
                OptionKey.B, "mvn validate",
                OptionKey.C, "mvn package",
                OptionKey.D, "mvn dependency:tree",
                OptionKey.C,
                "Running 'mvn package' executes compile, test, and package phases to produce the deployable JAR/WAR artifact.",
                10, Difficulty.EASY);
        quizRepository.save(genQuiz);

        // Seed initial alerts
        alertRepository.saveAll(List.of(
                SystemAlert.builder()
                        .title("New Quiz Submission Pending Approval")
                        .message("Quiz \"Operating Systems: Threads, Scheduling & Deadlocks\" by Prof. James Gosling requires review.")
                        .alertType(AlertType.INFO)
                        .isDismissed(false)
                        .build(),
                SystemAlert.builder()
                        .title("Spring Boot & MySQL Environment Healthy")
                        .message("All assessment services, JWT authentication, and JPA repositories initialized cleanly.")
                        .alertType(AlertType.INFO)
                        .isDismissed(false)
                        .build()
        ));

        // Seed sample participant interaction
        interactionRepository.save(ParticipantCreatorInteraction.builder()
                .participant(participant)
                .creator(creator)
                .quiz(javaCoreQuiz)
                .subject("Clarification on String Pool vs Heap Allocation")
                .message("Could you explain why intern() makes s2 == s1 evaluate to true?")
                .status(InteractionStatus.OPEN)
                .build());

        // Seed sample quiz reminder
        reminderRepository.save(QuizReminder.builder()
                .participant(participant)
                .quiz(oopQuiz)
                .reminderDateTime("2026-12-01T18:00")
                .note("Review dynamic method dispatch and SOLID principles before attempting")
                .isCompleted(false)
                .build());

        log.info("JavaQuiz Platform seed data initialized: {} categories, {} quizzes.",
                categoryRepository.count(), quizRepository.count());
    }

    private Quiz buildQuiz(
            String title,
            String slug,
            String description,
            Category category,
            Difficulty difficulty,
            int durationMinutes,
            int passingPercentage,
            ApprovalStatus status,
            User creator
    ) {
        return Quiz.builder()
                .title(title)
                .slug(slug)
                .description(description)
                .category(category)
                .difficulty(difficulty)
                .durationMinutes(durationMinutes)
                .passingPercentage(passingPercentage)
                .isActive(true)
                .approvalStatus(status)
                .createdBy(creator)
                .build();
    }

    private void addQ(
            Quiz quiz,
            int num,
            String text,
            String codeSnippet,
            OptionKey kA, String tA,
            OptionKey kB, String tB,
            OptionKey kC, String tC,
            OptionKey kD, String tD,
            OptionKey correctKey,
            String explanation,
            int points,
            Difficulty difficulty
    ) {
        Question q = Question.builder()
                .questionNumber(num)
                .questionText(text)
                .codeSnippet(codeSnippet)
                .codeLanguage("java")
                .correctOptionKey(correctKey)
                .explanation(explanation)
                .points(points)
                .difficulty(difficulty)
                .build();
        q.addOption(kA, tA);
        q.addOption(kB, tB);
        q.addOption(kC, tC);
        q.addOption(kD, tD);
        quiz.addQuestion(q);
    }
}
