-- BRINDA · V8 · DNI obligatorio SIEMPRE en pedidos nuevos (se elimina el umbral de S/ 700)
-- Los pedidos anteriores sin DNI se conservan tal cual. Un CHECK/NOT NULL (incluso NOT VALID) también se evaluaría
-- al confirmar o anular esos pedidos viejos (UPDATE), por eso la regla "solo para filas nuevas" va en un trigger de INSERT.

ALTER TABLE orders DROP CONSTRAINT ck_orders_dni_700;

CREATE OR REPLACE FUNCTION fn_orders_require_dni() RETURNS trigger AS $$
BEGIN
    IF NEW.customer_dni_encrypted IS NULL OR btrim(NEW.customer_dni_encrypted) = '' THEN
        RAISE EXCEPTION 'El DNI es obligatorio en todo pedido nuevo' USING ERRCODE = 'not_null_violation';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_require_dni
    BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION fn_orders_require_dni();
