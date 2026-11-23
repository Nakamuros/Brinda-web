# Graph Report - BRINDA  (2026-11-22)

## Corpus Check
- 361 files · ~138,017 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 39 file(s) not represented in the graph (top: .css 26, (none) 7, .properties 4)

## Summary
- 2223 nodes · 6074 edges · 111 communities (75 shown, 36 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 279 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Panel de pedidos (backend)
- Filtro JWT y seguridad
- Catálogo público y ofertas
- Utilidades de tests
- Controladores REST
- DTOs de auth y propiedades
- Control de edad (+18)
- Carrito y preferencias de medios
- Dependencias npm
- Configuración Angular
- Admin de catálogo
- Entidades JPA base
- Panel de reclamos (backend)
- Manejo de errores API
- Formulario público del Libro
- Carrito y líneas
- Registro de reclamos
- Sistema de diseño (DESIGN.md)
- Login y sesión
- Producto y precios
- Zonas y distritos (admin)
- Productos del panel (DTOs)
- Panel de reclamos (frontend)
- Imágenes de productos
- Visibilidad y ofertas
- Combos
- Correo de reclamos
- Formulario de producto y combos
- Servicio JWT y cookie
- Checkout /pedido
- Navegación y scroll
- Repositorios JPA
- Sesión del panel (frontend)
- Landing: contacto e info
- Tests de seguridad y CORS
- Ventas y zonas (frontend)
- Lista de reclamos y plazos
- Estado de correos
- PDF de la hoja
- Panel: clave y categorías
- pedidos-lista.ts
- Complaint
- org.springframework.transaction.annotati
- org.junit.jupiter.api.Test
- BRINDA — Brief de frontend (para `/impec
- OrderItem
- producto-form.ts
- ProductsAdmin
- pedido-creado.ts
- playwright
- carrito.mjs
- PROMPT-CLI-V4 (lote de cambios V4)
- .buildableNow()
- BusinessRuleException
- pedido-real.mjs
- CONTEXTO-BRINDA (documento de traspaso)
- ValidDocument.java
- Seccion 19 pendientes antes de produccio
- StockMovement
- Counting
- Seccion 18 decisiones lote V4 y etapa V8
- ReclamosLista
- avances.md registro de estado
- ProductRepository
- CreateComplaintRequest
- db
- Product
- ImageController.java
- ComplaintNotifierTest
- database/README.md BD PostgreSQL
- PedidoDetalle
- CategoryRepository
- admin-productos.mjs
- hero.ts
- .resolve()
- Modelo de datos ERD v2
- DNI obligatorio y cifrado para boletas
- admin-pedidos.mjs
- ProductosLista
- Catalogo
- pedido.spec.ts
- CatalogService
- UserRepository
- SecurityEventLog
- ref_node_fs
- pedido.mjs
- Zonas
- .isActive()
- .isActive()
- 2026-10-26T01-33-07Z__src-app-pages-publ
- 2026-10-26T01-47-10Z__src-app-pages-publ
- 2026-10-26T01-59-53Z__src-app-pages-publ
- Frontend
- admin.mjs
- ReclamoDetalle
- SecurityAutoConfigTest.java
- ComboNuevo
- BrindaApplication.java
- CreateOrderRequestDniTest
- pedido-creado.mjs
- ProductDetail
- Role
- PublicProductResponseTest
- environment.production.ts
- PROMPT-INICIO-SESION.md
- com.brinda:api
- readme.md (vacio)

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
- `Hallazgos` --references--> `SecurityProperties`  [INFERRED]
  SECURITY-REPORT.md → backend/src/main/java/com/brinda/api/auth/security/SecurityProperties.java
- `Hallazgos` --references--> `AuthService`  [INFERRED]
  SECURITY-REPORT.md → backend/src/main/java/com/brinda/api/auth/service/AuthService.java

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Migraciones V1-V9 de la BD** — database_readme_v1, database_readme_v2, database_readme_v4, database_readme_v9 [EXTRACTED 0.95]
- **Entidades del nucleo de pedido y stock** — contexto_brinda_orders, contexto_brinda_order_items, contexto_brinda_stock_movements, contexto_brinda_products [EXTRACTED 0.95]
- **Mecanismos de promocion del catalogo** — contexto_brinda_ofertas, contexto_brinda_combos, contexto_brinda_lleva_n_paga_m [EXTRACTED 0.95]
- **V4 promotion phases (offers, combos, buy X pay Y)** — prompt_cli_v4_fase1, prompt_cli_v4_fase2, prompt_cli_v4_fase3 [EXTRACTED 1.00]

## Communities (111 total, 36 thin omitted)

### Community 0 - "Panel de pedidos (backend)"
Cohesion: 0.05
Nodes (26): OrderAdminController, CancelOrderRequest, OrderDetailResponse, OrderSummaryResponse, PendingCountResponse, Day, Inventory, SalesReportResponse (+18 more)

### Community 1 - "Filtro JWT y seguridad"
Cohesion: 0.06
Nodes (8): JwtAuthenticationFilter, ClockConfig, SchedulingConfig, SecurityConfig, BodySizeLimitFilter, RateLimitFilter, SlidingWindowLimiter, BcryptHash

### Community 2 - "Catálogo público y ofertas"
Cohesion: 0.07
Nodes (8): OfferRule, PromoRule, CreateOrderRequest, Item, PaymentMethod, PLIN, YAPE, AuditService

### Community 3 - "Utilidades de tests"
Cohesion: 0.08
Nodes (11): ComplaintType, CLAIM, COMPLAINT, DocumentType, CE, DNI, GoodType, PRODUCT (+3 more)

### Community 4 - "Controladores REST"
Cohesion: 0.11
Nodes (12): CatalogController, PageResponse, CatalogService, ComboAdminController, ComplaintController, DeliveryController, PublicDistrictResponse, DeliveryService (+4 more)

### Community 5 - "DTOs de auth y propiedades"
Cohesion: 0.10
Nodes (4): SecurityProperties, OrderProperties, ImageProperties, ImageUrlSerializer

### Community 6 - "Control de edad (+18)"
Cohesion: 0.07
Nodes (16): AgeGate, AGE_GATE, HOW_TO_ORDER, IMAGES, ORDER, SITE, AgeGateDialog, lock (+8 more)

### Community 7 - "Carrito y preferencias de medios"
Cohesion: 0.08
Nodes (15): MediaPrefs, NetworkInformationLike, Carrito, CatalogoSoon, CatalogStatus, BottlePlaceholder, LegalNotice, ParallaxDirective (+7 more)

### Community 8 - "Dependencias npm"
Cohesion: 0.06
Nodes (40): dependencies, @angular/common@^21.2.0, @angular/compiler@^21.2.0, @angular/core@^21.2.0, @angular/platform-browser@^21.2.0, @angular/router@^21.2.0, gsap@^3.15.0, lenis@^1.3.27 (+32 more)

### Community 9 - "Configuración Angular"
Cohesion: 0.05
Nodes (41): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+33 more)

### Community 10 - "Admin de catálogo"
Cohesion: 0.15
Nodes (7): AuthenticatedUser, CatalogAdminController, VisibilityResponse, ComplaintAdminController, InventoryAdminController, Line, RestockBatchRequest

### Community 11 - "Entidades JPA base"
Cohesion: 0.12
Nodes (5): Category, DeliveryZone, District, AuditLog, Auditable

### Community 12 - "Panel de reclamos (backend)"
Cohesion: 0.11
Nodes (8): ComplaintCountsResponse, ComplaintDetailResponse, RespondComplaintRequest, BusinessDays, ComplaintAdminService, PdfFile, ComplaintDeadlines, ComplaintAdminTest

### Community 13 - "Manejo de errores API"
Cohesion: 0.14
Nodes (3): ErrorResponse, GlobalExceptionHandler, GlobalExceptionHandlerTest

### Community 14 - "Formulario público del Libro"
Cohesion: 0.07
Nodes (18): LEGAL, SHOW_PENDING, ComplaintForm, DATE, DOC, FieldName, LIMITS, MESSAGES (+10 more)

### Community 15 - "Carrito y líneas"
Cohesion: 0.10
Nodes (15): CartLine, Product, ProductLine, CartService, cents(), lineTotals(), MAX_QTY, DAY_MONTH (+7 more)

### Community 16 - "Registro de reclamos"
Cohesion: 0.09
Nodes (6): CreatedComplaintResponse, ComplaintNumberGenerator, ComplaintService, Created, DniCipher, ComplaintServiceTest

### Community 17 - "Sistema de diseño (DESIGN.md)"
Cohesion: 0.05
Nodes (36): Avisos legales, Barra fija "Pedir ahora", Buttons, Campos de formulario, Category tile, Colors, Components, Control de edad (+18) (+28 more)

### Community 18 - "Login y sesión"
Cohesion: 0.11
Nodes (7): AuthController, ChangePasswordRequest, LoginRequest, UserResponse, User, AuthService, InvalidCredentialsException

### Community 20 - "Zonas y distritos (admin)"
Cohesion: 0.16
Nodes (8): DeliveryAdminController, DistrictRequest, DistrictResponse, ZoneRequest, ZoneResponse, DeliveryZoneRepository, DistrictRepository, DeliveryAdminService

### Community 21 - "Productos del panel (DTOs)"
Cohesion: 0.21
Nodes (4): AdminProductResponse, CategoryRequest, ProductRequest, CatalogAdminService

### Community 22 - "Panel de reclamos (frontend)"
Cohesion: 0.14
Nodes (21): ComplaintCounts, ComplaintDetail, ComplaintFilters, ComplaintPage, ComplaintStatus, ComplaintSummary, ComplaintType, days() (+13 more)

### Community 23 - "Imágenes de productos"
Cohesion: 0.11
Nodes (4): ImageStore, ImageUploadProperties, MigrationsSeedGuardTest, ImageStoreTest

### Community 24 - "Visibilidad y ofertas"
Cohesion: 0.09
Nodes (13): OfferRequest, ProductVisibility, ALL, HIDDEN, VISIBLE, PromoRequest, VisibilityRequest, ProductType (+5 more)

### Community 25 - "Combos"
Cohesion: 0.14
Nodes (8): ComboDetailResponse, Line, CreateComboRequest, Item, ComboItem, ComboItemRepository, ComboService, OrderComboContents

### Community 26 - "Correo de reclamos"
Cohesion: 0.13
Nodes (8): ComplaintEmailRetryJob, ComplaintNotifier, OrderExpirationJob, EmailSender, NoopEmailSender, SendResult, SENT, SKIPPED

### Community 27 - "Formulario de producto y combos"
Cohesion: 0.13
Nodes (7): Line, amount(), ProductoForm, PRODUCT, wholeNumber(), AdminProduct, ProductRequest

### Community 28 - "Servicio JWT y cookie"
Cohesion: 0.14
Nodes (4): JwtProperties, JwtService, Session, JwtServiceTest

### Community 29 - "Checkout /pedido"
Cohesion: 0.11
Nodes (10): @angular/forms@^21.2.0, District, FieldName, MESSAGES, Pedido, DeliveryService, DeliveryStatus, OrderFailure (+2 more)

### Community 30 - "Navegación y scroll"
Cohesion: 0.12
Nodes (6): ScrollService, NAV_ITEMS, NavItem, SiteNav, OrderBar, vitest

### Community 31 - "Repositorios JPA"
Cohesion: 0.20
Nodes (3): ComplaintRepository, StockMovementRepository, AuditLogRepository

### Community 32 - "Sesión del panel (frontend)"
Cohesion: 0.12
Nodes (7): AdminAuth, AdminUser, adminGuard(), runGuard(), LayoutAdmin, AdminLogin, Deadline

### Community 33 - "Landing: contacto e info"
Cohesion: 0.13
Nodes (11): CONTACT, PENDING, buildColumns(), HAS_INFO_SECTION, InfoColumn, Landing, Categories, InfoColumns (+3 more)

### Community 34 - "Tests de seguridad y CORS"
Cohesion: 0.13
Nodes (10): SecurityPropertiesTest, ClientIpTest, Acciones manuales (tuyas), Cambios sin commitear y agrupación sugerida, Decisiones pendientes, Hallazgos, No aplica / no existe, Pendientes para la asesora legal (Ley 29733) (+2 more)

### Community 35 - "Ventas y zonas (frontend)"
Cohesion: 0.15
Nodes (13): SalesReport, District, Zone, appConfig, routes, API_URL, credentialsFor(), credentialsInterceptor (+5 more)

### Community 36 - "Lista de reclamos y plazos"
Cohesion: 0.15
Nodes (10): ComplaintSummaryResponse, DeadlineInfo, Level, ANSWERED, ON_TIME, OVERDUE, SOON, ComplaintStatus (+2 more)

### Community 37 - "Estado de correos"
Cohesion: 0.12
Nodes (7): EmailInfo, EmailDelivery, EmailStatus, FAILED, PENDING, SENT, ReflectionHelper

### Community 39 - "Panel: clave y categorías"
Cohesion: 0.14
Nodes (5): apiError(), AdminPassword, Categorias, PedidosLista, Ventas

### Community 40 - "pedidos-lista.ts"
Cohesion: 0.17
Nodes (7): ORDER_STATUS, OrderDetail, OrdersAdmin, OrderStatus, OrderSummary, formatDateTime(), Page

### Community 41 - "Complaint"
Cohesion: 0.20
Nodes (5): Complaint, ComplaintEmailTemplates, ComplaintProperties, Attachment, EmailMessage

### Community 42 - "org.springframework.transaction.annotati"
Cohesion: 0.26
Nodes (5): AdjustRequest, MovementResponse, RestockRequest, InventoryService, StockLine

### Community 43 - "org.junit.jupiter.api.Test"
Cohesion: 0.28
Nodes (3): BuyXPayYCalculator, Result, BuyXPayYCalculatorTest

### Community 44 - "BRINDA — Brief de frontend (para `/impec"
Cohesion: 0.10
Nodes (19): 10. Animaciones (alcance por pantalla), 11. Landing: secciones (primera pantalla a construir), 12. Material visual (assets), 13. Cómo usar este documento, 1. El producto, 2. Stack y convenciones (tomadas de IntelliMarket), 3. Estructura rescatada de IntelliMarket (solo el esqueleto), 4. Qué NO se rescata (propio de IntelliMarket) (+11 more)

### Community 45 - "OrderItem"
Cohesion: 0.17
Nodes (7): Item, OrderItem, PromoType, BUY_X_PAY_Y, OFFER, OrderLineText, OrderLineTextTest

### Community 46 - "producto-form.ts"
Cohesion: 0.19
Nodes (13): Draft, EMPTY, IMAGE_TYPES, ComboCreate, ComboDetail, ComboUpdate, Movement, MOVEMENT_LABEL (+5 more)

### Community 48 - "pedido-creado.ts"
Cohesion: 0.20
Nodes (10): CreatedOrder, CreateOrderRequest, HOUR, METHOD, PedidoCreado, ORDER, OrderService, readRecent() (+2 more)

### Community 49 - "playwright"
Cohesion: 0.18
Nodes (10): AGE_KEY, passAgeGate(), api, cats, out, out, sizes, errors (+2 more)

### Community 50 - "carrito.mjs"
Cohesion: 0.15
Nodes (11): newCtx(), out, sizes, checks, newCtx(), sizes, data, json() (+3 more)

### Community 51 - "PROMPT-CLI-V4 (lote de cambios V4)"
Cohesion: 0.18
Nodes (14): Endpoints admin (ROLE_ADMIN), Endpoints auth (login, logout, me, change-password), BRINDA API Endpoints v1, Imagenes imageUrl / imageKey, Endpoints publicos (catalogo, distritos, POST orders), Reglas a recordar (promo, combo, oferta, stock), Formula lleva N paga M, PROMPT-CLI-V4 (lote de cambios V4) (+6 more)

### Community 52 - ".buildableNow()"
Cohesion: 0.28
Nodes (3): ComboCalculator, Component, ComboCalculatorTest

### Community 53 - "BusinessRuleException"
Cohesion: 0.24
Nodes (5): CreatedOrderResponse, Line, Payment, OrderService, BusinessRuleException

### Community 54 - "pedido-real.mjs"
Cohesion: 0.12
Nodes (4): CLIENT, districts, out, sizes

### Community 55 - "CONTEXTO-BRINDA (documento de traspaso)"
Cohesion: 0.17
Nodes (14): Backend Spring Boot 3.4.5 / Java 21 cerrado para Hito 1, Frontend Angular (Hito 2), Arquitectura backend com.brinda.api (auth, catalog, inventory, order, delivery, shared, config), Diseno visual hibrido (paleta y tipografias), CONTEXTO-BRINDA (documento de traspaso), Garantia y acuerdos con el cliente, Hitos 1-3 y plan de trabajo, IntelliMarket (proyecto ZIP de referencia) (+6 more)

### Community 57 - "Seccion 19 pendientes antes de produccio"
Cohesion: 0.16
Nodes (15): Legal y privacidad (Ley 29733, SUNAT, edad, terminos), Pendiente 1: IP real detras del proxy (ABIERTO), Pendiente 5: rol cajero para el hijo (ABIERTO), Pendiente 8: usuario admin adivinable, bloqueo (ABIERTO), Pendiente 10: sin captcha, limite en memoria (ABIERTO), Pendiente 11: pedidos rechazados por falta de stock no registrados (ABIERTO), Pendiente 12: desarmar combos, ofertas con inicio, promos mixtas (ABIERTO), Pendiente 13: validar con asesor venta de cigarros y alcohol (ABIERTO) (+7 more)

### Community 58 - "StockMovement"
Cohesion: 0.15
Nodes (10): MovementType, ADJUSTMENT, CANCEL_RETURN, COMBO_BUILD, COMBO_CONSUME, COMBO_DISASSEMBLE, COMBO_RETURN, RESTOCK (+2 more)

### Community 60 - "Seccion 18 decisiones lote V4 y etapa V8"
Cohesion: 0.18
Nodes (12): Promocion lleva N paga M, Ofertas de precio con fecha de fin, Pendiente 21: subida de fotos desde el panel, WebP y R2 (DIFERIDO), Seccion 18 decisiones lote V4 y etapa V8-V9, setup/02_grants.sql fuente unica de privilegios de brinda_app, Orden de ejecucion de scripts SQL, Migracion V1 schema, Migracion V2 indices y triggers (+4 more)

### Community 62 - "avances.md registro de estado"
Cohesion: 0.15
Nodes (13): avances.md registro de estado, Entorno de desarrollo PC nueva (Docker brinda-db, JDK 21, DBeaver), Que sigue: frontend Angular Hito 2, datos reales, despliegue, Verificacion: 45 tests unitarios y Newman 133 peticiones 0 fallos, CLAUDE.md Directrices Core Brinda Web, Skills de frontend (UI Pro Max, Taste, mobile-first, a11y), Skill Ponytail (minimalismo), Reglas de seguridad y alcance (no secretos, no commit sin pedir, no destructivo BD) (+5 more)

### Community 63 - "ProductRepository"
Cohesion: 0.19
Nodes (3): Line, PublicProductResponse, ProductRepository

### Community 65 - "db"
Cohesion: 0.15
Nodes (12): container_name, environment, image, ports, restart, volumes, POSTGRES_PASSWORD, POSTGRES_USER (+4 more)

### Community 66 - "Product"
Cohesion: 0.15
Nodes (12): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+4 more)

### Community 69 - "database/README.md BD PostgreSQL"
Cohesion: 0.18
Nodes (12): Docker Compose Postgres 16 (puerto 5433 local), BRINDA licoreria delivery Lima, Lucia (duena, usuaria del panel), Pendiente 2: cuenta real de la duena (ABIERTO), Stack: Angular, Spring Boot, PostgreSQL, Credenciales semilla (solo hash BCrypt en V3, no en produccion), database/README.md BD PostgreSQL, Reglas en la BD (NUMERIC, TIMESTAMPTZ, RESTRICT, solo-insercion) (+4 more)

### Community 73 - "admin-productos.mjs"
Cohesion: 0.18
Nodes (3): env, out, sizes

### Community 74 - "hero.ts"
Cohesion: 0.22
Nodes (4): HERO, Hero, HeroVideo, Setup

### Community 76 - "Modelo de datos ERD v2"
Cohesion: 0.36
Nodes (10): Entidad AUDIT_LOGS, Entidad CATEGORIES, Combos pre-armados (combos, combo_items), Entidades DELIVERY_ZONES y DISTRICTS, Modelo de datos ERD v2, Entidad ORDER_ITEMS, Entidad ORDERS, Entidad PRODUCTS (+2 more)

### Community 77 - "DNI obligatorio y cifrado para boletas"
Cohesion: 0.20
Nodes (8): DNI obligatorio y cifrado para boletas, Flujo del pedido (carrito, solicitar, WhatsApp, Finalizada), Estados de pedido PENDING/CONFIRMED/CANCELLED/EXPIRED, Pago Yape/Plin verificado a mano (sin capturas), Pendiente 4: respaldo DNI_ENCRYPTION_KEY (ABIERTO), Reglas de negocio (precios, stock, delivery, DNI, pagos, edad), Stock: descuento atomico al confirmar, sin reserva, Migracion V8 DNI obligatorio (trigger INSERT)

### Community 78 - "admin-pedidos.mjs"
Cohesion: 0.20
Nodes (5): districts, env, out, simOrders, sizes

### Community 81 - "pedido.spec.ts"
Cohesion: 0.27
Nodes (7): CREATED, DISTRICTS, fill(), product, render(), select(), submit()

### Community 85 - "ref_node_fs"
Cohesion: 0.22
Nodes (3): sizes, CASES, out

### Community 86 - "pedido.mjs"
Cohesion: 0.22
Nodes (5): districts, far, near, out, zones

### Community 90 - "2026-10-26T01-33-07Z__src-app-pages-publ"
Cohesion: 0.25
Nodes (7): Browser measurements (B): overflow 0 at 360/768/1440; 0 console errors; 2 imgs all with alt attribute; heading outline h1>h2>h3 clean; 44 requests / ~2.6 MB on the dev server (production build ~65 KB JS transferred); targets under 44px: skip link, nav brand, "Ver en el catalogo" (37px), desktop nav links (36px, mouse-driven)., Design Health Score: 21/32 (applicable max; heuristics 7 and 10 n/a for a Persuade landing) → 66%, Acceptable, Design Specificity Verdict, Minor observations, Persona red flags, Priority issues, Questions

### Community 91 - "2026-10-26T01-47-10Z__src-app-pages-publ"
Cohesion: 0.25
Nodes (7): Design Health Score: 21/32 (66%, Acceptable). Heuristics 7 and 10 n/a (Persuade landing). Same total as round 1., Evidence (B, production build), Minor, Persona red flags, Priority issues, Questions, Specificity: authored hero, interchangeable lower page. Detector: [] on all targets (exit 0); headless overlay: "No anti-patterns found" at 1440 and 360 (no user-visible overlay).

### Community 92 - "2026-10-26T01-59-53Z__src-app-pages-publ"
Cohesion: 0.25
Nodes (7): Design Health Score: 23/32 (72%, Good band by percentage). Heuristics 7 and 10 n/a. Reviewer note: A scored heuristic 9 at 3 ("nothing to recover from") and heuristic 5 at 3 (+18 notice present); earlier rounds scored both 2, so about one point of the +2 is scorer drift, the rest comes from real fixes., Evidence (B, production), Minor, Personas, Priority issues, Questions, Specificity: distinct mood (bar at night), generic skeleton; mood 3/5, content 2/5. Detector [] on all targets; overlay "No anti-patterns found" (headless, no user-visible overlay).

### Community 93 - "Frontend"
Cohesion: 0.25
Nodes (7): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests

### Community 94 - "admin.mjs"
Cohesion: 0.25
Nodes (6): created, env, out, password, PII, sizes

### Community 102 - "Role"
Cohesion: 0.50
Nodes (3): Role, ROLE_ADMIN, ROLE_CASHIER

## Knowledge Gaps
- **69 isolated node(s):** `Endpoints auth (login, logout, me, change-password)`, `Imagenes imageUrl / imageKey`, `Pruebas esperadas (unitarias y manuales)`, `Reglas de trabajo por fases (plan, migraciones nuevas, grants)`, `Diseno visual hibrido (paleta y tipografias)` (+64 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 644 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@angular/core` connect `Carrito y preferencias de medios` to `Control de edad (+18)`, `Dependencias npm`, `Formulario público del Libro`, `Carrito y líneas`, `Panel de reclamos (frontend)`, `Formulario de producto y combos`, `Checkout /pedido`, `Navegación y scroll`, `Sesión del panel (frontend)`, `Landing: contacto e info`, `Ventas y zonas (frontend)`, `Panel: clave y categorías`, `pedidos-lista.ts`, `producto-form.ts`, `pedido-creado.ts`, `PedidoDetalle`, `hero.ts`, `pedido.spec.ts`, `CatalogService`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `Endpoints auth (login, logout, me, change-password)`, `Imagenes imageUrl / imageKey`, `Pruebas esperadas (unitarias y manuales)` to the rest of the system?**
  _69 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Panel de pedidos (backend)` be split into smaller, more focused modules?**
  _Cohesion score 0.050187265917602995 - nodes in this community are weakly interconnected._
- **Why does `playwright` connect `playwright` to `pedido-creado.mjs`, `Dependencias npm`, `admin-productos.mjs`, `admin-pedidos.mjs`, `carrito.mjs`, `ref_node_fs`, `pedido.mjs`, `pedido-real.mjs`, `admin.mjs`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Should `Filtro JWT y seguridad` be split into smaller, more focused modules?**
  _Cohesion score 0.05608322026232474 - nodes in this community are weakly interconnected._
- **Why does `BusinessRuleException` connect `BusinessRuleException` to `Panel de pedidos (backend)`, `Catálogo público y ofertas`, `Utilidades de tests`, `Lista de reclamos y plazos`, `ComplaintPdfService.java`, `org.springframework.transaction.annotati`, `Panel de reclamos (backend)`, `Manejo de errores API`, `Login y sesión`, `Zonas y distritos (admin)`, `Productos del panel (DTOs)`, `Imágenes de productos`, `Visibilidad y ofertas`, `Combos`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Should `Catálogo público y ofertas` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._