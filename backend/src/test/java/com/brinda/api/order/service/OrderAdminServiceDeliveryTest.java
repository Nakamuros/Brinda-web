package com.brinda.api.order.service;

import com.brinda.api.delivery.model.DeliveryZone;
import com.brinda.api.delivery.model.District;
import com.brinda.api.inventory.service.InventoryService;
import com.brinda.api.order.config.OrderProperties;
import com.brinda.api.order.dto.ConfirmOrderRequest;
import com.brinda.api.order.model.CustomerDocumentType;
import com.brinda.api.order.model.Order;
import com.brinda.api.order.model.OrderStatus;
import com.brinda.api.order.model.PaymentMethod;
import com.brinda.api.order.repository.OrderRepository;
import com.brinda.api.shared.audit.AuditService;
import com.brinda.api.shared.crypto.CryptoProperties;
import com.brinda.api.shared.crypto.DniCipher;
import com.brinda.api.shared.exception.BusinessRuleException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/** Delivery cobrado al confirmar y su corrección: montos finales, tope, S/ 0 explícito y auditoría sin datos personales. */
class OrderAdminServiceDeliveryTest {

    private final OrderRepository repository = mock(OrderRepository.class);
    private final InventoryService inventory = mock(InventoryService.class);
    private final AuditService audit = mock(AuditService.class);
    private final DniCipher cipher = new DniCipher(new CryptoProperties(Base64.getEncoder().encodeToString(new byte[32])));
    private final OrderAdminService service = new OrderAdminService(repository, inventory, cipher,
            mock(OrderComboContents.class), audit, new OrderProperties(20, null, null, null, null, null, null, null,
            null, new BigDecimal("100")));

    private final UUID id = UUID.randomUUID();
    private final UUID actor = UUID.randomUUID();
    private Order order;

    @BeforeEach
    void setUp() {
        DeliveryZone zone = new DeliveryZone();
        zone.setName("Zona 1");
        District district = new District();
        district.setName("Miraflores");
        district.setZone(zone);
        order = new Order();
        order.setId(id);
        order.setOrderCode("BR1234");
        order.setStatus(OrderStatus.PENDING);
        order.setDistrict(district);
        order.setSubtotalAmount(new BigDecimal("90.00"));
        order.setDeliveryFee(new BigDecimal("8.00"));
        order.setTotalAmount(new BigDecimal("98.00"));
        order.setPaymentMethod(PaymentMethod.TRANSFER);
        order.setDocumentType(CustomerDocumentType.PASSPORT);
        order.setCustomerDniEncrypted(cipher.encrypt("AB1234"));
        when(repository.lockById(id)).thenReturn(Optional.of(order));
        when(repository.findWithDistrictById(id)).thenReturn(Optional.of(order));
    }

    private static ConfirmOrderRequest fee(String amount, boolean zero) {
        return new ConfirmOrderRequest(new BigDecimal(amount), zero);
    }

    @Test
    void confirmarGuardaDeliveryYTotalFinalesYAuditaSinDatosPersonales() {
        var res = service.confirm(id, fee("12.50", false), actor, "1.1.1.1");
        assertEquals(OrderStatus.CONFIRMED, order.getStatus());
        assertEquals(new BigDecimal("12.50"), res.finalDeliveryFee());
        assertEquals(new BigDecimal("102.50"), res.finalTotal());
        assertEquals(new BigDecimal("98.00"), res.total(), "el estimado no cambia");
        verify(inventory).sell(eq(id), anyList(), eq(actor));
        verify(audit).record(actor, "ORDER_CONFIRM", "orders", "BR1234", "1.1.1.1",
                "delivery 8.00 -> 12.50, total 102.50");
    }

    @Test
    void ceroSoloConConfirmacionExplicita() {
        assertThrows(BusinessRuleException.class, () -> service.confirm(id, fee("0", false), actor, "ip"));
        verify(inventory, never()).sell(any(), anyList(), any());
        assertEquals(OrderStatus.PENDING, order.getStatus());
        assertEquals(BigDecimal.ZERO.setScale(2), service.confirm(id, fee("0.00", true), actor, "ip").finalDeliveryFee());
    }

    @Test
    void sobreElTopeNoConfirmaNada() {
        assertThrows(BusinessRuleException.class, () -> service.confirm(id, fee("100.01", false), actor, "ip"));
        verify(inventory, never()).sell(any(), anyList(), any());
        assertNull(order.getFinalDeliveryFee());
    }

    @Test
    void vencidoTambienSeConfirmaConSuDelivery() {
        order.setStatus(OrderStatus.EXPIRED);
        assertEquals(new BigDecimal("98.00"), service.confirm(id, fee("8.00", false), actor, "ip").finalTotal());
    }

    @Test
    void corregirSoloEnConfirmadosYAuditaElValorAnterior() {
        assertThrows(BusinessRuleException.class, () -> service.fixDelivery(id, fee("10", false), actor, "ip"));
        service.confirm(id, fee("12.50", false), actor, "ip");
        var res = service.fixDelivery(id, fee("15", false), actor, "ip");
        assertEquals(new BigDecimal("105.00"), res.finalTotal());
        verify(audit).record(actor, "ORDER_DELIVERY_FIX", "orders", "BR1234", "ip",
                "delivery 12.50 -> 15.00, total 105.00");
    }

    @Test
    void boletaUsaElTotalFinalYElTipoDeDocumento() {
        String before = service.receiptText(id, actor, "ip").text();
        assertTrue(before.contains("Total: S/ 98.00"), "sin confirmar: el estimado");
        service.confirm(id, fee("12.50", false), actor, "ip");
        String text = service.receiptText(id, actor, "ip").text();
        assertTrue(text.contains("Pasaporte: AB1234"), text);
        assertTrue(text.contains("Envío: S/ 12.50"), text);
        assertTrue(text.contains("Total: S/ 102.50"), text);
        assertTrue(text.contains("Pago: Transferencia"), text);
        assertFalse(text.contains("DNI"));
    }
}
