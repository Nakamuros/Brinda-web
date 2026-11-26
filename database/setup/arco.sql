-- BRINDA · Derechos ARCO sobre pedidos (Ley 29733). Procedimiento completo: PROCEDIMIENTO-ARCO.md.
--
-- Se ejecuta con brinda_owner (brinda_app no puede modificar audit_logs). Una sola transacción.
-- POR DEFECTO ES UNA SIMULACIÓN: muestra qué pedidos cambiarían y deshace todo. Solo guarda con -v apply=1.
-- Nunca muestra nombre, celular, documento ni dirección: solo código, estado y fecha.
-- No toca el Libro de Reclamaciones (complaints) ni la IP de audit_logs.
--
-- Variables (psql -v):
--   action             list | revoke-marketing | anonymize
--   phone              celular del titular, 9 dígitos (obligatorio)
--   codes              códigos de pedido separados por comas, verificados en el panel (obligatorio salvo en list)
--   include_confirmed  1 = anonimiza también los pedidos CONFIRMADOS (por defecto 0: se excluyen, son base de
--                      boletas y obligaciones tributarias; plazo de conservación por confirmar con la asesora)
--   apply              1 = guarda los cambios (por defecto 0 = simulación)
--
-- Ejemplos:
--   psql ... -v action=list -v phone=987654321 -f database/setup/arco.sql
--   psql ... -v action=revoke-marketing -v phone=987654321 -v codes=EQ12,AB34 -f database/setup/arco.sql
--   psql ... -v action=anonymize -v phone=987654321 -v codes=EQ12 -v apply=1 -f database/setup/arco.sql

\set ON_ERROR_STOP on
\set QUIET on
\if :{?action}
\else
  \echo 'Falta -v action=list|revoke-marketing|anonymize'
  \quit
\endif
\if :{?phone}
\else
  \echo 'Falta -v phone=<9 dígitos>'
  \quit
\endif
\if :{?codes}
\else
  \set codes ''
\endif
\if :{?include_confirmed}
\else
  \set include_confirmed 0
\endif
\if :{?apply}
\else
  \set apply 0
\endif

BEGIN;

-- Las variables de psql no llegan dentro de los bloques DO: se pasan como ajustes locales de la transacción.
SELECT set_config('arco.action', :'action', true) AS a,
       set_config('arco.phone', :'phone', true) AS p,
       set_config('arco.codes', upper(replace(:'codes', ' ', '')), true) AS c,
       set_config('arco.include_confirmed', :'include_confirmed', true) AS i
\gset arco_

DO $$
DECLARE
    v_action  TEXT := current_setting('arco.action');
    v_phone   TEXT := current_setting('arco.phone');
    v_codes   TEXT[] := array_remove(string_to_array(current_setting('arco.codes'), ','), '');
    v_missing TEXT[];
BEGIN
    IF v_action NOT IN ('list', 'revoke-marketing', 'anonymize') THEN
        RAISE EXCEPTION 'action inválida: use list, revoke-marketing o anonymize';
    END IF;
    IF v_phone !~ '^[0-9]{9}$' THEN
        RAISE EXCEPTION 'phone debe tener 9 dígitos';
    END IF;
    IF v_action <> 'list' AND coalesce(array_length(v_codes, 1), 0) = 0 THEN
        RAISE EXCEPTION 'Indica los códigos con -v codes=AA11,BB22 (revísalos antes con action=list y en el panel)';
    END IF;
    -- Cada código debe pertenecer a ese celular: un error de tipeo no alcanza a pedidos de otra persona.
    SELECT array_agg(c) INTO v_missing
    FROM unnest(v_codes) c
    WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.order_code = c AND o.customer_phone = v_phone);
    IF v_missing IS NOT NULL THEN
        RAISE EXCEPTION 'Estos códigos no existen o no son de ese celular: %', array_to_string(v_missing, ', ');
    END IF;
END $$;

-- Pedidos del titular (sin datos personales). En list: todos los de ese celular.
CREATE TEMP TABLE arco_target ON COMMIT DROP AS
SELECT o.id, o.order_code, o.status, o.created_at,
       o.status = 'CONFIRMED' AND current_setting('arco.include_confirmed') <> '1'
           AND current_setting('arco.action') = 'anonymize' AS excluded
FROM orders o
WHERE o.customer_phone = current_setting('arco.phone')
  AND (current_setting('arco.action') = 'list'
       OR o.order_code = ANY (string_to_array(current_setting('arco.codes'), ',')));

\set QUIET off
\echo
\echo '== Pedidos considerados (código, estado, fecha de creación, promociones, ¿se excluye?) =='
SELECT t.order_code AS codigo, t.status AS estado, (t.created_at AT TIME ZONE 'America/Lima')::date AS creado,
       o.marketing_consent AS promociones, t.excluded AS excluido
FROM arco_target t JOIN orders o ON o.id = t.id
ORDER BY t.created_at;
\set QUIET on

-- Revocar promociones: deja los dos campos coherentes (CHECK ck_orders_marketing).
UPDATE orders o SET marketing_consent = FALSE, marketing_consent_at = NULL
FROM arco_target t
WHERE o.id = t.id AND current_setting('arco.action') = 'revoke-marketing';

-- Anonimizar (supresión): reemplaza los datos personales cumpliendo los CHECK de orders. Conserva el tipo de
-- documento, montos (incluidos los finales), productos, fechas, estado y versiones de los textos legales.
UPDATE orders o SET customer_first_name    = 'ANONIMIZADO',
                    customer_last_name     = 'ANONIMIZADO',
                    customer_phone         = '000000000',
                    customer_dni_encrypted = NULL,
                    delivery_address       = 'ANONIMIZADO',
                    delivery_reference     = NULL,
                    marketing_consent      = FALSE,
                    marketing_consent_at   = NULL
FROM arco_target t
WHERE o.id = t.id AND NOT t.excluded AND current_setting('arco.action') = 'anonymize';

-- Rastro en auditoría: solo código y acción (sin datos personales ni IP).
INSERT INTO audit_logs (user_id, action, entity, entity_id, ip_address, details)
SELECT NULL,
       CASE current_setting('arco.action') WHEN 'anonymize' THEN 'ARCO_ANONYMIZE' ELSE 'ARCO_REVOKE_MARKETING' END,
       'orders', t.order_code, NULL,
       'ARCO por script' || CASE WHEN current_setting('arco.include_confirmed') = '1' THEN ' (incluye confirmados)' ELSE '' END
FROM arco_target t
WHERE current_setting('arco.action') <> 'list' AND NOT t.excluded;

\set QUIET off
\echo
\echo '== Resultado dentro de la transacción =='
SELECT t.order_code AS codigo,
       o.customer_first_name = 'ANONIMIZADO' AS anonimizado,
       o.marketing_consent AS promociones,
       t.excluded AS excluido
FROM arco_target t JOIN orders o ON o.id = t.id
ORDER BY t.created_at;

\if :apply
  COMMIT;
  \echo 'APLICADO: cambios guardados.'
\else
  ROLLBACK;
  \echo 'SIMULACIÓN: no se guardó nada. Para aplicar: -v apply=1 (con run-arco.ps1, responde APLICAR).'
\endif
