-- BRINDA · Alta del administrador real en producción (el seed admin@brinda.local NO existe en prod).
-- Ejecutar UNA vez, con brinda_owner, después del primer arranque (las tablas ya existen).
-- El hash BCrypt (costo 12) se genera sin mostrar la clave con database/setup/new-admin-hash.ps1.
--   psql "$OWNER_URL" -v ON_ERROR_STOP=1 -v admin_user=<usuario> -v admin_email=<correo> -v admin_hash="$HASH" -f create_admin.sql
-- must_change_password = TRUE: en el primer ingreso se exige POST /api/v1/auth/change-password.

-- Rechaza un hash vacío o que no sea BCrypt costo 12 (un hash inválido dejaría la cuenta inutilizable).
SELECT (:'admin_hash' ~ '^\$2[aby]\$12\$[./A-Za-z0-9]{53}$') AS hash_ok \gset
\if :hash_ok
INSERT INTO users (username, email, password_hash, role, active, must_change_password)
VALUES (:'admin_user', :'admin_email', :'admin_hash', 'ROLE_ADMIN', TRUE, TRUE);
\else
DO $$ BEGIN RAISE EXCEPTION 'admin_hash no es un hash BCrypt de costo 12'; END $$;
\endif

-- Control: el seed de desarrollo no debe existir (con perfil prod la app se niega a arrancar si está).
SELECT username, email, role, active, must_change_password FROM users ORDER BY created_at;
SELECT count(*) AS seed_admin_presente FROM users WHERE lower(email) = 'admin@brinda.local';
