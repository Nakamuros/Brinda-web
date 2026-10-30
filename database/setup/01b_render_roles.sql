-- BRINDA · Setup 1b · Roles en un Postgres administrado (Render). Alternativa a 01_create_roles.sql:
-- la base YA existe (no hay CREATE DATABASE) y el usuario conectado no es superusuario.
-- Requisito: que ese usuario tenga CREATEROLE (rolsuper=f, rolcreaterole=t en Render).
-- Se ejecuta conectado a la base de destino. Lo normal es usar run-render-roles.ps1, que pide las claves
-- de forma oculta; a mano:
--   psql "$ADMIN_URL" -v ON_ERROR_STOP=1 -v db=<nombre_de_la_base> \
--        -v owner_password="$OWNER_PW" -v app_password="$APP_PW" -f 01b_render_roles.sql
-- pg_trgm no se crea aquí: V1 hace CREATE EXTENSION IF NOT EXISTS (extensión "trusted" desde PG13).
-- Todo va en una transacción: si algo falla no queda ningún rol a medias. No ejecutar si los roles ya existen.

BEGIN;

-- Protección: las sentencias ALTER DATABASE de abajo deben apuntar a la base a la que estamos conectados.
SELECT (current_database() = :'db') AS en_la_base_correcta \gset
\if :en_la_base_correcta
\else
  DO $$ BEGIN RAISE EXCEPTION 'La conexión no apunta a la base indicada en -v db'; END $$;
\endif

CREATE ROLE brinda_owner LOGIN PASSWORD :'owner_password';
CREATE ROLE brinda_app   LOGIN PASSWORD :'app_password';

-- Para poder ceder la propiedad del esquema hay que ser miembro del rol destino.
-- La base sigue siendo del usuario administrado (ALTER DATABASE ... OWNER exige CREATEDB, que Render no da);
-- brinda_owner recibe CREATE en la base (V1 crea pg_trgm) y la propiedad del esquema public.
GRANT brinda_owner TO CURRENT_USER;

REVOKE ALL ON DATABASE :"db" FROM PUBLIC;
GRANT CONNECT, CREATE, TEMPORARY ON DATABASE :"db" TO brinda_owner;
GRANT CONNECT ON DATABASE :"db" TO brinda_app;
ALTER DATABASE :"db" SET timezone TO 'America/Lima';

-- PG15+: PUBLIC ya no puede crear en `public`; Flyway (brinda_owner) necesita ser su dueño.
ALTER SCHEMA public OWNER TO brinda_owner;

COMMIT;
