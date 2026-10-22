package com.brinda.api.order.service;

import com.brinda.api.catalog.model.Product;
import com.brinda.api.catalog.repository.ProductRepository;
import com.brinda.api.delivery.model.District;
import com.brinda.api.delivery.repository.DistrictRepository;
import com.brinda.api.order.config.OrderProperties;
import com.brinda.api.order.dto.CreateOrderRequest;
import com.brinda.api.order.dto.CreatedOrderResponse;
import com.brinda.api.order.model.Order;
import com.brinda.api.order.model.OrderItem;
import com.brinda.api.order.model.PaymentMethod;
import com.brinda.api.order.model.PromoType;
import com.brinda.api.order.repository.OrderRepository;
import com.brinda.api.shared.audit.AuditService;
import com.brinda.api.shared.crypto.DniCipher;
import com.brinda.api.shared.exception.BusinessRuleException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Creación del pedido público. Principios: el servidor decide precios, tarifa, total y vencimiento;
 * el stock NO se reserva (se descuenta al confirmar); no se escriben datos personales en logs.
 */
@Service
@RequiredArgsConstructor
public class OrderService {

    private static final int MAX_UNITS_PER_PRODUCT = 50;

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final DistrictRepository districtRepository;
    private final OrderCodeGenerator codeGenerator;
    private final DniCipher dniCipher;
    private final WhatsAppMessageBuilder whatsApp;
    private final OrderProperties props;
    private final AuditService auditService;
    private final Clock clock;

    @Transactional
    public CreatedOrderResponse create(CreateOrderRequest req, String ip) {
        Map<UUID, Integer> quantities = mergeItems(req);
        Map<UUID, Product> products = loadProducts(quantities);
        District district = districtRepository.findWithZoneById(req.districtId())
                .filter(District::isDeliverable)
                .orElseThrow(() -> new BusinessRuleException("No hacemos reparto a ese distrito"));

        checkAvailability(quantities, products);

        OffsetDateTime now = OffsetDateTime.now(clock);
        Order order = new Order();
        BigDecimal subtotal = BigDecimal.ZERO;
        for (Map.Entry<UUID, Integer> e : quantities.entrySet()) {
            Product p = products.get(e.getKey());
            OrderItem item = new OrderItem();
            item.setProductId(p.getId());
            item.setProductName(p.getName());
            item.setQuantity(e.getValue());
            item.setListPrice(p.getPrice());
            BigDecimal unitPrice = p.effectivePrice(now);
            item.setUnitPrice(unitPrice);
            item.setPromoType(p.isOfferActive(now) ? PromoType.OFFER : null);
            item.setSubtotal(unitPrice.multiply(BigDecimal.valueOf(e.getValue())));
            applyBuyXPayY(item, p, now);
            order.addItem(item);
            subtotal = subtotal.add(item.getSubtotal());
        }
        BigDecimal fee = district.getZone().getFee();
        BigDecimal total = subtotal.add(fee);

        order.setOrderCode(codeGenerator.next());
        order.setCustomerFirstName(clean(req.firstName()));
        order.setCustomerLastName(clean(req.lastName()));
        order.setCustomerPhone(req.phone());
        order.setCustomerDniEncrypted(dniCipher.encrypt(req.dni()));
        order.setDeliveryAddress(clean(req.address()));
        order.setDeliveryReference(blankToNull(clean(req.reference())));
        order.setDistrict(district);
        order.setSubtotalAmount(subtotal);
        order.setDeliveryFee(fee);
        order.setTotalAmount(total);
        order.setPaymentMethod(req.paymentMethod());
        order.setAdultConfirmed(true);
        order.setTermsAcceptedAt(now);
        order.setPrivacyAcceptedAt(now);
        order.setExpiresAt(now.plusMinutes(props.expirationMinutes()));
        orderRepository.save(order);

        auditService.record(null, "ORDER_CREATE", "orders", order.getOrderCode(), ip);
        return toResponse(order);
    }

    /**
     * "Lleva N paga M": solo si la promoción está activa y el cliente completa al menos un grupo.
     * La cantidad (y el stock que baja) sigue siendo la de unidades entregadas; solo cambia lo que se cobra.
     */
    private static void applyBuyXPayY(OrderItem item, Product p, OffsetDateTime now) {
        if (!p.isPromoActive(now)) {
            return;
        }
        BuyXPayYCalculator.Result r = BuyXPayYCalculator.calculate(item.getQuantity(), p.getPromoBuy(),
                p.getPromoPay(), item.getUnitPrice());
        if (r.discount().signum() > 0) {
            item.setPromoType(PromoType.BUY_X_PAY_Y);
            item.setPromoBuy(p.getPromoBuy());
            item.setPromoPay(p.getPromoPay());
            item.setPromoDiscount(r.discount());
            item.setSubtotal(r.subtotal());
        }
    }

    /** Une líneas repetidas del mismo producto y limita las unidades por producto. */
    private Map<UUID, Integer> mergeItems(CreateOrderRequest req) {
        Map<UUID, Integer> merged = new LinkedHashMap<>();
        req.items().forEach(i -> merged.merge(i.productId(), i.quantity(), Integer::sum));
        if (merged.values().stream().anyMatch(q -> q > MAX_UNITS_PER_PRODUCT)) {
            throw new BusinessRuleException("Máximo " + MAX_UNITS_PER_PRODUCT + " unidades por producto");
        }
        return merged;
    }

    private Map<UUID, Product> loadProducts(Map<UUID, Integer> quantities) {
        Map<UUID, Product> products = productRepository.findAllById(quantities.keySet()).stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));
        if (products.size() != quantities.size()) {
            throw new BusinessRuleException("Algún producto del pedido ya no existe");
        }
        return products;
    }

    /** Aviso temprano al cliente; la verificación definitiva (con bloqueo) ocurre al confirmar. */
    private void checkAvailability(Map<UUID, Integer> quantities, Map<UUID, Product> products) {
        List<String> problems = new ArrayList<>();
        quantities.forEach((id, qty) -> {
            Product p = products.get(id);
            if (!p.isAvailable() || !p.getCategory().isActive() || p.getStockQuantity() < qty) {
                problems.add(p.getName());
            }
        });
        if (!problems.isEmpty()) {
            throw new BusinessRuleException("Sin stock suficiente o no disponible: " + String.join(", ", problems));
        }
    }

    private CreatedOrderResponse toResponse(Order o) {
        List<CreatedOrderResponse.Line> lines = o.getItems().stream()
                .map(i -> new CreatedOrderResponse.Line(i.getProductName(), i.getQuantity(), i.getUnitPrice(),
                        i.getPromoDiscount(), OrderLineText.promo(i), i.getSubtotal()))
                .toList();
        String number = o.getPaymentMethod() == PaymentMethod.YAPE ? props.yapeNumber() : props.plinNumber();
        return new CreatedOrderResponse(o.getOrderCode(), o.getStatus().name(), o.getSubtotalAmount(),
                o.getDeliveryFee(), o.getTotalAmount(), o.getExpiresAt(), lines,
                new CreatedOrderResponse.Payment(o.getPaymentMethod().name(), blankToNull(number), o.getTotalAmount()),
                whatsApp.url(o));
    }

    /** Quita saltos de línea y caracteres de control (evita romper el formato del mensaje de WhatsApp). */
    private static String clean(String s) {
        return s == null ? null : s.replaceAll("\\p{Cntrl}", " ").replaceAll("\\s{2,}", " ").trim();
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
