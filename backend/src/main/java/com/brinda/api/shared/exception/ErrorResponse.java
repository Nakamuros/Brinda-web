package com.brinda.api.shared.exception;

import java.time.OffsetDateTime;
import java.util.Map;

public record ErrorResponse(int status, String code, String message, Map<String, String> fields, OffsetDateTime timestamp) {

    public static ErrorResponse of(int status, String code, String message) {
        return new ErrorResponse(status, code, message, null, OffsetDateTime.now());
    }

    public static ErrorResponse of(int status, String code, String message, Map<String, String> fields) {
        return new ErrorResponse(status, code, message, fields, OffsetDateTime.now());
    }
}
