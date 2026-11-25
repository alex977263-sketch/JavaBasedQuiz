package com.javaquiz.oop;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Generic, thread-safe in-memory repository cache demonstrating Java Generics,
 * Collections Framework (Map, List, Set), and bounded-capacity eviction.
 */
public class GenericScoreCache<K, V> {

    private final int maxCapacity;
    private final Map<K, V> store = new ConcurrentHashMap<>();
    private final Deque<K> insertionOrder = new ArrayDeque<>();

    public GenericScoreCache(int maxCapacity) {
        this.maxCapacity = Math.max(1, maxCapacity);
    }

    public synchronized void put(K key, V value) {
        if (key == null || value == null) {
            return;
        }
        if (!store.containsKey(key) && store.size() >= maxCapacity) {
            K oldest = insertionOrder.pollFirst();
            if (oldest != null) {
                store.remove(oldest);
            }
        }
        if (!store.containsKey(key)) {
            insertionOrder.addLast(key);
        }
        store.put(key, value);
    }

    public Optional<V> get(K key) {
        return Optional.ofNullable(store.get(key));
    }

    public synchronized List<V> snapshotValues() {
        return new ArrayList<>(store.values());
    }

    public synchronized int size() {
        return store.size();
    }

    public synchronized void clear() {
        store.clear();
        insertionOrder.clear();
    }
}
