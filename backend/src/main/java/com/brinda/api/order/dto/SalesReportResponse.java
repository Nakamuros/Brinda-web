package com.brinda.api.order.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Ventas del panel: solo pedidos CONFIRMADOS, por fecha de confirmación (hora de Lima). Sin datos personales.
 * No hay ganancia ni costo: la base no guarda el precio de costo de los productos.
 */
public record SalesReportResponse(LocalDate from, LocalDate to, long orders, BigDecimal revenue,
                                  BigDecimal productsRevenue, BigDecimal deliveryRevenue, BigDecimal averageTicket,
                                  List<Day> days, List<TopProduct> topProducts, Inventory inventory) {

    /** Un día con ventas (los días sin pedidos no se envían). */
    public record Day(LocalDate date, long orders, BigDecimal revenue) {
    }

    public record TopProduct(String name, long units, BigDecimal revenue) {
    }

    /** Foto del inventario de hoy, valorizado al precio de venta normal (no al costo). */
    public record Inventory(long units, BigDecimal valueAtSalePrice) {
    }
}
