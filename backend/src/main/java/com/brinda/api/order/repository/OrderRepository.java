package com.brinda.api.order.repository;

import com.brinda.api.order.model.Order;
import com.brinda.api.order.model.OrderStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    boolean existsByOrderCode(String orderCode);

    long countByStatus(OrderStatus status);

    /** Lista del panel: filtros opcionales por estado y por consentimiento de promociones (null = todos). */
    @EntityGraph(attributePaths = {"district", "district.zone"})
    @Query("select o from Order o where (:status is null or o.status = :status) "
            + "and (:marketing is null or o.marketingConsent = :marketing)")
    Page<Order> search(@Param("status") OrderStatus status, @Param("marketing") Boolean marketing,
                       Pageable pageable);

    @EntityGraph(attributePaths = {"district", "district.zone"})
    Optional<Order> findWithDistrictById(UUID id);

    @EntityGraph(attributePaths = {"district", "district.zone"})
    Optional<Order> findWithDistrictByOrderCode(String orderCode);

    /** Serializa confirmar/cancelar sobre el mismo pedido. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select o from Order o where o.id = :id")
    Optional<Order> lockById(@Param("id") UUID id);

    @Modifying(clearAutomatically = true)
    @Query("update Order o set o.status = :expired where o.status = :pending and o.expiresAt < :now")
    int expirePending(@Param("pending") OrderStatus pending, @Param("expired") OrderStatus expired,
                      @Param("now") OffsetDateTime now);

    /** Ventas: (confirmedAt, total cobrado) de cada pedido confirmado en [since, until). Sin total final: el estimado. */
    @Query("select o.confirmedAt, coalesce(o.finalTotalAmount, o.totalAmount) from Order o "
            + "where o.status = :status and o.confirmedAt >= :since and o.confirmedAt < :until")
    List<Object[]> confirmedTotals(@Param("status") OrderStatus status, @Param("since") OffsetDateTime since,
                                   @Param("until") OffsetDateTime until);

    /** Delivery cobrado (el final; en confirmados antiguos, la tarifa base). */
    @Query("select coalesce(sum(coalesce(o.finalDeliveryFee, o.deliveryFee)), 0) from Order o "
            + "where o.status = :status and o.confirmedAt >= :since and o.confirmedAt < :until")
    BigDecimal confirmedDeliveryFees(@Param("status") OrderStatus status, @Param("since") OffsetDateTime since,
                                     @Param("until") OffsetDateTime until);

    /** Ventas: (nombre, unidades, importe) por producto, del que más vendió al que menos. */
    @Query("select i.productName, sum(i.quantity), sum(i.subtotal) from OrderItem i "
            + "where i.order.status = :status and i.order.confirmedAt >= :since and i.order.confirmedAt < :until "
            + "group by i.productName order by sum(i.subtotal) desc")
    List<Object[]> topProducts(@Param("status") OrderStatus status, @Param("since") OffsetDateTime since,
                               @Param("until") OffsetDateTime until, Pageable pageable);
}
