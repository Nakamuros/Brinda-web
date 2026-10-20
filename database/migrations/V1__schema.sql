-- BRINDA · V1 · Esquema base (ERD v2)
-- Orden: extensiones → catálogo → delivery → usuarios → pedidos → stock → auditoría

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- 1. USUARIOS
-- ============================================================
CREATE TABLE users (
    id                    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    username              VARCHAR(50)  NOT NULL UNIQUE,
    email                 VARCHAR(120) NOT NULL UNIQUE,
    password_hash         VARCHAR(100) NOT NULL,             -- BCrypt costo >= 12
    role                  VARCHAR(20)  NOT NULL,
    active                BOOLEAN      NOT NULL DEFAULT TRUE,
    must_change_password  BOOLEAN      NOT NULL DEFAULT TRUE,
    failed_attempts       INTEGER      NOT NULL DEFAULT 0,
    locked_until          TIMESTAMPTZ,
    created_at            TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT ck_users_role     CHECK (role IN ('ROLE_ADMIN', 'ROLE_CASHIER')),
    CONSTRAINT ck_users_attempts CHECK (failed_attempts >= 0)
);

-- ============================================================
-- 2. CATÁLOGO
-- ============================================================
CREATE TABLE categories (
    id             BIGSERIAL    PRIMARY KEY,
    name           VARCHAR(80)  NOT NULL UNIQUE,
    slug           VARCHAR(100) NOT NULL UNIQUE,
    description    TEXT,
    icon_url       VARCHAR(500),
    is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
    display_order  INTEGER      NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE products (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id     BIGINT         NOT NULL REFERENCES categories (id) ON DELETE RESTRICT,
    sku             VARCHAR(50)    UNIQUE,
    name            VARCHAR(150)   NOT NULL,
    slug            VARCHAR(180)   NOT NULL UNIQUE,
    description     TEXT,
    price           NUMERIC(10,2)  NOT NULL,
    discount_price  NUMERIC(10,2),
    image_url       VARCHAR(500),
    stock_quantity  INTEGER        NOT NULL DEFAULT 0,
    min_stock       INTEGER        NOT NULL DEFAULT 0,
    max_stock       INTEGER        NOT NULL DEFAULT 0,
    is_available    BOOLEAN        NOT NULL DEFAULT TRUE,
    is_featured     BOOLEAN        NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ    NOT NULL DEFAULT now(),
    CONSTRAINT ck_products_price     CHECK (price > 0),
    CONSTRAINT ck_products_discount  CHECK (discount_price IS NULL OR (discount_price > 0 AND discount_price < price)),
    CONSTRAINT ck_products_stock     CHECK (stock_quantity >= 0),
    CONSTRAINT ck_products_thresh    CHECK (min_stock >= 0 AND max_stock >= min_stock)
);

-- ============================================================
-- 3. DELIVERY
-- ============================================================
CREATE TABLE delivery_zones (
    id          BIGSERIAL     PRIMARY KEY,
    name        VARCHAR(80)   NOT NULL UNIQUE,
    fee         NUMERIC(10,2) NOT NULL,
    is_active   BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT ck_zones_fee CHECK (fee >= 0)
);

CREATE TABLE districts (
    id         BIGSERIAL    PRIMARY KEY,
    zone_id    BIGINT       NOT NULL REFERENCES delivery_zones (id) ON DELETE RESTRICT,
    name       VARCHAR(80)  NOT NULL UNIQUE,
    is_active  BOOLEAN      NOT NULL DEFAULT TRUE
);

-- ============================================================
-- 4. PEDIDOS
-- ============================================================
CREATE TABLE orders (
    id                     UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code             VARCHAR(12)   NOT NULL UNIQUE,
    channel                VARCHAR(20)   NOT NULL DEFAULT 'WHATSAPP',
    status                 VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    customer_first_name    VARCHAR(80)   NOT NULL,
    customer_last_name     VARCHAR(80)   NOT NULL,
    customer_phone         VARCHAR(9)    NOT NULL,
    customer_dni_encrypted VARCHAR(255),
    delivery_address       VARCHAR(255)  NOT NULL,
    delivery_reference     VARCHAR(255),
    district_id            BIGINT        NOT NULL REFERENCES districts (id) ON DELETE RESTRICT,
    subtotal_amount        NUMERIC(10,2) NOT NULL,
    delivery_fee           NUMERIC(10,2) NOT NULL,
    total_amount           NUMERIC(10,2) NOT NULL,
    payment_method         VARCHAR(10)   NOT NULL,
    adult_confirmed        BOOLEAN       NOT NULL,
    terms_accepted_at      TIMESTAMPTZ   NOT NULL,
    privacy_accepted_at    TIMESTAMPTZ   NOT NULL,
    expires_at             TIMESTAMPTZ   NOT NULL,
    confirmed_at           TIMESTAMPTZ,
    confirmed_by           UUID          REFERENCES users (id) ON DELETE RESTRICT,
    cancel_reason          VARCHAR(255),
    created_at             TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at             TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT ck_orders_channel  CHECK (channel IN ('WHATSAPP', 'STORE')),
    CONSTRAINT ck_orders_status   CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED')),
    CONSTRAINT ck_orders_payment  CHECK (payment_method IN ('YAPE', 'PLIN')),
    CONSTRAINT ck_orders_phone    CHECK (customer_phone ~ '^[0-9]{9}$'),
    CONSTRAINT ck_orders_adult    CHECK (adult_confirmed = TRUE),
    CONSTRAINT ck_orders_amounts  CHECK (subtotal_amount >= 0 AND delivery_fee >= 0
                                         AND total_amount = subtotal_amount + delivery_fee),
    -- Regla de negocio: total > S/ 700 exige DNI (confirmar umbral con el contador)
    CONSTRAINT ck_orders_dni_700  CHECK (total_amount <= 700 OR customer_dni_encrypted IS NOT NULL),
    CONSTRAINT ck_orders_confirm  CHECK (status <> 'CONFIRMED' OR confirmed_at IS NOT NULL),
    CONSTRAINT ck_orders_cancel   CHECK (status <> 'CANCELLED' OR cancel_reason IS NOT NULL)
);

CREATE TABLE order_items (
    id            BIGSERIAL     PRIMARY KEY,
    order_id      UUID          NOT NULL REFERENCES orders (id)   ON DELETE RESTRICT,
    product_id    UUID          NOT NULL REFERENCES products (id) ON DELETE RESTRICT,
    product_name  VARCHAR(150)  NOT NULL,
    quantity      INTEGER       NOT NULL,
    list_price    NUMERIC(10,2) NOT NULL,
    unit_price    NUMERIC(10,2) NOT NULL,
    subtotal      NUMERIC(10,2) NOT NULL,
    CONSTRAINT ck_items_quantity  CHECK (quantity > 0),
    CONSTRAINT ck_items_prices    CHECK (list_price > 0 AND unit_price > 0 AND unit_price <= list_price),
    CONSTRAINT ck_items_subtotal  CHECK (subtotal = quantity * unit_price),
    CONSTRAINT uq_items_order_product UNIQUE (order_id, product_id)
);

-- ============================================================
-- 5. STOCK
-- ============================================================
CREATE TABLE stock_movements (
    id               BIGSERIAL    PRIMARY KEY,
    product_id       UUID         NOT NULL REFERENCES products (id) ON DELETE RESTRICT,
    order_id         UUID         REFERENCES orders (id)            ON DELETE RESTRICT,
    created_by       UUID         REFERENCES users (id)             ON DELETE RESTRICT,
    movement_type    VARCHAR(20)  NOT NULL,
    quantity_change  INTEGER      NOT NULL,
    stock_after      INTEGER      NOT NULL,
    reason           VARCHAR(255),
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT ck_mov_type    CHECK (movement_type IN ('SALE', 'RESTOCK', 'ADJUSTMENT', 'CANCEL_RETURN')),
    CONSTRAINT ck_mov_change  CHECK (quantity_change <> 0),
    CONSTRAINT ck_mov_after   CHECK (stock_after >= 0),
    CONSTRAINT ck_mov_sign    CHECK (
        (movement_type = 'SALE'          AND quantity_change < 0) OR
        (movement_type IN ('RESTOCK', 'CANCEL_RETURN') AND quantity_change > 0) OR
        (movement_type = 'ADJUSTMENT')
    ),
    CONSTRAINT ck_mov_reason  CHECK (movement_type <> 'ADJUSTMENT' OR (reason IS NOT NULL AND length(btrim(reason)) > 0))
);

-- ============================================================
-- 6. AUDITORÍA
-- ============================================================
CREATE TABLE audit_logs (
    id          BIGSERIAL    PRIMARY KEY,
    user_id     UUID         REFERENCES users (id) ON DELETE RESTRICT,
    action      VARCHAR(40)  NOT NULL,
    entity      VARCHAR(60),
    entity_id   VARCHAR(64),
    ip_address  VARCHAR(45),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
