-- BRINDA · Setup 1/2 · Roles de base de datos (ejecutar ANTES de las migraciones, como superusuario)
-- Las claves NO van en este archivo: se pasan como variables de psql (ver database/README.md):
--   psql -U postgres -v owner_password='...' -v app_password='...' -f 01_create_roles.sql

-- Dueño del esquema: lo usa Flyway / DBeaver para migraciones (DDL).
CREATE ROLE brinda_owner LOGIN PASSWORD :'owner_password';

-- Usuario de la aplicación (Spring): sin DDL, solo lo mínimo (ver 02_grants.sql).
CREATE ROLE brinda_app LOGIN PASSWORD :'app_password';

CREATE DATABASE brinda OWNER brinda_owner ENCODING 'UTF8';
REVOKE ALL ON DATABASE brinda FROM PUBLIC;
GRANT CONNECT ON DATABASE brinda TO brinda_app;

-- Luego conéctate a la BD "brinda" como superusuario y ejecuta:
--   ALTER DATABASE brinda SET timezone TO 'America/Lima';
--   CREATE EXTENSION IF NOT EXISTS pg_trgm;   -- si brinda_owner no puede crearla
