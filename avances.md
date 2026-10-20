# BRINDA — Avances

> Registro de avances y aprendizajes. Se actualiza a medida que se trabaja.

## 2026-10-19

### Hecho
- Revisadas las skills disponibles en `.claude/skills/` (113 `SKILL.md`; el listado mostró 100).
- Leído y comprendido `CONTEXTO-BRINDA.md` completo.

### Aprendido
- Estado del proyecto: diseño cerrado en lo esencial (ERD v2, flujo del pedido); **implementación sin iniciar**.
- Falta `IntelliMarket-develop2.zip` en la carpeta del proyecto; se necesita antes del Hito 1, paso 1.
- Skills relevantes para BRINDA: `frontend-design`, `web-artifacts-builder`, `theme-factory`, `webapp-testing`, plugins `phoenix-*` (PRD, seguridad).
- Reglas del `CLAUDE.md`: respuestas concisas, UI de nivel agencia (mobile-first, a11y), anticipar casos borde, componentes modulares, mapear entidades antes de implementar.

### Decisiones pendientes (técnicas)
- JWT: cookie HttpOnly vs cabecera Bearer.
- Flyway + `ddl-auto=validate` (recomendado).
- Paquete base del backend (p. ej. `com.brinda.api`).

### Siguiente paso (cuando se indique)
Hito 1: extraer ZIP → DDL PostgreSQL → seeds → esqueleto backend → `auth` y `catalog` → colección Postman.

## 2026-10-19 (continuación)

### Hecho
- `database/`: DDL (V1), índices + triggers (V2), seeds (V3), roles y grants. Validado por el desarrollador en DBeaver/Docker.
- `brinda-db/docker-compose.yaml` (Postgres 16, puerto 5433 solo localhost). Revisado: OK.
- `.gitignore` raíz (protege `.env`).
- `backend/`: esqueleto Spring Boot 3.4.5 / Java 21, paquete `com.brinda.api`, módulos `auth`, `catalog`, `shared`, `config`.
  - JWT en cookie HttpOnly + SameSite=Strict (8 h), bloqueo por intentos, cambio de clave obligatorio, auditoría.
  - Catálogo público (`/api/v1/catalog/**`) y admin (`/api/v1/admin/**`).
  - Flyway usa `../database/migrations` (baseline 3), `ddl-auto=validate`.
- Compila. **Aún no probado en ejecución** (la BD estaba apagada).

### Decisiones tomadas por defecto (reversibles)
- JWT: cookie HttpOnly (la recomendada).
- Sin refresh token por ahora; sesión de 8 h configurable.

### Pendiente
- Levantar BD y probar `auth`/`catalog` (curl/Postman).
- Módulos `inventory`, `delivery`, `order`; rate limiting; colección Postman.
- Producción: sacar `V3__seed_data.sql` de las migraciones que corren en prod.

## 2026-10-19 (Hito 1: inventory, delivery, order)

### Hecho
- `inventory`: reposición, ajustes (motivo obligatorio), movimientos, alertas; único punto que cambia stock (bloqueo `FOR UPDATE` + movimiento en la misma transacción).
- `delivery`: distritos públicos con tarifa; zonas y distritos editables por admin.
- `order`: pedido público anónimo (precios/tarifa/total calculados en servidor, código corto, DNI cifrado AES-GCM, enlace WhatsApp armado en servidor), panel: lista, detalle, confirmar/cancelar, textos para copiar; job de vencimiento (45 min).
- Rate limiting por IP: pedidos 5/min, login 10/min.
- Probado en vivo contra Postgres: flujo completo, concurrencia (3 de 6 confirmaciones simultáneas, stock final 0), anulación con devolución de stock, vencimiento, 429.
- BD devuelta al estado del seed tras las pruebas. `backend/ENDPOINTS.md` listo para armar Postman.

### Decisiones por defecto (reversibles)
- Se puede confirmar un pedido EXPIRED (pago tardío).
- El DNI no va en el mensaje de WhatsApp.
- Vencimiento: 45 min.

### Pendiente
- Colección Postman (la hace el desarrollador).
- Tarifas/zonas reales, números de Yape/Plin y WhatsApp (`.env`: WHATSAPP_NUMBER, YAPE_NUMBER, PLIN_NUMBER).
- Separar `V3__seed_data.sql` de lo que corre en producción.
- Hito 2: frontend Angular.

## 2026-10-19 · V4 Fase 0 (ajustes de la revisión)
- V3 movida a `database/seed-dev/` (solo perfil `local`); `V4__audit_details_reference_data.sql` (`audit_logs.details` + zonas/distritos con `ON CONFLICT`). Verificado: base nueva en `local` = V1-V4 con seed; en `prod` = sin usuarios ni productos, con zonas/distritos.
- Catálogo público oculta `is_available=false` (lista y detalle), orden nuevo (stock > oferta > destacado > nombre), filtro `onOffer`.
- Admin: ocultar/mostrar por lote, filtros del listado, recepción de mercadería por lote, `details` en auditoría.
- Respaldo previo: `backups/brinda_pre_v4.dump` (ignorado en git).

## 2026-10-19 · V4 Fase 1 (ofertas con fecha de fin)
- `V5__offers_end_date.sql`: `products.offer_ends_at`, `order_items.promo_type` (OFFER / BUY_X_PAY_Y), backfill de líneas con descuento.
- Regla única `OfferRule` (+ equivalente en `ProductSpecifications`), `Clock` inyectable; `PUT/DELETE /admin/products/{id}/offer`; pedidos guardan `promo_type='OFFER'`.
- Tests unitarios: `OfferRuleTest`, `PublicProductResponseTest` (8 pruebas, ok).

## 2026-10-19 · V4 Fase 1.5 y Fase 2
- Fase 1.5: `MigrationsSeedGuardTest` (build falla si `db/migration` trae el seed), `ProdSeedGuard` (perfil prod no arranca con `admin@brinda.local`), `setup/02_grants.sql` empaquetado como `afterMigrate.sql` (antrun), `ValidationMessages.properties` en español.
- Fase 2: `V6__combos.sql` (`product_type`, `combo_items` solo SELECT/INSERT, `stock_movements.combo_id`, tipos COMBO_*), módulo `combo` (crear, armar más, detalle con `buildableNow`, editar sin tocar composición/stock), lectura pública con contenido, filtro `type`. Tests: `ComboCalculatorTest`.
- Respaldos: `backups/brinda_pre_v6_seed.dump` y `brinda_pre_v6_con_datos.dump`.

## 2026-10-19 · V4 Fase 3 ("lleva N, paga M") y ajuste de afterMigrate
- `02_grants.sql` ya no hace REVOKE general: solo GRANT idempotentes + revocación de lo que la app nunca debe tener (sin ventana de permission denied; probado con 651 consultas mientras se reejecutaba 40 veces).
- `V7__buy_x_pay_y.sql`: `promo_buy/pay/ends_at` en productos (excluyente con oferta), `promo_discount/buy/pay` en `order_items`, nueva restricción de subtotal. Probada sobre una copia con ventas reales (V6 y V7 aplican y los pedidos viejos cumplen).
- `BuyXPayYCalculator` (puro, 11 tests), `PromoRule`, `OrderLineText` (WhatsApp y boleta), `PUT/DELETE /admin/products/{id}/promo`.
- `CONTEXTO-BRINDA.md`: secciones 18 (decisiones) y 19 (pendientes antes de producción).

## 2026-10-19 · Cierre de sesión
- Estado: backend completo hasta V7 (35 tests unitarios ok), base local devuelta al estado del seed, app apagada.
- Siguiente: colección Postman (usar `backend/ENDPOINTS.md`), luego frontend Angular (Hito 2).
- Antes de producción: ver `CONTEXTO-BRINDA.md` sección 19 (17 pendientes) y datos reales de Lucía (tarifas, distritos, números `WHATSAPP_NUMBER`/`YAPE_NUMBER`/`PLIN_NUMBER`, cuenta de la dueña).
