package com.brinda.api.order.service;

import com.brinda.api.order.model.OrderStatus;
import com.brinda.api.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

/** Pasa a EXPIRED los pedidos PENDING cuyo plazo venció. Idempotente: es seguro si corre más de una vez. */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderExpirationJob {

    private final OrderRepository orderRepository;

    @Scheduled(fixedDelayString = "PT1M", initialDelayString = "PT30S")
    @Transactional
    public void expirePendingOrders() {
        int expired = orderRepository.expirePending(OrderStatus.PENDING, OrderStatus.EXPIRED, OffsetDateTime.now());
        if (expired > 0) {
            log.info("Pedidos vencidos: {}", expired);
        }
    }
}
