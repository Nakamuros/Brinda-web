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
