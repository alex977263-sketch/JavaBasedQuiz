package com.javaquiz.service;

import com.javaquiz.dto.CreateQuestionRequest;
import com.javaquiz.entity.Difficulty;
import com.javaquiz.entity.OptionKey;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Generates deterministic Java code-tracing and algorithmic complexity questions
 * across Java Core, OOP, Collections, Multithreading, and Spring Boot.
 */
@Service
public class JavaCodingChallengeGenerator {

    public List<CreateQuestionRequest> generateCoreJavaChallenges() {
        return List.of(
                CreateQuestionRequest.builder()
                        .questionText("What is the output of this Java autoboxing and method overloading snippet?")
                        .codeSnippet("""
                                public class OverloadDemo {
                                    static void print(long x) { System.out.print("long "); }
                                    static void print(Integer x) { System.out.print("Integer "); }
                                    public static void main(String[] args) {
                                        int val = 42;
                                        print(val);
                                    }
                                }""")
                        .codeLanguage("java")
                        .points(10)
                        .difficulty(Difficulty.HARD)
                        .options(Map.of(
                                OptionKey.A, "Integer ",
                                OptionKey.B, "long ",
                                OptionKey.C, "Compilation error: ambiguous call",
                                OptionKey.D, "Runtime ClassCastException"
                        ))
                        .correctOptionKey(OptionKey.B)
                        .explanation("In Java overload resolution, widening primitive conversion (int -> long) takes precedence over boxing (int -> Integer).")
                        .build(),

                CreateQuestionRequest.builder()
                        .questionText("What does the following Java Optional chain return?")
                        .codeSnippet("""
                                String result = Optional.<String>ofNullable(null)
                                        .map(String::toUpperCase)
                                        .orElseGet(() -> "DEFAULT_JAVA");
                                System.out.println(result);""")
                        .codeLanguage("java")
                        .points(10)
                        .difficulty(Difficulty.MEDIUM)
                        .options(Map.of(
                                OptionKey.A, "null",
                                OptionKey.B, "NullPointerException",
                                OptionKey.C, "DEFAULT_JAVA",
                                OptionKey.D, "Optional.empty"
                        ))
                        .correctOptionKey(OptionKey.C)
                        .explanation("Optional.ofNullable(null) produces an empty Optional; map() skips transformation and orElseGet() lazily supplies \"DEFAULT_JAVA\".")
                        .build(),

                CreateQuestionRequest.builder()
                        .questionText("What is the output when a 'finally' block executes after a 'return' inside 'try'?")
                        .codeSnippet("""
                                static int compute() {
                                    try {
                                        return 10;
                                    } finally {
                                        System.out.print("F:");
                                    }
                                }
                                public static void main(String[] args) {
                                    System.out.print(compute());
                                }""")
                        .codeLanguage("java")
                        .points(10)
                        .difficulty(Difficulty.MEDIUM)
                        .options(Map.of(
                                OptionKey.A, "10",
                                OptionKey.B, "F:10",
                                OptionKey.C, "10F:",
                                OptionKey.D, "Compilation error"
                        ))
                        .correctOptionKey(OptionKey.B)
                        .explanation("The finally block always runs before control returns to the caller, printing \"F:\" first, then returning 10.")
                        .build(),

                CreateQuestionRequest.builder()
                        .questionText("Which functional interface in java.util.function accepts a T and returns a boolean?")
                        .codeSnippet(null)
                        .codeLanguage("java")
                        .points(10)
                        .difficulty(Difficulty.EASY)
                        .options(Map.of(
                                OptionKey.A, "Consumer<T>",
                                OptionKey.B, "Supplier<T>",
                                OptionKey.C, "Predicate<T>",
                                OptionKey.D, "Function<T, T>"
                        ))
                        .correctOptionKey(OptionKey.C)
                        .explanation("Predicate<T> defines boolean test(T t) and is widely used in Stream.filter().")
                        .build()
        );
    }

    public List<CreateQuestionRequest> generateConcurrencyChallenges() {
        return List.of(
                CreateQuestionRequest.builder()
                        .questionText("Why is ConcurrentHashMap preferred over Collections.synchronizedMap() in high-concurrency Java servers?")
                        .codeSnippet(null)
                        .codeLanguage("java")
                        .points(15)
                        .difficulty(Difficulty.HARD)
                        .options(Map.of(
                                OptionKey.A, "ConcurrentHashMap uses fine-grained bucket locking and lock-free reads instead of a single global mutex",
                                OptionKey.B, "ConcurrentHashMap allows null keys and null values",
                                OptionKey.C, "ConcurrentHashMap persists entries automatically to disk",
                                OptionKey.D, "synchronizedMap() only supports String keys"
                        ))
                        .correctOptionKey(OptionKey.A)
                        .explanation("ConcurrentHashMap in Java 8+ uses CAS operations and per-bin synchronized locks, avoiding full-map lock contention.")
                        .build(),

                CreateQuestionRequest.builder()
                        .questionText("What is the purpose of the 'volatile' keyword on a shared boolean flag in Java?")
                        .codeSnippet("""
                                private volatile boolean running = true;
                                public void stop() { running = false; }""")
                        .codeLanguage("java")
                        .points(10)
                        .difficulty(Difficulty.MEDIUM)
                        .options(Map.of(
                                OptionKey.A, "Guarantees cross-thread visibility by reading/writing directly to main memory and preventing instruction reordering",
                                OptionKey.B, "Makes compound operations like count++ atomic",
                                OptionKey.C, "Marks the field as non-serializable",
                                OptionKey.D, "Binds the variable to a ThreadLocal cache"
                        ))
                        .correctOptionKey(OptionKey.A)
                        .explanation("volatile guarantees visibility and ordering (happens-before) across threads, though compound read-modify-write still requires Atomic classes or locks.")
                        .build()
        );
    }
}
