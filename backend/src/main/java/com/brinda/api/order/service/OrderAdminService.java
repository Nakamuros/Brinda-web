package com.brinda.api.order.service;

import com.brinda.api.catalog.dto.PageResponse;
import com.brinda.api.inventory.service.InventoryService;
import com.brinda.api.inventory.service.StockLine;
import com.brinda.api.order.dto.CancelOrderRequest;
import com.brinda.api.order.dto.OrderDetailResponse;
import com.brinda.api.order.dto.OrderSummaryResponse;
import com.brinda.api.order.dto.PendingCountResponse;
import com.brinda.api.order.dto.TextResponse;
import com.brinda.api.order.model.Order;
import com.brinda.api.order.model.OrderItem;
import com.brinda.api.order.model.OrderStatus;
import com.brinda.api.order.repository.OrderRepository;
import com.brinda.api.shared.audit.AuditService;
import com.brinda.api.shared.crypto.DniCipher;
import com.brinda.api.shared.exception.BusinessRuleException;
import com.brinda.api.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/** Gestión de pedidos desde el panel: lista, detalle, confirmar ("Finalizada"), cancelar y textos para copiar. */
@Service
@RequiredArgsConstructor
@Transactional
public class OrderAdminService {

    private final OrderRepository orderRepository;
    private final InventoryService inventoryService;
    private final DniCipher dniCipher;
    private final OrderComboContents comboContents;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public PageResponse<OrderSummaryResponse> list(OrderStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        var result = status == null ? orderRepository.findAll(pageable) : orderRepository.findByStatus(status, pageable);
        return PageResponse.of(result, OrderSummaryResponse::from);
    }

    @Transactional(readOnly = true)
    public PendingCountResponse pendingCount() {
        return new PendingCountResponse(orderRepository.countByStatus(OrderStatus.PENDING));
    }

    /** Muestra datos personales (DNI descifrado): deja huella en la auditoría. */
    public OrderDetailResponse detail(UUID id, UUID actor, String ip) {
        Order o = find(id);
        auditService.record(actor, "ORDER_VIEW", "orders", o.getOrderCode(), ip);
        return OrderDetailResponse.from(o, dni(o));
    }

    /**
     * "Finalizada": confirma la venta, descuenta el stock y escribe los movimientos, todo en una transacción.
     * Admite PENDING y también EXPIRED (el pago pudo llegar tarde). Si el stock ya no alcanza, no se confirma nada.
     */
    public OrderDetailResponse confirm(UUID id, UUID actor, String ip) {
        Order o = lock(id);
        if (o.getStatus() != OrderStatus.PENDING && o.getStatus() != OrderStatus.EXPIRED) {
            throw new BusinessRuleException("Solo se pueden confirmar pedidos pendientes o vencidos (estado actual: "
                    + o.getStatus() + ")");
        }
        inventoryService.sell(o.getId(), lines(o), actor);
        o.setStatus(OrderStatus.CONFIRMED);
        o.setConfirmedAt(OffsetDateTime.now());
        o.setConfirmedBy(actor);
        auditService.record(actor, "ORDER_CONFIRM", "orders", o.getOrderCode(), ip);
        return OrderDetailResponse.from(find(id), dni(o));
    }

    /** Cancela con motivo. Si la venta ya estaba confirmada, devuelve el stock (CANCEL_RETURN). Nada se borra. */
    public OrderDetailResponse cancel(UUID id, CancelOrderRequest req, UUID actor, String ip) {
        Order o = lock(id);
        String reason = req.reason().trim();
        switch (o.getStatus()) {
            case CANCELLED -> throw new BusinessRuleException("El pedido ya está cancelado");
            case CONFIRMED -> inventoryService.returnStock(o.getId(), lines(o), "Venta anulada: " + reason, actor);
            default -> { /* PENDING / EXPIRED: no hubo descuento de stock */ }
        }
        o.setStatus(OrderStatus.CANCELLED);
        o.setCancelReason(reason);
        auditService.record(actor, "ORDER_CANCEL", "orders", o.getOrderCode(), ip);
        return OrderDetailResponse.from(find(id), dni(o));
    }

    /** "Copiar datos de entrega": se pega tal cual al contratar el motorizado (sin DNI). */
    @Transactional(readOnly = true)
    public TextResponse deliveryText(UUID id) {
        Order o = find(id);
        StringBuilder sb = new StringBuilder()
                .append("Pedido ").append(o.getOrderCode()).append('\n')
                .append("Nombre: ").append(o.customerFullName()).append('\n')
                .append("Celular: ").append(o.getCustomerPhone()).append('\n')
                .append("Dirección: ").append(o.getDeliveryAddress()).append('\n');
        if (o.getDeliveryReference() != null) {
            sb.append("Referencia: ").append(o.getDeliveryReference()).append('\n');
        }
        sb.append("Distrito: ").append(o.getDistrict().getName());
        return new TextResponse(sb.toString());
    }

    /** "Copiar datos para boleta": nombre, DNI, productos y total. */
    public TextResponse receiptText(UUID id, UUID actor, String ip) {
        Order o = find(id);
        auditService.record(actor, "ORDER_COPY_RECEIPT", "orders", o.getOrderCode(), ip);
        StringBuilder sb = new StringBuilder()
                .append("Cliente: ").append(o.customerFullName()).append('\n');
        String dni = dni(o);
        if (dni != null) {
            sb.append("DNI: ").append(dni).append('\n');
        }
        sb.append("Productos:\n");
        Map<UUID, List<String>> contents = comboContents.of(o.getItems());
        for (OrderItem i : o.getItems()) {
            sb.append("- ").append(OrderLineText.line(i, contents.get(i.getProductId())))
                    .append("  S/ ").append(WhatsAppMessageBuilder.money(i.getSubtotal())).append('\n');
        }
        sb.append("Envío: S/ ").append(WhatsAppMessageBuilder.money(o.getDeliveryFee())).append('\n')
                .append("Total: S/ ").append(WhatsAppMessageBuilder.money(o.getTotalAmount()));
        return new TextResponse(sb.toString());
    }

    private Order find(UUID id) {
        return orderRepository.findWithDistrictById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));
    }

    private Order lock(UUID id) {
        return orderRepository.lockById(id).orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));
    }

    private List<StockLine> lines(Order o) {
        return o.getItems().stream().map(i -> new StockLine(i.getProductId(), i.getQuantity())).toList();
    }

    private String dni(Order o) {
        return o.getCustomerDniEncrypted() == null ? null : dniCipher.decrypt(o.getCustomerDniEncrypted());
    }
}
