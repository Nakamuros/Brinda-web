# BRINDA · Base de datos (PostgreSQL)

## Orden de ejecución
| # | Archivo | Rol | Cuándo |
|---|---|---|---|
| 1 | `setup/01_create_roles.sql` | superusuario | una vez (cambia las claves) |
| 2 | `migrations/V1__schema.sql` | `brinda_owner` | tablas y restricciones |
| 3 | `migrations/V2__indexes_triggers.sql` | `brinda_owner` | índices + `updated_at` |
| 4 | `seed-dev/V3__seed_data.sql` | `brinda_owner` | solo local/pruebas (no corre en `prod`) |
| 4b | `migrations/V4__audit_details_reference_data.sql` | `brinda_owner` | `audit_logs.details` + zonas/distritos |
| 5 | `setup/02_grants.sql` | `brinda_owner` | **lo aplica solo la app** (callback `afterMigrate`); manual solo si no usas la app |
| 4c | `migrations/V5__offers_end_date.sql` | `brinda_owner` | `offer_ends_at`, `promo_type` |
| 4d | `migrations/V6__combos.sql` | `brinda_owner` | combos, `combo_items`, movimientos de armado |
| 4e | `migrations/V7__buy_x_pay_y.sql` | `brinda_owner` | promoción lleva N paga M |

En DBeaver: conecta a la BD `brinda`, abre cada archivo y ejecútalo como script (Alt+X). Los `V*` están listos para Flyway (`db/migration`).

## Privilegios y builds de release
- `setup/02_grants.sql` es la **fuente única** de privilegios de `brinda_app`. El `pom.xml` lo copia como `db/migration/afterMigrate.sql` y Flyway lo ejecuta con `brinda_owner` tras cada migración (arranque de la app). Idempotente.
- **Los builds de release usan siempre `mvn clean package`.** Un `target/` viejo puede arrastrar el seed (`V3`) a `db/migration`. Defensas: el test `MigrationsSeedGuardTest` rompe el build si lo encuentra, y con perfil `prod` la app no arranca si existe el usuario `admin@brinda.local`.

## Credenciales semilla (solo desarrollo)
- Usuario `admin` · clave `Brinda-oBFrNt2TKNDv` (BCrypt costo 12, `must_change_password = true`).
- **No usar en producción**: crear el admin de Lucía con su correo y clave propia.

## Reglas aplicadas en la BD
- Dinero `NUMERIC(10,2)`, fechas `TIMESTAMPTZ`; `total = subtotal + envío`; DNI obligatorio en todo pedido nuevo (V8: trigger de INSERT; los pedidos anteriores sin DNI se conservan).
- Stock nunca negativo; ajustes manuales exigen motivo; `SALE` resta, `RESTOCK`/`CANCEL_RETURN` suman.
- `ON DELETE RESTRICT` en todo; `brinda_app` no tiene `DELETE` ni DDL, y `order_items`, `stock_movements`, `audit_logs` son solo-inserción.
- Zonas/tarifas/distritos del seed son **provisionales**.
