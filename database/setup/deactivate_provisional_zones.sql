-- BRINDA · Desactiva las zonas y tarifas PROVISIONALES que inserta V4 (corre también en producción).
-- Ejecutar UNA vez con brinda_owner, justo después del primer arranque (las tablas ya existen) y antes de abrir al público.
--   psql "$OWNER_URL" -v ON_ERROR_STOP=1 -f deactivate_provisional_zones.sql
-- Solo toca las 3 zonas por su nombre de V4: no desactiva zonas reales creadas después. Los distritos no se tocan
-- (un distrito solo es entregable si él y su zona están activos). Reversible: is_active = TRUE, o corregir nombre y
-- tarifa con los datos reales de Lucía por la API admin de entrega y reactivar.

UPDATE delivery_zones
SET is_active = FALSE, updated_at = now()
WHERE name IN ('Zona 1 - Cercanos', 'Zona 2 - Medios', 'Zona 3 - Lejanos')
  AND is_active;

-- Control
SELECT id, name, fee, is_active FROM delivery_zones ORDER BY id;

-- Con solo los datos de V4 debe dar 0 (checkout sin zonas disponibles hasta cargar los datos reales).
SELECT count(*) AS distritos_entregables
FROM districts d JOIN delivery_zones z ON z.id = d.zone_id
WHERE d.is_active AND z.is_active;
