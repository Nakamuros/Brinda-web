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

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    boolean existsByOrderCode(String orderCode);

    long countByStatus(OrderStatus status);

    @EntityGraph(attributePaths = {"district", "district.zone"})
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"district", "district.zone"})
    Page<Order> findAll(Pageable pageable);

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
}
