package com.brinda.api.order;

import com.brinda.api.order.dto.CreateOrderRequest;
import com.brinda.api.order.model.CustomerDocumentType;
import com.brinda.api.order.model.PaymentMethod;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static com.brinda.api.order.model.CustomerDocumentType.CE;
import static com.brinda.api.order.model.CustomerDocumentType.DNI;
import static com.brinda.api.order.model.CustomerDocumentType.PASSPORT;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CreateOrderRequestDocumentTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    private CreateOrderRequest with(CustomerDocumentType type, String number) {
        return new CreateOrderRequest(List.of(new CreateOrderRequest.Item(UUID.randomUUID(), 1)),
                "Ana", "Pérez", "987654321", type, number, "Av. Larco 123", null, 1L, PaymentMethod.TRANSFER,
                true, true, true, false);
    }

    private boolean invalido(CustomerDocumentType type, String number) {
        return validator.validate(with(type, number)).stream()
                .anyMatch(v -> v.getPropertyPath().toString().matches("documentNumber|documentType"));
    }

    @Test
    void documentoEsObligatorioSiempre() {
        assertTrue(invalido(DNI, null));
        assertTrue(invalido(DNI, ""));
        assertTrue(invalido(DNI, "   "));
        assertTrue(invalido(null, "12345678"));
    }

    @Test
    void dniDebeTenerOchoDigitos() {
        assertTrue(invalido(DNI, "1234567"));
        assertTrue(invalido(DNI, "123456789"));
        assertTrue(invalido(DNI, "1234567a"));
        assertFalse(invalido(DNI, "12345678"));
    }

    @Test
    void ceDeOchoADoceAlfanumericos() {
        assertTrue(invalido(CE, "1234567"));
        assertTrue(invalido(CE, "1234567890123"));
        assertTrue(invalido(CE, "12345-678"));
        assertFalse(invalido(CE, "a12345678"));
    }

    @Test
    void pasaporteDeSeisADoceAlfanumericos() {
        assertTrue(invalido(PASSPORT, "12345"));
        assertTrue(invalido(PASSPORT, "1234567890123"));
        assertTrue(invalido(PASSPORT, "AB 1234"));
        assertFalse(invalido(PASSPORT, "AB1234"));
        assertFalse(invalido(PASSPORT, "x12345678901"));
    }
}
