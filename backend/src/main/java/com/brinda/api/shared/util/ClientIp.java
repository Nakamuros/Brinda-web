package com.brinda.api.shared.util;

import jakarta.servlet.http.HttpServletRequest;

/** Usa getRemoteAddr(): detrás del proxy lo corrige server.forward-headers-strategy=framework (prod). */
public final class ClientIp {

    private ClientIp() {
    }

    public static String of(HttpServletRequest request) {
        return request.getRemoteAddr();
    }
}
