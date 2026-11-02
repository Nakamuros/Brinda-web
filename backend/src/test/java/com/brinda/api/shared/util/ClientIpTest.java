package com.brinda.api.shared.util;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ClientIpTest {

    private static final String PEER = "10.0.0.7";

    @Test
    void xffFalsificadoConEntradasExtraALaIzquierdaNoCambiaLaIpEfectiva() {
        String honest = ClientIp.resolve(List.of("203.0.113.9"), PEER, 1);
        String forged = ClientIp.resolve(List.of("1.2.3.4, 5.6.7.8, 203.0.113.9"), PEER, 1);
        String forgedOtherLine = ClientIp.resolve(List.of("9.9.9.9", "203.0.113.9"), PEER, 1);
        assertEquals("203.0.113.9", honest);
        assertEquals(honest, forged);
        assertEquals(honest, forgedOtherLine);
    }

    @Test
    void xffAusenteUsaLaDireccionDelPar() {
        assertEquals(PEER, ClientIp.resolve(List.of(), PEER, 1));
        assertEquals(PEER, ClientIp.resolve(List.of("  , "), PEER, 1));
    }

    @Test
    void conMenosEntradasQueHopsUsaLaDireccionDelPar() {
        assertEquals(PEER, ClientIp.resolve(List.of("203.0.113.9"), PEER, 2));
    }

    @Test
    void conDosHopsTomaLaSegundaDesdeLaDerecha() {
        assertEquals("198.51.100.4", ClientIp.resolve(List.of("6.6.6.6, 198.51.100.4, 172.68.1.1"), PEER, 2));
    }

    @Test
    void entradaConBasuraNoEsUnaIp() {
        assertEquals(PEER, ClientIp.resolve(List.of("1.1.1.1, <script>"), PEER, 1));
    }

    @Test
    void hopsInvalidosFallanAlConfigurar() {
        assertThrows(IllegalArgumentException.class, () -> ClientIp.configure(0));
        assertThrows(IllegalArgumentException.class, () -> ClientIp.configure(-1));
    }
}
