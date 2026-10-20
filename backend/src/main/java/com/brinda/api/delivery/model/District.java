package com.brinda.api.delivery.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "districts")
public class District {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "zone_id", nullable = false)
    private DeliveryZone zone;

    @Column(nullable = false, unique = true, length = 80)
    private String name;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    /** Un distrito solo recibe pedidos si él y su zona están activos. */
    public boolean isDeliverable() {
        return active && zone.isActive();
    }
}
