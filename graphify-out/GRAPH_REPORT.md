# Graph Report - BRINDA  (2026-11-02)

## Corpus Check
- 304 files · ~108,600 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: .css 20, (none) 7, .properties 4)

## Summary
- 1902 nodes · 5259 edges · 104 communities (62 shown, 42 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 262 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `16bb0a6d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Product
- offsetdatetime
- Components
- jakarta.servlet.http.HttpServletRequest
- User
- .buildableNow
- SecurityConfig.java
- org.springframework.stereotype.Component
- DistrictRepository
- ClientIpTest
- catalog.service.ts
- org.springframework.http.ResponseEntity
- ComboService.java
- PROMPT-CLI-V4 (lote de cambios V4)
- CONTEXTO-BRINDA (documento de traspaso)
- Seccion 19 pendientes antes de produccion
- CatalogAdminService.java
- Seccion 18 decisiones lote V4 y etapa V8-V9
- avances.md registro de estado
- org.springframework.data.jpa.repository.JpaRepository
- package.json
- database/README.md BD PostgreSQL
- MovementType
- frontend
- Modelo de datos ERD v2
- DNI obligatorio y cifrado para boletas
- OrderAdminService
- BRINDA — Brief de frontend (para `/impeccable init` y para el CLI)
- BrindaApplication.java
- JwtAuthenticationFilter.java
- StockMovement
- CartService
- Counting
- OrderStatus
- CreateOrderRequestDniTest.java
- DniCipher
- ComplaintNotifierTest
- com.brinda:api
- readme.md (vacio)
- MediaPrefs
- pedido.ts
- BodySizeLimitFilter.java
- config.ts
- PublicProductResponse.java
- org.junit.jupiter.api.Test
- .isActive
- CreateOrderRequestDniTest.java
- db
- app.config.ts
- Product
- CartService
- catalogo.ts
- OrderChannel
- JwtAuthenticationFilter.java
- AuthController.java
- pedido.spec.ts
- PublicProductResponseTest.java
- Frontend
- EmailMessage
- scripts
- StockMovement
- UserRepository
- .create
- org.springframework.transaction.annotation.Transactional
- EmailDelivery
- DniCipher
- OrderRepository
- .line
- how-to-order.ts
- 2026-10-26T01-33-07Z__src-app-pages-public-landing-landing-ts.md
- 2026-10-26T01-47-10Z__src-app-pages-public-landing-landing-ts.md
- 2026-10-26T01-59-53Z__src-app-pages-public-landing-landing-ts.md
- playwright
- SiteNav
- Catalogo
- BusinessDays
- PageResponse
- District
- SecurityConfig
- .receiptText
- ProductDetail
- uuid
- OrderRepository
- PROMPT-INICIO-SESION.md
- pedido.mjs
- ReclamoDetalle
- PageResponse
- EmailStatus
- admin.mjs
- org.springframework.context.annotation.Configuration
- DistrictRepository
- RateLimitFilter
- carrito.mjs
- Pedido
- catalogo-api.mjs
- Carrito
- environment.production.ts

## God Nodes (most connected - your core abstractions)
1. `Product` - 68 edges
2. `@angular/core` - 61 edges
3. `Complaint` - 53 edges
4. `BusinessRuleException` - 45 edges
5. `AuthenticatedUser` - 38 edges
6. `Order` - 37 edges
7. `CatalogAdminService` - 35 edges
8. `@angular/router` - 30 edges
9. `User` - 28 edges
10. `AdminProductResponse` - 28 edges

## Surprising Connections (you probably didn't know these)
- `4. Qué NO se rescata (propio de IntelliMarket)` --references--> `AuthService`  [INFERRED]
  FRONTEND-BRIEF-BRINDA.md → backend/src/main/java/com/brinda/api/auth/service/AuthService.java
- `Verificado correcto (sin cambios)` --references--> `ProdSeedGuard`  [INFERRED]
  SECURITY-REPORT.md → backend/src/main/java/com/brinda/api/config/ProdSeedGuard.java
- `No aplica / no existe` --references--> `NoopEmailSender`  [INFERRED]
  SECURITY-REPORT.md → backend/src/main/java/com/brinda/api/shared/mail/NoopEmailSender.java
- `Hallazgos` --references--> `SecurityProperties`  [INFERRED]
  SECURITY-REPORT.md → backend/src/main/java/com/brinda/api/auth/security/SecurityProperties.java
- `Cambios sin commitear y agrupación sugerida` --references--> `AuthService`  [INFERRED]
  SECURITY-REPORT.md → backend/src/main/java/com/brinda/api/auth/service/AuthService.java

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Migraciones V1-V9 de la BD** — database_readme_v1, database_readme_v2, database_readme_v4, database_readme_v9 [EXTRACTED 0.95]
- **Entidades del nucleo de pedido y stock** — contexto_brinda_orders, contexto_brinda_order_items, contexto_brinda_stock_movements, contexto_brinda_products [EXTRACTED 0.95]
- **Mecanismos de promocion del catalogo** — contexto_brinda_ofertas, contexto_brinda_combos, contexto_brinda_lleva_n_paga_m [EXTRACTED 0.95]
- **V4 promotion phases (offers, combos, buy X pay Y)** — prompt_cli_v4_fase1, prompt_cli_v4_fase2, prompt_cli_v4_fase3 [EXTRACTED 1.00]

## Communities (104 total, 42 thin omitted)

### Community 0 - "Product"
Cohesion: 0.12
Nodes (4): Line, PublicProductResponse, Product, ProductSpecifications

### Community 1 - "offsetdatetime"
Cohesion: 0.10
Nodes (6): LoginRequest, JwtProperties, SecurityProperties, OrderProperties, ImageProperties, ImageUrlSerializer

### Community 2 - "Components"
Cohesion: 0.05
Nodes (36): Avisos legales, Barra fija "Pedir ahora", Buttons, Campos de formulario, Category tile, Colors, Components, Control de edad (+18) (+28 more)

### Community 3 - "jakarta.servlet.http.HttpServletRequest"
Cohesion: 0.06
Nodes (21): AuthController, UserResponse, AuthenticatedUser, CatalogAdminController, VisibilityResponse, CatalogController, CategoryResponse, ComboAdminController (+13 more)

### Community 4 - "User"
Cohesion: 0.07
Nodes (8): Role, ROLE_ADMIN, ROLE_CASHIER, User, JwtService, Session, InvalidCredentialsException, JwtServiceTest

### Community 5 - ".buildableNow"
Cohesion: 0.28
Nodes (3): ComboCalculator, Component, ComboCalculatorTest

### Community 7 - "org.springframework.stereotype.Component"
Cohesion: 0.16
Nodes (9): ComplaintRepository, ComplaintEmailRetryJob, ComplaintNotifier, OrderExpirationJob, EmailSender, NoopEmailSender, SendResult, SENT (+1 more)

### Community 8 - "DistrictRepository"
Cohesion: 0.24
Nodes (5): ZoneRequest, ZoneResponse, DeliveryZone, DeliveryZoneRepository, DeliveryAdminService

### Community 9 - "ClientIpTest"
Cohesion: 0.12
Nodes (10): SecurityPropertiesTest, ClientIpTest, Acciones manuales (tuyas), Cambios sin commitear y agrupación sugerida, Decisiones pendientes, Hallazgos, No aplica / no existe, Pendientes para la asesora legal (Ley 29733) (+2 more)

### Community 10 - "catalog.service.ts"
Cohesion: 0.14
Nodes (15): build(), COMBOS, inDays(), MOCK_CATEGORIES, mockProducts(), Seed, SEEDS, slugify() (+7 more)

### Community 11 - "org.springframework.http.ResponseEntity"
Cohesion: 0.17
Nodes (3): ErrorResponse, GlobalExceptionHandler, GlobalExceptionHandlerTest

### Community 12 - "ComboService.java"
Cohesion: 0.09
Nodes (13): ProductType, COMBO, PRODUCT, CategoryRepository, BuildComboRequest, ComboDetailResponse, Line, ComboUpdateRequest (+5 more)

### Community 13 - "PROMPT-CLI-V4 (lote de cambios V4)"
Cohesion: 0.18
Nodes (14): Endpoints admin (ROLE_ADMIN), Endpoints auth (login, logout, me, change-password), BRINDA API Endpoints v1, Imagenes imageUrl / imageKey, Endpoints publicos (catalogo, distritos, POST orders), Reglas a recordar (promo, combo, oferta, stock), Formula lleva N paga M, PROMPT-CLI-V4 (lote de cambios V4) (+6 more)

### Community 14 - "CONTEXTO-BRINDA (documento de traspaso)"
Cohesion: 0.17
Nodes (14): Backend Spring Boot 3.4.5 / Java 21 cerrado para Hito 1, Frontend Angular (Hito 2), Arquitectura backend com.brinda.api (auth, catalog, inventory, order, delivery, shared, config), Diseno visual hibrido (paleta y tipografias), CONTEXTO-BRINDA (documento de traspaso), Garantia y acuerdos con el cliente, Hitos 1-3 y plan de trabajo, IntelliMarket (proyecto ZIP de referencia) (+6 more)

### Community 15 - "Seccion 19 pendientes antes de produccion"
Cohesion: 0.16
Nodes (15): Legal y privacidad (Ley 29733, SUNAT, edad, terminos), Pendiente 1: IP real detras del proxy (ABIERTO), Pendiente 5: rol cajero para el hijo (ABIERTO), Pendiente 8: usuario admin adivinable, bloqueo (ABIERTO), Pendiente 10: sin captcha, limite en memoria (ABIERTO), Pendiente 11: pedidos rechazados por falta de stock no registrados (ABIERTO), Pendiente 12: desarmar combos, ofertas con inicio, promos mixtas (ABIERTO), Pendiente 13: validar con asesor venta de cigarros y alcohol (ABIERTO) (+7 more)

### Community 16 - "CatalogAdminService.java"
Cohesion: 0.12
Nodes (10): ChangePasswordRequest, AuthService, OfferRequest, PromoRequest, VisibilityRequest, ComplaintAdminService, PdfFile, CancelOrderRequest (+2 more)

### Community 17 - "Seccion 18 decisiones lote V4 y etapa V8-V9"
Cohesion: 0.18
Nodes (12): Promocion lleva N paga M, Ofertas de precio con fecha de fin, Pendiente 21: subida de fotos desde el panel, WebP y R2 (DIFERIDO), Seccion 18 decisiones lote V4 y etapa V8-V9, setup/02_grants.sql fuente unica de privilegios de brinda_app, Orden de ejecucion de scripts SQL, Migracion V1 schema, Migracion V2 indices y triggers (+4 more)

### Community 18 - "avances.md registro de estado"
Cohesion: 0.15
Nodes (13): avances.md registro de estado, Entorno de desarrollo PC nueva (Docker brinda-db, JDK 21, DBeaver), Que sigue: frontend Angular Hito 2, datos reales, despliegue, Verificacion: 45 tests unitarios y Newman 133 peticiones 0 fallos, CLAUDE.md Directrices Core Brinda Web, Skills de frontend (UI Pro Max, Taste, mobile-first, a11y), Skill Ponytail (minimalismo), Reglas de seguridad y alcance (no secretos, no commit sin pedir, no destructivo BD) (+5 more)

### Community 20 - "package.json"
Cohesion: 0.11
Nodes (23): @angular/compiler@^21.2.0, tslib@^2.3.0, devDependencies, @angular/build@^21.2.28, @angular/cli@^21.2.28, @angular/compiler-cli@^21.2.0, jsdom@^28.0.0, playwright@^1.64.1 (+15 more)

### Community 21 - "database/README.md BD PostgreSQL"
Cohesion: 0.18
Nodes (12): Docker Compose Postgres 16 (puerto 5433 local), BRINDA licoreria delivery Lima, Lucia (duena, usuaria del panel), Pendiente 2: cuenta real de la duena (ABIERTO), Stack: Angular, Spring Boot, PostgreSQL, Credenciales semilla (solo hash BCrypt en V3, no en produccion), database/README.md BD PostgreSQL, Reglas en la BD (NUMERIC, TIMESTAMPTZ, RESTRICT, solo-insercion) (+4 more)

### Community 22 - "MovementType"
Cohesion: 0.11
Nodes (7): AgeGate, AGE_GATE, AgeGateDialog, lock, AnnouncementBar, LayoutPublic, SiteFooter

### Community 23 - "frontend"
Cohesion: 0.05
Nodes (41): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+33 more)

### Community 24 - "Modelo de datos ERD v2"
Cohesion: 0.36
Nodes (10): Entidad AUDIT_LOGS, Entidad CATEGORIES, Combos pre-armados (combos, combo_items), Entidades DELIVERY_ZONES y DISTRICTS, Modelo de datos ERD v2, Entidad ORDER_ITEMS, Entidad ORDERS, Entidad PRODUCTS (+2 more)

### Community 25 - "DNI obligatorio y cifrado para boletas"
Cohesion: 0.20
Nodes (8): DNI obligatorio y cifrado para boletas, Flujo del pedido (carrito, solicitar, WhatsApp, Finalizada), Estados de pedido PENDING/CONFIRMED/CANCELLED/EXPIRED, Pago Yape/Plin verificado a mano (sin capturas), Pendiente 4: respaldo DNI_ENCRYPTION_KEY (ABIERTO), Reglas de negocio (precios, stock, delivery, DNI, pagos, edad), Stock: descuento atomico al confirmar, sin reserva, Migracion V8 DNI obligatorio (trigger INSERT)

### Community 26 - "OrderAdminService"
Cohesion: 0.18
Nodes (6): Order, OrderChannel, STORE, WHATSAPP, OrderComboContents, WhatsAppMessageBuilder

### Community 27 - "BRINDA — Brief de frontend (para `/impeccable init` y para el CLI)"
Cohesion: 0.10
Nodes (19): 10. Animaciones (alcance por pantalla), 11. Landing: secciones (primera pantalla a construir), 12. Material visual (assets), 13. Cómo usar este documento, 1. El producto, 2. Stack y convenciones (tomadas de IntelliMarket), 3. Estructura rescatada de IntelliMarket (solo el esqueleto), 4. Qué NO se rescata (propio de IntelliMarket) (+11 more)

### Community 30 - "StockMovement"
Cohesion: 0.14
Nodes (11): MovementType, ADJUSTMENT, CANCEL_RETURN, COMBO_BUILD, COMBO_CONSUME, COMBO_DISASSEMBLE, COMBO_RETURN, RESTOCK (+3 more)

### Community 33 - "OrderStatus"
Cohesion: 0.17
Nodes (6): PendingCountResponse, OrderStatus, CANCELLED, CONFIRMED, EXPIRED, PENDING

### Community 34 - "CreateOrderRequestDniTest.java"
Cohesion: 0.24
Nodes (5): CreateOrderRequest, PaymentMethod, PLIN, YAPE, CreateOrderRequestDniTest

### Community 39 - "MediaPrefs"
Cohesion: 0.11
Nodes (8): gsap@^3.15.0, IMAGES, MediaPrefs, HeroVideo, Setup, Intro, ParallaxDirective, gsap

### Community 40 - "pedido.ts"
Cohesion: 0.06
Nodes (27): dependencies, @angular/common@^21.2.0, @angular/core@^21.2.0, @angular/forms@^21.2.0, @angular/platform-browser@^21.2.0, @angular/router@^21.2.0, lenis@^1.3.27, rxjs@~7.8.0 (+19 more)

### Community 42 - "config.ts"
Cohesion: 0.09
Nodes (17): CONTACT, HERO, LEGAL, PENDING, SHOW_PENDING, SITE, buildColumns(), HAS_INFO_SECTION (+9 more)

### Community 44 - "org.junit.jupiter.api.Test"
Cohesion: 0.21
Nodes (5): BuyXPayYCalculator, Result, MigrationsSeedGuardTest, SecurityAutoConfigTest, BuyXPayYCalculatorTest

### Community 46 - "CreateOrderRequestDniTest.java"
Cohesion: 0.09
Nodes (8): DocumentType, CE, DNI, GoodType, PRODUCT, SERVICE, CryptoProperties, EmailSendException

### Community 47 - "db"
Cohesion: 0.15
Nodes (12): container_name, environment, image, ports, restart, volumes, POSTGRES_PASSWORD, POSTGRES_USER (+4 more)

### Community 48 - "app.config.ts"
Cohesion: 0.10
Nodes (13): AdminAuth, AdminUser, apiError(), adminGuard(), runGuard(), AdminPassword, LayoutAdmin, AdminLogin (+5 more)

### Community 49 - "Product"
Cohesion: 0.15
Nodes (12): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+4 more)

### Community 50 - "CartService"
Cohesion: 0.20
Nodes (3): RespondComplaintRequest, ComplaintDeadlines, ComplaintAdminTest

### Community 51 - "catalogo.ts"
Cohesion: 0.09
Nodes (21): NetworkInformationLike, Product, CatalogoSoon, cents(), lineTotals(), MAX_QTY, BottlePlaceholder, DAY_MONTH (+13 more)

### Community 53 - "JwtAuthenticationFilter.java"
Cohesion: 0.14
Nodes (22): ComplaintCounts, ComplaintDetail, ComplaintFilters, ComplaintPage, ComplaintStatus, ComplaintSummary, ComplaintType, days() (+14 more)

### Community 54 - "AuthController.java"
Cohesion: 0.19
Nodes (5): AdminProductResponse, CategoryRequest, ProductRequest, CatalogAdminService, BusinessRuleException

### Community 55 - "pedido.spec.ts"
Cohesion: 0.20
Nodes (3): Category, AuditLog, Auditable

### Community 58 - "Frontend"
Cohesion: 0.25
Nodes (7): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests

### Community 59 - "EmailMessage"
Cohesion: 0.32
Nodes (4): ComplaintEmailTemplates, ComplaintProperties, Attachment, EmailMessage

### Community 60 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, ng, start, test, watch

### Community 61 - "StockMovement"
Cohesion: 0.14
Nodes (15): ComplaintDetailResponse, ComplaintSummaryResponse, DeadlineInfo, Level, ANSWERED, ON_TIME, OVERDUE, SOON (+7 more)

### Community 63 - ".create"
Cohesion: 0.15
Nodes (9): CreatedOrderResponse, Line, Payment, Item, OrderItem, PromoType, BUY_X_PAY_Y, OFFER (+1 more)

### Community 64 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.20
Nodes (4): ProductRepository, MovementResponse, InventoryService, StockLine

### Community 66 - "DniCipher"
Cohesion: 0.15
Nodes (5): CreatedComplaintResponse, ComplaintNumberGenerator, ComplaintService, Created, ComplaintServiceTest

### Community 69 - "how-to-order.ts"
Cohesion: 0.08
Nodes (8): HOW_TO_ORDER, ScrollService, NAV_ITEMS, NavItem, SiteNav, HowToOrder, HideOrderBarDirective, OrderBar

### Community 70 - "2026-10-26T01-33-07Z__src-app-pages-public-landing-landing-ts.md"
Cohesion: 0.25
Nodes (7): Browser measurements (B): overflow 0 at 360/768/1440; 0 console errors; 2 imgs all with alt attribute; heading outline h1>h2>h3 clean; 44 requests / ~2.6 MB on the dev server (production build ~65 KB JS transferred); targets under 44px: skip link, nav brand, "Ver en el catalogo" (37px), desktop nav links (36px, mouse-driven)., Design Health Score: 21/32 (applicable max; heuristics 7 and 10 n/a for a Persuade landing) → 66%, Acceptable, Design Specificity Verdict, Minor observations, Persona red flags, Priority issues, Questions

### Community 71 - "2026-10-26T01-47-10Z__src-app-pages-public-landing-landing-ts.md"
Cohesion: 0.25
Nodes (7): Design Health Score: 21/32 (66%, Acceptable). Heuristics 7 and 10 n/a (Persuade landing). Same total as round 1., Evidence (B, production build), Minor, Persona red flags, Priority issues, Questions, Specificity: authored hero, interchangeable lower page. Detector: [] on all targets (exit 0); headless overlay: "No anti-patterns found" at 1440 and 360 (no user-visible overlay).

### Community 72 - "2026-10-26T01-59-53Z__src-app-pages-public-landing-landing-ts.md"
Cohesion: 0.25
Nodes (7): Design Health Score: 23/32 (72%, Good band by percentage). Heuristics 7 and 10 n/a. Reviewer note: A scored heuristic 9 at 3 ("nothing to recover from") and heuristic 5 at 3 (+18 notice present); earlier rounds scored both 2, so about one point of the +2 is scorer drift, the rest comes from real fixes., Evidence (B, production), Minor, Personas, Priority issues, Questions, Specificity: distinct mood (bar at night), generic skeleton; mood 3/5, content 2/5. Detector [] on all targets; overlay "No anti-patterns found" (headless, no user-visible overlay).

### Community 73 - "playwright"
Cohesion: 0.18
Nodes (9): AGE_KEY, passAgeGate(), sizes, checks, sizes, out, sizes, errors (+1 more)

### Community 78 - "District"
Cohesion: 0.18
Nodes (3): DistrictResponse, PublicDistrictResponse, District

### Community 80 - ".receiptText"
Cohesion: 0.30
Nodes (4): Item, OrderDetailResponse, TextResponse, OrderAdminService

### Community 82 - "uuid"
Cohesion: 0.10
Nodes (4): CatalogService, ComboItemRepository, AdjustRequest, RestockRequest

### Community 87 - "pedido.mjs"
Cohesion: 0.22
Nodes (5): districts, far, near, out, zones

### Community 89 - "PageResponse"
Cohesion: 0.20
Nodes (6): PageResponse, ProductVisibility, ALL, HIDDEN, VISIBLE, OrderSummaryResponse

### Community 90 - "EmailStatus"
Cohesion: 0.29
Nodes (5): EmailInfo, EmailStatus, FAILED, PENDING, SENT

### Community 91 - "admin.mjs"
Cohesion: 0.25
Nodes (6): created, env, out, password, PII, sizes

### Community 98 - "catalogo-api.mjs"
Cohesion: 0.40
Nodes (3): api, cats, out

## Knowledge Gaps
- **69 isolated node(s):** `com.brinda:api`, `ROLE_ADMIN`, `ROLE_CASHIER`, `ALL`, `VISIBLE` (+64 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 525 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@angular/core` connect `catalogo.ts` to `how-to-order.ts`, `MediaPrefs`, `pedido.ts`, `config.ts`, `catalog.service.ts`, `app.config.ts`, `package.json`, `JwtAuthenticationFilter.java`, `MovementType`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `com.brinda:api`, `ROLE_ADMIN`, `ROLE_CASHIER` to the rest of the system?**
  _69 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Product` be split into smaller, more focused modules?**
  _Cohesion score 0.11666666666666667 - nodes in this community are weakly interconnected._
- **Why does `Product` connect `Product` to `org.springframework.transaction.annotation.Transactional`, `ComboService.java`, `CatalogAdminService.java`, `uuid`, `org.springframework.data.jpa.repository.JpaRepository`, `AuthController.java`, `pedido.spec.ts`, `.create`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Should `offsetdatetime` be split into smaller, more focused modules?**
  _Cohesion score 0.1011764705882353 - nodes in this community are weakly interconnected._
- **Why does `Order` connect `OrderAdminService` to `OrderStatus`, `CreateOrderRequestDniTest.java`, `District`, `.receiptText`, `CatalogAdminService.java`, `uuid`, `org.springframework.data.jpa.repository.JpaRepository`, `OrderRepository`, `pedido.spec.ts`, `PageResponse`, `.create`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Should `Components` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._