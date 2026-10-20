# BRINDA · Lote de cambios V4 (ofertas, combos, promociones y ajustes de la revisión)

> Pega este documento al CLI (o dile: "lee PROMPT-CLI-V4.md y ejecútalo por fases").
> Idioma de trabajo: español. Backend en `backend/`, paquete `com.brinda.api`, migraciones en `database/migrations` (el `pom.xml` las copia a `db/migration`).

## 0. Cómo quiero que trabajes

1. **Empieza en modo plan.** Léelo todo, revisa el código actual y dime el plan por fases antes de tocar nada. Si algo de este documento choca con el código real, dímelo en vez de improvisar.
2. **Trabaja por fases (secciones 1 a 4), en orden.** Al terminar cada fase: compila (`mvn -q compile`), prueba contra mi Postgres de Docker (`localhost:5433`), resume qué hiciste y qué probaste, y **detente** para que yo confirme antes de pasar a la siguiente.
3. **No edites el contenido de V1, V2 ni V3.** Ya están aplicadas en mi base. Todo cambio de esquema va en migraciones nuevas: `V4__...`, `V5__...`, `V6__...` (una por fase, para poder probarlas por separado).
4. **Antes de aplicar la primera migración nueva**, haz una copia de la base (`pg_dump` dentro del contenedor y `docker cp`; no uses `>` de PowerShell). Esta será la primera migración real que Flyway aplique sobre mi base (baseline en 3): verifica que la toma y que `flyway_schema_history` queda bien.
5. **Después de tus pruebas, deja la base como estaba** (o restaura la copia), igual que hiciste la vez anterior.
6. Las migraciones corren con `brinda_owner`. Toda tabla nueva debe llevar sus `GRANT` para `brinda_app` **dentro de la propia migración** y además quedar reflejada en `database/setup/02_grants.sql`. Reglas de privilegios: sin `DELETE` en ninguna tabla; historiales solo `SELECT, INSERT`.
7. Todo endpoint nuevo va bajo `/api/v1/admin/**` (ROLE_ADMIN), con `@Valid`, límites de tamaño y errores en español y opacos, igual que el resto.
8. Cada acción administrativa nueva deja registro en `audit_logs`. **Nunca** datos personales (DNI, teléfono, dirección) en auditoría ni en logs.
9. Actualiza `backend/ENDPOINTS.md` y `CONTEXTO-BRINDA.md` al terminar (ver sección 6).
10. Si necesitas decidir algo que no está aquí, elige lo más simple y seguro, y anótalo en tu resumen de la fase.

## 1. Fase 0 · Ajustes de la revisión (sin combos ni promociones todavía)

### 1.1 Ocultar de verdad los productos no disponibles
- El catálogo público (lista **y** detalle por slug) debe **excluir** los productos con `is_available = false`. El detalle de uno oculto responde 404.
- Significado acordado con la dueña:
  - **Stock 0** (con `is_available = true`): sigue apareciendo, con la marca de sin stock (`inStock = false`), y no se puede pedir. Ocurre solo, sin que ella haga nada.
  - **`is_available = false`**: el producto queda **oculto** del catálogo público (descontinuado, de temporada, aún no publicado). Nada se borra: sigue en la base, en el panel y en el historial.
- El panel admin sigue viendo todos los productos.

### 1.2 Ocultar o mostrar varios productos a la vez
- `POST /api/v1/admin/products/visibility` con `{ "ids": [uuid,...], "available": true|false }`.
- Máximo 200 ids. Todo o nada en una transacción. Un registro de auditoría por producto (`PRODUCT_HIDE` / `PRODUCT_SHOW`).

### 1.3 Filtros y búsqueda en el listado del panel
`GET /api/v1/admin/products` debe aceptar, combinables: `q` (nombre, como hoy), `categoryId`, `visibility=ALL|VISIBLE|HIDDEN`, `onOffer=true`, `lowStock=true` (stock <= min_stock), `type=PRODUCT|COMBO` (este último cuando exista la fase 2).
La respuesta admin debe incluir además `stockLevel`: `OUT` (0), `LOW` (<= min_stock), `HIGH` (>= max_stock), `NORMAL`; para que el frontend pinte los colores sin recalcular.

### 1.4 Orden del catálogo público
Orden en una sola lista paginada, con desempate estable por `id`:
1. Productos con stock primero (stock > 0), agotados al final.
2. Dentro de eso: con promoción activa primero (oferta de precio; más adelante también "lleva N paga M").
3. Luego combos (cuando existan).
4. Luego destacados.
5. Luego por nombre.
Añade el parámetro `onOffer=true` al catálogo público (filtro de ofertas). El conteo para la franja de anuncio sale del `totalElements` de esa consulta; no hace falta endpoint nuevo.

### 1.5 Recepción de mercadería (reposición por lote)
- `POST /api/v1/admin/inventory/restock-batch` con `{ "reference": "texto opcional", "lines": [{ "productId": uuid, "quantity": n }, ...] }`.
- Máximo 100 líneas, sin productos repetidos, cantidades 1..100000. Todo o nada. Reutiliza `InventoryService` (bloqueo de filas en orden fijo de id) y escribe un movimiento `RESTOCK` por línea. Una auditoría por lote.
- El endpoint individual de reposición y el de ajuste se quedan como están.

### 1.6 Separar el seed de desarrollo de las migraciones de producción
- Hoy el `pom.xml` copia todas las migraciones al jar, y `V3__seed_data.sql` crearía en producción el usuario `admin` con clave conocida y productos de ejemplo.
- Requisito: en el perfil `prod` el seed **no corre**; en `local` sí. Propón el mecanismo (por ejemplo `database/seed-dev/` cargada solo con `spring.flyway.locations` en `application-local.properties`). No cambies el contenido de V3; si la mueves de carpeta, verifica que mi base local sigue arrancando y que una base local nueva (V1, V2, V3, V4...) sigue funcionando.
- Los datos de referencia que sí hacen falta en producción (por ejemplo la categoría "Combos y promociones", fase 2) van en migraciones normales con `ON CONFLICT DO NOTHING`.

### 1.7 Detalle en la auditoría (migración V4)
- `ALTER TABLE audit_logs ADD COLUMN details TEXT` (nulo permitido; máx. razonable 500 caracteres).
- Úsalo para guardar **valor anterior → valor nuevo** en: `PRICE_CHANGE`, `DELIVERY_FEE_CHANGE`, cambios de oferta (fase 1), visibilidad, ajustes de stock. Ejemplo: `price 40.00 -> 30.00`. Nunca datos personales.

## 2. Fase 1 · Ofertas de precio con fecha y hora de fin (migración V4, continuación)

Regla de negocio (de la dueña): una oferta es un **precio rebajado temporal sobre el mismo producto** (ej. sixpack de Pilsen de S/ 40 a S/ 30 por una semana). Es el mismo producto con el mismo stock: **nunca** se crea un producto aparte para la oferta. El stock siempre se descuenta. Y la base debe saber que esa venta se hizo en oferta.

### 2.1 Esquema
- `products.offer_ends_at TIMESTAMPTZ NULL`.
- `order_items.promo_type VARCHAR(20) NULL` con CHECK `IN ('OFFER','BUY_X_PAY_Y')` (el segundo valor se usará en la fase 3; déjalo permitido ya). `NULL` = venta sin promoción.
- Rellena `promo_type = 'OFFER'` en líneas existentes donde `unit_price < list_price`.
- Cuidado: el seed (V3) tiene un producto con `discount_price` sin fecha de fin. La migración **no debe fallar** por eso. Los datos antiguos sin fecha se tratan como oferta sin fin.

### 2.2 Regla única de "oferta activa"
Oferta activa = `discount_price IS NOT NULL AND (offer_ends_at IS NULL OR offer_ends_at > now())`.
- Impleméntala **en un solo lugar** (método en `Product` más su equivalente para consultas/ordenamiento) y úsala en: catálogo público, filtro `onOffer`, orden del catálogo, creación de pedidos, respuestas admin.
- No usar tareas programadas para apagar ofertas: se evalúa por fecha al consultar.
- `effectivePrice()` pasa a depender de si la oferta está activa en ese momento.

### 2.3 Escritura (panel admin)
- Al **fijar** un precio de oferta, `offerEndsAt` es **obligatorio** (para que no se olvide) y debe ser futuro. Zona horaria de Lima en el panel; en la base `TIMESTAMPTZ`.
- Validaciones: `discount_price < price` (ya existe), 2 decimales, mayor que 0.
- Endpoints:
  - `PUT /api/v1/admin/products/{id}/offer` con `{ "discountPrice": 30.00, "endsAt": "2026-10-26T23:59:00-05:00" }`.
  - `DELETE /api/v1/admin/products/{id}/offer` (quita la oferta; es un UPDATE de columnas, no borra el producto).
  - Crear/editar producto (`ProductRequest`) puede traer `discountPrice` + `offerEndsAt` opcionales, con las mismas reglas.
- Auditoría con detalle: `OFFER_SET` (`price 40.00, offer 30.00 until 2026-10-26T23:59-05:00`), `OFFER_CLEAR`, `PRICE_CHANGE` (precio normal).

### 2.4 Lectura
- Catálogo público: `price`, `discountPrice` (solo si la oferta está activa), `finalPrice`, `onOffer`, `discountPercent` (entero redondeado), `offerEndsAt`.
- Admin: además, si la oferta ya venció, indicarlo (`offerExpired`) para que ella lo vea.

### 2.5 Pedidos
- Al crear el pedido, la línea guarda `list_price` (precio normal), `unit_price` (precio cobrado) y `promo_type = 'OFFER'` si la oferta estaba activa en ese instante.
- **Un pedido pendiente conserva su precio aunque la oferta venza antes de confirmarlo** (como ya hace el sistema). Confirmar no recalcula precios.
- El stock se descuenta igual (movimiento `SALE`), en oferta o no.

## 3. Fase 2 · Combos armados de antemano (migración V5)

Modelo acordado con la dueña ("kit pre-armado"):
- Un **combo es un producto normal con su propio stock**. Lucía lo arma físicamente con productos de su inventario y le pone su precio y foto.
- Al **armar N combos** el sistema resta de cada componente `N × cantidad_por_combo` y suma N al stock del combo. **Eso no es una venta.**
- El combo luego se vende por el flujo de pedidos existente, sin cambios: baja el stock del combo y se anula devolviendo stock del combo. **No modifiques `OrderService` ni `OrderAdminService.confirm/cancel` salvo lo mínimo para mostrar contenido.**
- Composición fija: la composición **no se edita** una vez creado el combo (el contenido físico ya armado no cambia). Para otro contenido se crea otro combo.

### 3.1 Esquema
- `products.product_type VARCHAR(10) NOT NULL DEFAULT 'PRODUCT'` con CHECK `IN ('PRODUCT','COMBO')`.
- Tabla `combo_items`: `id BIGSERIAL PK`, `combo_id UUID FK products`, `product_id UUID FK products`, `quantity INT CHECK (quantity > 0)`, `UNIQUE (combo_id, product_id)`, `CHECK (combo_id <> product_id)`. FKs con `ON DELETE RESTRICT`. Privilegios para `brinda_app`: solo `SELECT, INSERT`.
- `stock_movements`:
  - Amplía `ck_mov_type` con: `COMBO_BUILD` (+, sobre el combo), `COMBO_CONSUME` (−, sobre cada componente), `COMBO_DISASSEMBLE` (−, sobre el combo), `COMBO_RETURN` (+, sobre componentes). Los dos últimos se dejan permitidos pero **no se implementan ahora** (desarmar queda para después).
  - Amplía `ck_mov_sign` con esos signos.
  - Nueva columna `combo_id UUID NULL REFERENCES products(id) ON DELETE RESTRICT`: en los movimientos `COMBO_CONSUME` indica a qué combo se destinó el stock (es la etiqueta para el CSV).
- Categoría de referencia `Combos y promociones` (slug `combos-y-promociones`) creada en la migración con `ON CONFLICT DO NOTHING` (es dato de referencia, también para producción). Todo combo nuevo se crea en esa categoría.

### 3.2 Reglas
- Un combo solo puede contener productos de tipo `PRODUCT` (no combos dentro de combos). Máx. 10 productos distintos por combo, cantidad por componente 1..100.
- Armar exige stock suficiente de **todos** los componentes. Si a uno no le alcanza, no se arma nada y el error dice cuál falta y cuánto hay.
- Todo en una transacción, bloqueando las filas de los componentes en **orden fijo de id** (reutiliza el patrón `lockAll` de `InventoryService`). El stock sigue cambiando **solo** desde `InventoryService`.
- Los movimientos de armado **no** son `SALE`: los reportes de ventas no deben contarlos.
- Un combo admite oferta de precio (fase 1) porque es un producto normal.
- Un componente puede estar oculto o agotado después; no afecta a los combos ya armados.

### 3.3 Endpoints
- `POST /api/v1/admin/combos`: crea el combo y arma las primeras unidades.
  `{ name, description, imageUrl, price, minStock, maxStock, featured, available, items: [{productId, quantity}], unitsToBuild }` (`unitsToBuild` 1..1000).
- `POST /api/v1/admin/combos/{id}/build` con `{ "units": n, "reason": "opcional" }`: **"armar más"**. Indispensable: los combos fijos se venderán y habrá que rearmarlos.
- `GET /api/v1/admin/combos/{id}`: incluye composición y `buildableNow` (cuántos combos más se podrían armar con el stock actual: mínimo de `floor(stock_componente / cantidad)`).
- Editar un combo (por `PUT /admin/products/{id}` o equivalente) permite nombre, descripción, foto, precio, oferta, umbrales, visibilidad; **rechaza** cambios de composición y de stock.
- Auditoría con detalle: `COMBO_CREATE`, `COMBO_BUILD` (`+30 units, consumed: Whisky x30, Vasos x60`).

### 3.4 Lectura pública
- En lista y detalle de combos: `productType = "COMBO"` y `items: [{ name, quantity }]` ("Incluye: 1 Whisky X, 2 Vasos..."). Sin cantidades de stock.
- El orden del catálogo (1.4) ya los prioriza.

## 4. Fase 3 · Promoción "lleva N, paga M" (migración V6)

Hacer esta fase **después** de que la 1 y la 2 estén verificadas; toca la fórmula del dinero en la creación del pedido y hay que ser muy cuidadoso. Ejemplos de la dueña: 2x1 (lleva 2, paga 1), 3x2 (lleva 3, paga 2). **Misma promoción sobre el mismo producto**; no se mezclan productos distintos.

### 4.1 Esquema
- `products.promo_buy SMALLINT NULL`, `promo_pay SMALLINT NULL`, `promo_ends_at TIMESTAMPTZ NULL`.
- CHECK: ambos nulos o ambos con valor; `promo_buy > promo_pay` y `promo_pay >= 1`.
- `order_items.promo_discount NUMERIC(10,2) NOT NULL DEFAULT 0` con CHECK `promo_discount >= 0 AND promo_discount <= quantity * unit_price`.
- **Reemplaza** `ck_items_subtotal` (`subtotal = quantity * unit_price`) por `subtotal = quantity * unit_price - promo_discount`.

### 4.2 Reglas
- Fecha de fin **obligatoria** al fijar la promoción, futura. Se evalúa por fecha como las ofertas (promoción activa = campos completos y `promo_ends_at IS NULL OR promo_ends_at > now()`).
- Una promoción "lleva N paga M" y una oferta de precio **no pueden coexistir** en el mismo producto en esta versión (el servicio lo rechaza con un mensaje claro). Tampoco en combos.
- Cálculo (función pura, en una clase aparte, con pruebas unitarias):
  `grupos = floor(q / promo_buy)`; `unidades_gratis = grupos × (promo_buy − promo_pay)`;
  `promo_discount = unidades_gratis × unit_price`; `subtotal = q × unit_price − promo_discount`.
  Si `q < promo_buy`, no hay descuento. Las unidades sueltas que no completan un grupo se pagan completas.
- **El stock baja por todas las unidades** que recibe el cliente (`quantity`), no por las pagadas.
- La línea del pedido guarda `promo_type = 'BUY_X_PAY_Y'`, `quantity` (lo que recibe) y `promo_discount`. El total del pedido y el límite de S/ 700 para DNI usan el subtotal ya descontado.
- Un pedido pendiente conserva el descuento aunque la promoción venza antes de confirmarlo.
- Mensaje de WhatsApp y texto de boleta: mostrar la línea con la promoción, por ejemplo `3 x Pilsen (lleva 3 paga 2: -S/ 40.00)`, y que el total cuadre con lo cobrado.

### 4.3 Endpoints
- `PUT /api/v1/admin/products/{id}/promo` con `{ "buy": 3, "pay": 2, "endsAt": "..." }` y `DELETE /api/v1/admin/products/{id}/promo`. Auditoría `PROMO_SET` / `PROMO_CLEAR` con detalle.
- Catálogo público: `promoBuy`, `promoPay`, `promoLabel` ("Lleva 3, paga 2"), `promoEndsAt`. Cuenta como `onOffer` para el filtro y el orden.

## 5. Pruebas esperadas

Hay poco tiempo de pruebas manuales y esta es la parte donde un error cuesta dinero, así que:
- **Pruebas unitarias (JUnit 5, ya viene con `spring-boot-starter-test`)** solo para lógica pura: la regla de oferta activa, el cálculo de "lleva N paga M" (casos: q menor que N, múltiplo exacto, múltiplo con sobrante, redondeo, 2x1, 3x2) y el cálculo de `buildableNow`.
- Pruebas manuales contra mi Postgres, informando el resultado de cada una:
  - Fase 0: producto oculto no sale en lista ni detalle (404); visibilidad por lote; filtros del panel; orden del catálogo (agotados al final); recepción por lote todo o nada.
  - Fase 1: oferta con fecha futura aparece; con fecha pasada deja de aparecer y el precio vuelve al normal (insertando una fecha pasada directamente en la base para simularlo); pedido con oferta activa guarda `promo_type='OFFER'` y precios correctos; pedido pendiente conserva el precio si la oferta vence antes de confirmar; confirmar descuenta el stock.
  - Fase 2: crear combo de 30 unidades con 3 componentes baja `30 × cantidad` en cada componente y escribe `COMBO_CONSUME` con `combo_id` y `COMBO_BUILD`; armar con un componente insuficiente no cambia nada; el combo se vende y se anula como un producto normal; rechaza cambiar composición.
  - Fase 3: los casos de la sección 4.2 de punta a punta, incluido que el total del pedido, el mensaje y la restricción de la base cuadran.
- Restaura la base al terminar.

## 6. Documentación y pendientes (déjalos escritos)

Actualiza `backend/ENDPOINTS.md` con todo lo nuevo. En `CONTEXTO-BRINDA.md` agrega:
- Las decisiones de este lote: ocultar = `is_available=false`, agotado automático con stock 0, ofertas con fecha de fin obligatoria evaluadas por fecha, combos pre-armados con composición fija y movimientos propios (no venta), "lleva N paga M" sobre el mismo producto, orden del catálogo, recepción de mercadería por lote.
- Una sección **"Pendientes antes de producción"** con esto, que **no hay que implementar ahora**:
  1. IP real detrás del proxy: `ClientIp` usa `getRemoteAddr()` y el comentario asume que `forward-headers-strategy=framework` lo corrige; no está confirmado. Probar en staging y, si hace falta, usar la estrategia `native` con proxies de confianza. Si no, el límite de 5 pedidos por minuto se compartiría entre todos los clientes.
  2. Crear la cuenta real de la dueña (script o endpoint) y desactivar la del seed.
  3. El umbral de S/ 700 para DNI está duplicado (propiedad y `ck_orders_dni_700` fijo): si el contador dice otro valor, nueva migración.
  4. `DNI_ENCRYPTION_KEY`: respaldarla aparte; no hay rotación. Perderla deja los DNI ilegibles.
  5. Decidir si el hijo tendrá rol de cajero (hoy todo el panel exige ROLE_ADMIN).
  6. Fotos de productos: hoy solo `image_url`, sin subida de archivos. Decidir dónde viven.
  7. Cookie `SameSite=Strict`: requiere dominio propio con frontend y API como subdominios del mismo sitio; con `*.vercel.app` y `*.railway.app` la sesión no se mantendría.
  8. Bloqueo de cuenta por intentos: el usuario `admin` es fácil de adivinar y se puede bloquear a la dueña. Usar un nombre de usuario menos obvio y mantener el límite por IP.
  9. Sesión de 8 horas sin invalidación en logout o cambio de clave; sin refresh token (decisión consciente).
  10. Sin captcha en pedidos; el límite por IP está en memoria (se reinicia con la app).
  11. No se registran los pedidos rechazados por falta de stock (demanda perdida).
  12. Desarmar combos (los tipos de movimiento ya quedan permitidos), ofertas programadas con fecha de inicio, y promociones que mezclan productos.
  13. Validar con el asesor: publicidad y venta de cigarros y alcohol en un catálogo en línea.
  14. Sin tests automáticos de integración; solo los unitarios de la sección 5.
  15. No subir `backend/.env` ni compartirlo; usar claves nuevas (`JWT_SECRET`, `DNI_ENCRYPTION_KEY`, contraseñas de base) en producción.

## 7. Al terminar cada fase, responde con
- Qué migración/archivos cambiaste (lista corta).
- Qué probaste y el resultado (tabla breve).
- Qué decisiones tomaste por tu cuenta.
- Qué quedó pendiente o te preocupa.
- Confirma que la base de pruebas quedó restaurada.
