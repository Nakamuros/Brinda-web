# Graph Report - BRINDA  (2026-11-22)

## Corpus Check
- 361 files · ~138,080 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 39 file(s) not represented in the graph (top: .css 26, (none) 7, .properties 4)

## Summary
- 2352 nodes · 6276 edges · 109 communities (71 shown, 38 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 336 edges (avg confidence: 0.86)
- Token cost: 385,322 input · 0 output

## Community Hubs (Navigation)
- Controladores y sesión (backend)
- Control de edad y servicios públicos
- Sesión del panel (frontend)
- Repositorios JPA
- Correo de reclamos
- Carrito y producto (frontend)
- Entidades y DTOs
- Requests y propiedades
- Utilidades de tests
- Visibilidad de productos
- Catálogo y paginación
- Registro de reclamos
- Configuración Angular
- Formulario público del Libro
- Productos del panel (DTOs)
- Manejo de errores API
- Contadores y plazos de reclamos
- Detalle y lista de reclamos
- PDF e imágenes
- Configuración Spring
- Login y sesión
- Panel de reclamos (frontend)
- Plantillas del panel admin
- Roles y JWT
- Filtro JWT
- Combos
- Estado del proyecto (avances)
- Formulario de producto
- Config legal y pie
- Dependencias npm
- Scripts Playwright
- Componentes de diseño
- Lleva N paga M
- Toolchain Angular
- Checkout /pedido
- Movimientos de stock
- Detalle de pedido (backend)
- Productos (servicio admin)
- Despliegue y base de datos
- PDF de la hoja
- Brief de frontend
- Pedido y WhatsApp (producto)
- Modelo de datos (ERD)
- Sistema de diseño
- Pruebas del carrito
- pedido-real.mjs
- AuthService
- Critique landing ronda 1 (21/32)
- BusinessRuleException
- .buildableNow()
- ValidDocument.java
- ImageStore
- Components
- ENDPOINTS.md (API v1)
- Counting
- Flujo del pedido (guardar con codigo cor
- ReclamosLista
- CreateComplaintRequest
- db
- .isActive()
- FRONTEND-BRIEF-BRINDA.md
- PedidoDetalle
- RateLimitFilter
- MovementType
- DNI obligatorio y cifrado (para boletas)
- Seguridad (seccion 7)
- Identidad visual (tipografia, paleta com
- admin-productos.mjs
- Decisiones del frontend Hito 2
- PROMPT-CLI-V4.md (lote V4: ofertas, comb
- admin-pedidos.mjs
- ProductosLista
- Catalogo
- .line()
- ClientIpTest
- Fase 0: ajustes de la revision
- Frontend
- pedido.mjs
- Zonas
- Pedido
- .isActive()
- 2026-10-26T01-33-07Z__src-app-pages-publ
- 2026-10-26T01-47-10Z__src-app-pages-publ
- 2026-10-26T01-59-53Z__src-app-pages-publ
- admin.mjs
- ReclamoDetalle
- SiteNav
- SecurityEventLog
- ComboNuevo
- AgeGateDialog
- BrindaApplication.java
- .resolve()
- scripts
- reclamos-publico.mjs
- PedidosLista
- EmailStatus
- PublicProductResponseTest.java
- Ventas
- OrderChannel
- PromoType
- LayoutAdmin
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
- `4. Qué NO se rescata (propio de IntelliMarket)` --references--> `AuthService`  [INFERRED]
  FRONTEND-BRIEF-BRINDA.md → backend/src/main/java/com/brinda/api/auth/service/AuthService.java
- `No aplica / no existe` --references--> `NoopEmailSender`  [INFERRED]
  SECURITY-REPORT.md → backend/src/main/java/com/brinda/api/shared/mail/NoopEmailSender.java
- `Verificado correcto (sin cambios)` --references--> `ProdSeedGuard`  [INFERRED]
  SECURITY-REPORT.md → backend/src/main/java/com/brinda/api/config/ProdSeedGuard.java
- `Cambios sin commitear y agrupación sugerida` --references--> `SecurityConfig`  [INFERRED]
  SECURITY-REPORT.md → backend/src/main/java/com/brinda/api/config/SecurityConfig.java
- `Hallazgos` --references--> `SecurityConfig`  [INFERRED]
  SECURITY-REPORT.md → backend/src/main/java/com/brinda/api/config/SecurityConfig.java

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Ciclo de vida del pedido BRINDA (crear, WhatsApp, pago manual, Finalizada, stock)** — contexto_brinda_flujo_pedido, contexto_brinda_order_code, contexto_brinda_whatsapp_message, contexto_brinda_pago_yape_plin, contexto_brinda_boton_finalizada, contexto_brinda_stock_movements, contexto_brinda_expiration_job [EXTRACTED 1.00]
- **Lote V4: ofertas, combos y lleva N paga M** — prompt_cli_v4_fase1_offers, prompt_cli_v4_fase2_combos, prompt_cli_v4_fase3_promo, contexto_brinda_price_offers, contexto_brinda_combos, contexto_brinda_buy_n_pay_m, contexto_brinda_catalog_order [EXTRACTED 1.00]
- **Admin paginated list pattern (filters, rows, badges, pager)** — frontend_src_app_admin_pedidos_pedidos_lista_template, frontend_src_app_admin_productos_productos_lista_template, frontend_src_app_admin_reclamos_reclamos_lista_template [INFERRED 0.85]
- **Sistema de identidad visual BRINDA** — contexto_brinda_palette, contexto_brinda_typography, contexto_brinda_hybrid_design, frontend_brief_brinda_visual_identity, frontend_brief_brinda_contrast_table, frontend_brief_brinda_design_guidelines, frontend_brief_brinda_ghost_button [INFERRED 0.85]
- **Tres rondas de critique de la landing** — frontend__impeccable_critique_2026_10_26t01_33_07z__src_app_pages_public_landing_landing_ts, frontend__impeccable_critique_2026_10_26t01_47_10z__src_app_pages_public_landing_landing_ts, frontend__impeccable_critique_2026_10_26t01_59_53z__src_app_pages_public_landing_landing_ts, design_barra_fija_pedir_ahora, avances_hide_order_bar_directive, design_the_candle_edge_rule [INFERRED 0.85]
- **Flujo del Libro de Reclamaciones** — avances_libro_de_reclamaciones, avances_etapa_c_formulario_publico, backend_endpoints_post_complaints, backend_endpoints_get_complaints_copy, backend_endpoints_honeypot_website, backend_endpoints_complaint_deadline, avances_noop_email_sender, security_report_s_02_copy_token_expiry [INFERRED 0.85]
- **Pedido y cierre por WhatsApp** — product_order_flow, backend_endpoints_post_orders, avances_whatsapp_message_builder, avances_order_service, design_paso_pendiente_whatsapp, design_whatsapp_green_exception [INFERRED 0.85]
- **Libro de Reclamaciones: public form to admin response** — frontend_src_app_pages_public_libro_reclamaciones_libro_reclamaciones_template, frontend_src_app_pages_public_libro_reclamaciones_complaint_form_template, frontend_src_app_admin_reclamos_reclamos_lista_template, frontend_src_app_admin_reclamos_reclamo_detalle_template [INFERRED 0.95]
- **Public checkout flow: catalogo -> carrito -> pedido -> pedido creado (WhatsApp)** — frontend_src_app_pages_public_catalogo_catalogo_template, frontend_src_app_pages_public_carrito_carrito_template, frontend_src_app_pages_public_pedido_pedido_template, frontend_src_app_pages_public_pedido_pedido_creado_template, frontend_src_app_pages_public_pedido_pedido_creado_sendstep [INFERRED 0.95]

## Communities (109 total, 38 thin omitted)

### Community 0 - "Controladores y sesión (backend)"
Cohesion: 0.05
Nodes (37): AuthenticatedUser, CatalogAdminController, VisibilityResponse, CatalogController, CategoryResponse, OfferRequest, PromoRequest, VisibilityRequest (+29 more)

### Community 1 - "Control de edad y servicios públicos"
Cohesion: 0.04
Nodes (39): AgeGate, AGE_GATE, CONTACT, HERO, HOW_TO_ORDER, IMAGES, PENDING, SHOW_PENDING (+31 more)

### Community 2 - "Sesión del panel (frontend)"
Cohesion: 0.06
Nodes (38): AdminAuth, AdminUser, apiError(), adminGuard(), runGuard(), AdminPassword, Categorias, AdminLogin (+30 more)

### Community 3 - "Repositorios JPA"
Cohesion: 0.06
Nodes (16): ProductRepository, ComplaintRepository, PendingCountResponse, Day, Inventory, SalesReportResponse, TopProduct, OrderStatus (+8 more)

### Community 4 - "Correo de reclamos"
Cohesion: 0.05
Nodes (17): ComplaintEmailRetryJob, ComplaintEmailTemplates, ComplaintNotifier, ProdSeedGuard, OrderExpirationJob, ImageProperties, ImageUrlSerializer, Attachment (+9 more)

### Community 5 - "Carrito y producto (frontend)"
Cohesion: 0.05
Nodes (23): CartLine, Product, ProductLine, Carrito, CatalogoSoon, CartService, cents(), lineTotals() (+15 more)

### Community 6 - "Entidades y DTOs"
Cohesion: 0.07
Nodes (9): PromoRule, EmailDelivery, PublicDistrictResponse, DeliveryZone, District, Order, OrderItem, AuditLog (+1 more)

### Community 7 - "Requests y propiedades"
Cohesion: 0.07
Nodes (11): ComplaintProperties, OrderProperties, CreateOrderRequest, Item, PaymentMethod, PLIN, YAPE, WhatsAppMessageBuilder (+3 more)

### Community 8 - "Utilidades de tests"
Cohesion: 0.09
Nodes (5): DocumentType, CE, DNI, CryptoProperties, EmailSendException

### Community 9 - "Visibilidad de productos"
Cohesion: 0.09
Nodes (11): ProductVisibility, ALL, HIDDEN, VISIBLE, Line, PublicProductResponse, Product, ProductType (+3 more)

### Community 10 - "Catálogo y paginación"
Cohesion: 0.09
Nodes (5): PageResponse, OrderSummaryResponse, AuditService, ResourceNotFoundException, SlugUtil

### Community 11 - "Registro de reclamos"
Cohesion: 0.08
Nodes (7): CreatedComplaintResponse, Complaint, ComplaintNumberGenerator, ComplaintService, Created, DniCipher, ComplaintServiceTest

### Community 12 - "Configuración Angular"
Cohesion: 0.05
Nodes (41): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+33 more)

### Community 13 - "Formulario público del Libro"
Cohesion: 0.07
Nodes (18): ComplaintForm, DATE, DOC, FieldName, LIMITS, MESSAGES, check(), CREATED (+10 more)

### Community 14 - "Productos del panel (DTOs)"
Cohesion: 0.13
Nodes (6): AdminProductResponse, CategoryRequest, ProductRequest, Category, CategoryRepository, CatalogAdminService

### Community 15 - "Manejo de errores API"
Cohesion: 0.15
Nodes (3): ErrorResponse, GlobalExceptionHandler, GlobalExceptionHandlerTest

### Community 16 - "Contadores y plazos de reclamos"
Cohesion: 0.12
Nodes (7): ComplaintCountsResponse, RespondComplaintRequest, BusinessDays, ComplaintAdminService, PdfFile, ComplaintDeadlines, ComplaintAdminTest

### Community 17 - "Detalle y lista de reclamos"
Cohesion: 0.11
Nodes (18): ComplaintDetailResponse, ComplaintSummaryResponse, DeadlineInfo, Level, ANSWERED, ON_TIME, OVERDUE, SOON (+10 more)

### Community 19 - "Configuración Spring"
Cohesion: 0.10
Nodes (3): ClockConfig, SchedulingConfig, SecurityConfig

### Community 20 - "Login y sesión"
Cohesion: 0.11
Nodes (7): AuthController, ChangePasswordRequest, LoginRequest, UserResponse, User, UserRepository, InvalidCredentialsException

### Community 21 - "Panel de reclamos (frontend)"
Cohesion: 0.13
Nodes (22): ComplaintCounts, ComplaintDetail, ComplaintFilters, ComplaintPage, ComplaintStatus, ComplaintSummary, ComplaintType, days() (+14 more)

### Community 22 - "Plantillas del panel admin"
Cohesion: 0.08
Nodes (27): Admin Categorias template (edit/create, displayOrder), Order status lifecycle (PENDING/EXPIRED/CONFIRMED/CANCELLED, stock on confirm), PII read audit (lectura registrada en auditoria), Admin PedidoDetalle template (confirm/cancel, copy delivery/receipt), Admin PedidosLista template (code/status filters, pager), Combo assembly deducts component stock (composition immutable), Admin ComboNuevo template (composition lines, units to build), Offer vs buy-X-pay-Y promo mutual exclusion (+19 more)

### Community 23 - "Roles y JWT"
Cohesion: 0.12
Nodes (7): Role, ROLE_ADMIN, ROLE_CASHIER, JwtProperties, JwtService, Session, JwtServiceTest

### Community 24 - "Filtro JWT"
Cohesion: 0.10
Nodes (3): JwtAuthenticationFilter, BodySizeLimitFilter, BcryptHash

### Community 25 - "Combos"
Cohesion: 0.15
Nodes (8): ComboDetailResponse, Line, CreateComboRequest, Item, ComboItem, ComboItemRepository, ComboService, OrderComboContents

### Community 26 - "Estado del proyecto (avances)"
Cohesion: 0.11
Nodes (24): avances.md (registro de estado), core/config.ts (HOW_TO_ORDER, ORDER, LEGAL, HERO), Etapa C: formulario publico /libro-de-reclamaciones, Fixture de pruebas catalogo.json, ImageStore (subida de fotos a IMAGES_UPLOAD_DIR), Libro de Reclamaciones (Etapas A, B, C), NoopEmailSender / EmailSender, Panel /admin (Pedidos, Productos, Categorias, Ventas, Zonas, Reclamos) (+16 more)

### Community 27 - "Formulario de producto"
Cohesion: 0.14
Nodes (5): amount(), ProductoForm, PRODUCT, wholeNumber(), ProductRequest

### Community 28 - "Config legal y pie"
Cohesion: 0.13
Nodes (14): LEGAL, ORDER, SiteFooter, CreatedOrder, CreateOrderRequest, HOUR, METHOD, PedidoCreado (+6 more)

### Community 29 - "Dependencias npm"
Cohesion: 0.11
Nodes (19): dependencies, @angular/common@^21.2.0, @angular/core@^21.2.0, @angular/forms@^21.2.0, @angular/platform-browser@^21.2.0, @angular/router@^21.2.0, gsap@^3.15.0, lenis@^1.3.27 (+11 more)

### Community 30 - "Scripts Playwright"
Cohesion: 0.13
Nodes (12): AGE_KEY, passAgeGate(), sizes, api, cats, out, out, sizes (+4 more)

### Community 31 - "Componentes de diseño"
Cohesion: 0.12
Nodes (15): Control de edad (age-gate.service + AgeGate), Control de edad (+18) modal, Barra fija "Pedir ahora", Boton CTA burdeos, Boton fantasma (hero), Paleta BRINDA (marron medianoche, ciruela, crema, laton, burdeos, terracota, petroleo), Como pedir (4 pasos), Hierarchy (+7 more)

### Community 32 - "Lleva N paga M"
Cohesion: 0.21
Nodes (5): BuyXPayYCalculator, Result, MigrationsSeedGuardTest, SecurityAutoConfigTest, BuyXPayYCalculatorTest

### Community 33 - "Toolchain Angular"
Cohesion: 0.11
Nodes (23): @angular/compiler@^21.2.0, tslib@^2.3.0, devDependencies, @angular/build@^21.2.28, @angular/cli@^21.2.28, @angular/compiler-cli@^21.2.0, jsdom@^28.0.0, playwright@^1.64.1 (+15 more)

### Community 34 - "Checkout /pedido"
Cohesion: 0.12
Nodes (13): District, FieldName, MESSAGES, CREATED, DISTRICTS, fill(), product, render() (+5 more)

### Community 35 - "Movimientos de stock"
Cohesion: 0.23
Nodes (5): MovementResponse, StockMovement, StockMovementRepository, InventoryService, StockLine

### Community 36 - "Detalle de pedido (backend)"
Cohesion: 0.21
Nodes (4): Item, OrderDetailResponse, TextResponse, OrderAdminService

### Community 38 - "Despliegue y base de datos"
Cohesion: 0.12
Nodes (16): Despliegue en Render, Corridas Newman de la coleccion Postman, Migraciones Flyway V1-V10, 02_grants.sql (callback afterMigrate), Scripts de setup en Render (run-render-roles.ps1, create_admin.sql), Roles brinda_owner / brinda_app (sin DELETE), Coleccion Postman BRINDA (carpetas 11b, 12b, 13), DNI/CE cifrado AES-256-GCM (+8 more)

### Community 40 - "Brief de frontend"
Cohesion: 0.11
Nodes (19): 10. Animaciones (alcance por pantalla), 11. Landing: secciones (primera pantalla a construir), 12. Material visual (assets), 13. Cómo usar este documento, 1. El producto, 2. Stack y convenciones (tomadas de IntelliMarket), 3. Estructura rescatada de IntelliMarket (solo el esqueleto), 4. Qué NO se rescata (propio de IntelliMarket) (+11 more)

### Community 41 - "Pedido y WhatsApp (producto)"
Cohesion: 0.13
Nodes (17): OrderService (brinda.order.v1, 1 h 30 min), WhatsAppMessageBuilder (mensaje corto sin datos personales), POST /api/v1/orders, Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context (+9 more)

### Community 42 - "Modelo de datos (ERD)"
Cohesion: 0.19
Nodes (16): Tabla AUDIT_LOGS, Tabla CATEGORIES, Combos pre-armados con composicion fija, Zonas de delivery con tarifa fija por zona, Tabla DELIVERY_ZONES, Tabla DISTRICTS, Modelo de datos ERD v2, Tabla ORDER_ITEMS (+8 more)

### Community 43 - "Sistema de diseño"
Cohesion: 0.12
Nodes (17): Colors, Design System: BRINDA, Do:, Do's and Don'ts, Don't:, Elevation & Depth, Layout, Named Rules (+9 more)

### Community 44 - "Pruebas del carrito"
Cohesion: 0.15
Nodes (11): newCtx(), out, sizes, checks, newCtx(), sizes, data, json() (+3 more)

### Community 45 - "pedido-real.mjs"
Cohesion: 0.12
Nodes (5): CLIENT, districts, open(), out, sizes

### Community 46 - "AuthService"
Cohesion: 0.18
Nodes (11): SecurityProperties, AuthService, SecurityPropertiesTest, Acciones manuales (tuyas), Cambios sin commitear y agrupación sugerida, Decisiones pendientes, Hallazgos, No aplica / no existe (+3 more)

### Community 47 - "Critique landing ronda 1 (21/32)"
Cohesion: 0.13
Nodes (13): Datos reales de Lucia (WhatsApp, Yape/Plin, distritos, tarifas), HideOrderBarDirective (ctaInView), Critique landing ronda 1 (21/32), P1: marcadores internos Por confirmar expuestos, P1: sin producto, precio ni senales de confianza, Critique landing ronda 2 (21/32), P1: copia de promo de ejemplo lleva 3, paga 2, P1: demasiado muy pronto en la pagina (+5 more)

### Community 48 - "BusinessRuleException"
Cohesion: 0.24
Nodes (5): CreatedOrderResponse, Line, Payment, OrderService, BusinessRuleException

### Community 49 - ".buildableNow()"
Cohesion: 0.28
Nodes (3): ComboCalculator, Component, ComboCalculatorTest

### Community 52 - "Components"
Cohesion: 0.14
Nodes (15): Avisos legales, Buttons, Campos de formulario, Category tile, Components, Control de edad (+18), Detalle de producto, Filtros del catálogo (+7 more)

### Community 53 - "ENDPOINTS.md (API v1)"
Cohesion: 0.15
Nodes (14): CartService (localStorage brinda.cart.v1), CatalogService (signals, HttpClient), ENDPOINTS.md (API v1), Admin endpoints (/api/v1/admin/**), Auth (/api/v1/auth/*), GET /api/v1/catalog/* y /delivery/districts, Combos (stock propio, composicion fija), Plazo 15 dias habiles (ON_TIME/SOON/OVERDUE) (+6 more)

### Community 55 - "Flujo del pedido (guardar con codigo cor"
Cohesion: 0.15
Nodes (11): Panel admin con polling cada 10-15 s, Arquitectura backend por modulos (auth, catalog, inventory, order, delivery, shared, config), Boton Finalizada (confirmar venta y descontar stock), Tarea programada de vencimiento (20 min), IntelliMarket (proyecto de referencia ZIP), Problemas de seguridad del ZIP (no repetir), Codigo corto de pedido (ej. EQ12), Estados de pedido PENDING/CONFIRMED/CANCELLED/EXPIRED (+3 more)

### Community 58 - "db"
Cohesion: 0.15
Nodes (12): container_name, environment, image, ports, restart, volumes, POSTGRES_PASSWORD, POSTGRES_USER (+4 more)

### Community 60 - "FRONTEND-BRIEF-BRINDA.md"
Cohesion: 0.17
Nodes (9): Docker Compose Postgres 16 (puerto 5433 local), CONTEXTO-BRINDA.md (contexto completo del proyecto), BRINDA licoreria delivery-only (Lima), Lucia (duena de BRINDA), Stack Angular + Spring Boot + PostgreSQL, Angular 21 standalone + signals + lazy routes + Vitest, Animaciones por pantalla (transform/opacity, reduced-motion, GSAP/Lenis), Material visual (video hero, fotos, licencias) (+1 more)

### Community 63 - "MovementType"
Cohesion: 0.18
Nodes (9): MovementType, ADJUSTMENT, CANCEL_RETURN, COMBO_BUILD, COMBO_CONSUME, COMBO_DISASSEMBLE, COMBO_RETURN, RESTOCK (+1 more)

### Community 64 - "DNI obligatorio y cifrado (para boletas)"
Cohesion: 0.25
Nodes (10): Modal de control de edad (+18) primera visita, Verificacion de mayoria de edad (+18), IP real detras del proxy (ClientIp), DNI_ENCRYPTION_KEY (sin rotacion), Ley 29733 de datos personales (DS 016-2024-JUS), Libro de Reclamaciones virtual, Pendientes antes de produccion (seccion 19), Boletas SUNAT (fuera del sistema) (+2 more)

### Community 65 - "Seguridad (seccion 7)"
Cohesion: 0.24
Nodes (8): Dominio .com (Porkbun/Cloudflare), JWT en cookie HttpOnly SameSite=Strict, Endpoint publico de pedidos, Rate limiting (login y pedidos por IP), Seguridad (seccion 7), CORS estricto por variable de entorno, Sesion de 8 h con token_version (V9), Despliegue y conexion con la API (cookie, proxy, 429)

### Community 66 - "Identidad visual (tipografia, paleta com"
Cohesion: 0.22
Nodes (9): Paleta BRINDA 60/30/10, Raising the Bar (referencia de tienda), The Violet Hour (referencia visual), Tipografias Libre Baskerville / Limelight / Jost, Como pedir en 3 pasos, Tabla de contraste WCAG de la paleta, Boton fantasma Pedir ahora del hero, Landing: secciones (anuncio, nav, hero, presentacion, categorias, combos, como pedir, zonas, pie) (+1 more)

### Community 67 - "admin-productos.mjs"
Cohesion: 0.18
Nodes (3): env, out, sizes

### Community 68 - "Decisiones del frontend Hito 2"
Cohesion: 0.22
Nodes (9): Panel /admin, Promocion lleva N paga M, CatalogService (carga todas las paginas, filtro en navegador), Checkout /pedido y /pedido/:codigo, Decisiones del frontend Hito 2, Subida de fotos desde el panel (POST /admin/images), Carrito local (signals + localStorage brinda.cart.v1), Mensaje de WhatsApp prearmado (+1 more)

### Community 69 - "PROMPT-CLI-V4.md (lote V4: ofertas, comb"
Cohesion: 0.24
Nodes (7): Ofertas de precio con fecha de fin obligatoria, PROMPT-CLI-V4.md (lote V4: ofertas, combos, promociones), buildableNow (combos armables con stock actual), Pruebas esperadas (JUnit unitarias + manuales), Fase 1: ofertas de precio con fecha de fin (V4), Fase 3: lleva N paga M (V6), Formula promo_discount (grupos, unidades gratis)

### Community 70 - "admin-pedidos.mjs"
Cohesion: 0.20
Nodes (5): districts, env, out, simOrders, sizes

### Community 75 - "Fase 0: ajustes de la revision"
Cohesion: 0.28
Nodes (7): Orden del catalogo (stock, promo, combos, destacados, nombre), Lote V4 decisiones (seccion 18), Filtros del panel y stockLevel (OUT/LOW/HIGH/NORMAL), audit_logs.details (valor anterior -> nuevo), Fase 0: ajustes de la revision, Separar seed de desarrollo de migraciones de produccion, POST /admin/products/visibility (lote)

### Community 76 - "Frontend"
Cohesion: 0.22
Nodes (8): Additional Resources, Angular CLI 21.2.28 + Vitest, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests

### Community 77 - "pedido.mjs"
Cohesion: 0.22
Nodes (5): districts, far, near, out, zones

### Community 81 - "2026-10-26T01-33-07Z__src-app-pages-publ"
Cohesion: 0.25
Nodes (7): Browser measurements (B): overflow 0 at 360/768/1440; 0 console errors; 2 imgs all with alt attribute; heading outline h1>h2>h3 clean; 44 requests / ~2.6 MB on the dev server (production build ~65 KB JS transferred); targets under 44px: skip link, nav brand, "Ver en el catalogo" (37px), desktop nav links (36px, mouse-driven)., Design Health Score: 21/32 (applicable max; heuristics 7 and 10 n/a for a Persuade landing) → 66%, Acceptable, Design Specificity Verdict, Minor observations, Persona red flags, Priority issues, Questions

### Community 82 - "2026-10-26T01-47-10Z__src-app-pages-publ"
Cohesion: 0.25
Nodes (7): Design Health Score: 21/32 (66%, Acceptable). Heuristics 7 and 10 n/a (Persuade landing). Same total as round 1., Evidence (B, production build), Minor, Persona red flags, Priority issues, Questions, Specificity: authored hero, interchangeable lower page. Detector: [] on all targets (exit 0); headless overlay: "No anti-patterns found" at 1440 and 360 (no user-visible overlay).

### Community 83 - "2026-10-26T01-59-53Z__src-app-pages-publ"
Cohesion: 0.25
Nodes (7): Design Health Score: 23/32 (72%, Good band by percentage). Heuristics 7 and 10 n/a. Reviewer note: A scored heuristic 9 at 3 ("nothing to recover from") and heuristic 5 at 3 (+18 notice present); earlier rounds scored both 2, so about one point of the +2 is scorer drift, the rest comes from real fixes., Evidence (B, production), Minor, Personas, Priority issues, Questions, Specificity: distinct mood (bar at night), generic skeleton; mood 3/5, content 2/5. Detector [] on all targets; overlay "No anti-patterns found" (headless, no user-visible overlay).

### Community 84 - "admin.mjs"
Cohesion: 0.25
Nodes (6): created, env, out, password, PII, sizes

### Community 92 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, ng, start, test, watch

### Community 95 - "EmailStatus"
Cohesion: 0.40
Nodes (4): EmailStatus, FAILED, PENDING, SENT

### Community 98 - "OrderChannel"
Cohesion: 0.50
Nodes (3): OrderChannel, STORE, WHATSAPP

### Community 99 - "PromoType"
Cohesion: 0.50
Nodes (3): PromoType, BUY_X_PAY_Y, OFFER

## Knowledge Gaps
- **95 isolated node(s):** `STORE`, `WHATSAPP`, `CANCELLED`, `CONFIRMED`, `EXPIRED` (+90 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 666 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **38 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AuthService` connect `AuthService` to `Controladores y sesión (backend)`, `Detalle de pedido (backend)`, `Brief de frontend`, `Catálogo y paginación`, `Configuración Spring`, `Login y sesión`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **What connects `STORE`, `WHATSAPP`, `CANCELLED` to the rest of the system?**
  _95 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Controladores y sesión (backend)` be split into smaller, more focused modules?**
  _Cohesion score 0.05108780108780109 - nodes in this community are weakly interconnected._
- **Why does `4. Qué NO se rescata (propio de IntelliMarket)` connect `Brief de frontend` to `AuthService`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `Control de edad y servicios públicos` be split into smaller, more focused modules?**
  _Cohesion score 0.03914653500264503 - nodes in this community are weakly interconnected._
- **Why does `BRINDA — Brief de frontend (para `/impeccable init` y para el CLI)` connect `Brief de frontend` to `FRONTEND-BRIEF-BRINDA.md`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `Sesión del panel (frontend)` be split into smaller, more focused modules?**
  _Cohesion score 0.05630834086118639 - nodes in this community are weakly interconnected._