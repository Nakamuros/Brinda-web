package com.brinda.api.inventory.service;

import com.brinda.api.catalog.dto.AdminProductResponse;
import com.brinda.api.catalog.dto.PageResponse;
import com.brinda.api.catalog.model.Product;
import com.brinda.api.catalog.repository.ProductRepository;
import com.brinda.api.inventory.dto.AdjustRequest;
import com.brinda.api.inventory.dto.MovementResponse;
import com.brinda.api.inventory.dto.RestockBatchRequest;
import com.brinda.api.inventory.dto.RestockRequest;
import com.brinda.api.inventory.model.MovementType;
import com.brinda.api.inventory.model.StockMovement;
import com.brinda.api.inventory.repository.StockMovementRepository;
import com.brinda.api.shared.audit.AuditService;
import com.brinda.api.shared.exception.BusinessRuleException;
import com.brinda.api.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Único lugar donde cambia el stock. Toda variación bloquea la fila del producto
 * (SELECT ... FOR UPDATE), valida que no quede negativa y escribe su movimiento en la misma transacción.
 */
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final ProductRepository productRepository;
    private final StockMovementRepository movementRepository;
    private final AuditService auditService;
    private final Clock clock;

    // ---------- Panel: reposición y ajustes ----------

    @Transactional
    public MovementResponse restock(UUID productId, RestockRequest req, UUID actor, String ip) {
        Product p = lockOne(productId);
        int before = p.getStockQuantity();
        StockMovement m = apply(p, MovementType.RESTOCK, req.quantity(), blankToNull(req.reason()), null, actor);
        auditService.record(actor, "STOCK_RESTOCK", "products", productId.toString(), ip,
                "stock " + before + " -> " + m.getStockAfter());
        return MovementResponse.from(m);
    }

    @Transactional
    public MovementResponse adjust(UUID productId, AdjustRequest req, UUID actor, String ip) {
        if (req.quantityChange() == 0) {
            throw new BusinessRuleException("El ajuste no puede ser cero");
        }
        Product p = lockOne(productId);
        int before = p.getStockQuantity();
        StockMovement m = apply(p, MovementType.ADJUSTMENT, req.quantityChange(), req.reason().trim(), null, actor);
        auditService.record(actor, "STOCK_ADJUST", "products", productId.toString(), ip,
                "stock " + before + " -> " + m.getStockAfter());
        return MovementResponse.from(m);
    }

    /** Recepción de mercadería: todo o nada. Bloquea las filas en orden fijo de id y escribe un RESTOCK por línea. */
    @Transactional
    public List<MovementResponse> restockBatch(RestockBatchRequest req, UUID actor, String ip) {
        List<StockLine> lines = req.lines().stream()
                .map(l -> new StockLine(l.productId(), l.quantity())).toList();
        if (lines.stream().map(StockLine::productId).distinct().count() != lines.size()) {
            throw new BusinessRuleException("Hay productos repetidos en la recepción");
        }
        Map<UUID, Product> locked = lockAll(lines);
        String reason = blankToNull(req.reference());
        List<MovementResponse> result = lines.stream()
                .map(l -> MovementResponse.from(
                        apply(locked.get(l.productId()), MovementType.RESTOCK, l.quantity(), reason, null, actor)))
                .toList();
        int units = lines.stream().mapToInt(StockLine::quantity).sum();
        auditService.record(actor, "STOCK_RESTOCK_BATCH", "products", null, ip,
                "lines " + lines.size() + ", units +" + units);
        return result;
    }

    @Transactional(readOnly = true)
    public PageResponse<MovementResponse> movements(UUID productId, int page, int size) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Producto no encontrado");
        }
        var pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100));
        return PageResponse.of(movementRepository.findByProductIdOrderByCreatedAtDescIdDesc(productId, pageable),
                MovementResponse::from);
    }

    /** Productos agotados o en el mínimo (o por debajo): alimentan la insignia de alerta del panel. */
    @Transactional(readOnly = true)
    public List<AdminProductResponse> alerts() {
        OffsetDateTime now = OffsetDateTime.now(clock);
        return productRepository.findLowStock().stream().map(p -> AdminProductResponse.from(p, now)).toList();
    }

    // ---------- Uso interno (módulo order) ----------

    /** Descuenta todo el pedido o nada: si una línea no alcanza, lanza error y la transacción se revierte. */
    @Transactional(propagation = Propagation.MANDATORY)
    public void sell(UUID orderId, List<StockLine> lines, UUID actor) {
        Map<UUID, Product> locked = lockAll(lines);
        String shortage = lines.stream()
                .filter(l -> locked.get(l.productId()).getStockQuantity() < l.quantity())
                .map(l -> {
                    Product p = locked.get(l.productId());
                    return p.getName() + " (disponible " + p.getStockQuantity() + ", pedido " + l.quantity() + ")";
                })
                .collect(Collectors.joining("; "));
        if (!shortage.isEmpty()) {
            throw new BusinessRuleException("Stock insuficiente: " + shortage);
        }
        for (StockLine l : lines) {
            apply(locked.get(l.productId()), MovementType.SALE, -l.quantity(), null, orderId, actor);
        }
    }

    /** Devuelve al stock lo vendido cuando se anula una venta ya confirmada. */
    @Transactional(propagation = Propagation.MANDATORY)
    public void returnStock(UUID orderId, List<StockLine> lines, String reason, UUID actor) {
        Map<UUID, Product> locked = lockAll(lines);
        for (StockLine l : lines) {
            apply(locked.get(l.productId()), MovementType.CANCEL_RETURN, l.quantity(), reason, orderId, actor);
        }
    }

    /**
     * Arma {@code units} combos: resta units × cantidad de cada componente (COMBO_CONSUME) y suma units al combo
     * (COMBO_BUILD). No es una venta. Todo o nada: si a algún componente no le alcanza no cambia nada.
     * Bloquea combo y componentes juntos, en orden fijo de id. Devuelve el detalle de lo consumido (auditoría).
     */
    @Transactional(propagation = Propagation.MANDATORY)
    public String buildCombo(UUID comboId, int units, List<StockLine> perCombo, String reason, UUID actor) {
        List<UUID> ids = new java.util.ArrayList<>(perCombo.stream().map(StockLine::productId).toList());
        ids.add(comboId);
        Map<UUID, Product> locked = lockIds(ids.stream().distinct().toList());
        String shortage = perCombo.stream()
                .filter(l -> locked.get(l.productId()).getStockQuantity() < (long) l.quantity() * units)
                .map(l -> {
                    Product p = locked.get(l.productId());
                    return p.getName() + " (necesitas " + (long) l.quantity() * units + ", hay " + p.getStockQuantity() + ")";
                })
                .collect(Collectors.joining("; "));
        if (!shortage.isEmpty()) {
            throw new BusinessRuleException("Stock insuficiente para armar " + units + " combo(s): " + shortage);
        }
        for (StockLine l : perCombo) {
            apply(locked.get(l.productId()), MovementType.COMBO_CONSUME, -l.quantity() * units, reason, null, actor, comboId);
        }
        apply(locked.get(comboId), MovementType.COMBO_BUILD, units, reason, null, actor);
        return perCombo.stream()
                .map(l -> locked.get(l.productId()).getName() + " x" + l.quantity() * units)
                .collect(Collectors.joining(", "));
    }

    // ---------- Internos ----------

    private Product lockOne(UUID id) {
        return productRepository.lockById(id).orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
    }

    private Map<UUID, Product> lockAll(List<StockLine> lines) {
        return lockIds(lines.stream().map(StockLine::productId).distinct().toList());
    }

    private Map<UUID, Product> lockIds(List<UUID> ids) {
        Map<UUID, Product> locked = productRepository.lockAllByIdIn(ids).stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));
        if (locked.size() != ids.size()) {
            throw new BusinessRuleException("Algún producto del pedido ya no existe");
        }
        return locked;
    }

    private StockMovement apply(Product p, MovementType type, int change, String reason, UUID orderId, UUID actor) {
        return apply(p, type, change, reason, orderId, actor, null);
    }

    private StockMovement apply(Product p, MovementType type, int change, String reason, UUID orderId, UUID actor,
                                UUID comboId) {
        int newStock = p.getStockQuantity() + change;
        if (newStock < 0) {
            throw new BusinessRuleException("El stock no puede quedar negativo (stock actual: "
                    + p.getStockQuantity() + ")");
        }
        p.setStockQuantity(newStock);
        return movementRepository.save(new StockMovement(p.getId(), orderId, actor, type, change, newStock, reason, comboId));
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
