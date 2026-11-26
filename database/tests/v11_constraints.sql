-- BRINDA · Prueba de las restricciones de V11 sobre orders. No deja cambios: todo va en una transacción con ROLLBACK.
-- Uso (BD local, rol dueño):  psql -v ON_ERROR_STOP=1 -U brinda_owner -d brinda -f database/tests/v11_constraints.sql
-- Necesita al menos un pedido en la tabla. Cada caso debe ser rechazado; si alguno pasa, el script falla.
BEGIN;

DO $$
DECLARE
    target UUID;
    cases TEXT[][] := ARRAY[
        -- [descripción, SET a probar, constraint esperado]
        ['solo total final (fee NULL)',            'final_total_amount = subtotal_amount + 5',                      'ck_orders_final'],
        ['solo delivery final (total NULL)',       'final_delivery_fee = 5',                                        'ck_orders_final'],
        ['delivery final negativo',                'final_delivery_fee = -1, final_total_amount = subtotal_amount - 1', 'ck_orders_final'],
        ['total final que no cuadra',              'final_delivery_fee = 5, final_total_amount = subtotal_amount + 6',  'ck_orders_final'],
        ['consentimiento sin fecha',               'marketing_consent = TRUE, marketing_consent_at = NULL',         'ck_orders_marketing'],
        ['fecha sin consentimiento',               'marketing_consent = FALSE, marketing_consent_at = now()',       'ck_orders_marketing'],
        ['tipo de documento inválido',             'document_type = ''RUC''',                                       'ck_orders_doc_type'],
        ['método de pago inválido',                'payment_method = ''CASH''',                                     'ck_orders_payment']
    ];
    i INT;
    got TEXT;
BEGIN
    SELECT id INTO target FROM orders LIMIT 1;
    IF target IS NULL THEN
        RAISE EXCEPTION 'No hay pedidos para probar las restricciones';
    END IF;

    FOR i IN 1 .. array_length(cases, 1) LOOP
        got := NULL;
        BEGIN
            EXECUTE format('UPDATE orders SET %s WHERE id = $1', cases[i][2]) USING target;
        EXCEPTION WHEN check_violation THEN
            GET STACKED DIAGNOSTICS got = CONSTRAINT_NAME;
        END;
        IF got IS DISTINCT FROM cases[i][3] THEN
            RAISE EXCEPTION 'FALLA: % (esperado %, obtenido %)', cases[i][1], cases[i][3], coalesce(got, 'aceptado');
        END IF;
        RAISE NOTICE 'OK  rechazado: % (%)', cases[i][1], got;
    END LOOP;

    -- Casos válidos: ambas columnas coherentes, transferencia, pasaporte, consentimiento con fecha.
    UPDATE orders SET final_delivery_fee = 0, final_total_amount = subtotal_amount WHERE id = target;
    UPDATE orders SET final_delivery_fee = 12.50, final_total_amount = subtotal_amount + 12.50 WHERE id = target;
    UPDATE orders SET final_delivery_fee = NULL, final_total_amount = NULL WHERE id = target;
    UPDATE orders SET payment_method = 'TRANSFER', document_type = 'PASSPORT' WHERE id = target;
    UPDATE orders SET marketing_consent = TRUE, marketing_consent_at = now() WHERE id = target;
    RAISE NOTICE 'OK  aceptados: finales coherentes (0 y 12.50), sin finales, TRANSFER, PASSPORT y consentimiento con fecha';
END $$;

ROLLBACK;
