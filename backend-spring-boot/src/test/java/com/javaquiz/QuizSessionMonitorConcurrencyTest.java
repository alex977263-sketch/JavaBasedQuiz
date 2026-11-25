package com.javaquiz;

import com.javaquiz.concurrent.QuizSessionMonitor;
import org.junit.jupiter.api.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

class QuizSessionMonitorConcurrencyTest {

    @Test
    void concurrentThreadsSafelyRegisterAndCompleteTimedSessions() throws InterruptedException {
        QuizSessionMonitor monitor = new QuizSessionMonitor();
        int threadCount = 12;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch startGate = new CountDownLatch(1);
        CountDownLatch doneGate = new CountDownLatch(threadCount);

        for (int i = 0; i < threadCount; i++) {
            final int idx = i;
            executor.submit(() -> {
                try {
                    startGate.await();
                    String token = "session-token-" + idx;
                    monitor.registerSession(token, (long) idx + 1, 1L, 15);
                    monitor.completeSession(token);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    doneGate.countDown();
                }
            });
        }

        startGate.countDown();
        boolean finished = doneGate.await(5, TimeUnit.SECONDS);
        executor.shutdownNow();
        monitor.shutdown();

        assertThat(finished).isTrue();
        assertThat(monitor.getActiveSessionCount()).isZero();
        assertThat(monitor.getCompletedSessionsCount()).isEqualTo(threadCount);
    }
}
