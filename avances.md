# BRINDA — Avances

> Registro de estado. Se actualiza al terminar cada tarea. Decisiones: `CONTEXTO-BRINDA.md` (secciones 18 y 19).

## Estado actual (2026-10-22) · Backend cerrado para el Hito 1

### Backend
- Spring Boot 3.4.5 / Java 21, paquete `com.brinda.api`. Módulos: `auth`, `catalog`, `inventory`, `delivery`, `order`, `combo`, `shared`, `config`.
- BD PostgreSQL 16: migraciones **V1–V9** (esquema, índices/triggers, ofertas con fecha de fin, combos, "lleva N paga M", DNI siempre obligatorio, `token_version`). Seed de desarrollo en `database/seed-dev/` (solo perfil `local`); zonas y distritos son datos de referencia (V4).
- Seguridad: JWT en cookie HttpOnly (8 h, sin refresh token), invalidación por `token_version`, bloqueo por intentos, DNI cifrado AES-GCM, rate limiting por IP, protecciones del seed en producción.
- Pedidos: precios, tarifa y total calculados en servidor; vencimiento a 20 min (un pedido vencido aún se puede confirmar); enlace de WhatsApp con contenido de combos.
- Imágenes: carga manual (`products.image_url` + `IMAGES_BASE_URL`, plantilla `database/templates/update_image_urls.sql`).

### Verificación
- 45 tests unitarios en verde.
- Colección Postman (`postman/`) ejecutada con Newman contra la API real: **133 peticiones, 170 aserciones, 0 fallos** (incluye EXPIRED, 429, bloqueo y token invalidado).
- V1–V9 aplicadas con Flyway sobre una BD nueva; `brinda_app` sin `DELETE` verificado por psql.

### Entorno de desarrollo (PC nueva)
- Claves de `brinda_owner` y `brinda_app` rotadas (aleatorias, solo en `backend/.env`); `01_create_roles.sql` ya no trae claves (variables de psql, ver `database/README.md`). Las anteriores siguen en el historial de git (`b96ece0`).
- Docker: contenedor `brinda-db` (Postgres 16, `127.0.0.1:5433`), compose en `brinda-db/`; claves en `brinda-db/.env` y `backend/.env` (ignorados por git).
- Java: JDK 21 Temurin en `C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot`. El Java global es el 25 (Lombok no compila ahí): para compilar o correr, apuntar `JAVA_HOME` al 21.
- Arranque: `mvn spring-boot:run` en `backend/` (perfil `local`, puerto 8080).
- DBeaver: conexiones `brinda-owner`, `brinda-super` y `brinda-app` (sin contraseñas guardadas).
- La BD local quedó con los datos de prueba de la colección Postman; para volver al seed, recrearla o restaurar un dump de `backups/`.
- Grafo: `graphify-out/` + `.graphifyignore` (excluye `.claude/`, `graphify-out/`, `backups/`).

## Frontend (Hito 2) · Landing (2026-10-25)
- `frontend/`: Angular 21 (standalone, signals, zoneless, rutas lazy, CSS plano, sin SSR). Rutas: `/` landing y `/catalogo` provisional (prueba de View Transitions). No conecta con la API todavía.
- Dependencias: `gsap@3.15.0` (licencia "no charge", uso comercial permitido) y `lenis@1.3.27` (MIT). `playwright` solo en devDependencies (scripts en `frontend/scripts/`, capturas en `frontend/capturas/`, ignorada por git; nunca entra al bundle).
- Landing completa: barra de anuncio, nav (transparente→sólida, menú móvil a pantalla completa), hero, presentación, categorías, combos y promociones, cómo pedir, zonas/horario/contacto y pie con espacio reservado para avisos legales. Paleta y tipografías como variables CSS (`src/styles/tokens.css`, único lugar con hex).
- Todo lo editable está en `src/app/core/config.ts`: **para activar el video del hero basta con poner la URL en `HERO.videoUrl`** (más `videoMobileUrl`, `videoWebmUrl`, posters). `HeroVideo` solo carga video si hay URL, movimiento permitido y sin ahorro de datos; si falla vuelve al poster.
- Animaciones: solo transform/opacity, GSAP+ScrollTrigger (reveals, parallax), Lenis (scroll suave, desactivado con reduced-motion), View Transitions del router, hero con CSS.
- Verificación: 12 tests (Vitest) en verde, `ng build` de producción OK (~65 KB iniciales transferidos), capturas con Playwright a 360/768/1440 px sin scroll horizontal ni errores de consola, menú móvil (foco, Escape, navegación) y reveals con movimiento normal comprobados.
- Placeholders sintéticos (a reemplazar): `public/media/hero-poster*.svg`, `product-placeholder.svg`, ilustración "sin foto" de categorías/promos.
- Decisiones: nav de escritorio desde 1200 px (por debajo, menú hamburguesa); cigarros fuera de categorías hasta que el asesor confirme; carrito del nav deshabilitado hasta que exista; enlaces legales como "pendientes" (sin páginas aún); promos de la landing son ejemplos rotulados, sin precios.
- Crítica y mejoras (2026-10-25, tras `/impeccable critique`, nota 21/32):
  - P0: CTA burdeos sólido al cierre de "Cómo pedir" y barra fija "Pedir ahora" en celular/tablet (aparece al dejar atrás el hero; hero fantasma intacto). Sin botón de WhatsApp deshabilitado a la vista.
  - P1: marcadores internos ("Por confirmar", "Espacio reservado") solo en desarrollo, con la bandera `SHOW_PENDING = isDevMode()` en `core/config.ts`; en producción se ocultan las columnas sin datos. Las promos de ejemplo se eliminaron: bloque honesto "catálogo en camino" en verde azulado. Sin productos ni precios inventados.
  - P2: la intro se fusionó con el hero (copa debajo del texto en celular/tablet, a la derecha en escritorio), barra de anuncio de una sola línea en celular, el rail muestra la siguiente tarjeta y una pista "Desliza", objetivos táctiles de 44 px. Hasta 1024 px se usa el poster vertical y el video liviano.
  - Menores: Lima nombrada en el subtítulo y en zonas.
  - Tests 14/14, build de producción OK (~65 KB iniciales transferidos). Scripts de verificación en `frontend/scripts/` (`capture.mjs`, `menu.mjs`, `prod-check.mjs`).
  - 2.ª crítica (21/32, sin P0): corregido el texto de promos (sin ejemplo "lleva 3, paga 2"; no inventar promos hasta tener datos), franjas "muy pronto" compactadas (promos y zonas en una línea: "Lima. Distritos con cobertura, muy pronto."), luz de vela del hero en las transiciones de sección (`.candle-edge`, CSS estático en `styles/base.css`) y aviso genérico "+18 · Venta solo para mayores de 18 años" en el pie (el texto legal oficial sigue pendiente del asesor).
  - 3.ª crítica (23/32; parte de la subida es criterio del evaluador): el hero queda con un solo protagonista, la vela con halo y bokeh (la copa vuelve a la presentación, `sections/intro`); en móvil la vela va centrada bajo el texto y sin cortarse. La barra fija "Pedir ahora" se oculta mientras el CTA de "Cómo pedir" está a la vista (`HideOrderBarDirective`, señal `ctaInView`). Combos y zonas se funden en una sola franja "Próximamente" cuando no hay horario ni WhatsApp (`core/info.ts`: `HAS_INFO_SECTION`); con datos reales reaparece la sección de zonas/horario/contacto. Tarjetas del rail más bajas en móvil. 15 tests en verde.
  - Decisión: categorías sin recortes propios hasta tener las fotos reales de Lucía; carrito del menú sigue inerte y `/catalogo` sigue provisional (pendiente: estado "Catálogo muy pronto" y ocultar el carrito en producción).
- Catálogo `/catalogo` (2026-10-26, solo navegación; sin carrito ni checkout todavía):
  - Reemplaza la página provisional. Cabecera con la luz de vela, búsqueda (sin distinguir tildes), fila fija de filtros (categorías + "Ofertas"), rejilla 2/3/4 columnas, "Ver más" por tandas de 12 y detalle en `<dialog>` nativo (hoja desde abajo en celular, ventana en escritorio; muestra "Incluye" en combos y fecha de fin de oferta). Filtros reflejados en la URL (`?categoria=&q=&ofertas=1`); las fichas de la landing enlazan a su categoría.
  - Datos: ver "Conexión con la API" más abajo. `core/catalog.mock.ts` (27 productos de ejemplo) queda solo como herramienta de diseño sin backend: se activa en desarrollo con `localStorage.setItem('brinda.mock','1')`.
  - Piezas nuevas: `models/` (product, category), `services/catalog.service.ts` (signals; estados idle/loading/ready/error/unavailable), `shared/` (`product-card`, `product-detail`, `product-skeleton`, `state-panel`, `rise.directive` entrada escalonada por scroll con Web Animations, `format`). Tintes por categoría movidos a `styles/base.css` (`[data-cat]`). `html.menu-open` ahora bloquea el scroll del fondo.
  - Verificación: `scripts/catalogo.mjs` (37 comprobaciones a 360/768/1440: sin scroll horizontal, objetivos ≥44 px, búsqueda, filtros, URL, foco y Escape en el detalle, combo, consola limpia, reduced-motion) en verde; 15 tests y build de producción sin avisos (~66 KB iniciales); estado "muy pronto" comprobado sobre la build servida.
  - Pendiente del catálogo: conectar `CatalogService` a la API real (`/api/v1/catalog/*`, paginación y búsqueda en servidor con debounce), fotos reales (`imageUrl`), crítica/`audit` del catálogo.
- Carrito local (2026-10-26, sin checkout todavía):
  - `services/cart.service.ts`: signals + `localStorage` (`brinda.cart.v1`, con try/catch y datos corruptos ignorados). Cada línea guarda una copia mínima del producto; al cargar el catálogo se reconcilia (`sync`): refresca precios y marca "ya no disponible" lo agotado o ausente (no suma al total). Tope de 50 por línea (supuesto; el servidor valida el stock real). Importes en céntimos; "lleva N paga M" con la fórmula de `ENDPOINTS.md`. Los totales son estimados: el servidor calcula el real.
  - UI: tarjeta (`article` con botón de detalle + "Agregar" que pasa a selector de cantidad `shared/qty-stepper`), detalle con "Agregar al pedido" (burdeos, es la acción de pedir) y "Ver carrito", ícono del menú con contador (late al cambiar; aviso para lector de pantalla en `LayoutPublic`), página `/carrito` (líneas, resumen con subtotal, promoción y total estimado, "Seguir comprando", "Vaciar carrito"). Sin botón de continuar: llega con el checkout.
  - El ícono del carrito siempre se muestra (el catálogo ahora es real).
  - Verificación: `scripts/carrito.mjs` (61 comprobaciones a 360/768/1440: agregar, selector, contador, agotado sin acción, promo 2×1 = S/ 72.00, total = suma de líneas, persistencia al recargar, quitar, no disponible, vaciar, objetivos ≥44 px, consola limpia, reduced-motion) y `catalogo.mjs` (37) en verde; 24 tests (9 nuevos del servicio y 1 del menú) y build sin avisos (~66 KB iniciales).
  - Siguiente: ver "Checkout" más abajo.
  - Aviso del hook de diseño `broken-image` en `product-card.ts` y `product-detail.ts`: falso positivo (el `<img>` solo se pinta con `imageUrl`); no se pudo silenciar (el ignore se denegó), queda en pie.
- Conexión con la API (2026-10-26): catálogo y carrito leen del backend real.
  - `CatalogService` usa `HttpClient` (`provideHttpClient(withFetch())`): `GET /api/v1/catalog/categories` y `GET /api/v1/catalog/products?page&size=50` (todas las páginas, en paralelo). Filtro y búsqueda siguen en el navegador y conservan el orden del servidor; con catálogos grandes habrá que pasar `q` y `category` al servidor. Estados: cargando (esqueletos), error (reintentar), vacío (API responde sin productos → "Catálogo muy pronto") y listo.
  - `API_URL = '/api/v1'` (relativa). En desarrollo la atiende `frontend/proxy.conf.json` (`/api` → `localhost:8080`, en `angular.json` → serve), sin CORS y válido desde el celular por la red local. En producción hará falta un proxy/rewrite `/api/*` del hosting hacia el backend, o una URL absoluta (decidir al desplegar; la cookie `SameSite=Strict` exige dominio propio).
  - Arranque local: Docker Desktop → contenedor `brinda-db` (BD `brinda`, 5433); `mvn spring-boot:run -Dspring-boot.run.profiles=local` en `backend/` (JDK 21.0.10 en `C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot`, ya es el Java del PATH; Maven en `C:\maven`); `npx ng serve --host 0.0.0.0` en `frontend/`.
  - Estado de la BD local al conectar: solo tenía migraciones hasta V7 (con baseline V3); al arrancar el backend Flyway aplicó **V8 y V9**. Contiene el seed de desarrollo: 5 productos (Whisky Etiqueta Negra con oferta, Pisco Quebranta, Bolsa de Hielo, Piqueo Mixto, Whisky Reserva), 4 categorías (Piscos y Whiskys, Snacks, Hielo y Bebidas, Combos y promociones), 20 distritos y el usuario `admin` del seed. No se borró nada.
  - Desajuste conocido: las fichas de categorías de la landing (`CATEGORIES` en `core/config.ts`: cervezas, vinos, …) no coinciden con las categorías de la BD; su enlace `?categoria=` se ignora si el slug no existe. Resolver cuando Lucía defina categorías reales (idealmente la landing las leerá de la API).
  - Verificación: `scripts/catalogo-api.mjs` (21 comprobaciones contra la API real a 360/768/1440: mismos productos y nombres que la API, chips = categorías de la API, oferta real, sin rótulo de ejemplo, consola limpia), estados vacío y API caída comprobados interceptando respuestas, `catalogo.mjs` y `carrito.mjs` (con la bandera de ejemplo) en verde; 27 tests (3 nuevos del servicio HTTP) y build sin avisos (~72 KB iniciales).
- Checkout `/pedido` (2026-10-26, solo formulario; el botón NO hace nada por decisión del usuario):
  - Desde el carrito, "Continuar con el pedido" (burdeos) → `/pedido`. Sin productos disponibles muestra el estado "carrito vacío".
  - Campos según `CreateOrderRequest`: nombres, apellidos, celular (9 dígitos), DNI (8), distrito (dropdown nativo agrupado por zona, de `GET /api/v1/delivery/districts`), dirección, referencia (opcional), pago Yape/Plin y las casillas +18, términos y privacidad. Validación de las mismas reglas del backend; los errores salen al tocar el campo; celular y DNI solo aceptan dígitos. El DNI y demás datos viven solo en memoria (no se guardan en el navegador).
  - Resumen: líneas, subtotal, promoción, **delivery según el distrito elegido** (tarifa estimada de la API) y total estimado (carrito + tarifa).
  - "Finalizar compra" es un `button` sin acción: no valida, no crea el pedido (`POST /api/v1/orders`) ni abre WhatsApp. Verificado: sin peticiones POST ni pestañas nuevas.
  - Piezas: `services/delivery.service.ts`, `models/district.ts`, `shared/form-field.ts` (etiqueta + error/ayuda), estilos globales `.input`/`.check` en `styles/base.css` (servirán al admin).
  - Pendiente (siguiente etapa): al finalizar, validar todo el formulario, `POST /api/v1/orders` (items con `productId` y cantidad; el servidor recalcula precios y tarifa; límite 5/min por IP → mensaje para 429), pantalla `/pedido/:codigo` con código corto, aviso de 20 min y "Enviar por WhatsApp" (`whatsappUrl` de la respuesta), vaciar el carrito al crear el pedido. Enlaces a términos y privacidad cuando el asesor entregue los textos. Tarifas y distritos de la BD son provisionales (V4).
  - Verificación: `scripts/pedido.mjs` (64 comprobaciones a 360/768/1440 contra la API real: 20 distritos y 3 zonas, tarifa de Barranco +6 y Callao +13 sobre el total del carrito, validaciones, formulario válido, DNI no guardado, botón sin efecto, objetivos ≥44 px, consola limpia); 33 tests (6 nuevos de `Pedido`, 3 del servicio de catálogo); build sin avisos (~73 KB iniciales; el chunk `pedido` pesa ~14 KB transferidos por traer `@angular/forms`).
- Pendiente: probar en celular real por red local, `DESIGN.md` y contrato de dirección (`/impeccable document`), crítica/auditoría (`critique`, `audit`), pulido de movimiento, assets reales de Lucía.

## Pendientes antes de producción
Detalle y estado de cada uno en `CONTEXTO-BRINDA.md` sección 19. Los principales:
- Cuenta real de la dueña y desactivar el `admin` del seed; respaldar `DNI_ENCRYPTION_KEY` y usar claves nuevas.
- IP real detrás del proxy (staging) y dominio propio (cookie `SameSite=Strict`).
- Legal con el asesor de Lucía: licor y cigarros, términos, libro de reclamaciones, política de privacidad.
- Datos reales de Lucía: tarifas, distritos, `WHATSAPP_NUMBER`, `YAPE_NUMBER`, `PLIN_NUMBER` (hoy son de prueba).

## Qué sigue
1. **Frontend Angular (Hito 2)**: catálogo, carrito/checkout (casillas de mayor de 18, términos y privacidad), panel admin.
2. **Datos reales de Lucía** y creación de su cuenta.
3. **Despliegue**: Angular en Vercel/Netlify, Spring Boot en Railway, Postgres gestionado, dominio en Cloudflare, cuentas a nombre de Lucía.

## Historial resumido
- 2026-10-19: diseño cerrado, DDL, seeds, esqueleto del backend y módulos de inventario, delivery y pedidos; lote V4 (V4–V7: ofertas, combos, "lleva N paga M").
- 2026-10-22: vencimiento a 20 min; refresh token descartado; V8 (DNI siempre); imágenes por URL base; V9 (`token_version`); colección Postman; entorno de la PC nueva; acuerdos por escrito en `CLAUDE.md` y `CONTEXTO-BRINDA.md`.
