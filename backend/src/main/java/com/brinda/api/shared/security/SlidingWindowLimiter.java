package com.brinda.api.shared.security;

import java.time.Duration;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** Límite de peticiones por clave en ventana deslizante, en memoria (una instancia del backend). */
public class SlidingWindowLimiter {

    private static final int PURGE_THRESHOLD = 10_000;

    private final Map<String, Deque<Long>> hits = new ConcurrentHashMap<>();

    public boolean tryAcquire(String key, int limit, Duration window) {
        long now = System.nanoTime();
        long cutoff = now - window.toNanos();
        if (hits.size() > PURGE_THRESHOLD) {
            hits.values().removeIf(d -> {
                synchronized (d) {
                    return d.isEmpty() || d.peekLast() < cutoff;
                }
            });
        }
        Deque<Long> deque = hits.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (deque) {
            while (!deque.isEmpty() && deque.peekFirst() < cutoff) {
                deque.pollFirst();
            }
            if (deque.size() >= limit) {
                return false;
            }
            deque.addLast(now);
            return true;
        }
    }
}
