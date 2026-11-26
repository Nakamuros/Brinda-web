# Graph Report - Brinda-web  (2026-11-25)

## Corpus Check
- 377 files · ~159,942 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .css 28, (none) 7, .properties 4)

## Summary
- 2567 nodes · 6651 edges · 146 communities (90 shown, 56 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 345 edges (avg confidence: 0.86)
- Token cost: 210,271 input · 0 output

## Community Hubs (Navigation)
- Control de edad y servicios públicos
- Carrito y producto (frontend)
- Controladores y sesión (backend)
- ReclamoDetalle
- SiteNav
- Correo de reclamos (6)
- PedidosLista
- Control de edad y servicios públicos · layout-public.ts
- Utilidades de tests
- BrindaApplication.java
- Datos de pago del pedido
- Carrito y producto (frontend) · ProductDetail
- Ventas
- PublicProductResponseTest.java
- Manejo de errores API
- Control de edad y servicios públicos · config.ts
- Repositorios JPA · org.springframework.data.jpa.repository.JpaReposito
- Combos
- Detalle y lista de reclamos
- Detalle de pedido (backend)
- Visibilidad de productos (2)
- Repositorios JPA
- Contadores y plazos de reclamos
- Config legal y pie
- Controladores y sesión (backend) (2)
- Controladores y sesión (backend) · District
- Configuración Spring
- Sesión del panel (frontend) (2)
- Filtro JWT
- Registro de reclamos
- .isActive() · .isActive()
- PDF e imágenes
- Requests y propiedades (2)
- AuthService
- Roles y JWT
- Correo de reclamos
- PDF e imágenes (2)
- Productos (servicio admin)
- Catálogo y paginación
- PDF de la hoja
- Lleva N paga M
- Movimientos de stock
- Formulario público del Libro
- Sesión del panel (frontend)
- .buildableNow()
- Páginas legales
- BusinessRuleException
- Counting
- ReclamosLista
- Formulario público del Libro (2)
- Panel de reclamos (frontend)
- Correo de reclamos (2)
- RateLimitFilter
- Correo de reclamos (3)
- Sesión del panel (frontend) · @angular/router
- Correo de reclamos (4)
- Entidades y DTOs
- Repositorios JPA · org.springframework.data.jpa.repository.JpaReposito (2)
- CreateComplaintRequest
- Sesión del panel (frontend) · pedidos-lista.ts
- Visibilidad de productos (3)
- .resolve()
- Requests y propiedades
- ProductosLista
- Catalogo
- Pedido
- .line()
- Visibilidad de productos
- Zonas
- Correo de reclamos (5)
- Correo de reclamos · UserRepository
- admin.mjs
- Scripts Playwright · pedido-creado.mjs
- Scripts Playwright
- Pruebas del carrito
- pedido-real.mjs
- admin-pedidos.mjs
- admin-productos.mjs
- Scripts Playwright (2)
- Checkout /pedido
- Scripts Playwright · ref_node_fs
- Formulario público del Libro (3)
- Esquema del Libro (V10)
- Sistema de diseño · Colors
- scripts
- Configuración Angular
- Script ARCO (SQL)
- Verificación de roles en Render
- environment.production.ts
- Pedido y WhatsApp (producto)
- com.brinda:api
- Components
- Sistema de diseño
- Despliegue y base de datos · SECURITY-REPORT.md
- Brief de frontend
- Toolchain Angular
- Componentes de diseño
- db
- PROMPT-CLI-V4.md (lote V4: ofertas, comb
- Dependencias npm
- Toolchain Angular (2)
- Frontend
- 2026-10-26T01-33-07Z__src-app-pages-publ
- 2026-10-26T01-47-10Z__src-app-pages-publ
- 2026-10-26T01-59-53Z__src-app-pages-publ
- Decisiones del frontend Hito 2
- Plantillas del panel admin (2)
- Procedimiento ARCO
- Flujo del pedido (guardar con codigo cor · Flujo del pedido (guardar c
- index.html y metadatos
- Hitos 1-3 del plan de trabajo
- Scripts Playwright
- Garantia y acuerdos con el cliente
- Rappi (canal posterior, stock compartido
- Plantillas del panel admin (3)
- Plantillas del panel admin (4)
- Plantillas del panel admin
- ENDPOINTS.md (API v1)
- Despliegue y base de datos
- Estado del proyecto (avances) · Panel /admin
- Modelo de datos (ERD)
- Seguridad (seccion 7)
- Identidad visual (tipografia, paleta com
- Fase 0: ajustes de la revision
- DNI obligatorio y cifrado (para boletas)
- Fase 0: ajustes de la revision (2)
- ENDPOINTS.md (API v1) (2)
- Flujo del pedido (guardar con codigo cor

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 82 edges
2. `BusinessRuleException` - 54 edges
3. `Product` - 49 edges
4. `Order` - 47 edges
5. `@angular/router` - 44 edges
6. `AuthenticatedUser` - 41 edges
7. `apiError()` - 35 edges
8. `CatalogAdminService` - 33 edges
9. `ResourceNotFoundException` - 29 edges
10. `ProductRepository` - 27 edges

## Surprising Connections (you probably didn't know these)
- `No aplica / no existe` --references--> `NoopEmailSender`  [INFERRED]
  SECURITY-REPORT.md → backend/src/main/java/com/brinda/api/shared/mail/NoopEmailSender.java
- `4. Qué NO se rescata (propio de IntelliMarket)` --references--> `AuthService`  [INFERRED]
  FRONTEND-BRIEF-BRINDA.md → backend/src/main/java/com/brinda/api/auth/service/AuthService.java
- `Verificado correcto (sin cambios)` --references--> `ProdSeedGuard`  [INFERRED]
  SECURITY-REPORT.md → backend/src/main/java/com/brinda/api/config/ProdSeedGuard.java
- `Cambios sin commitear y agrupación sugerida` --references--> `GlobalExceptionHandler`  [INFERRED]
  SECURITY-REPORT.md → backend/src/main/java/com/brinda/api/shared/exception/GlobalExceptionHandler.java
- `Hallazgos` --references--> `GlobalExceptionHandler`  [INFERRED]
  SECURITY-REPORT.md → backend/src/main/java/com/brinda/api/shared/exception/GlobalExceptionHandler.java

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Atencion de solicitudes ARCO** — procedimiento_arco_registro_arco, procedimiento_arco_identity_verification, procedimiento_arco_run_arco_ps1, procedimiento_arco_arco_sql, procedimiento_arco_revoke_marketing, procedimiento_arco_anonymize [EXTRACTED 1.00]
- **Ciclo de vida del pedido BRINDA (crear, WhatsApp, pago manual, Finalizada, stock)** — contexto_brinda_flujo_pedido, contexto_brinda_order_code, contexto_brinda_whatsapp_message, contexto_brinda_pago_yape_plin, contexto_brinda_boton_finalizada, contexto_brinda_stock_movements, contexto_brinda_expiration_job [EXTRACTED 1.00]
- **V4 promotion phases (offers, combos, buy X pay Y)** — prompt_cli_v4_fase1, prompt_cli_v4_fase2, prompt_cli_v4_fase3 [EXTRACTED 1.00]
- **Admin paginated list pattern (filters, rows, badges, pager)** — frontend_src_app_admin_pedidos_pedidos_lista_template, frontend_src_app_admin_productos_productos_lista_template, frontend_src_app_admin_reclamos_reclamos_lista_template [INFERRED 0.85]
- **Sistema de identidad visual BRINDA** — contexto_brinda_palette, contexto_brinda_typography, contexto_brinda_hybrid_design, frontend_brief_brinda_visual_identity, frontend_brief_brinda_contrast_table, frontend_brief_brinda_design_guidelines, frontend_brief_brinda_ghost_button [INFERRED 0.85]
- **Sincronizacion de la version de textos legales al lanzar** — avances_legal_documents_version, avances_legal_page, design_paginas_legales, backend_endpoints_post_orders, avances_v11_migration [INFERRED 0.85]
- **Confirmacion de pedido con delivery cobrado** — avances_delivery_cobrado, backend_endpoints_admin_order_confirm, backend_endpoints_admin_order_delivery_fee, backend_endpoints_stock_on_confirm, avances_v11_migration, backend_endpoints_sales_report, design_panel_admin [INFERRED 0.85]
- **Order lifecycle screens: checkout, created, admin list, admin detail** — frontend_src_app_pages_public_pedido_pedido_template, frontend_src_app_pages_public_pedido_pedido_creado_template, frontend_src_app_admin_pedidos_pedidos_lista_template, frontend_src_app_admin_pedidos_pedido_detalle_template [INFERRED 0.85]
- **Customer sends order by WhatsApp, pays, admin confirms** — frontend_src_app_pages_public_pedido_pedido_creado_sendstep, frontend_src_app_pages_public_pedido_pedido_creado_payblock, frontend_src_app_admin_pedidos_pedido_detalle_order_actions, concept_whatsapp_order_flow [INFERRED 0.85]
- **Libro de Reclamaciones: public form to admin response** — frontend_src_app_pages_public_libro_reclamaciones_libro_reclamaciones_template, frontend_src_app_pages_public_libro_reclamaciones_complaint_form_template, frontend_src_app_admin_reclamos_reclamos_lista_template, frontend_src_app_admin_reclamos_reclamo_detalle_template [INFERRED 0.95]

## Communities (146 total, 56 thin omitted)

### Community 1 - "Control de edad y servicios públicos"
Cohesion: 0.05
Nodes (27): ScrollService, HideOrderBarDirective, AgeGate, MediaPrefs, NetworkInformationLike, LayoutPublic, NavItem, Landing (+19 more)

### Community 3 - "Carrito y producto (frontend)"
Cohesion: 0.06
Nodes (22): RiseDirective, CartLine, Product, ProductLine, Carrito, CatalogoSoon, CartService, CatalogService (+14 more)

### Community 0 - "Controladores y sesión (backend)"
Cohesion: 0.06
Nodes (22): AuthenticatedUser, CatalogAdminController, VisibilityResponse, CatalogController, CategoryResponse, ComboAdminController, ComboDetailResponse, Line (+14 more)

### Community 14 - "Manejo de errores API"
Cohesion: 0.14
Nodes (3): ErrorResponse, GlobalExceptionHandler, GlobalExceptionHandlerTest

### Community 16 - "Control de edad y servicios públicos · config.ts"
Cohesion: 0.08
Nodes (21): InfoColumn, AnnouncementBar, SiteFooter, InfoColumns, Promos, LibroReclamaciones, BrindisMark, LegalNotice (+13 more)

### Community 17 - "Repositorios JPA · org.springframework.data.jpa.repository.JpaReposito"
Cohesion: 0.13
Nodes (3): ProductRepository, StockMovementRepository, AuditLogRepository

### Community 18 - "Combos"
Cohesion: 0.10
Nodes (9): CategoryRepository, BuildComboRequest, ComboUpdateRequest, CreateComboRequest, Item, ComboItem, ComboItemRepository, ComboService (+1 more)

### Community 19 - "Detalle y lista de reclamos"
Cohesion: 0.10
Nodes (21): ComplaintDetailResponse, ComplaintSummaryResponse, CreateComplaintRequest, DeadlineInfo, Level, ComplaintStatus, ComplaintType, DocumentType (+13 more)

### Community 2 - "Detalle de pedido (backend)"
Cohesion: 0.06
Nodes (20): OrderAdminController, CancelOrderRequest, ConfirmOrderRequest, CreatedOrderResponse, Line, Payment, Transfer, Item (+12 more)

### Community 20 - "Visibilidad de productos (2)"
Cohesion: 0.18
Nodes (5): AdminProductResponse, CategoryRequest, ProductRequest, CatalogAdminService, BusinessRuleException

### Community 21 - "Repositorios JPA"
Cohesion: 0.12
Nodes (13): Day, Inventory, SalesReportResponse, TopProduct, OrderStatus, OrderRepository, OrderExpirationJob, SalesReportService (+5 more)

### Community 22 - "Contadores y plazos de reclamos"
Cohesion: 0.11
Nodes (5): ComplaintCountsResponse, RespondComplaintRequest, BusinessDays, ComplaintDeadlines, ComplaintAdminTest

### Community 23 - "Config legal y pie"
Cohesion: 0.09
Nodes (19): District, CreatedOrder, CreateOrderRequest, OrderPayment, PedidoCreado, FieldName, DeliveryService, DeliveryStatus (+11 more)

### Community 24 - "Controladores y sesión (backend) (2)"
Cohesion: 0.10
Nodes (7): AuthController, ChangePasswordRequest, LoginRequest, UserResponse, User, UserRepository, InvalidCredentialsException

### Community 25 - "Controladores y sesión (backend) · District"
Cohesion: 0.13
Nodes (8): DistrictRequest, DistrictResponse, ZoneRequest, ZoneResponse, District, DeliveryZoneRepository, DistrictRepository, DeliveryAdminService

### Community 26 - "Configuración Spring"
Cohesion: 0.11
Nodes (3): ClockConfig, SchedulingConfig, SecurityConfig

### Community 27 - "Sesión del panel (frontend) (2)"
Cohesion: 0.11
Nodes (5): ComboNuevo, ProductoForm, ProductRequest, amount(), wholeNumber()

### Community 28 - "Filtro JWT"
Cohesion: 0.11
Nodes (3): JwtAuthenticationFilter, BodySizeLimitFilter, BcryptHash

### Community 29 - "Registro de reclamos"
Cohesion: 0.13
Nodes (7): CreatedComplaintResponse, Complaint, ComplaintNumberGenerator, ComplaintRepository, ComplaintService, Created, ComplaintServiceTest

### Community 30 - ".isActive() · .isActive()"
Cohesion: 0.13
Nodes (5): OfferRule, JwtServiceTest, OfferRuleTest, PromoRuleTest, SecurityAutoConfigTest

### Community 31 - "PDF e imágenes"
Cohesion: 0.11
Nodes (4): ImageStore, ImageUploadProperties, MigrationsSeedGuardTest, ImageStoreTest

### Community 32 - "Requests y propiedades (2)"
Cohesion: 0.14
Nodes (9): JwtProperties, SecurityProperties, ComplaintProperties, OrderProperties, PaymentMethod, CryptoProperties, PLIN, TRANSFER (+1 more)

### Community 33 - "AuthService"
Cohesion: 0.12
Nodes (10): SecurityPropertiesTest, ClientIpTest, Acciones manuales (tuyas), Cambios sin commitear y agrupación sugerida, Decisiones pendientes, Hallazgos, No aplica / no existe, Pendientes para la asesora legal (Ley 29733) (+2 more)

### Community 34 - "Roles y JWT"
Cohesion: 0.14
Nodes (5): Role, JwtService, Session, ROLE_ADMIN, ROLE_CASHIER

### Community 35 - "Correo de reclamos"
Cohesion: 0.12
Nodes (7): EmailInfo, EmailDelivery, EmailStatus, ReflectionHelper, FAILED, PENDING, SENT

### Community 37 - "PDF e imágenes (2)"
Cohesion: 0.16
Nodes (5): CustomerDocumentType, CreateOrderRequestDocumentTest, CE, DNI, PASSPORT

### Community 4 - "Catálogo y paginación"
Cohesion: 0.07
Nodes (14): AuthService, PageResponse, CatalogService, ComplaintAdminService, PdfFile, DeliveryService, OrderSummaryResponse, PromoType (+6 more)

### Community 41 - "Lleva N paga M"
Cohesion: 0.25
Nodes (3): BuyXPayYCalculator, Result, BuyXPayYCalculatorTest

### Community 45 - "Movimientos de stock"
Cohesion: 0.26
Nodes (5): AdjustRequest, MovementResponse, RestockRequest, InventoryService, StockLine

### Community 48 - "Formulario público del Libro"
Cohesion: 0.12
Nodes (9): FieldName, ComplaintService, FormField, DATE, DOC, LIMITS, MESSAGES, NOT_REGISTERED (+1 more)

### Community 5 - "Sesión del panel (frontend)"
Cohesion: 0.06
Nodes (33): AdminAuth, AdminUser, AdminPassword, Categorias, LayoutAdmin, AdminLogin, Line, Draft (+25 more)

### Community 50 - ".buildableNow()"
Cohesion: 0.28
Nodes (3): ComboCalculator, Component, ComboCalculatorTest

### Community 52 - "Páginas legales"
Cohesion: 0.20
Nodes (10): LegalBlock, LegalDocument, LegalSection, LegalPage, segments(), updatedLine(), PRIVACY, TERMS (+2 more)

### Community 54 - "BusinessRuleException"
Cohesion: 0.23
Nodes (3): CreateOrderRequest, OrderCodeGenerator, OrderService

### Community 59 - "Formulario público del Libro (2)"
Cohesion: 0.18
Nodes (5): ComplaintForm, ComplaintFailure, CreatedComplaint, complaintCopyUrl(), isRealComplaint()

### Community 6 - "Panel de reclamos (frontend)"
Cohesion: 0.08
Nodes (33): OrderDetail, OrdersAdmin, OrderStatus, OrderSummary, ComplaintCounts, ComplaintDetail, ComplaintFilters, ComplaintPage (+25 more)

### Community 61 - "Correo de reclamos (2)"
Cohesion: 0.35
Nodes (3): ComplaintEmailTemplates, Attachment, EmailMessage

### Community 68 - "Sesión del panel (frontend) · @angular/router"
Cohesion: 0.23
Nodes (7): App, credentialsFor(), withCredentials(), appConfig, routes, credentialsInterceptor, @angular/platform-browser

### Community 69 - "Correo de reclamos (4)"
Cohesion: 0.38
Nodes (3): ComplaintEmailRetryJob, ComplaintNotifier, EmailSender

### Community 7 - "Entidades y DTOs"
Cohesion: 0.09
Nodes (7): Category, PromoRule, DeliveryZone, StockMovement, OrderItem, AuditLog, Auditable

### Community 70 - "Repositorios JPA · org.springframework.data.jpa.repository.JpaReposito (2)"
Cohesion: 0.18
Nodes (9): MovementType, ADJUSTMENT, CANCEL_RETURN, COMBO_BUILD, COMBO_CONSUME, COMBO_DISASSEMBLE, COMBO_RETURN, RESTOCK (+1 more)

### Community 8 - "Requests y propiedades"
Cohesion: 0.09
Nodes (6): OfferRequest, PromoRequest, VisibilityRequest, HasDocument, Validator, ValidDocument

### Community 9 - "Visibilidad de productos"
Cohesion: 0.09
Nodes (11): ProductVisibility, Line, PublicProductResponse, Product, ProductType, ProductSpecifications, ALL, HIDDEN (+3 more)

### Community 94 - "Correo de reclamos (5)"
Cohesion: 0.25
Nodes (3): SendResult, SENT, SKIPPED

### Community 100 - "admin.mjs"
Cohesion: 0.25
Nodes (6): created, env, out, password, PII, sizes

### Community 105 - "Scripts Playwright · pedido-creado.mjs"
Cohesion: 0.29
Nodes (3): out, sizes, TRANSFER

### Community 46 - "Scripts Playwright"
Cohesion: 0.18
Nodes (10): passAgeGate(), open(), AGE_KEY, api, cats, out, out, sizes (+2 more)

### Community 47 - "Pruebas del carrito"
Cohesion: 0.15
Nodes (11): newCtx(), newCtx(), json(), mockCatalog(), out, sizes, checks, sizes (+3 more)

### Community 51 - "pedido-real.mjs"
Cohesion: 0.12
Nodes (4): CLIENT, districts, out, sizes

### Community 74 - "admin-pedidos.mjs"
Cohesion: 0.18
Nodes (6): districts, env, KIND, out, simOrders, sizes

### Community 75 - "admin-productos.mjs"
Cohesion: 0.18
Nodes (3): env, out, sizes

### Community 76 - "Scripts Playwright (2)"
Cohesion: 0.18
Nodes (6): districts, far, minFee, near, out, zones

### Community 83 - "Checkout /pedido"
Cohesion: 0.27
Nodes (7): fill(), render(), select(), submit(), CREATED, DISTRICTS, product

### Community 90 - "Scripts Playwright · ref_node_fs"
Cohesion: 0.22
Nodes (3): sizes, CASES, out

### Community 92 - "Formulario público del Libro (3)"
Cohesion: 0.28
Nodes (4): check(), fill(), pick(), CREATED

### Community 10 - "Esquema del Libro (V10)"
Cohesion: 0.08
Nodes (41): complaint_counters, complaints, idx_complaints_email_retry, idx_complaints_filed, idx_complaints_status_filed, trg_complaints_updated_at, audit_logs, categories (+33 more)

### Community 114 - "Sistema de diseño · Colors"
Cohesion: 0.33
Nodes (6): Colors, Named Rules, Neutral, Primary, Secondary, Tertiary

### Community 115 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, ng, start, test, watch

### Community 12 - "Configuración Angular"
Cohesion: 0.05
Nodes (41): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+33 more)

### Community 13 - "Pedido y WhatsApp (producto)"
Cohesion: 0.06
Nodes (36): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+28 more)

### Community 36 - "Components"
Cohesion: 0.10
Nodes (20): Barra fija "Pedir ahora", Buttons, Campos de formulario, Category tile, Components, Control de edad (+18), Detalle de producto, Filtros del catálogo (+12 more)

### Community 38 - "Sistema de diseño"
Cohesion: 0.10
Nodes (17): Design System: BRINDA, Do:, Do's and Don'ts, Don't:, Elevation & Depth, Hierarchy, Layout, Named Rules (+9 more)

### Community 42 - "Despliegue y base de datos · SECURITY-REPORT.md"
Cohesion: 0.11
Nodes (16): Migraciones Flyway V1-V10, 02_grants.sql (callback afterMigrate), Scripts de setup en Render (run-render-roles.ps1, create_admin.sql), Roles brinda_owner / brinda_app (sin DELETE), Coleccion Postman BRINDA (carpetas 11b, 12b, 13), DNI/CE cifrado AES-256-GCM, JWT HS512 en cookie HttpOnly SameSite=Strict + token_version, Ley 29733 / derechos ARCO (pendiente asesora) (+8 more)

### Community 43 - "Brief de frontend"
Cohesion: 0.11
Nodes (19): 10. Animaciones (alcance por pantalla), 11. Landing: secciones (primera pantalla a construir), 12. Material visual (assets), 13. Cómo usar este documento, 1. El producto, 2. Stack y convenciones (tomadas de IntelliMarket), 3. Estructura rescatada de IntelliMarket (solo el esqueleto), 4. Qué NO se rescata (propio de IntelliMarket) (+11 more)

### Community 57 - "Toolchain Angular"
Cohesion: 0.14
Nodes (13): name, packageManager, private, version, @angular/build, @angular/cli, @angular/compiler, @angular/compiler-cli (+5 more)

### Community 60 - "Componentes de diseño"
Cohesion: 0.18
Nodes (11): Avisos legales, Edad en el checkout (radios mayor/no mayor de 18), Control de edad (age-gate modal), shared/delivery-notice (Delivery desde S/ X), /pedido/:codigo (pedido-creado), GET /api/v1/delivery/districts, Aviso de delivery, Boton CTA burdeos (+3 more)

### Community 62 - "db"
Cohesion: 0.15
Nodes (12): container_name, environment, image, ports, restart, volumes, POSTGRES_PASSWORD, POSTGRES_USER (+4 more)

### Community 66 - "PROMPT-CLI-V4.md (lote V4: ofertas, comb"
Cohesion: 0.17
Nodes (9): BRINDA licoreria delivery-only (Lima), Lucia (duena de BRINDA), Stack Angular + Spring Boot + PostgreSQL, Angular 21 standalone + signals + lazy routes + Vitest, Animaciones por pantalla (transform/opacity, reduced-motion, GSAP/Lenis), Material visual (video hero, fotos, licencias), Flujo con impeccable (shape, craft, critique, audit, polish), Docker Compose Postgres 16 (puerto 5433 local) (+1 more)

### Community 73 - "Dependencias npm"
Cohesion: 0.18
Nodes (11): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/router, gsap (+3 more)

### Community 88 - "Toolchain Angular (2)"
Cohesion: 0.22
Nodes (9): devDependencies, @angular/build, @angular/cli, @angular/compiler-cli, jsdom, playwright, prettier, typescript (+1 more)

### Community 89 - "Frontend"
Cohesion: 0.22
Nodes (8): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests, Angular CLI 21.2.28 + Vitest

### Community 97 - "2026-10-26T01-33-07Z__src-app-pages-publ"
Cohesion: 0.25
Nodes (7): Browser measurements (B): overflow 0 at 360/768/1440; 0 console errors; 2 imgs all with alt attribute; heading outline h1>h2>h3 clean; 44 requests / ~2.6 MB on the dev server (production build ~65 KB JS transferred); targets under 44px: skip link, nav brand, "Ver en el catalogo" (37px), desktop nav links (36px, mouse-driven)., Design Health Score: 21/32 (applicable max; heuristics 7 and 10 n/a for a Persuade landing) → 66%, Acceptable, Design Specificity Verdict, Minor observations, Persona red flags, Priority issues, Questions

### Community 98 - "2026-10-26T01-47-10Z__src-app-pages-publ"
Cohesion: 0.25
Nodes (7): Design Health Score: 21/32 (66%, Acceptable). Heuristics 7 and 10 n/a (Persuade landing). Same total as round 1., Evidence (B, production build), Minor, Persona red flags, Priority issues, Questions, Specificity: authored hero, interchangeable lower page. Detector: [] on all targets (exit 0); headless overlay: "No anti-patterns found" at 1440 and 360 (no user-visible overlay).

### Community 99 - "2026-10-26T01-59-53Z__src-app-pages-publ"
Cohesion: 0.25
Nodes (7): Design Health Score: 23/32 (72%, Good band by percentage). Heuristics 7 and 10 n/a. Reviewer note: A scored heuristic 9 at 3 ("nothing to recover from") and heuristic 5 at 3 (+18 notice present); earlier rounds scored both 2, so about one point of the +2 is scorer drift, the rest comes from real fixes., Evidence (B, production), Minor, Personas, Priority issues, Questions, Specificity: distinct mood (bar at night), generic skeleton; mood 3/5, content 2/5. Detector [] on all targets; overlay "No anti-patterns found" (headless, no user-visible overlay).

### Community 104 - "Decisiones del frontend Hito 2"
Cohesion: 0.33
Nodes (7): Panel /admin, CatalogService (carga todas las paginas, filtro en navegador), Checkout /pedido y /pedido/:codigo, Decisiones del frontend Hito 2, Subida de fotos desde el panel (POST /admin/images), Mensaje de WhatsApp prearmado, Pantallas publicas y admin de BRINDA

### Community 107 - "Plantillas del panel admin (2)"
Cohesion: 0.33
Nodes (6): Admin ReclamoDetalle template (4 sections, one-time response, PDF), Admin ReclamosLista template (deadline counts, filters), SiteFooter template (legal links, +18, Libro de Reclamaciones logo, RUC), ComplaintForm template (3-section hoja de reclamacion, PDF copy), LibroReclamaciones page template (provider data, notes), Claim deadline: 15 business days (holidays pending advisor)

### Community 109 - "Procedimiento ARCO"
Cohesion: 0.33
Nodes (6): database/setup/arco.sql + run-arco.ps1, Accion anonymize (excluye CONFIRMADOS), Script arco.sql (list, revoke-marketing, anonymize), Conexion externa a Render (solo IP propia, SSL), Accion revoke-marketing, Lanzador run-arco.ps1

### Community 113 - "Flujo del pedido (guardar con codigo cor · Flujo del pedido (guardar c"
Cohesion: 0.33
Nodes (3): Panel admin con polling cada 10-15 s, Boton Finalizada (confirmar venta y descontar stock), Codigo corto de pedido (ej. EQ12)

### Community 15 - "Plantillas del panel admin"
Cohesion: 0.06
Nodes (36): Admin Categorias template (edit/create, displayOrder), Copy delivery / receipt data actions, feeField template (Delivery cobrado), Order actions: confirm payment, fix delivery, cancel, Admin pedido detalle template, Order filters (code, status, marketing), Orders pagination, Admin pedidos lista template (+28 more)

### Community 44 - "ENDPOINTS.md (API v1)"
Cohesion: 0.12
Nodes (16): Panel /admin (Pedidos, Productos, Categorias, Ventas, Zonas, Reclamos), Coleccion Postman / Newman, /api/v1/admin/complaints (lista, detalle auditado, respond, pdf), POST /api/v1/admin/orders/{id}/confirm, POST /api/v1/admin/orders/{id}/delivery-fee, Auth endpoints (login, logout, me, change-password), Combos (stock propio, composicion fija), Plazo del reclamo (15 dias habiles, ON_TIME/SOON/OVERDUE) (+8 more)

### Community 49 - "Despliegue y base de datos"
Cohesion: 0.17
Nodes (16): Favicon, apple-touch-icon y og:image provisionales, core/config.ts (LEGAL, CONTACT, HERO, ORDER, HOW_TO_ORDER), Grafo graphify-out, ImageStore (subida de fotos), Landing Hito 2 (Angular 21), LEGAL_DOCUMENTS_VERSION / LEGAL.documentsUpdatedAt, pages/public/legal-page (/terminos, /privacidad), Despliegue en Render (+8 more)

### Community 55 - "Estado del proyecto (avances) · Panel /admin"
Cohesion: 0.25
Nodes (13): documentType + documentNumber (DNI/CE/PASSPORT), Consentimiento de promociones (marketing_consent), OrderService (brinda.order.v1, 1 h 30 min), Ventas (SalesReportService), Pago por transferencia (PaymentMethod.TRANSFER, TRANSFER_*), V11 orders_payment_document_consent_final_fee, WhatsAppMessageBuilder, GET /api/v1/admin/orders (filtro marketing) (+5 more)

### Community 63 - "Modelo de datos (ERD)"
Cohesion: 0.27
Nodes (10): Tabla AUDIT_LOGS, Tabla CATEGORIES, Zonas de delivery con tarifa fija por zona, Tabla DELIVERY_ZONES, Tabla DISTRICTS, Modelo de datos ERD v2, Tabla ORDER_ITEMS, Tabla PRODUCTS (+2 more)

### Community 67 - "Seguridad (seccion 7)"
Cohesion: 0.21
Nodes (9): IP real detras del proxy (ClientIp), Dominio .com (Porkbun/Cloudflare), JWT en cookie HttpOnly SameSite=Strict, Endpoint publico de pedidos, Rate limiting (login y pedidos por IP), Seguridad (seccion 7), CORS estricto por variable de entorno, Sesion de 8 h con token_version (V9) (+1 more)

### Community 72 - "Identidad visual (tipografia, paleta com"
Cohesion: 0.22
Nodes (9): Paleta BRINDA 60/30/10, Raising the Bar (referencia de tienda), The Violet Hour (referencia visual), Tipografias Libre Baskerville / Limelight / Jost, Como pedir en 3 pasos, Tabla de contraste WCAG de la paleta, Boton fantasma Pedir ahora del hero, Landing: secciones (anuncio, nav, hero, presentacion, categorias, combos, como pedir, zonas, pie) (+1 more)

### Community 84 - "Fase 0: ajustes de la revision"
Cohesion: 0.24
Nodes (8): Formula lleva N paga M, Fase 0: ajustes (ocultar productos, filtros, orden, restock lote, seed-dev, details), Fase 1: ofertas con fecha de fin (V5), Fase 2: combos pre-armados (V6), Fase 3: promocion lleva N paga M (V7), Pruebas esperadas (unitarias y manuales), Reglas de trabajo por fases (plan, migraciones nuevas, grants), PROMPT-CLI-V4 (lote de cambios V4)

### Community 86 - "DNI obligatorio y cifrado (para boletas)"
Cohesion: 0.31
Nodes (8): Modal de control de edad (+18) primera visita, Verificacion de mayoria de edad (+18), DNI_ENCRYPTION_KEY (sin rotacion), Ley 29733 de datos personales (DS 016-2024-JUS), Libro de Reclamaciones virtual, Pendientes antes de produccion (seccion 19), Boletas SUNAT (fuera del sistema), Requisitos legales en pantalla (avisos, +18, DNI, libro)

### Community 87 - "Fase 0: ajustes de la revision (2)"
Cohesion: 0.22
Nodes (6): Promocion lleva N paga M, Orden del catalogo (stock, promo, combos, destacados, nombre), Combos pre-armados con composicion fija, Carrito local (signals + localStorage brinda.cart.v1), Lote V4 decisiones (seccion 18), Ofertas de precio con fecha de fin obligatoria

### Community 93 - "ENDPOINTS.md (API v1) (2)"
Cohesion: 0.29
Nodes (8): Formulario publico del Libro de Reclamaciones (Etapa C), ComplaintPdfService (domicilio unificado), NoopEmailSender / EmailSender, V10 complaints (Libro de Reclamaciones), GET /api/v1/complaints/copy/{token} (copia PDF), Correo de reclamos (PENDING/SENT/FAILED, reintentos), POST /api/v1/complaints (Libro de Reclamaciones), Hoja de Reclamacion (formulario)

### Community 96 - "Flujo del pedido (guardar con codigo cor"
Cohesion: 0.29
Nodes (8): Arquitectura backend por modulos (auth, catalog, inventory, order, delivery, shared, config), Tarea programada de vencimiento (20 min), IntelliMarket (proyecto de referencia ZIP), Problemas de seguridad del ZIP (no repetir), Estados de pedido PENDING/CONFIRMED/CANCELLED/EXPIRED, Estructura src/app (core, layouts, models, pages, services, shared), errorInterceptor (401/403/429), ToastService + ToastContainer

## Knowledge Gaps
- **138 isolated node(s):** `com.brinda:api`, `ANSWERED`, `ON_TIME`, `OVERDUE`, `SOON` (+133 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 773 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **56 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Design System: BRINDA` connect `Sistema de diseño` to `Components`, `Pedido y WhatsApp (producto)`, `Despliegue y base de datos`, `Sistema de diseño · Colors`, `Componentes de diseño`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **What connects `com.brinda:api`, `ANSWERED`, `ON_TIME` to the rest of the system?**
  _138 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Control de edad y servicios públicos` be split into smaller, more focused modules?**
  _Cohesion score 0.04649947753396029 - nodes in this community are weakly interconnected._
- **Why does `AuthService` connect `Catálogo y paginación` to `Controladores y sesión (backend)`, `Requests y propiedades (2)`, `AuthService`, `Brief de frontend`, `Configuración Spring (2)`, `Controladores y sesión (backend) (2)`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `Carrito y producto (frontend)` be split into smaller, more focused modules?**
  _Cohesion score 0.058385093167701865 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `Control de edad y servicios públicos` to `Carrito y producto (frontend)`, `Sesión del panel (frontend) · @angular/router`, `Sesión del panel (frontend)`, `Panel de reclamos (frontend)`, `Control de edad y servicios públicos · config.ts`, `Formulario público del Libro`, `Checkout /pedido`, `Páginas legales`, `Config legal y pie`, `Toolchain Angular`, `Formulario público del Libro (3)`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `Controladores y sesión (backend)` be split into smaller, more focused modules?**
  _Cohesion score 0.0579689502919812 - nodes in this community are weakly interconnected._