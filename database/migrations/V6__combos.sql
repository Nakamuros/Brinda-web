-- BRINDA · V6 · Combos armados de antemano ("kit pre-armado")
-- Un combo es un producto con su propio stock. Armarlo resta de los componentes y suma al combo (no es una venta).
-- La composición es fija: combo_items solo admite INSERT.

ALTER TABLE products ADD COLUMN product_type VARCHAR(10) NOT NULL DEFAULT 'PRODUCT';
ALTER TABLE products ADD CONSTRAINT ck_products_type CHECK (product_type IN ('PRODUCT', 'COMBO'));

CREATE TABLE combo_items (
    id          BIGSERIAL PRIMARY KEY,
    combo_id    UUID      NOT NULL REFERENCES products (id) ON DELETE RESTRICT,
    product_id  UUID      NOT NULL REFERENCES products (id) ON DELETE RESTRICT,
    quantity    INTEGER   NOT NULL,
    CONSTRAINT ck_combo_items_quantity CHECK (quantity > 0),
    CONSTRAINT ck_combo_items_distinct CHECK (combo_id <> product_id),
    CONSTRAINT uq_combo_items UNIQUE (combo_id, product_id)
);
CREATE INDEX idx_combo_items_product ON combo_items (product_id);

-- Historial inmutable: solo se agregan filas (sin UPDATE ni DELETE). También en setup/02_grants.sql.
GRANT SELECT, INSERT ON combo_items TO brinda_app;
GRANT USAGE, SELECT ON SEQUENCE combo_items_id_seq TO brinda_app;

-- Movimientos de armado. combo_id: a qué combo se destinó el stock consumido (COMBO_CONSUME).
ALTER TABLE stock_movements ADD COLUMN combo_id UUID REFERENCES products (id) ON DELETE RESTRICT;
CREATE INDEX idx_stock_mov_combo ON stock_movements (combo_id) WHERE combo_id IS NOT NULL;

-- COMBO_DISASSEMBLE y COMBO_RETURN quedan permitidos pero aún no se usan (desarmar queda para después).
ALTER TABLE stock_movements DROP CONSTRAINT ck_mov_type;
ALTER TABLE stock_movements ADD CONSTRAINT ck_mov_type CHECK (movement_type IN
    ('SALE', 'RESTOCK', 'ADJUSTMENT', 'CANCEL_RETURN',
     'COMBO_BUILD', 'COMBO_CONSUME', 'COMBO_DISASSEMBLE', 'COMBO_RETURN'));

ALTER TABLE stock_movements DROP CONSTRAINT ck_mov_sign;
ALTER TABLE stock_movements ADD CONSTRAINT ck_mov_sign CHECK (
    (movement_type IN ('SALE', 'COMBO_CONSUME', 'COMBO_DISASSEMBLE') AND quantity_change < 0) OR
    (movement_type IN ('RESTOCK', 'CANCEL_RETURN', 'COMBO_BUILD', 'COMBO_RETURN') AND quantity_change > 0) OR
    (movement_type = 'ADJUSTMENT')
);

-- Un movimiento COMBO_CONSUME siempre indica el combo de destino
ALTER TABLE stock_movements ADD CONSTRAINT ck_mov_combo CHECK (movement_type <> 'COMBO_CONSUME' OR combo_id IS NOT NULL);

-- Categoría de referencia (también en producción)
INSERT INTO categories (name, slug, description, display_order)
VALUES ('Combos y promociones', 'combos-y-promociones', 'Combos armados y promociones', 4)
ON CONFLICT DO NOTHING;
