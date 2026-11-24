# Graph Report - BRINDA  (2026-11-23)

## Corpus Check
- 5 files · ~138,565 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2381 nodes · 6304 edges · 116 communities (79 shown, 37 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 330 edges (avg confidence: 0.86)
- Token cost: 98,401 input · 0 output

## Community Hubs (Navigation)
- Controladores y sesión (backend)
- Visibilidad de productos
- Correo de reclamos
- Sesión del panel (frontend)
- Control de edad y servicios públicos
- Carrito y producto (frontend)
- PDF e imágenes
- Sesión del panel (frontend) · @angular/router
- Requests y propiedades
- Detalle y lista de reclamos
- Catálogo y paginación
- Entidades y DTOs
- Control de edad y servicios públicos · config.ts
- Repositorios JPA
- Repositorios JPA · org.springframework.data.jpa.repository.JpaReposito
- Configuración Angular
- Controladores y sesión (backend) · District
- Manejo de errores API
- Combos
- Config legal y pie
- Contadores y plazos de reclamos
- Formulario público del Libro
- Registro de reclamos
- Utilidades de tests
- BusinessRuleException
- Panel de reclamos (frontend)
- Roles y JWT
- Filtro JWT
- Plantillas del panel admin
- Sesión del panel (frontend) · pedidos-lista.ts
- Configuración Spring
- Detalle de pedido (backend)
- Control de edad y servicios públicos · layout-public.ts
- Toolchain Angular
- AuthService
- Lleva N paga M
- Scripts Playwright
- PDF de la hoja
- Componentes de diseño
- Productos (servicio admin)
- Checkout y control de edad
- Modelo de datos (ERD)
- Brief de frontend
- ENDPOINTS.md (API v1)
- Movimientos de stock
- ImageStore
- Flujo del pedido (guardar con codigo cor
- Pruebas del carrito
- pedido-real.mjs
- Pedido y WhatsApp (producto)
- .buildableNow()
- ValidDocument.java
- Components
- PROMPT-CLI-V4.md (lote V4: ofertas, comb
- ReclamosLista
- CreateComplaintRequest
- Counting
- db
- Critique landing ronda 1 (21/32)
- RateLimitFilter
- Estado del proyecto (avances)
- Estado del proyecto (avances) · CLAUDE.md (directrices del proyecto)
- Dependencias npm
- Scripts Playwright · ref_node_fs
- .isActive()
- DNI obligatorio y cifrado (para boletas)
- Seguridad (seccion 7)
- Identidad visual (tipografia, paleta com
- Sistema de diseño
- admin-productos.mjs
- Despliegue y base de datos
- Despliegue y base de datos · SECURITY-REPORT.md
- admin-pedidos.mjs
- ProductosLista
- Catalogo
- Checkout /pedido
- Correo de reclamos · UserRepository
- .line()
- ClientIpTest
- Frontend
- Zonas
- .isActive() · .isActive()
- Pedido
- Flujo del pedido (guardar con codigo cor · Flujo del pedido (guardar c
- Fase 0: ajustes de la revision
- Despliegue y base de datos · database/README.md
- 2026-10-26T01-33-07Z__src-app-pages-publ
- 2026-10-26T01-47-10Z__src-app-pages-publ
- 2026-10-26T01-59-53Z__src-app-pages-publ
- admin.mjs
- ReclamoDetalle
- SiteNav
- Estado del proyecto (avances) · Panel /admin
- Configuración Spring · org.springframework.context.annotation.Configur
- ComboNuevo
- BrindaApplication.java
- .resolve()
- Decisiones del frontend Hito 2
- Sistema de diseño · Colors
- scripts
- Scripts Playwright · pedido-creado.mjs
- PedidosLista
- Carrito y producto (frontend) · ProductDetail
- Detalle y lista de reclamos · Level
- Requests y propiedades · CreateOrderRequestDniTest
- Ventas
- PublicProductResponseTest.java
- Componentes de diseño · Typography
- Hitos 1-3 del plan de trabajo
- environment.production.ts
- Garantia y acuerdos con el cliente
- Rappi (canal posterior, stock compartido
- com.brinda:api

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 81 edges
2. `Product` - 68 edges
3. `Complaint` - 53 edges
4. `BusinessRuleException` - 51 edges
5. `@angular/router` - 44 edges
6. `AuthenticatedUser` - 40 edges
7. `Order` - 38 edges
8. `CatalogAdminService` - 35 edges
9. `apiError()` - 35 edges
10. `ResourceNotFoundException` - 29 edges

## Surprising Connections (you probably didn't know these)
- `Verificado correcto (sin cambios)` --references--> `ProdSeedGuard`  [INFERRED]
  SECURITY-REPORT.md → backend/src/main/java/com/brinda/api/config/ProdSeedGuard.java
- `No aplica / no existe` --references--> `NoopEmailSender`  [INFERRED]
  SECURITY-REPORT.md → backend/src/main/java/com/brinda/api/shared/mail/NoopEmailSender.java
- `4. Qué NO se rescata (propio de IntelliMarket)` --references--> `AuthService`  [INFERRED]
  FRONTEND-BRIEF-BRINDA.md → backend/src/main/java/com/brinda/api/auth/service/AuthService.java
- `Cambios sin commitear y agrupación sugerida` --references--> `GlobalExceptionHandler`  [INFERRED]
  SECURITY-REPORT.md → backend/src/main/java/com/brinda/api/shared/exception/GlobalExceptionHandler.java
- `Hallazgos` --references--> `GlobalExceptionHandler`  [INFERRED]
  SECURITY-REPORT.md → backend/src/main/java/com/brinda/api/shared/exception/GlobalExceptionHandler.java

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Etapas A, B y C del Libro de Reclamaciones** — avances_etapa_a_libro, avances_etapa_b_libro, avances_etapa_c_libro, avances_libro_de_reclamaciones [EXTRACTED 1.00]
- **Ciclo de vida del pedido BRINDA (crear, WhatsApp, pago manual, Finalizada, stock)** — contexto_brinda_flujo_pedido, contexto_brinda_order_code, contexto_brinda_whatsapp_message, contexto_brinda_pago_yape_plin, contexto_brinda_boton_finalizada, contexto_brinda_stock_movements, contexto_brinda_expiration_job [EXTRACTED 1.00]
- **Lote V4: ofertas, combos y lleva N paga M** — prompt_cli_v4_fase1_offers, prompt_cli_v4_fase2_combos, prompt_cli_v4_fase3_promo, contexto_brinda_price_offers, contexto_brinda_combos, contexto_brinda_buy_n_pay_m, contexto_brinda_catalog_order [EXTRACTED 1.00]
- **Admin paginated list pattern (filters, rows, badges, pager)** — frontend_src_app_admin_pedidos_pedidos_lista_template, frontend_src_app_admin_productos_productos_lista_template, frontend_src_app_admin_reclamos_reclamos_lista_template [INFERRED 0.85]
- **Flujo de checkout: formulario, edad, carrito, distrito, envío y pantalla del pedido** — frontend_src_app_pages_public_pedido_pedido_form, frontend_src_app_pages_public_pedido_pedido_adult_radios, avances_cartservice, avances_deliveryservice, avances_orderservice, avances_pedido_creado [INFERRED 0.85]
- **Verificación de mayoría de edad (modal, radios del checkout, adultConfirmed)** — avances_control_de_edad, frontend_src_app_pages_public_pedido_pedido_adult_radios, avances_adult_confirmed, avances_edad_en_el_checkout [INFERRED 0.85]
- **Sistema de identidad visual BRINDA** — contexto_brinda_palette, contexto_brinda_typography, contexto_brinda_hybrid_design, frontend_brief_brinda_visual_identity, frontend_brief_brinda_contrast_table, frontend_brief_brinda_design_guidelines, frontend_brief_brinda_ghost_button [INFERRED 0.85]
- **Libro de Reclamaciones: public form to admin response** — frontend_src_app_pages_public_libro_reclamaciones_libro_reclamaciones_template, frontend_src_app_pages_public_libro_reclamaciones_complaint_form_template, frontend_src_app_admin_reclamos_reclamos_lista_template, frontend_src_app_admin_reclamos_reclamo_detalle_template [INFERRED 0.95]

## Communities (116 total, 37 thin omitted)

### Community 0 - "Controladores y sesión (backend)"
Cohesion: 0.05
Nodes (36): AuthController, ChangePasswordRequest, LoginRequest, UserResponse, AuthenticatedUser, CatalogAdminController, VisibilityResponse, CatalogController (+28 more)

### Community 1 - "Visibilidad de productos"
Cohesion: 0.06
Nodes (16): AdminProductResponse, ProductRequest, ProductVisibility, ALL, HIDDEN, VISIBLE, Line, PublicProductResponse (+8 more)

### Community 2 - "Correo de reclamos"
Cohesion: 0.06
Nodes (21): EmailInfo, EmailDelivery, EmailStatus, FAILED, PENDING, SENT, ComplaintEmailRetryJob, ComplaintEmailTemplates (+13 more)

### Community 3 - "Sesión del panel (frontend)"
Cohesion: 0.07
Nodes (29): apiError(), Categorias, Line, amount(), Draft, EMPTY, IMAGE_TYPES, ProductoForm (+21 more)

### Community 4 - "Control de edad y servicios públicos"
Cohesion: 0.06
Nodes (17): MediaPrefs, NetworkInformationLike, ScrollService, NAV_ITEMS, NavItem, CatalogoSoon, HeroVideo, Setup (+9 more)

### Community 5 - "Carrito y producto (frontend)"
Cohesion: 0.07
Nodes (18): CartLine, Product, ProductLine, Carrito, CartService, cents(), lineTotals(), MAX_QTY (+10 more)

### Community 6 - "PDF e imágenes"
Cohesion: 0.06
Nodes (6): OfferRule, PaymentMethod, PLIN, YAPE, ImageUrls, MigrationsSeedGuardTest

### Community 7 - "Sesión del panel (frontend) · @angular/router"
Cohesion: 0.06
Nodes (19): AdminAuth, AdminUser, adminGuard(), runGuard(), AdminPassword, LayoutAdmin, AdminLogin, ORDER (+11 more)

### Community 8 - "Requests y propiedades"
Cohesion: 0.11
Nodes (4): ComplaintProperties, OrderProperties, WhatsAppMessageBuilder, WhatsAppMessageBuilderTest

### Community 9 - "Detalle y lista de reclamos"
Cohesion: 0.09
Nodes (15): ComplaintDetailResponse, ComplaintSummaryResponse, DeadlineInfo, ComplaintStatus, ANSWERED, RECEIVED, ComplaintType, CLAIM (+7 more)

### Community 10 - "Catálogo y paginación"
Cohesion: 0.09
Nodes (3): AuditService, ResourceNotFoundException, SlugUtil

### Community 11 - "Entidades y DTOs"
Cohesion: 0.11
Nodes (4): User, Category, AuditLog, Auditable

### Community 12 - "Control de edad y servicios públicos · config.ts"
Cohesion: 0.07
Nodes (21): CONTACT, HERO, HOW_TO_ORDER, IMAGES, ORDER, PENDING, SHOW_PENDING, SITE (+13 more)

### Community 13 - "Repositorios JPA"
Cohesion: 0.10
Nodes (14): ProductRepository, PendingCountResponse, Day, Inventory, SalesReportResponse, TopProduct, OrderStatus, CANCELLED (+6 more)

### Community 14 - "Repositorios JPA · org.springframework.data.jpa.repository.JpaReposito"
Cohesion: 0.09
Nodes (12): MovementType, ADJUSTMENT, CANCEL_RETURN, COMBO_BUILD, COMBO_CONSUME, COMBO_DISASSEMBLE, COMBO_RETURN, RESTOCK (+4 more)

### Community 15 - "Configuración Angular"
Cohesion: 0.05
Nodes (41): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+33 more)

### Community 16 - "Controladores y sesión (backend) · District"
Cohesion: 0.11
Nodes (10): DistrictRequest, DistrictResponse, PublicDistrictResponse, ZoneResponse, DeliveryZone, District, DeliveryZoneRepository, DistrictRepository (+2 more)

### Community 17 - "Manejo de errores API"
Cohesion: 0.13
Nodes (4): ErrorResponse, GlobalExceptionHandler, InvalidCredentialsException, GlobalExceptionHandlerTest

### Community 18 - "Combos"
Cohesion: 0.09
Nodes (10): CategoryRepository, CatalogService, ComboDetailResponse, Line, CreateComboRequest, Item, ComboItem, ComboItemRepository (+2 more)

### Community 19 - "Config legal y pie"
Cohesion: 0.08
Nodes (20): LEGAL, SiteFooter, District, CreatedOrder, CreateOrderRequest, HOUR, METHOD, PedidoCreado (+12 more)

### Community 20 - "Contadores y plazos de reclamos"
Cohesion: 0.12
Nodes (7): ComplaintCountsResponse, RespondComplaintRequest, BusinessDays, ComplaintAdminService, PdfFile, ComplaintDeadlines, ComplaintAdminTest

### Community 21 - "Formulario público del Libro"
Cohesion: 0.08
Nodes (17): ComplaintForm, DATE, DOC, FieldName, LIMITS, MESSAGES, check(), CREATED (+9 more)

### Community 22 - "Registro de reclamos"
Cohesion: 0.11
Nodes (7): CreatedComplaintResponse, Complaint, ComplaintNumberGenerator, ComplaintRepository, ComplaintService, Created, ComplaintServiceTest

### Community 23 - "Utilidades de tests"
Cohesion: 0.10
Nodes (3): CryptoProperties, DniCipher, EmailSendException

### Community 24 - "BusinessRuleException"
Cohesion: 0.11
Nodes (12): CreatedOrderResponse, Line, Payment, CreateOrderRequest, Item, Item, OrderItem, PromoType (+4 more)

### Community 25 - "Panel de reclamos (frontend)"
Cohesion: 0.14
Nodes (21): ComplaintCounts, ComplaintDetail, ComplaintFilters, ComplaintPage, ComplaintStatus, ComplaintSummary, ComplaintType, days() (+13 more)

### Community 26 - "Roles y JWT"
Cohesion: 0.11
Nodes (7): Role, ROLE_ADMIN, ROLE_CASHIER, JwtProperties, JwtService, Session, JwtServiceTest

### Community 27 - "Filtro JWT"
Cohesion: 0.11
Nodes (3): JwtAuthenticationFilter, BodySizeLimitFilter, BcryptHash

### Community 28 - "Plantillas del panel admin"
Cohesion: 0.08
Nodes (26): Admin Categorias template (edit/create, displayOrder), Order status lifecycle (PENDING/EXPIRED/CONFIRMED/CANCELLED, stock on confirm), PII read audit (lectura registrada en auditoria), Admin PedidoDetalle template (confirm/cancel, copy delivery/receipt), Admin PedidosLista template (code/status filters, pager), Combo assembly deducts component stock (composition immutable), Admin ComboNuevo template (composition lines, units to build), Offer vs buy-X-pay-Y promo mutual exclusion (+18 more)

### Community 29 - "Sesión del panel (frontend) · pedidos-lista.ts"
Cohesion: 0.12
Nodes (8): PedidoDetalle, ORDER_STATUS, OrderDetail, OrdersAdmin, OrderStatus, OrderSummary, formatDateTime(), Page

### Community 31 - "Detalle de pedido (backend)"
Cohesion: 0.17
Nodes (7): OrderDetailResponse, TextResponse, Order, OrderChannel, STORE, WHATSAPP, OrderAdminService

### Community 32 - "Control de edad y servicios públicos · layout-public.ts"
Cohesion: 0.11
Nodes (6): AgeGate, AGE_GATE, AgeGateDialog, lock, AnnouncementBar, LayoutPublic

### Community 33 - "Toolchain Angular"
Cohesion: 0.11
Nodes (23): @angular/compiler@^21.2.0, tslib@^2.3.0, devDependencies, @angular/build@^21.2.28, @angular/cli@^21.2.28, @angular/compiler-cli@^21.2.0, jsdom@^28.0.0, playwright@^1.64.1 (+15 more)

### Community 34 - "AuthService"
Cohesion: 0.13
Nodes (11): SecurityProperties, AuthService, SecurityPropertiesTest, Acciones manuales (tuyas), Cambios sin commitear y agrupación sugerida, Decisiones pendientes, Hallazgos, No aplica / no existe (+3 more)

### Community 35 - "Lleva N paga M"
Cohesion: 0.24
Nodes (4): BuyXPayYCalculator, Result, SecurityAutoConfigTest, BuyXPayYCalculatorTest

### Community 36 - "Scripts Playwright"
Cohesion: 0.13
Nodes (12): AGE_KEY, passAgeGate(), sizes, out, sizes, errors, districts, far (+4 more)

### Community 38 - "Componentes de diseño"
Cohesion: 0.14
Nodes (11): Control de edad (+18) modal, Barra fija "Pedir ahora", Boton CTA burdeos, Boton fantasma (hero), Paleta BRINDA (marron medianoche, ciruela, crema, laton, burdeos, terracota, petroleo), Como pedir (4 pasos), Hoja de Reclamacion (formulario), Avisos legales y logo del Libro (+3 more)

### Community 40 - "Checkout y control de edad"
Cohesion: 0.15
Nodes (19): adultConfirmed (confirmación +18), CartService (carrito local), Catálogo /catalogo, CatalogService, Checkout /pedido, Control de edad (age gate), CreateOrderRequest, Cumplimiento legal en el frontend (+11 more)

### Community 41 - "Modelo de datos (ERD)"
Cohesion: 0.18
Nodes (17): Tabla AUDIT_LOGS, Tabla CATEGORIES, Combos pre-armados con composicion fija, Zonas de delivery con tarifa fija por zona, Tabla DELIVERY_ZONES, Tabla DISTRICTS, Modelo de datos ERD v2, Tabla ORDER_ITEMS (+9 more)

### Community 42 - "Brief de frontend"
Cohesion: 0.11
Nodes (19): 10. Animaciones (alcance por pantalla), 11. Landing: secciones (primera pantalla a construir), 12. Material visual (assets), 13. Cómo usar este documento, 1. El producto, 2. Stack y convenciones (tomadas de IntelliMarket), 3. Estructura rescatada de IntelliMarket (solo el esqueleto), 4. Qué NO se rescata (propio de IntelliMarket) (+11 more)

### Community 43 - "ENDPOINTS.md (API v1)"
Cohesion: 0.14
Nodes (17): Etapa A Libro (backend, V10, PDF), Libro de Reclamaciones, NoopEmailSender / EmailSender, Apache PDFBox 3.0.4, Qué sigue, V10__complaints.sql, ENDPOINTS.md (API v1), Admin endpoints (/api/v1/admin/**) (+9 more)

### Community 44 - "Movimientos de stock"
Cohesion: 0.34
Nodes (3): MovementResponse, InventoryService, StockLine

### Community 45 - "ImageStore"
Cohesion: 0.21
Nodes (3): ImageStore, ImageUploadProperties, ImageStoreTest

### Community 46 - "Flujo del pedido (guardar con codigo cor"
Cohesion: 0.13
Nodes (14): Arquitectura backend por modulos (auth, catalog, inventory, order, delivery, shared, config), Boton Finalizada (confirmar venta y descontar stock), Tarea programada de vencimiento (20 min), IntelliMarket (proyecto de referencia ZIP), Problemas de seguridad del ZIP (no repetir), Estados de pedido PENDING/CONFIRMED/CANCELLED/EXPIRED, Angular 21 standalone + signals + lazy routes + Vitest, Animaciones por pantalla (transform/opacity, reduced-motion, GSAP/Lenis) (+6 more)

### Community 47 - "Pruebas del carrito"
Cohesion: 0.15
Nodes (11): newCtx(), out, sizes, checks, newCtx(), sizes, data, json() (+3 more)

### Community 48 - "pedido-real.mjs"
Cohesion: 0.12
Nodes (4): CLIENT, districts, out, sizes

### Community 49 - "Pedido y WhatsApp (producto)"
Cohesion: 0.15
Nodes (15): POST /api/v1/orders, Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Flujo de pedido (carrito -> WhatsApp -> Yape/Plin -> confirmado), Estados PENDING/CONFIRMED/CANCELLED/EXPIRED (20 min) (+7 more)

### Community 50 - ".buildableNow()"
Cohesion: 0.30
Nodes (3): ComboCalculator, Component, ComboCalculatorTest

### Community 52 - "Components"
Cohesion: 0.14
Nodes (15): Avisos legales, Buttons, Campos de formulario, Category tile, Components, Control de edad (+18), Detalle de producto, Filtros del catálogo (+7 more)

### Community 53 - "PROMPT-CLI-V4.md (lote V4: ofertas, comb"
Cohesion: 0.16
Nodes (12): Docker Compose Postgres 16 (puerto 5433 local), CONTEXTO-BRINDA.md (contexto completo del proyecto), BRINDA licoreria delivery-only (Lima), Lucia (duena de BRINDA), Ofertas de precio con fecha de fin obligatoria, Stack Angular + Spring Boot + PostgreSQL, PROMPT-CLI-V4.md (lote V4: ofertas, combos, promociones), buildableNow (combos armables con stock actual) (+4 more)

### Community 57 - "db"
Cohesion: 0.15
Nodes (12): container_name, environment, image, ports, restart, volumes, POSTGRES_PASSWORD, POSTGRES_USER (+4 more)

### Community 58 - "Critique landing ronda 1 (21/32)"
Cohesion: 0.15
Nodes (12): Critique landing ronda 1 (21/32), P0: sin CTA dominante pedir ahora ni barra fija movil, P1: marcadores internos Por confirmar expuestos, P1: sin producto, precio ni senales de confianza, Critique landing ronda 2 (21/32), P1: copia de promo de ejemplo lleva 3, paga 2, P1: demasiado muy pronto en la pagina, P2: la parte baja pierde la luz de vela (+4 more)

### Community 60 - "Estado del proyecto (avances)"
Cohesion: 0.21
Nodes (10): Cómo pedir (HOW_TO_ORDER, 4 pasos), Etapa C Libro (formulario público), Fixture scripts/fixtures/catalogo.json, Grafo graphify-out, Limpieza y pedido real (2026-11-15), OrderService, /pedido/:codigo (pedido-creado), Resumen 2026-11-22 (+2 more)

### Community 61 - "Estado del proyecto (avances) · CLAUDE.md (directrices del proyecto)"
Cohesion: 0.18
Nodes (10): CLAUDE.md (directrices del proyecto), Skill Graphify (relaciones de datos), Skill Ponytail (eficiencia y minimalismo), Skill Superpowers (stack y componentizacion), Skill Taste / Frontend-Designs, Skill UI PRO MAX + Impecable, Prompt de inicio de sesión (Claude Code), readme.md (arranque local) (+2 more)

### Community 62 - "Dependencias npm"
Cohesion: 0.17
Nodes (12): dependencies, @angular/common@^21.2.0, @angular/core@^21.2.0, @angular/forms@^21.2.0, @angular/platform-browser@^21.2.0, @angular/router@^21.2.0, gsap@^3.15.0, lenis@^1.3.27 (+4 more)

### Community 63 - "Scripts Playwright · ref_node_fs"
Cohesion: 0.17
Nodes (5): api, cats, out, CASES, out

### Community 65 - "DNI obligatorio y cifrado (para boletas)"
Cohesion: 0.25
Nodes (10): Modal de control de edad (+18) primera visita, Verificacion de mayoria de edad (+18), IP real detras del proxy (ClientIp), DNI_ENCRYPTION_KEY (sin rotacion), Ley 29733 de datos personales (DS 016-2024-JUS), Libro de Reclamaciones virtual, Pendientes antes de produccion (seccion 19), Boletas SUNAT (fuera del sistema) (+2 more)

### Community 66 - "Seguridad (seccion 7)"
Cohesion: 0.22
Nodes (7): Dominio .com (Porkbun/Cloudflare), JWT en cookie HttpOnly SameSite=Strict, Rate limiting (login y pedidos por IP), Seguridad (seccion 7), CORS estricto por variable de entorno, Sesion de 8 h con token_version (V9), Despliegue y conexion con la API (cookie, proxy, 429)

### Community 67 - "Identidad visual (tipografia, paleta com"
Cohesion: 0.22
Nodes (9): Paleta BRINDA 60/30/10, Raising the Bar (referencia de tienda), The Violet Hour (referencia visual), Tipografias Libre Baskerville / Limelight / Jost, Como pedir en 3 pasos, Tabla de contraste WCAG de la paleta, Boton fantasma Pedir ahora del hero, Landing: secciones (anuncio, nav, hero, presentacion, categorias, combos, como pedir, zonas, pie) (+1 more)

### Community 68 - "Sistema de diseño"
Cohesion: 0.18
Nodes (11): Design System: BRINDA, Do:, Do's and Don'ts, Don't:, Elevation & Depth, Layout, Named Rules, Named Rules (+3 more)

### Community 69 - "admin-productos.mjs"
Cohesion: 0.18
Nodes (3): env, out, sizes

### Community 70 - "Despliegue y base de datos"
Cohesion: 0.24
Nodes (10): avances.md (Registro de avances BRINDA), Auditoría de seguridad (2026-11-02), CONTEXTO-BRINDA.md (secciones 18 y 19), Preparación del despliegue en Render, Estado actual backend Hito 1 (2026-10-22), Colección Postman / Newman, Pendientes antes de producción, Resumen anterior 2026-10-28 (+2 more)

### Community 71 - "Despliegue y base de datos · SECURITY-REPORT.md"
Cohesion: 0.20
Nodes (9): Auth (/api/v1/auth/*), DNI/CE cifrado AES-256-GCM, JWT HS512 en cookie HttpOnly SameSite=Strict + token_version, Ley 29733 / derechos ARCO (pendiente asesora), S-01 Rate limit evadible por X-Forwarded-For (TRUSTED_PROXY_HOPS), S-03 BodySizeLimitFilter (64 KB), S-04 Spring Boot 3.5.16 (migrar a 4.x), S-11 _headers de Cloudflare Pages (+1 more)

### Community 72 - "admin-pedidos.mjs"
Cohesion: 0.20
Nodes (5): districts, env, out, simOrders, sizes

### Community 75 - "Checkout /pedido"
Cohesion: 0.27
Nodes (7): CREATED, DISTRICTS, fill(), product, render(), select(), submit()

### Community 79 - "Frontend"
Cohesion: 0.22
Nodes (8): Additional Resources, Angular CLI 21.2.28 + Vitest, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests

### Community 83 - "Flujo del pedido (guardar con codigo cor · Flujo del pedido (guardar c"
Cohesion: 0.29
Nodes (5): Panel admin con polling cada 10-15 s, Checkout /pedido y /pedido/:codigo, Codigo corto de pedido (ej. EQ12), Endpoint publico de pedidos, Mensaje de WhatsApp prearmado

### Community 84 - "Fase 0: ajustes de la revision"
Cohesion: 0.32
Nodes (6): Orden del catalogo (stock, promo, combos, destacados, nombre), Lote V4 decisiones (seccion 18), audit_logs.details (valor anterior -> nuevo), Fase 0: ajustes de la revision, Separar seed de desarrollo de migraciones de produccion, POST /admin/products/visibility (lote)

### Community 85 - "Despliegue y base de datos · database/README.md"
Cohesion: 0.29
Nodes (6): Migraciones Flyway V1-V10, 02_grants.sql (callback afterMigrate), Scripts de setup en Render (run-render-roles.ps1, create_admin.sql), Roles brinda_owner / brinda_app (sin DELETE), Coleccion Postman BRINDA (carpetas 11b, 12b, 13), S-12 Flyway con credenciales brinda_owner en la app

### Community 86 - "2026-10-26T01-33-07Z__src-app-pages-publ"
Cohesion: 0.25
Nodes (7): Browser measurements (B): overflow 0 at 360/768/1440; 0 console errors; 2 imgs all with alt attribute; heading outline h1>h2>h3 clean; 44 requests / ~2.6 MB on the dev server (production build ~65 KB JS transferred); targets under 44px: skip link, nav brand, "Ver en el catalogo" (37px), desktop nav links (36px, mouse-driven)., Design Health Score: 21/32 (applicable max; heuristics 7 and 10 n/a for a Persuade landing) → 66%, Acceptable, Design Specificity Verdict, Minor observations, Persona red flags, Priority issues, Questions

### Community 87 - "2026-10-26T01-47-10Z__src-app-pages-publ"
Cohesion: 0.25
Nodes (7): Design Health Score: 21/32 (66%, Acceptable). Heuristics 7 and 10 n/a (Persuade landing). Same total as round 1., Evidence (B, production build), Minor, Persona red flags, Priority issues, Questions, Specificity: authored hero, interchangeable lower page. Detector: [] on all targets (exit 0); headless overlay: "No anti-patterns found" at 1440 and 360 (no user-visible overlay).

### Community 88 - "2026-10-26T01-59-53Z__src-app-pages-publ"
Cohesion: 0.25
Nodes (7): Design Health Score: 23/32 (72%, Good band by percentage). Heuristics 7 and 10 n/a. Reviewer note: A scored heuristic 9 at 3 ("nothing to recover from") and heuristic 5 at 3 (+18 notice present); earlier rounds scored both 2, so about one point of the +2 is scorer drift, the rest comes from real fixes., Evidence (B, production), Minor, Personas, Priority issues, Questions, Specificity: distinct mood (bar at night), generic skeleton; mood 3/5, content 2/5. Detector [] on all targets; overlay "No anti-patterns found" (headless, no user-visible overlay).

### Community 89 - "admin.mjs"
Cohesion: 0.25
Nodes (6): created, env, out, password, PII, sizes

### Community 92 - "Estado del proyecto (avances) · Panel /admin"
Cohesion: 0.38
Nodes (7): Columna de costo (V11) pendiente, Etapa B Libro (panel de reclamos), ImageStore (subida de fotos), Resumen anterior 2026-11-15, Ventas (GET /admin/reports/sales), GET /api/v1/admin/reports/sales, Panel /admin

### Community 97 - "Decisiones del frontend Hito 2"
Cohesion: 0.33
Nodes (5): Promocion lleva N paga M, CatalogService (carga todas las paginas, filtro en navegador), Decisiones del frontend Hito 2, Subida de fotos desde el panel (POST /admin/images), Carrito local (signals + localStorage brinda.cart.v1)

### Community 98 - "Sistema de diseño · Colors"
Cohesion: 0.33
Nodes (6): Colors, Named Rules, Neutral, Primary, Secondary, Tertiary

### Community 99 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, ng, start, test, watch

### Community 103 - "Detalle y lista de reclamos · Level"
Cohesion: 0.40
Nodes (5): Level, ANSWERED, ON_TIME, OVERDUE, SOON

### Community 107 - "Componentes de diseño · Typography"
Cohesion: 0.50
Nodes (3): Hierarchy, Named Rules, Typography

## Knowledge Gaps
- **112 isolated node(s):** `com.brinda:api`, `ANSWERED`, `ON_TIME`, `OVERDUE`, `SOON` (+107 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 683 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Pedido` connect `Pedido` to `Checkout /pedido`, `Config legal y pie`?**
  _High betweenness centrality (0.312) - this node is a cross-community bridge._
- **What connects `com.brinda:api`, `ANSWERED`, `ON_TIME` to the rest of the system?**
  _112 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Controladores y sesión (backend)` be split into smaller, more focused modules?**
  _Cohesion score 0.05177304964539007 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `Control de edad y servicios públicos` to `Control de edad y servicios públicos · layout-public.ts`, `Toolchain Angular`, `Sesión del panel (frontend)`, `Carrito y producto (frontend)`, `Sesión del panel (frontend) · @angular/router`, `Checkout /pedido`, `Control de edad y servicios públicos · config.ts`, `Config legal y pie`, `Formulario público del Libro`, `Panel de reclamos (frontend)`, `Sesión del panel (frontend) · pedidos-lista.ts`, `Dependencias npm`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Should `Visibilidad de productos` be split into smaller, more focused modules?**
  _Cohesion score 0.05616509926854754 - nodes in this community are weakly interconnected._
- **Why does `avances.md (Registro de avances BRINDA)` connect `Despliegue y base de datos` to `Checkout y control de edad`, `ENDPOINTS.md (API v1)`, `Estado del proyecto (avances) · Panel /admin`, `Estado del proyecto (avances)`, `Estado del proyecto (avances) · CLAUDE.md (directrices del proyecto)`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Should `Correo de reclamos` be split into smaller, more focused modules?**
  _Cohesion score 0.055534987041836355 - nodes in this community are weakly interconnected._