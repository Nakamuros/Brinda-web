-- BRINDA · Setup 1/2 · Roles de base de datos (ejecutar ANTES de las migraciones, como superusuario)
-- Reemplaza las claves por valores reales; no subir las claves al repositorio.

-- Dueño del esquema: lo usa Flyway / DBeaver para migraciones (DDL).
CREATE ROLE brinda_owner LOGIN PASSWORD 'OWNER1234';

-- Usuario de la aplicación (Spring): sin DDL, solo lo mínimo (ver 02_grants.sql).
CREATE ROLE brinda_app LOGIN PASSWORD 'APP1234';

CREATE DATABASE brinda OWNER brinda_owner ENCODING 'UTF8';
REVOKE ALL ON DATABASE brinda FROM PUBLIC;
GRANT CONNECT ON DATABASE brinda TO brinda_app;

-- Luego conéctate a la BD "brinda" como superusuario y ejecuta:
--   ALTER DATABASE brinda SET timezone TO 'America/Lima';
--   CREATE EXTENSION IF NOT EXISTS pg_trgm;   -- si brinda_owner no puede crearla
