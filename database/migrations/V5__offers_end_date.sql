-- BRINDA · V5 · Ofertas de precio con fecha y hora de fin
-- Oferta activa = discount_price IS NOT NULL AND (offer_ends_at IS NULL OR offer_ends_at > now()).
-- Los datos antiguos sin fecha de fin se tratan como oferta sin fin.

ALTER TABLE products ADD COLUMN offer_ends_at TIMESTAMPTZ;
-- Una fecha de fin solo tiene sentido con un precio de oferta
ALTER TABLE products ADD CONSTRAINT ck_products_offer_end CHECK (offer_ends_at IS NULL OR discount_price IS NOT NULL);

-- Promoción aplicada a la línea ('BUY_X_PAY_Y' se usará más adelante). NULL = venta sin promoción.
ALTER TABLE order_items ADD COLUMN promo_type VARCHAR(20);
ALTER TABLE order_items ADD CONSTRAINT ck_items_promo_type CHECK (promo_type IS NULL OR promo_type IN ('OFFER', 'BUY_X_PAY_Y'));

UPDATE order_items SET promo_type = 'OFFER' WHERE unit_price < list_price;
