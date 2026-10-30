-- BRINDA · Verificación posterior a 01b_render_roles.sql. Solo imprime nombres de roles y booleanes.
-- No deja nada: la prueba de DELETE usa una tabla temporal dentro de una transacción que se revierte.

SELECT rolname, rolcanlogin AS puede_login, rolsuper AS superusuario
FROM pg_roles WHERE rolname IN ('brinda_owner', 'brinda_app') ORDER BY rolname;

SELECT has_schema_privilege('brinda_owner', 'public', 'CREATE')       AS owner_puede_crear_en_public,
       has_database_privilege('brinda_owner', current_database(), 'CREATE') AS owner_puede_crear_en_base,
       has_schema_privilege('brinda_app', 'public', 'CREATE')         AS app_puede_crear_en_public_debe_ser_false,
       (SELECT trusted FROM pg_available_extension_versions WHERE name = 'pg_trgm' LIMIT 1) AS pg_trgm_trusted;

BEGIN;
SET LOCAL ROLE brinda_owner;
CREATE TABLE public._verif_roles (id int);            -- falla si brinda_owner no puede crear en public
RESET ROLE;
SELECT has_table_privilege('brinda_app', 'public._verif_roles', 'DELETE') AS app_tiene_delete_debe_ser_false;
ROLLBACK;
