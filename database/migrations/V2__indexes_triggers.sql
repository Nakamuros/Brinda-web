-- BRINDA · V2 · Índices y triggers

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_products_category     ON products (category_id);
CREATE INDEX idx_products_available    ON products (is_available);
CREATE INDEX idx_products_featured     ON products (is_featured) WHERE is_featured;
CREATE INDEX idx_products_name_trgm    ON products USING GIN (name gin_trgm_ops);   -- buscador ILIKE '%texto%'

CREATE INDEX idx_districts_zone        ON districts (zone_id);

CREATE INDEX idx_orders_status_created ON orders (status, created_at DESC);
CREATE INDEX idx_orders_pending_expiry ON orders (expires_at) WHERE status = 'PENDING';  -- job de vencimiento
CREATE INDEX idx_orders_district       ON orders (district_id);
CREATE INDEX idx_orders_confirmed_at   ON orders (confirmed_at) WHERE status = 'CONFIRMED'; -- reportes / predicción

CREATE INDEX idx_order_items_order     ON order_items (order_id);
CREATE INDEX idx_order_items_product   ON order_items (product_id);

CREATE INDEX idx_stock_mov_product     ON stock_movements (product_id, created_at DESC);
CREATE INDEX idx_stock_mov_order       ON stock_movements (order_id) WHERE order_id IS NOT NULL;

CREATE INDEX idx_audit_user_created    ON audit_logs (user_id, created_at DESC);
CREATE INDEX idx_audit_action_created  ON audit_logs (action, created_at DESC);

-- ============================================================
-- TRIGGER updated_at
-- ============================================================
CREATE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at          BEFORE UPDATE ON users          FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_categories_updated_at     BEFORE UPDATE ON categories     FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_products_updated_at       BEFORE UPDATE ON products       FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_delivery_zones_updated_at BEFORE UPDATE ON delivery_zones FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_orders_updated_at         BEFORE UPDATE ON orders         FOR EACH ROW EXECUTE FUNCTION set_updated_at();
