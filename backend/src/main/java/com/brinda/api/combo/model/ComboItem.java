package com.brinda.api.combo.model;

import com.brinda.api.catalog.model.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** Composición fija del combo: solo se inserta al crearlo (el rol de la app no tiene UPDATE ni DELETE). */
@Getter
@NoArgsConstructor
@Entity
@Table(name = "combo_items")
public class ComboItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "combo_id", nullable = false, updatable = false)
    private Product combo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false, updatable = false)
    private Product product;

    @Column(nullable = false, updatable = false)
    private int quantity;

    public ComboItem(Product combo, Product product, int quantity) {
        this.combo = combo;
        this.product = product;
        this.quantity = quantity;
    }
}
