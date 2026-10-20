package com.brinda.api.order.service;

import com.brinda.api.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

/** Código corto y dictable (ej. EQ12). Sin I ni O para no confundirlas con 1 y 0. */
@Component
@RequiredArgsConstructor
public class OrderCodeGenerator {

    private static final String LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final int ATTEMPTS_PER_LENGTH = 5;

    private final OrderRepository orderRepository;
    private final SecureRandom random = new SecureRandom();

    public String next() {
        for (int digits = 2; digits <= 4; digits++) {   // si hay choques, el código crece un dígito
            for (int i = 0; i < ATTEMPTS_PER_LENGTH; i++) {
                String code = candidate(digits);
                if (!orderRepository.existsByOrderCode(code)) {
                    return code;
                }
            }
        }
        throw new IllegalStateException("No se pudo generar un código de pedido único");
    }

    private String candidate(int digits) {
        StringBuilder sb = new StringBuilder();
        sb.append(LETTERS.charAt(random.nextInt(LETTERS.length())));
        sb.append(LETTERS.charAt(random.nextInt(LETTERS.length())));
        for (int i = 0; i < digits; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
}
