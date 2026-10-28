# Graph Report - Brinda-web  (2026-10-28)

## Corpus Check
- 284 files · ~101,019 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 31 file(s) not represented in the graph (top: .css 20, (none) 5, .properties 4)

## Summary
- 1859 nodes · 5080 edges · 90 communities (61 shown, 29 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 240 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eb2c511a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Product
- size
- Combos y catálogo público
- lombok.RequiredArgsConstructor
- JwtService
- Cálculo de combos y pruebas
- SecurityConfig.java
- org.springframework.stereotype.Component
- .updateDistrict
- Esquema SQL (V1) y tablas
- Entidades Usuario, Categoría y Producto
- Errores y manejo de excepciones
- ProductRepository
- Documentación de endpoints (ENDPOINTS.md)
- Estado y avances del proyecto
- Pendientes legales y de producción
- org.springframework.transaction.annotation.Transactional
- Decisiones V4: promos, ofertas e imágenes
- Entorno de desarrollo y qué sigue
- org.springframework.data.jpa.repository.JpaRepository
- Estados del pedido
- Infraestructura y contexto del negocio
- config.ts
- Cifrado del DNI (AES-GCM)
- Modelo de datos ERD v2
- Decisiones: DNI siempre y vencimiento 20 min
- Order
- Generador de código de pedido
- Arranque de la aplicación
- com.brinda:api
- readme.md (vacio)
- site-nav.ts
- pedido.ts
- dependencies
- landing.ts
- .isActive
- org.junit.jupiter.api.Test
- .isActive
- ComplaintAdminTest.java
- db
- @angular/core
- Product
- ComplaintAdminTest
- catalogo.ts
- ComplaintPdfService.java
- reclamo.models.ts
- CatalogAdminService
- lombok.Getter
- MigrationsSeedGuardTest.java
- PublicProductResponse.java
- Frontend
- Complaint
- scripts
- ComplaintAdminService.java
- Category
- BusinessRuleException
- InventoryService
- EmailDelivery
- DniCipher
- ValidDocument.java
- OrderItem
- scroll.service.ts
- 2026-10-26T01-33-07Z__src-app-pages-public-landing-landing-ts.md
- 2026-10-26T01-47-10Z__src-app-pages-public-landing-landing-ts.md
- 2026-10-26T01-59-53Z__src-app-pages-public-landing-landing-ts.md
- pedido.mjs
- ReclamosLista
- Catalogo
- ComboService.java
- CreateComplaintRequest
- bigdecimal
- .resolve
- OrderAdminService
- ProductDetail
- User
- ImageUrlSerializer.java
- PROMPT-INICIO-SESION.md
- devDependencies
- ReclamoDetalle
- ProductVisibility

## God Nodes (most connected - your core abstractions)
1. `Product` - 68 edges
2. `@angular/core` - 59 edges
3. `Complaint` - 51 edges
4. `BusinessRuleException` - 45 edges
5. `AuthenticatedUser` - 38 edges
6. `Order` - 37 edges
7. `CatalogAdminService` - 35 edges
8. `@angular/router` - 29 edges
9. `User` - 28 edges
10. `AdminProductResponse` - 28 edges

## Surprising Connections (you probably didn't know these)
- `4. Qué NO se rescata (propio de IntelliMarket)` --references--> `AuthService`  [INFERRED]
  FRONTEND-BRIEF-BRINDA.md → backend/src/main/java/com/brinda/api/auth/service/AuthService.java
- `Coleccion Postman BRINDA` --semantically_similar_to--> `IntelliMarket (proyecto ZIP de referencia)`  [INFERRED] [semantically similar]
  postman/README.md → CONTEXTO-BRINDA.md
- `Migracion V1 schema` --implements--> `Modelo de datos ERD v2`  [INFERRED]
  database/README.md → CONTEXTO-BRINDA.md
- `Coleccion Postman BRINDA` --references--> `BRINDA API Endpoints v1`  [INFERRED]
  postman/README.md → backend/ENDPOINTS.md
- `Reglas en la BD (NUMERIC, TIMESTAMPTZ, RESTRICT, solo-insercion)` --implements--> `Reglas de negocio (precios, stock, delivery, DNI, pagos, edad)`  [INFERRED]
  database/README.md → CONTEXTO-BRINDA.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Migraciones V1-V9 de la BD** — database_readme_v1, database_readme_v2, database_readme_v4, database_readme_v9 [EXTRACTED 0.95]
- **Entidades del nucleo de pedido y stock** — contexto_brinda_orders, contexto_brinda_order_items, contexto_brinda_stock_movements, contexto_brinda_products [EXTRACTED 0.95]
- **Mecanismos de promocion del catalogo** — contexto_brinda_ofertas, contexto_brinda_combos, contexto_brinda_lleva_n_paga_m [EXTRACTED 0.95]
- **V4 promotion phases (offers, combos, buy X pay Y)** — prompt_cli_v4_fase1, prompt_cli_v4_fase2, prompt_cli_v4_fase3 [EXTRACTED 1.00]

## Communities (90 total, 29 thin omitted)

### Community 1 - "size"
Cohesion: 0.09
Nodes (10): JwtProperties, SecurityProperties, OrderProperties, CreateOrderRequest, Item, PaymentMethod, PLIN, YAPE (+2 more)

### Community 2 - "Combos y catálogo público"
Cohesion: 0.05
Nodes (36): Avisos legales, Barra fija "Pedir ahora", Buttons, Campos de formulario, Category tile, Colors, Components, Control de edad (+18) (+28 more)

### Community 3 - "lombok.RequiredArgsConstructor"
Cohesion: 0.07
Nodes (30): AuthController, ChangePasswordRequest, LoginRequest, UserResponse, AuthenticatedUser, CatalogAdminController, VisibilityResponse, CatalogController (+22 more)

### Community 4 - "JwtService"
Cohesion: 0.23
Nodes (3): JwtService, Session, JwtServiceTest

### Community 5 - "Cálculo de combos y pruebas"
Cohesion: 0.28
Nodes (3): ComboCalculator, Component, ComboCalculatorTest

### Community 6 - "SecurityConfig.java"
Cohesion: 0.05
Nodes (8): UserRepository, JwtAuthenticationFilter, ClockConfig, ProdSeedGuard, SchedulingConfig, SecurityConfig, RateLimitFilter, SlidingWindowLimiter

### Community 7 - "org.springframework.stereotype.Component"
Cohesion: 0.12
Nodes (10): ComplaintRepository, ComplaintEmailRetryJob, ComplaintNotifier, EmailSender, NoopEmailSender, SendResult, SENT, SKIPPED (+2 more)

### Community 8 - ".updateDistrict"
Cohesion: 0.15
Nodes (5): DistrictRequest, DistrictResponse, ZoneRequest, ZoneResponse, DeliveryZoneRepository

### Community 9 - "Esquema SQL (V1) y tablas"
Cohesion: 0.08
Nodes (41): complaint_counters, complaints, idx_complaints_email_retry, idx_complaints_filed, idx_complaints_status_filed, trg_complaints_updated_at, audit_logs, categories (+33 more)

### Community 10 - "Entidades Usuario, Categoría y Producto"
Cohesion: 0.12
Nodes (16): build(), COMBOS, inDays(), MOCK_CATEGORIES, mockProducts(), Seed, SEEDS, slugify() (+8 more)

### Community 11 - "Errores y manejo de excepciones"
Cohesion: 0.18
Nodes (3): ErrorResponse, GlobalExceptionHandler, InvalidCredentialsException

### Community 12 - "ProductRepository"
Cohesion: 0.12
Nodes (6): ProductRepository, CreateComboRequest, Item, ComboItem, ComboItemRepository, ComboService

### Community 13 - "Documentación de endpoints (ENDPOINTS.md)"
Cohesion: 0.18
Nodes (14): Endpoints admin (ROLE_ADMIN), Endpoints auth (login, logout, me, change-password), BRINDA API Endpoints v1, Imagenes imageUrl / imageKey, Endpoints publicos (catalogo, distritos, POST orders), Reglas a recordar (promo, combo, oferta, stock), Formula lleva N paga M, PROMPT-CLI-V4 (lote de cambios V4) (+6 more)

### Community 14 - "Estado y avances del proyecto"
Cohesion: 0.17
Nodes (14): Backend Spring Boot 3.4.5 / Java 21 cerrado para Hito 1, Frontend Angular (Hito 2), Arquitectura backend com.brinda.api (auth, catalog, inventory, order, delivery, shared, config), Diseno visual hibrido (paleta y tipografias), CONTEXTO-BRINDA (documento de traspaso), Garantia y acuerdos con el cliente, Hitos 1-3 y plan de trabajo, IntelliMarket (proyecto ZIP de referencia) (+6 more)

### Community 15 - "Pendientes legales y de producción"
Cohesion: 0.16
Nodes (15): Legal y privacidad (Ley 29733, SUNAT, edad, terminos), Pendiente 1: IP real detras del proxy (ABIERTO), Pendiente 5: rol cajero para el hijo (ABIERTO), Pendiente 8: usuario admin adivinable, bloqueo (ABIERTO), Pendiente 10: sin captcha, limite en memoria (ABIERTO), Pendiente 11: pedidos rechazados por falta de stock no registrados (ABIERTO), Pendiente 12: desarmar combos, ofertas con inicio, promos mixtas (ABIERTO), Pendiente 13: validar con asesor venta de cigarros y alcohol (ABIERTO) (+7 more)

### Community 16 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.12
Nodes (7): AuthService, CatalogService, DistrictRepository, DeliveryAdminService, DeliveryService, AuditService, ResourceNotFoundException

### Community 17 - "Decisiones V4: promos, ofertas e imágenes"
Cohesion: 0.18
Nodes (12): Promocion lleva N paga M, Ofertas de precio con fecha de fin, Pendiente 21: subida de fotos desde el panel, WebP y R2 (DIFERIDO), Seccion 18 decisiones lote V4 y etapa V8-V9, setup/02_grants.sql fuente unica de privilegios de brinda_app, Orden de ejecucion de scripts SQL, Migracion V1 schema, Migracion V2 indices y triggers (+4 more)

### Community 18 - "Entorno de desarrollo y qué sigue"
Cohesion: 0.15
Nodes (13): avances.md registro de estado, Entorno de desarrollo PC nueva (Docker brinda-db, JDK 21, DBeaver), Que sigue: frontend Angular Hito 2, datos reales, despliegue, Verificacion: 45 tests unitarios y Newman 133 peticiones 0 fallos, CLAUDE.md Directrices Core Brinda Web, Skills de frontend (UI Pro Max, Taste, mobile-first, a11y), Skill Ponytail (minimalismo), Reglas de seguridad y alcance (no secretos, no commit sin pedir, no destructivo BD) (+5 more)

### Community 19 - "org.springframework.data.jpa.repository.JpaRepository"
Cohesion: 0.05
Nodes (21): MovementType, ADJUSTMENT, CANCEL_RETURN, COMBO_BUILD, COMBO_CONSUME, COMBO_DISASSEMBLE, COMBO_RETURN, RESTOCK (+13 more)

### Community 20 - "Estados del pedido"
Cohesion: 0.14
Nodes (13): name, packageManager, private, version, @angular/build, @angular/cli, @angular/compiler, @angular/compiler-cli (+5 more)

### Community 21 - "Infraestructura y contexto del negocio"
Cohesion: 0.18
Nodes (12): Docker Compose Postgres 16 (puerto 5433 local), BRINDA licoreria delivery Lima, Lucia (duena, usuaria del panel), Pendiente 2: cuenta real de la duena (ABIERTO), Stack: Angular, Spring Boot, PostgreSQL, Credenciales semilla (solo hash BCrypt en V3, no en produccion), database/README.md BD PostgreSQL, Reglas en la BD (NUMERIC, TIMESTAMPTZ, RESTRICT, solo-insercion) (+4 more)

### Community 22 - "config.ts"
Cohesion: 0.08
Nodes (15): AgeGate, AGE_GATE, LEGAL, PENDING, SHOW_PENDING, SITE, AgeGateDialog, lock (+7 more)

### Community 23 - "Cifrado del DNI (AES-GCM)"
Cohesion: 0.05
Nodes (40): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+32 more)

### Community 24 - "Modelo de datos ERD v2"
Cohesion: 0.36
Nodes (10): Entidad AUDIT_LOGS, Entidad CATEGORIES, Combos pre-armados (combos, combo_items), Entidades DELIVERY_ZONES y DISTRICTS, Modelo de datos ERD v2, Entidad ORDER_ITEMS, Entidad ORDERS, Entidad PRODUCTS (+2 more)

### Community 25 - "Decisiones: DNI siempre y vencimiento 20 min"
Cohesion: 0.20
Nodes (8): DNI obligatorio y cifrado para boletas, Flujo del pedido (carrito, solicitar, WhatsApp, Finalizada), Estados de pedido PENDING/CONFIRMED/CANCELLED/EXPIRED, Pago Yape/Plin verificado a mano (sin capturas), Pendiente 4: respaldo DNI_ENCRYPTION_KEY (ABIERTO), Reglas de negocio (precios, stock, delivery, DNI, pagos, edad), Stock: descuento atomico al confirmar, sin reserva, Migracion V8 DNI obligatorio (trigger INSERT)

### Community 26 - "Order"
Cohesion: 0.19
Nodes (6): OrderSummaryResponse, Order, OrderChannel, STORE, WHATSAPP, WhatsAppMessageBuilder

### Community 27 - "Generador de código de pedido"
Cohesion: 0.10
Nodes (19): 10. Animaciones (alcance por pantalla), 11. Landing: secciones (primera pantalla a construir), 12. Material visual (assets), 13. Cómo usar este documento, 1. El producto, 2. Stack y convenciones (tomadas de IntelliMarket), 3. Estructura rescatada de IntelliMarket (solo el esqueleto), 4. Qué NO se rescata (propio de IntelliMarket) (+11 more)

### Community 39 - "site-nav.ts"
Cohesion: 0.08
Nodes (11): HERO, MediaPrefs, NetworkInformationLike, NAV_ITEMS, NavItem, SiteNav, Hero, HeroVideo (+3 more)

### Community 40 - "pedido.ts"
Cohesion: 0.09
Nodes (11): API_URL, District, FieldName, MESSAGES, Pedido, DISTRICTS, product, DeliveryService (+3 more)

### Community 41 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/router, gsap (+3 more)

### Community 42 - "landing.ts"
Cohesion: 0.10
Nodes (14): CONTACT, IMAGES, buildColumns(), HAS_INFO_SECTION, InfoColumn, CatalogoSoon, Landing, Categories (+6 more)

### Community 44 - "org.junit.jupiter.api.Test"
Cohesion: 0.28
Nodes (3): BuyXPayYCalculator, Result, BuyXPayYCalculatorTest

### Community 46 - "ComplaintAdminTest.java"
Cohesion: 0.08
Nodes (12): OfferRule, ComplaintDetailResponse, ComplaintType, CLAIM, COMPLAINT, DocumentType, CE, DNI (+4 more)

### Community 47 - "db"
Cohesion: 0.15
Nodes (12): container_name, environment, image, ports, restart, volumes, POSTGRES_PASSWORD, POSTGRES_USER (+4 more)

### Community 48 - "@angular/core"
Cohesion: 0.10
Nodes (14): AdminAuth, AdminUser, apiError(), adminGuard(), runGuard(), AdminPassword, LayoutAdmin, AdminLogin (+6 more)

### Community 49 - "Product"
Cohesion: 0.15
Nodes (12): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+4 more)

### Community 50 - "ComplaintAdminTest"
Cohesion: 0.10
Nodes (7): ComplaintCountsResponse, RespondComplaintRequest, BusinessDays, ComplaintAdminService, PdfFile, ComplaintDeadlines, ComplaintAdminTest

### Community 51 - "catalogo.ts"
Cohesion: 0.08
Nodes (19): CartLine, Product, Carrito, CartService, cents(), lineTotals(), MAX_QTY, BottlePlaceholder (+11 more)

### Community 53 - "reclamo.models.ts"
Cohesion: 0.13
Nodes (23): ComplaintCounts, ComplaintDetail, ComplaintFilters, ComplaintPage, ComplaintStatus, ComplaintSummary, ComplaintType, days() (+15 more)

### Community 55 - "lombok.Getter"
Cohesion: 0.21
Nodes (3): DeliveryZone, AuditLog, Auditable

### Community 57 - "PublicProductResponse.java"
Cohesion: 0.18
Nodes (4): Line, PublicProductResponse, PromoRule, PublicProductResponseTest

### Community 58 - "Frontend"
Cohesion: 0.25
Nodes (7): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests

### Community 59 - "Complaint"
Cohesion: 0.14
Nodes (5): Complaint, ComplaintEmailTemplates, ComplaintProperties, Attachment, EmailMessage

### Community 60 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, ng, start, test, watch

### Community 61 - "ComplaintAdminService.java"
Cohesion: 0.13
Nodes (10): ComplaintSummaryResponse, DeadlineInfo, Level, ANSWERED, ON_TIME, OVERDUE, SOON, ComplaintStatus (+2 more)

### Community 62 - "Category"
Cohesion: 0.18
Nodes (3): CategoryResponse, Category, CategoryRepository

### Community 63 - "BusinessRuleException"
Cohesion: 0.24
Nodes (5): CreatedOrderResponse, Line, Payment, OrderService, BusinessRuleException

### Community 64 - "InventoryService"
Cohesion: 0.29
Nodes (5): MovementResponse, Line, RestockBatchRequest, InventoryService, StockLine

### Community 65 - "EmailDelivery"
Cohesion: 0.17
Nodes (7): EmailInfo, EmailDelivery, EmailStatus, FAILED, PENDING, SENT, ReflectionHelper

### Community 66 - "DniCipher"
Cohesion: 0.13
Nodes (6): CreatedComplaintResponse, ComplaintNumberGenerator, ComplaintService, Created, DniCipher, ComplaintServiceTest

### Community 68 - "OrderItem"
Cohesion: 0.14
Nodes (7): Item, OrderItem, PromoType, BUY_X_PAY_Y, OFFER, OrderLineText, OrderLineTextTest

### Community 69 - "scroll.service.ts"
Cohesion: 0.14
Nodes (5): HOW_TO_ORDER, ScrollService, HowToOrder, HideOrderBarDirective, OrderBar

### Community 70 - "2026-10-26T01-33-07Z__src-app-pages-public-landing-landing-ts.md"
Cohesion: 0.25
Nodes (7): Browser measurements (B): overflow 0 at 360/768/1440; 0 console errors; 2 imgs all with alt attribute; heading outline h1>h2>h3 clean; 44 requests / ~2.6 MB on the dev server (production build ~65 KB JS transferred); targets under 44px: skip link, nav brand, "Ver en el catalogo" (37px), desktop nav links (36px, mouse-driven)., Design Health Score: 21/32 (applicable max; heuristics 7 and 10 n/a for a Persuade landing) → 66%, Acceptable, Design Specificity Verdict, Minor observations, Persona red flags, Priority issues, Questions

### Community 71 - "2026-10-26T01-47-10Z__src-app-pages-public-landing-landing-ts.md"
Cohesion: 0.25
Nodes (7): Design Health Score: 21/32 (66%, Acceptable). Heuristics 7 and 10 n/a (Persuade landing). Same total as round 1., Evidence (B, production build), Minor, Persona red flags, Priority issues, Questions, Specificity: authored hero, interchangeable lower page. Detector: [] on all targets (exit 0); headless overlay: "No anti-patterns found" at 1440 and 360 (no user-visible overlay).

### Community 72 - "2026-10-26T01-59-53Z__src-app-pages-public-landing-landing-ts.md"
Cohesion: 0.25
Nodes (7): Design Health Score: 23/32 (72%, Good band by percentage). Heuristics 7 and 10 n/a. Reviewer note: A scored heuristic 9 at 3 ("nothing to recover from") and heuristic 5 at 3 (+18 notice present); earlier rounds scored both 2, so about one point of the +2 is scorer drift, the rest comes from real fixes., Evidence (B, production), Minor, Personas, Priority issues, Questions, Specificity: distinct mood (bar at night), generic skeleton; mood 3/5, content 2/5. Detector [] on all targets; overlay "No anti-patterns found" (headless, no user-visible overlay).

### Community 73 - "pedido.mjs"
Cohesion: 0.06
Nodes (25): created, env, out, password, PII, sizes, AGE_KEY, passAgeGate() (+17 more)

### Community 76 - "ComboService.java"
Cohesion: 0.19
Nodes (4): ProductType, COMBO, PRODUCT, SlugUtil

### Community 80 - "OrderAdminService"
Cohesion: 0.26
Nodes (4): OrderDetailResponse, TextResponse, OrderAdminService, OrderComboContents

### Community 83 - "User"
Cohesion: 0.24
Nodes (4): Role, ROLE_ADMIN, ROLE_CASHIER, User

### Community 87 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, @angular/build, @angular/cli, @angular/compiler-cli, jsdom, playwright, prettier, typescript (+1 more)

### Community 89 - "ProductVisibility"
Cohesion: 0.40
Nodes (4): ProductVisibility, ALL, HIDDEN, VISIBLE

## Knowledge Gaps
- **77 isolated node(s):** `com.brinda:api`, `ROLE_ADMIN`, `ROLE_CASHIER`, `ALL`, `VISIBLE` (+72 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 541 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Product` connect `Product` to `InventoryService`, `ComboService.java`, `ProductRepository`, `org.springframework.transaction.annotation.Transactional`, `uuid`, `org.springframework.data.jpa.repository.JpaRepository`, `CatalogAdminService`, `lombok.Getter`, `PublicProductResponse.java`, `Category`, `BusinessRuleException`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `com.brinda:api`, `ROLE_ADMIN`, `ROLE_CASHIER` to the rest of the system?**
  _77 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Product` be split into smaller, more focused modules?**
  _Cohesion score 0.14583333333333334 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `scroll.service.ts`, `site-nav.ts`, `pedido.ts`, `landing.ts`, `Entidades Usuario, Categoría y Producto`, `catalogo.ts`, `Estados del pedido`, `reclamo.models.ts`, `config.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Should `size` be split into smaller, more focused modules?**
  _Cohesion score 0.08821548821548822 - nodes in this community are weakly interconnected._
- **Why does `Complaint` connect `Complaint` to `EmailDelivery`, `DniCipher`, `lombok.RequiredArgsConstructor`, `org.springframework.stereotype.Component`, `ComplaintAdminTest.java`, `ComplaintAdminTest`, `org.springframework.data.jpa.repository.JpaRepository`, `ComplaintPdfService.java`, `lombok.Getter`, `ComplaintAdminService.java`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Should `Combos y catálogo público` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._