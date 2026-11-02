package com.brinda.api.shared.util;

import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletRequestWrapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.regex.Pattern;

/**
 * IP del cliente que no se puede falsificar. Spring (forward-headers-strategy=framework) reescribe getRemoteAddr()
 * con la entrada MÁS A LA IZQUIERDA de X-Forwarded-For, que controla el cliente. Aquí se desenvuelve la petición
 * hasta la original y se cuentan las entradas DESDE LA DERECHA: la {@code hops}-ésima la escribió un proxy propio.
 * Si hay menos entradas que hops (o ninguna), se usa la dirección del par TCP; nunca una entrada del cliente.
 * Con más entradas, las de más a la izquierda se ignoran.
 */
@Slf4j
public final class ClientIp {

    private static final String XFF = "X-Forwarded-For";
    private static final Pattern IP_LIKE = Pattern.compile("^[0-9a-fA-F:.]{2,45}$");

    // shortcut: estado estático para no tocar los ~35 llamadores; se fija una vez al arrancar (ClientIpConfig).
    private static volatile int hops = 1;

    private ClientIp() {
    }

    public static void configure(int trustedProxyHops) {
        if (trustedProxyHops < 1) {
            throw new IllegalArgumentException("TRUSTED_PROXY_HOPS debe ser >= 1");
        }
        hops = trustedProxyHops;
    }

    public static String of(HttpServletRequest request) {
        HttpServletRequest raw = unwrap(request);
        List<String> values = Collections.list(raw.getHeaders(XFF));
        // Solo conteo, nunca las IPs: sirve para comprobar cuántos saltos trae la cadena real (DEBUG, apagado por defecto).
        log.debug("X-Forwarded-For: {} entradas, hops configurados: {}", entries(values).size(), hops);
        return resolve(values, raw.getRemoteAddr(), hops);
    }

    /** Núcleo puro (testeable): {@code xffValues} son las líneas de cabecera tal como llegaron. */
    static String resolve(List<String> xffValues, String peerAddr, int trustedHops) {
        List<String> entries = entries(xffValues);
        if (entries.size() < trustedHops) {
            return peerAddr;
        }
        String candidate = entries.get(entries.size() - trustedHops);
        return IP_LIKE.matcher(candidate).matches() ? candidate : peerAddr;
    }

    private static List<String> entries(List<String> xffValues) {
        List<String> out = new ArrayList<>();
        for (String line : xffValues) {
            for (String part : line.split(",")) {
                String t = part.trim();
                if (!t.isEmpty()) {
                    out.add(t);
                }
            }
        }
        return out;
    }

    /** ForwardedHeaderFilter y Spring Security envuelven la petición y esconden la cabecera original. */
    private static HttpServletRequest unwrap(HttpServletRequest request) {
        ServletRequest current = request;
        while (current instanceof ServletRequestWrapper wrapper && wrapper.getRequest() instanceof HttpServletRequest inner) {
            current = inner;
        }
        return (HttpServletRequest) current;
    }
}
