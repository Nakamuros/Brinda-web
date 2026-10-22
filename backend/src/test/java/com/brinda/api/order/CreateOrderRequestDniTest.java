package com.brinda.api.order;

import com.brinda.api.order.dto.CreateOrderRequest;
import com.brinda.api.order.model.PaymentMethod;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CreateOrderRequestDniTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    private CreateOrderRequest withDni(String dni) {
        return new CreateOrderRequest(List.of(new CreateOrderRequest.Item(UUID.randomUUID(), 1)),
                "Ana", "Pérez", "987654321", dni, "Av. Larco 123", null, 1L, PaymentMethod.YAPE, true, true, true);
    }

    private boolean dniInvalido(String dni) {
        return validator.validate(withDni(dni)).stream().anyMatch(v -> v.getPropertyPath().toString().equals("dni"));
    }

    @Test
    void dniEsObligatorioSiempre() {
        assertTrue(dniInvalido(null));
        assertTrue(dniInvalido(""));
        assertTrue(dniInvalido("   "));
    }

    @Test
    void dniDebeTenerOchoDigitos() {
        assertTrue(dniInvalido("1234567"));
        assertTrue(dniInvalido("123456789"));
        assertTrue(dniInvalido("1234567a"));
        assertEquals(false, dniInvalido("12345678"));
    }
}
