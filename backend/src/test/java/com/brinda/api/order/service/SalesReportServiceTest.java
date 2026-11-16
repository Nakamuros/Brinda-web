package com.brinda.api.order.service;

import com.brinda.api.catalog.repository.ProductRepository;
import com.brinda.api.order.dto.SalesReportResponse;
import com.brinda.api.order.model.OrderStatus;
import com.brinda.api.order.repository.OrderRepository;
import com.brinda.api.shared.exception.BusinessRuleException;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SalesReportServiceTest {

    private final OrderRepository orders = mock(OrderRepository.class);
    private final ProductRepository products = mock(ProductRepository.class);
    // 2026-11-16 01:30 UTC = 2026-11-15 20:30 en Lima: "hoy" debe ser el 15.
    private final Clock clock = Clock.fixed(Instant.parse("2026-11-16T01:30:00Z"), ZoneOffset.UTC);
    private final SalesReportService service = new SalesReportService(orders, products, clock);

    private static Object[] row(String confirmedAt, String total) {
        return new Object[]{OffsetDateTime.parse(confirmedAt), new BigDecimal(total)};
    }

    @Test
    void agrupaPorDiaDeLimaYNoPorDiaUtc() {
        List<SalesReportResponse.Day> days = SalesReportService.byDay(List.of(
                row("2026-11-15T04:30:00Z", "50.00"),   // 14 nov 23:30 en Lima
                row("2026-11-15T15:00:00Z", "30.00"),   // 15 nov 10:00 en Lima
                row("2026-11-16T03:00:00Z", "20.50"))); // 15 nov 22:00 en Lima
        assertEquals(List.of(
                new SalesReportResponse.Day(LocalDate.of(2026, 11, 14), 1, new BigDecimal("50.00")),
                new SalesReportResponse.Day(LocalDate.of(2026, 11, 15), 2, new BigDecimal("50.50"))), days);
    }

    @Test
    void ticketPromedioRedondeadoYCeroSinPedidos() {
        assertEquals(new BigDecimal("33.33"), SalesReportService.average(new BigDecimal("100.00"), 3));
        assertEquals(new BigDecimal("0.00"), SalesReportService.average(BigDecimal.ZERO, 0));
    }

    @Test
    void sinFechasUsaLosUltimos30DiasDeLimaYSoloConfirmados() {
        OffsetDateTime since = OffsetDateTime.parse("2026-10-17T00:00:00-05:00");
        OffsetDateTime until = OffsetDateTime.parse("2026-11-16T00:00:00-05:00");
        when(orders.confirmedTotals(OrderStatus.CONFIRMED, since, until))
                .thenReturn(List.of(row("2026-11-15T15:00:00Z", "36.00"), row("2026-11-15T16:00:00Z", "64.00")));
        when(orders.confirmedDeliveryFees(OrderStatus.CONFIRMED, since, until)).thenReturn(new BigDecimal("12.00"));
        when(orders.topProducts(eq(OrderStatus.CONFIRMED), eq(since), eq(until), any(Pageable.class)))
                .thenReturn(List.<Object[]>of(new Object[]{"Pisco", 3L, new BigDecimal("88.00")}));
        when(products.inventoryTotals()).thenReturn(List.<Object[]>of(new Object[]{40L, new BigDecimal("1500.00")}));

        SalesReportResponse r = service.report(null, null);

        assertEquals(LocalDate.of(2026, 10, 17), r.from());
        assertEquals(LocalDate.of(2026, 11, 15), r.to());
        assertEquals(2, r.orders());
        assertEquals(new BigDecimal("100.00"), r.revenue());
        assertEquals(new BigDecimal("12.00"), r.deliveryRevenue());
        assertEquals(new BigDecimal("88.00"), r.productsRevenue());
        assertEquals(new BigDecimal("50.00"), r.averageTicket());
        assertEquals(new SalesReportResponse.TopProduct("Pisco", 3, new BigDecimal("88.00")), r.topProducts().get(0));
        assertEquals(new SalesReportResponse.Inventory(40, new BigDecimal("1500.00")), r.inventory());
    }

    @Test
    void rechazaRangosInvertidosODemasiadoLargos() {
        assertThrows(BusinessRuleException.class,
                () -> service.report(LocalDate.of(2026, 11, 2), LocalDate.of(2026, 11, 1)));
        assertThrows(BusinessRuleException.class,
                () -> service.report(LocalDate.of(2025, 1, 1), LocalDate.of(2026, 11, 1)));
    }
}
