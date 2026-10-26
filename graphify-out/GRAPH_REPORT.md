# Graph Report - BRINDA  (2026-10-26)

## Corpus Check
- 225 files · ~79,455 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 27 file(s) not represented in the graph (top: .css 16, (none) 5, .properties 4)

## Summary
- 1439 nodes · 3740 edges · 87 communities (52 shown, 35 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 162 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8e839da4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Product
- offsetdatetime
- Components
- jakarta.servlet.http.HttpServletRequest
- User
- .buildableNow
- org.springframework.stereotype.Component
- DistrictRepository
- V2__indexes_triggers.sql
- catalog.service.ts
- org.springframework.http.ResponseEntity
- uuid
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
- com.brinda:api
- readme.md (vacio)
- @angular/core
- pedido.ts
- dependencies
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
- MigrationsSeedGuardTest.java
- assertequals
- Frontend
- RateLimitFilter.java
- scripts
- StockMovement
- lombok.RequiredArgsConstructor
- .create
- org.springframework.transaction.annotation.Transactional
- OrderStatus
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
- pedido.mjs
- PageResponse
- org.springframework.context.annotation.Configuration
- SecurityConfig
- .receiptText
- ProductDetail
- PendingCountResponse
- catalogo-api.mjs
- Carrito
- PROMPT-INICIO-SESION.md

## God Nodes (most connected - your core abstractions)
1. `Product` - 68 edges
2. `@angular/core` - 45 edges
3. `BusinessRuleException` - 41 edges
4. `Order` - 37 edges
5. `CatalogAdminService` - 35 edges
6. `AuthenticatedUser` - 34 edges
7. `User` - 28 edges
8. `AdminProductResponse` - 28 edges
9. `InventoryService` - 25 edges
10. `District` - 23 edges

## Surprising Connections (you probably didn't know these)
- `4. Qué NO se rescata (propio de IntelliMarket)` --references--> `AuthService`  [INFERRED]
  FRONTEND-BRIEF-BRINDA.md → backend/src/main/java/com/brinda/api/auth/service/AuthService.java
- `Coleccion Postman BRINDA` --semantically_similar_to--> `IntelliMarket (proyecto ZIP de referencia)`  [INFERRED] [semantically similar]
  postman/README.md → CONTEXTO-BRINDA.md
- `Docker Compose Postgres 16 (puerto 5433 local)` --conceptually_related_to--> `database/README.md BD PostgreSQL`  [INFERRED]
  brinda-db/docker-compose.yaml → database/README.md
- `Migracion V1 schema` --implements--> `Modelo de datos ERD v2`  [INFERRED]
  database/README.md → CONTEXTO-BRINDA.md
- `Docker Compose Postgres 16 (puerto 5433 local)` --implements--> `Stack: Angular, Spring Boot, PostgreSQL`  [INFERRED]
  brinda-db/docker-compose.yaml → CONTEXTO-BRINDA.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Migraciones V1-V9 de la BD** — database_readme_v1, database_readme_v2, database_readme_v4, database_readme_v9 [EXTRACTED 0.95]
- **Entidades del nucleo de pedido y stock** — contexto_brinda_orders, contexto_brinda_order_items, contexto_brinda_stock_movements, contexto_brinda_products [EXTRACTED 0.95]
- **Mecanismos de promocion del catalogo** — contexto_brinda_ofertas, contexto_brinda_combos, contexto_brinda_lleva_n_paga_m [EXTRACTED 0.95]
- **V4 promotion phases (offers, combos, buy X pay Y)** — prompt_cli_v4_fase1, prompt_cli_v4_fase2, prompt_cli_v4_fase3 [EXTRACTED 1.00]

## Communities (87 total, 35 thin omitted)

### Community 0 - "Product"
Cohesion: 0.06
Nodes (13): ProductVisibility, ALL, HIDDEN, VISIBLE, Line, PublicProductResponse, Product, ProductType (+5 more)

### Community 1 - "offsetdatetime"
Cohesion: 0.06
Nodes (9): Category, OfferRule, ZoneRequest, ZoneResponse, DeliveryZone, District, DeliveryZoneRepository, AuditLog (+1 more)

### Community 2 - "Components"
Cohesion: 0.06
Nodes (33): Barra fija "Pedir ahora", Buttons, Campos de formulario, Category tile, Colors, Components, Design System: BRINDA, Detalle de producto (+25 more)

### Community 3 - "jakarta.servlet.http.HttpServletRequest"
Cohesion: 0.06
Nodes (20): AuthenticatedUser, CatalogAdminController, VisibilityResponse, AdminProductResponse, CategoryRequest, CategoryResponse, OfferRequest, ProductRequest (+12 more)

### Community 4 - "User"
Cohesion: 0.06
Nodes (14): AuthController, UserResponse, Role, ROLE_ADMIN, ROLE_CASHIER, User, JwtProperties, JwtService (+6 more)

### Community 5 - ".buildableNow"
Cohesion: 0.28
Nodes (3): ComboCalculator, Component, ComboCalculatorTest

### Community 7 - "org.springframework.stereotype.Component"
Cohesion: 0.24
Nodes (3): UserRepository, ProdSeedGuard, OrderExpirationJob

### Community 8 - "DistrictRepository"
Cohesion: 0.36
Nodes (4): DeliveryController, PublicDistrictResponse, DistrictRepository, DeliveryService

### Community 9 - "V2__indexes_triggers.sql"
Cohesion: 0.10
Nodes (35): audit_logs, categories, delivery_zones, districts, order_items, orders, products, stock_movements (+27 more)

### Community 10 - "catalog.service.ts"
Cohesion: 0.12
Nodes (15): build(), COMBOS, inDays(), MOCK_CATEGORIES, mockProducts(), Seed, SEEDS, slugify() (+7 more)

### Community 12 - "uuid"
Cohesion: 0.09
Nodes (7): BuildComboRequest, ComboItem, ComboItemRepository, Line, RestockBatchRequest, OrderComboContents, SlugUtil

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
Cohesion: 0.14
Nodes (9): ProductRepository, CatalogService, DeliveryAdminService, AdjustRequest, RestockRequest, CancelOrderRequest, OrderAdminService, AuditService (+1 more)

### Community 17 - "Seccion 18 decisiones lote V4 y etapa V8-V9"
Cohesion: 0.18
Nodes (12): Promocion lleva N paga M, Ofertas de precio con fecha de fin, Pendiente 21: subida de fotos desde el panel, WebP y R2 (DIFERIDO), Seccion 18 decisiones lote V4 y etapa V8-V9, setup/02_grants.sql fuente unica de privilegios de brinda_app, Orden de ejecucion de scripts SQL, Migracion V1 schema, Migracion V2 indices y triggers (+4 more)

### Community 18 - "avances.md registro de estado"
Cohesion: 0.15
Nodes (13): avances.md registro de estado, Entorno de desarrollo PC nueva (Docker brinda-db, JDK 21, DBeaver), Que sigue: frontend Angular Hito 2, datos reales, despliegue, Verificacion: 45 tests unitarios y Newman 133 peticiones 0 fallos, CLAUDE.md Directrices Core Brinda Web, Skills de frontend (UI Pro Max, Taste, mobile-first, a11y), Skill Ponytail (minimalismo), Reglas de seguridad y alcance (no secretos, no commit sin pedir, no destructivo BD) (+5 more)

### Community 20 - "package.json"
Cohesion: 0.13
Nodes (19): devDependencies, @angular/build@^21.2.28, @angular/cli@^21.2.28, @angular/compiler-cli@^21.2.0, jsdom@^28.0.0, playwright@^1.64.1, prettier@^3.8.1, typescript@~5.9.2 (+11 more)

### Community 21 - "database/README.md BD PostgreSQL"
Cohesion: 0.18
Nodes (12): Docker Compose Postgres 16 (puerto 5433 local), BRINDA licoreria delivery Lima, Lucia (duena, usuaria del panel), Pendiente 2: cuenta real de la duena (ABIERTO), Stack: Angular, Spring Boot, PostgreSQL, Credenciales semilla (solo hash BCrypt en V3, no en produccion), database/README.md BD PostgreSQL, Reglas en la BD (NUMERIC, TIMESTAMPTZ, RESTRICT, solo-insercion) (+4 more)

### Community 22 - "MovementType"
Cohesion: 0.18
Nodes (9): MovementType, ADJUSTMENT, CANCEL_RETURN, COMBO_BUILD, COMBO_CONSUME, COMBO_DISASSEMBLE, COMBO_RETURN, RESTOCK (+1 more)

### Community 23 - "frontend"
Cohesion: 0.05
Nodes (39): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+31 more)

### Community 24 - "Modelo de datos ERD v2"
Cohesion: 0.36
Nodes (10): Entidad AUDIT_LOGS, Entidad CATEGORIES, Combos pre-armados (combos, combo_items), Entidades DELIVERY_ZONES y DISTRICTS, Modelo de datos ERD v2, Entidad ORDER_ITEMS, Entidad ORDERS, Entidad PRODUCTS (+2 more)

### Community 25 - "DNI obligatorio y cifrado para boletas"
Cohesion: 0.20
Nodes (8): DNI obligatorio y cifrado para boletas, Flujo del pedido (carrito, solicitar, WhatsApp, Finalizada), Estados de pedido PENDING/CONFIRMED/CANCELLED/EXPIRED, Pago Yape/Plin verificado a mano (sin capturas), Pendiente 4: respaldo DNI_ENCRYPTION_KEY (ABIERTO), Reglas de negocio (precios, stock, delivery, DNI, pagos, edad), Stock: descuento atomico al confirmar, sin reserva, Migracion V8 DNI obligatorio (trigger INSERT)

### Community 26 - "OrderAdminService"
Cohesion: 0.17
Nodes (4): Item, OrderDetailResponse, Order, WhatsAppMessageBuilder

### Community 27 - "BRINDA — Brief de frontend (para `/impeccable init` y para el CLI)"
Cohesion: 0.10
Nodes (19): 10. Animaciones (alcance por pantalla), 11. Landing: secciones (primera pantalla a construir), 12. Material visual (assets), 13. Cómo usar este documento, 1. El producto, 2. Stack y convenciones (tomadas de IntelliMarket), 3. Estructura rescatada de IntelliMarket (solo el esqueleto), 4. Qué NO se rescata (propio de IntelliMarket) (+11 more)

### Community 39 - "@angular/core"
Cohesion: 0.08
Nodes (15): MediaPrefs, NetworkInformationLike, ScrollService, AnnouncementBar, LayoutPublic, NAV_ITEMS, NavItem, CatalogoSoon (+7 more)

### Community 40 - "pedido.ts"
Cohesion: 0.16
Nodes (9): rxjs@~7.8.0, API_URL, District, FieldName, MESSAGES, DeliveryService, DeliveryStatus, FormField (+1 more)

### Community 41 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, @angular/common@^21.2.0, @angular/compiler@^21.2.0, @angular/core@^21.2.0, @angular/forms@^21.2.0, @angular/platform-browser@^21.2.0, @angular/router@^21.2.0, gsap@^3.15.0 (+7 more)

### Community 42 - "config.ts"
Cohesion: 0.08
Nodes (21): CATEGORIES, CONTACT, HERO, IMAGES, LEGAL, PENDING, SHOW_PENDING, SITE (+13 more)

### Community 44 - "org.junit.jupiter.api.Test"
Cohesion: 0.23
Nodes (3): BuyXPayYCalculator, Result, BuyXPayYCalculatorTest

### Community 46 - "CreateOrderRequestDniTest.java"
Cohesion: 0.22
Nodes (4): PaymentMethod, PLIN, YAPE, CreateOrderRequestDniTest

### Community 47 - "db"
Cohesion: 0.15
Nodes (12): container_name, environment, image, ports, restart, volumes, POSTGRES_PASSWORD, POSTGRES_USER (+4 more)

### Community 48 - "app.config.ts"
Cohesion: 0.36
Nodes (4): App, appConfig, routes, @angular/router

### Community 49 - "Product"
Cohesion: 0.15
Nodes (12): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+4 more)

### Community 51 - "catalogo.ts"
Cohesion: 0.11
Nodes (16): Product, cents(), lineTotals(), MAX_QTY, BottlePlaceholder, DAY_MONTH, formatDay(), formatPrice() (+8 more)

### Community 52 - "OrderChannel"
Cohesion: 0.50
Nodes (3): OrderChannel, STORE, WHATSAPP

### Community 54 - "AuthController.java"
Cohesion: 0.26
Nodes (3): ChangePasswordRequest, LoginRequest, AuthService

### Community 55 - "pedido.spec.ts"
Cohesion: 0.18
Nodes (3): Pedido, DISTRICTS, product

### Community 58 - "Frontend"
Cohesion: 0.25
Nodes (7): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests

### Community 60 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, ng, start, test, watch

### Community 62 - "lombok.RequiredArgsConstructor"
Cohesion: 0.21
Nodes (7): CatalogController, ComboAdminController, DeliveryAdminController, InventoryAdminController, OrderAdminController, OrderController, ClientIp

### Community 63 - ".create"
Cohesion: 0.25
Nodes (6): CreatedOrderResponse, Line, Payment, CreateOrderRequest, Item, OrderService

### Community 64 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.25
Nodes (4): ComboService, MovementResponse, InventoryService, StockLine

### Community 65 - "OrderStatus"
Cohesion: 0.33
Nodes (5): OrderStatus, CANCELLED, CONFIRMED, EXPIRED, PENDING

### Community 68 - ".line"
Cohesion: 0.19
Nodes (6): OrderItem, PromoType, BUY_X_PAY_Y, OFFER, OrderLineText, OrderLineTextTest

### Community 69 - "how-to-order.ts"
Cohesion: 0.25
Nodes (3): HOW_TO_ORDER, HowToOrder, HideOrderBarDirective

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
Cohesion: 0.12
Nodes (7): sizes, out, sizes, checks, sizes, errors, playwright

### Community 76 - "pedido.mjs"
Cohesion: 0.22
Nodes (5): districts, far, near, out, zones

### Community 84 - "catalogo-api.mjs"
Cohesion: 0.40
Nodes (3): api, cats, out

## Knowledge Gaps
- **52 isolated node(s):** `com.brinda:api`, `ROLE_ADMIN`, `ROLE_CASHIER`, `ALL`, `VISIBLE` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 416 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Product` connect `Product` to `org.springframework.transaction.annotation.Transactional`, `offsetdatetime`, `OrderRepository`, `jakarta.servlet.http.HttpServletRequest`, `uuid`, `CatalogAdminService.java`, `org.springframework.data.jpa.repository.JpaRepository`, `.create`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `com.brinda:api`, `ROLE_ADMIN`, `ROLE_CASHIER` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Product` be split into smaller, more focused modules?**
  _Cohesion score 0.06298076923076923 - nodes in this community are weakly interconnected._
- **Why does `AuthService` connect `AuthController.java` to `jakarta.servlet.http.HttpServletRequest`, `User`, `org.springframework.stereotype.Component`, `CatalogAdminService.java`, `BRINDA — Brief de frontend (para `/impeccable init` y para el CLI)`, `lombok.RequiredArgsConstructor`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Should `offsetdatetime` be split into smaller, more focused modules?**
  _Cohesion score 0.060784313725490195 - nodes in this community are weakly interconnected._
- **Why does `Order` connect `OrderAdminService` to `OrderStatus`, `offsetdatetime`, `OrderRepository`, `.line`, `User`, `PageResponse`, `CreateOrderRequestDniTest.java`, `CatalogAdminService.java`, `org.springframework.data.jpa.repository.JpaRepository`, `OrderChannel`, `StockMovement`, `.create`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Should `Components` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._