package com.javaquiz.concurrent;

import jakarta.annotation.PreDestroy;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Thread-safe concurrent session monitor using ScheduledExecutorService,
 * ConcurrentHashMap, AtomicInteger, and synchronized critical sections
 * to track active timed quiz sessions and auto-expire stale attempts.
 */
@Component
public class QuizSessionMonitor {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActiveQuizSession {
        private String attemptToken;
        private Long userId;
        private Long quizId;
        private Instant startedAt;
        private Instant expiresAt;
    }

    private final Map<String, ActiveQuizSession> activeSessions = new ConcurrentHashMap<>();
    private final AtomicInteger completedSessionsCount = new AtomicInteger(0);
    private final ScheduledExecutorService reaperScheduler;
    private final Object lock = new Object();

    public QuizSessionMonitor() {
        this.reaperScheduler = Executors.newSingleThreadScheduledExecutor(runnable -> {
            Thread t = new Thread(runnable, "quiz-session-reaper");
            t.setDaemon(true);
            return t;
        });
        this.reaperScheduler.scheduleAtFixedRate(this::purgeExpiredSessions, 60, 60, TimeUnit.SECONDS);
    }

    public void registerSession(String attemptToken, Long userId, Long quizId, int durationMinutes) {
        if (attemptToken == null || attemptToken.isBlank()) {
            return;
        }
        Instant now = Instant.now();
        ActiveQuizSession session = ActiveQuizSession.builder()
                .attemptToken(attemptToken)
                .userId(userId)
                .quizId(quizId)
                .startedAt(now)
                .expiresAt(now.plusSeconds(Math.max(1, durationMinutes) * 60L))
                .build();

        synchronized (lock) {
            activeSessions.put(attemptToken, session);
        }
    }

    public boolean completeSession(String attemptToken) {
        if (attemptToken == null) {
            return false;
        }
        synchronized (lock) {
            ActiveQuizSession removed = activeSessions.remove(attemptToken);
            if (removed != null) {
                completedSessionsCount.incrementAndGet();
                return true;
            }
            return false;
        }
    }

    public synchronized int purgeExpiredSessions() {
        Instant now = Instant.now();
        int purged = 0;
        var iterator = activeSessions.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, ActiveQuizSession> entry = iterator.next();
            if (entry.getValue().getExpiresAt().isBefore(now)) {
                iterator.remove();
                purged++;
            }
        }
        return purged;
    }

    public int getActiveSessionCount() {
        synchronized (lock) {
            return activeSessions.size();
        }
    }

    public int getCompletedSessionsCount() {
        return completedSessionsCount.get();
    }

    public List<ActiveQuizSession> listActiveSessions() {
        synchronized (lock) {
            return new ArrayList<>(activeSessions.values());
        }
    }

    @PreDestroy
    public void shutdown() {
        reaperScheduler.shutdownNow();
    }
}
