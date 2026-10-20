-- BRINDA · V7 · Promoción "lleva N, paga M" (2x1, 3x2...) sobre el mismo producto
-- Promoción activa = promo_buy y promo_pay completos y (promo_ends_at IS NULL OR promo_ends_at > now()).
-- Es excluyente con la oferta de precio (discount_price) en el mismo producto.

ALTER TABLE products ADD COLUMN promo_buy     SMALLINT;
ALTER TABLE products ADD COLUMN promo_pay     SMALLINT;
ALTER TABLE products ADD COLUMN promo_ends_at TIMESTAMPTZ;

ALTER TABLE products ADD CONSTRAINT ck_products_promo CHECK (
    (promo_buy IS NULL AND promo_pay IS NULL AND promo_ends_at IS NULL) OR
    (promo_buy IS NOT NULL AND promo_pay IS NOT NULL AND promo_pay >= 1 AND promo_buy > promo_pay)
);
-- Promoción y oferta de precio no conviven en el mismo producto
ALTER TABLE products ADD CONSTRAINT ck_products_promo_xor_offer CHECK (promo_buy IS NULL OR discount_price IS NULL);

-- Línea de pedido: descuento por promoción y copia de lo pactado (el historial no cambia si luego se edita el producto).
-- Las filas existentes quedan con promo_discount = 0 y siguen cumpliendo la restricción de subtotal.
ALTER TABLE order_items ADD COLUMN promo_discount NUMERIC(10,2) NOT NULL DEFAULT 0;
ALTER TABLE order_items ADD COLUMN promo_buy      SMALLINT;
ALTER TABLE order_items ADD COLUMN promo_pay      SMALLINT;

ALTER TABLE order_items ADD CONSTRAINT ck_items_promo_discount
    CHECK (promo_discount >= 0 AND promo_discount <= quantity * unit_price);
-- Descuento > 0 solo con promoción "lleva N paga M", y entonces N y M quedan registrados
ALTER TABLE order_items ADD CONSTRAINT ck_items_promo_consistent CHECK (
    (promo_discount = 0 AND promo_type IS DISTINCT FROM 'BUY_X_PAY_Y') OR
    (promo_discount > 0 AND promo_type = 'BUY_X_PAY_Y' AND promo_buy IS NOT NULL AND promo_pay IS NOT NULL
        AND promo_pay >= 1 AND promo_buy > promo_pay)
);

ALTER TABLE order_items DROP CONSTRAINT ck_items_subtotal;
ALTER TABLE order_items ADD CONSTRAINT ck_items_subtotal CHECK (subtotal = quantity * unit_price - promo_discount);
