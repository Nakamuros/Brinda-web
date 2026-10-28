-- BRINDA · Privilegios mínimos de brinda_app. FUENTE ÚNICA.
-- La app lo reaplica sola: el pom lo copia como callback Flyway `afterMigrate.sql` (corre con brinda_owner tras cada migrate).
-- Manual (DBeaver) solo si no usas la app. Debe ser idempotente.
--
-- Seguro con instancias solapadas (la nueva arranca mientras la vieja sigue atendiendo): este script NUNCA quita
-- un privilegio que la app necesite. Solo concede (GRANT) y revoca lo que la app jamás debe tener (DELETE, etc.),
-- así que no hay ninguna ventana con "permission denied".

GRANT USAGE ON SCHEMA public TO brinda_app;

-- Datos editables desde el panel
GRANT SELECT, INSERT, UPDATE ON users, categories, products, delivery_zones, districts, orders, complaints, complaint_counters TO brinda_app;

-- Historiales inmutables: solo se agregan filas, nunca se editan ni se borran
GRANT SELECT, INSERT ON order_items, stock_movements, audit_logs, combo_items TO brinda_app;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO brinda_app;

-- Lo que la app nunca debe poder hacer (limpia concesiones manuales por error):
-- sin DELETE en ninguna tabla: lo "borrado" se desactiva (is_active / is_available / active)
REVOKE DELETE, TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM brinda_app;
REVOKE UPDATE ON order_items, stock_movements, audit_logs, combo_items FROM brinda_app;
REVOKE UPDATE ON ALL SEQUENCES IN SCHEMA public FROM brinda_app;

-- Si Flyway corre con brinda_owner, esto cubre tablas futuras creadas por ese rol:
ALTER DEFAULT PRIVILEGES FOR ROLE brinda_owner IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO brinda_app;
