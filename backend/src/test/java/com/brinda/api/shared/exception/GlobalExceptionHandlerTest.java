package com.brinda.api.shared.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void contentTypeNoSoportadoEs415YNoUn500() {
        var r = handler.mediaType();
        assertEquals(415, r.getStatusCode().value());
        assertEquals("UNSUPPORTED_MEDIA_TYPE", r.getBody().code());
    }

    @Test
    void parametroFaltanteEs400() {
        var r = handler.badRequest();
        assertEquals(400, r.getStatusCode().value());
    }
}
