# BRINDA · Base de datos (PostgreSQL)

## Orden de ejecución
| # | Archivo | Rol | Cuándo |
|---|---|---|---|
| 1 | `setup/01_create_roles.sql` | superusuario | una vez (claves por variables de psql, ver abajo) |
| 2 | `migrations/V1__schema.sql` | `brinda_owner` | tablas y restricciones |
| 3 | `migrations/V2__indexes_triggers.sql` | `brinda_owner` | índices + `updated_at` |
| 4 | `seed-dev/V3__seed_data.sql` | `brinda_owner` | solo local/pruebas (no corre en `prod`) |
| 4b | `migrations/V4__audit_details_reference_data.sql` | `brinda_owner` | `audit_logs.details` + zonas/distritos |
| 5 | `setup/02_grants.sql` | `brinda_owner` | **lo aplica solo la app** (callback `afterMigrate`); manual solo si no usas la app |
| 4c | `migrations/V5__offers_end_date.sql` | `brinda_owner` | `offer_ends_at`, `promo_type` |
| 4d | `migrations/V6__combos.sql` | `brinda_owner` | combos, `combo_items`, movimientos de armado |
| 4e | `migrations/V7__buy_x_pay_y.sql` | `brinda_owner` | promoción lleva N paga M |
| 4f | `migrations/V10__complaints.sql` | `brinda_owner` | Libro de Reclamaciones: `complaints` y `complaint_counters` (V8 y V9: DNI siempre y `token_version`) |

En DBeaver: conecta a la BD `brinda`, abre cada archivo y ejecútalo como script (Alt+X). Los `V*` están listos para Flyway (`db/migration`).

## Crear los roles (sin claves en el repo)
`setup/01_create_roles.sql` no trae claves: las recibe como variables de psql (`owner_password`, `app_password`). Genera dos claves aleatorias, guárdalas en `backend/.env` (`DB_OWNER_PASSWORD`, `DB_APP_PASSWORD`; el archivo está ignorado por git) y ejecuta:

```
psql -U postgres -h localhost -p 5433 -v owner_password='<clave-owner>' -v app_password='<clave-app>' -f database/setup/01_create_roles.sql
```

Con Docker: `docker exec -i brinda-db psql -U postgres -v owner_password='...' -v app_password='...' < database/setup/01_create_roles.sql`. En DBeaver el script no funciona tal cual (no interpola variables): usa la terminal.

Rotar una clave existente: `ALTER ROLE brinda_app PASSWORD '<nueva>';` y actualizar `backend/.env`.

## Producción en Render (Postgres administrado)
Scripts de `database/setup/`. Ninguno lleva claves: se piden de forma oculta o se pasan como variables de psql. Orden:

| # | Script | Quién lo corre | Para qué |
|---|---|---|---|
| 1 | `run-render-roles.ps1` | tú, en tu terminal (PowerShell, con Docker Desktop abierto) | Pide la URL externa del administrador y las dos claves nuevas, ejecuta `01b_render_roles.sql` y luego `verify_render_roles.sql`. Muestra solo nombres de roles y booleanos. |
| 1b | `01b_render_roles.sql` | lo usa el anterior | Crea `brinda_owner` y `brinda_app` en una transacción, sobre una base que ya existe y con un usuario sin superusuario pero con `CREATEROLE`. No usa `ALTER DATABASE … OWNER` (exige `CREATEDB`): da `CREATE` en la base y la propiedad del esquema `public` a `brinda_owner`. Falla si los roles ya existen. |
| 1c | `verify_render_roles.sql` | lo usa el anterior | Comprueba que `brinda_owner` crea en `public`, que `brinda_app` no tiene `DELETE` ni `CREATE`, y que `pg_trgm` es "trusted" (V1 la crea). La prueba usa una tabla temporal dentro de una transacción que se revierte. |
| 2 | primer arranque de la API | la app | Flyway aplica V1–V10 (sin baseline) y el callback `afterMigrate` aplica `02_grants.sql`. Revisar en `flyway_schema_history` que V1 figure como `SQL`, no `BASELINE`. |
| 3 | `deactivate_provisional_zones.sql` | `brinda_owner`, **antes de abrir al público** | Desactiva las 3 zonas provisionales de V4 (los distritos no se tocan). Idempotente; el control final `distritos_entregables` debe dar 0. Se revierte con `is_active = TRUE` o cargando los datos reales de Lucía. |
| 4 | `new-admin-hash.ps1` y `create_admin.sql` | tú | Crea el administrador real (ver abajo). |

Las claves nuevas de los roles van como `DB_OWNER_PASSWORD` y `DB_APP_PASSWORD` en las variables de entorno de Render; guárdalas también en tu gestor de claves.

### Alta del administrador real
1. `$hash = .\database\setup\new-admin-hash.ps1`: pide la clave dos veces, oculta (mín. 12 caracteres), y devuelve solo el hash BCrypt de costo 12 (el mismo encoder que la API). Requiere JDK 21 y haber compilado el backend una vez (usa los jar de `~/.m2`).
2. Con `brinda_owner`, tras el primer arranque:
   ```
   psql "$OWNER_URL" -v ON_ERROR_STOP=1 -v admin_user=<usuario> -v admin_email=<correo> -v admin_hash="$hash" -f database/setup/create_admin.sql
   ```
   `create_admin.sql` rechaza un hash que no sea BCrypt de costo 12 y deja `must_change_password = TRUE`: el primer ingreso exige cambiar la clave. Al final muestra los usuarios y `seed_admin_presente`, que debe ser 0 (con perfil `prod`, si existe `admin@brinda.local` la app no arranca).

## Privilegios y builds de release
- `setup/02_grants.sql` es la **fuente única** de privilegios de `brinda_app`. El `pom.xml` lo copia como `db/migration/afterMigrate.sql` y Flyway lo ejecuta con `brinda_owner` tras cada migración (arranque de la app). Idempotente.
- **Los builds de release usan siempre `mvn clean package`.** Un `target/` viejo puede arrastrar el seed (`V3`) a `db/migration`. Defensas: el test `MigrationsSeedGuardTest` rompe el build si lo encuentra, y con perfil `prod` la app no arranca si existe el usuario `admin@brinda.local`.

## Credenciales semilla (solo desarrollo)
- Usuario `admin` · la clave inicial está solo como hash BCrypt (costo 12, `must_change_password = true`) en `database/seed-dev/V3__seed_data.sql`; pídesela al desarrollador, no se documenta aquí.
- **No usar en producción**: crear el admin de Lucía con su correo y clave propia.

## Reglas aplicadas en la BD
- Dinero `NUMERIC(10,2)`, fechas `TIMESTAMPTZ`; `total = subtotal + envío`; DNI obligatorio en todo pedido nuevo (V8: trigger de INSERT; los pedidos anteriores sin DNI se conservan).
- Stock nunca negativo; ajustes manuales exigen motivo; `SALE` resta, `RESTOCK`/`CANCEL_RETURN` suman.
- `ON DELETE RESTRICT` en todo; `brinda_app` no tiene `DELETE` ni DDL, y `order_items`, `stock_movements`, `audit_logs` son solo-inserción.
- Zonas/tarifas/distritos del seed son **provisionales**.
