-- BRINDA · V11 · Pedidos: transferencia, tipo de documento, consentimiento de promociones,
-- versión de los textos legales aceptados y delivery/total finales al confirmar.
-- Solo aditiva: ninguna columna existente cambia ni se borra. audit_logs.action no tiene CHECK (VARCHAR(40)),
-- así que las acciones nuevas (ORDER_DELIVERY_FIX) no requieren cambios.
-- Filas existentes: document_type = 'DNI', marketing_consent = FALSE, el resto NULL. Los CHECK nuevos se validan
-- contra ellas y pasan (todas son YAPE o PLIN). PG16 no reescribe la tabla al añadir columnas con DEFAULT constante.

-- 1. Pago por transferencia (payment_method es VARCHAR(10): 'TRANSFER' cabe)
ALTER TABLE orders DROP CONSTRAINT ck_orders_payment;
ALTER TABLE orders ADD CONSTRAINT ck_orders_payment CHECK (payment_method IN ('YAPE', 'PLIN', 'TRANSFER'));

-- 2. Tipo del documento cifrado en customer_dni_encrypted (la columna conserva su nombre)
ALTER TABLE orders ADD COLUMN document_type VARCHAR(10) NOT NULL DEFAULT 'DNI';
ALTER TABLE orders ADD CONSTRAINT ck_orders_doc_type CHECK (document_type IN ('DNI', 'CE', 'PASSPORT'));

-- 3. Consentimiento opcional de promociones: verdadero solo si hay fecha (y viceversa).
--    Nunca evalúa a NULL: marketing_consent es NOT NULL e "IS NOT NULL" siempre da TRUE/FALSE.
--    (ck_orders_doc_type tampoco: document_type es NOT NULL.)
ALTER TABLE orders ADD COLUMN marketing_consent BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN marketing_consent_at TIMESTAMPTZ;
ALTER TABLE orders ADD CONSTRAINT ck_orders_marketing
    CHECK (marketing_consent = (marketing_consent_at IS NOT NULL));

-- 4. Prueba de aceptación: versión de términos y privacidad (constante del servidor; NULL hasta publicarlos)
ALTER TABLE orders ADD COLUMN terms_version VARCHAR(20);
ALTER TABLE orders ADD COLUMN privacy_version VARCHAR(20);

-- 5. Delivery y total finales (los fija la dueña al confirmar). delivery_fee y total_amount quedan como estimados.
ALTER TABLE orders ADD COLUMN final_delivery_fee NUMERIC(10,2);
ALTER TABLE orders ADD COLUMN final_total_amount NUMERIC(10,2);
-- Ambas o ninguna. Los IS NOT NULL explícitos importan: un CHECK que evalúa a NULL se acepta en PostgreSQL,
-- así que sin ellos (fee NULL, total con valor) pasaría.
ALTER TABLE orders ADD CONSTRAINT ck_orders_final CHECK (
    (final_delivery_fee IS NULL AND final_total_amount IS NULL)
    OR (final_delivery_fee IS NOT NULL AND final_total_amount IS NOT NULL
        AND final_delivery_fee >= 0
        AND final_total_amount = subtotal_amount + final_delivery_fee));
