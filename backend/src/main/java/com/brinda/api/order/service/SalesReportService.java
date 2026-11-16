package com.brinda.api.order.service;

import com.brinda.api.catalog.repository.ProductRepository;
import com.brinda.api.order.dto.SalesReportResponse;
import com.brinda.api.order.model.OrderStatus;
import com.brinda.api.order.repository.OrderRepository;
import com.brinda.api.shared.exception.BusinessRuleException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Clock;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/** Resumen de ventas para el panel. Cuenta solo pedidos confirmados (los anulados dejan de contar). */
@Service
@RequiredArgsConstructor
public class SalesReportService {

    static final ZoneId LIMA = ZoneId.of("America/Lima");
    private static final int DEFAULT_DAYS = 30;
    private static final int MAX_DAYS = 366;
    private static final int TOP_PRODUCTS = 10;

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final Clock clock;

    /** Rango inclusivo de fechas de Lima. Sin fechas: los últimos 30 días hasta hoy. */
    @Transactional(readOnly = true)
    public SalesReportResponse report(LocalDate from, LocalDate to) {
        LocalDate end = to != null ? to : LocalDate.now(clock.withZone(LIMA));
        LocalDate start = from != null ? from : end.minusDays(DEFAULT_DAYS - 1L);
        if (start.isAfter(end)) {
            throw new BusinessRuleException("La fecha inicial no puede ser posterior a la final");
        }
        if (ChronoUnit.DAYS.between(start, end) >= MAX_DAYS) {
            throw new BusinessRuleException("El rango máximo es de " + MAX_DAYS + " días");
        }
        OffsetDateTime since = start.atStartOfDay(LIMA).toOffsetDateTime();
        OffsetDateTime until = end.plusDays(1).atStartOfDay(LIMA).toOffsetDateTime();

        List<SalesReportResponse.Day> days = byDay(
                orderRepository.confirmedTotals(OrderStatus.CONFIRMED, since, until));
        long orders = days.stream().mapToLong(SalesReportResponse.Day::orders).sum();
        BigDecimal revenue = days.stream().map(SalesReportResponse.Day::revenue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal delivery = orderRepository.confirmedDeliveryFees(OrderStatus.CONFIRMED, since, until);
        List<SalesReportResponse.TopProduct> top = orderRepository
                .topProducts(OrderStatus.CONFIRMED, since, until, PageRequest.of(0, TOP_PRODUCTS)).stream()
                .map(r -> new SalesReportResponse.TopProduct((String) r[0], ((Number) r[1]).longValue(),
                        (BigDecimal) r[2]))
                .toList();
        Object[] stock = productRepository.inventoryTotals().get(0);

        return new SalesReportResponse(start, end, orders, revenue, revenue.subtract(delivery), delivery,
                average(revenue, orders), days, top,
                new SalesReportResponse.Inventory(((Number) stock[0]).longValue(), (BigDecimal) stock[1]));
    }

    /** Agrupa (fecha de confirmación, total) por día de Lima, en orden cronológico. */
    static List<SalesReportResponse.Day> byDay(List<Object[]> confirmedAtAndTotal) {
        Map<LocalDate, SalesReportResponse.Day> days = new TreeMap<>();
        for (Object[] row : confirmedAtAndTotal) {
            LocalDate date = ((OffsetDateTime) row[0]).atZoneSameInstant(LIMA).toLocalDate();
            BigDecimal total = (BigDecimal) row[1];
            days.merge(date, new SalesReportResponse.Day(date, 1, total),
                    (a, b) -> new SalesReportResponse.Day(date, a.orders() + 1, a.revenue().add(b.revenue())));
        }
        return List.copyOf(days.values());
    }

    static BigDecimal average(BigDecimal revenue, long orders) {
        return orders == 0 ? BigDecimal.ZERO.setScale(2)
                : revenue.divide(BigDecimal.valueOf(orders), 2, RoundingMode.HALF_UP);
    }
}
