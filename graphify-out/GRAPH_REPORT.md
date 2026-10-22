# Graph Report - Brinda-web  (2026-10-22)

## Corpus Check
- Corpus is ~48,643 words - fits in a single context window. You may not need a graph.

## Summary
- 964 nodes · 2964 edges · 39 communities (21 shown, 18 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 176 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Productos y stock (admin)
- Autenticación y DTOs de usuario
- Combos y catálogo público
- Controladores admin de catálogo
- Login, logout y cambio de clave
- Cálculo de combos y pruebas
- Filtro JWT y seguridad web
- Pedido: textos y respuestas
- Distritos y zonas de delivery
- Esquema SQL (V1) y tablas
- Entidades Usuario, Categoría y Producto
- Errores y manejo de excepciones
- Repositorio de productos
- Documentación de endpoints (ENDPOINTS.md)
- Estado y avances del proyecto
- Pendientes legales y de producción
- Vencimiento de pedidos (job)
- Decisiones V4: promos, ofertas e imágenes
- Entorno de desarrollo y qué sigue
- Movimientos de stock
- Estados del pedido
- Infraestructura y contexto del negocio
- Tipos de movimiento de inventario
- Cifrado del DNI (AES-GCM)
- Modelo de datos ERD v2
- Decisiones: DNI siempre y vencimiento 20 min
- Repositorios Spring Data
- Generador de código de pedido
- Arranque de la aplicación
- com.brinda:api
- readme.md (vacio)

## God Nodes (most connected - your core abstractions)
1. `Product` - 68 edges
2. `BusinessRuleException` - 41 edges
3. `Order` - 37 edges
4. `CatalogAdminService` - 35 edges
5. `AuthenticatedUser` - 34 edges
6. `User` - 28 edges
7. `AdminProductResponse` - 28 edges
8. `InventoryService` - 25 edges
9. `District` - 23 edges
10. `OrderItem` - 23 edges

## Surprising Connections (you probably didn't know these)
- `Coleccion Postman BRINDA` --semantically_similar_to--> `IntelliMarket (proyecto ZIP de referencia)`  [INFERRED] [semantically similar]
  postman/README.md → CONTEXTO-BRINDA.md
- `Migracion V1 schema` --implements--> `Modelo de datos ERD v2`  [INFERRED]
  database/README.md → CONTEXTO-BRINDA.md
- `Coleccion Postman BRINDA` --references--> `BRINDA API Endpoints v1`  [INFERRED]
  postman/README.md → backend/ENDPOINTS.md
- `Docker Compose Postgres 16 (puerto 5433 local)` --conceptually_related_to--> `database/README.md BD PostgreSQL`  [INFERRED]
  brinda-db/docker-compose.yaml → database/README.md
- `Reglas en la BD (NUMERIC, TIMESTAMPTZ, RESTRICT, solo-insercion)` --implements--> `Reglas de negocio (precios, stock, delivery, DNI, pagos, edad)`  [INFERRED]
  database/README.md → CONTEXTO-BRINDA.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Migraciones V1-V9 de la BD** — database_readme_v1, database_readme_v2, database_readme_v4, database_readme_v9 [EXTRACTED 0.95]
- **Entidades del nucleo de pedido y stock** — contexto_brinda_orders, contexto_brinda_order_items, contexto_brinda_stock_movements, contexto_brinda_products [EXTRACTED 0.95]
- **Mecanismos de promocion del catalogo** — contexto_brinda_ofertas, contexto_brinda_combos, contexto_brinda_lleva_n_paga_m [EXTRACTED 0.95]
- **V4 promotion phases (offers, combos, buy X pay Y)** — prompt_cli_v4_fase1, prompt_cli_v4_fase2, prompt_cli_v4_fase3 [EXTRACTED 1.00]

## Communities (39 total, 18 thin omitted)

### Community 0 - "Productos y stock (admin)"
Cohesion: 0.07
Nodes (19): AdminProductResponse, CategoryRequest, OfferRequest, ProductRequest, ProductVisibility, ALL, HIDDEN, VISIBLE (+11 more)

### Community 1 - "Autenticación y DTOs de usuario"
Cohesion: 0.06
Nodes (10): OfferRule, PromoRule, CreateOrderRequest, Item, PaymentMethod, PLIN, YAPE, ImageProperties (+2 more)

### Community 2 - "Combos y catálogo público"
Cohesion: 0.06
Nodes (18): BuildComboRequest, ComboDetailResponse, Line, ComboUpdateRequest, CreateComboRequest, Item, ComboItem, ComboItemRepository (+10 more)

### Community 3 - "Controladores admin de catálogo"
Cohesion: 0.11
Nodes (15): AuthenticatedUser, CatalogAdminController, VisibilityResponse, CatalogController, CategoryResponse, PageResponse, CatalogService, ComboAdminController (+7 more)

### Community 4 - "Login, logout y cambio de clave"
Cohesion: 0.05
Nodes (18): AuthController, ChangePasswordRequest, LoginRequest, UserResponse, Role, ROLE_ADMIN, ROLE_CASHIER, User (+10 more)

### Community 5 - "Cálculo de combos y pruebas"
Cohesion: 0.07
Nodes (11): ComboCalculator, Component, BuyXPayYCalculator, Result, ImageUrls, OfferRuleTest, PromoRuleTest, PublicProductResponseTest (+3 more)

### Community 6 - "Filtro JWT y seguridad web"
Cohesion: 0.05
Nodes (7): JwtAuthenticationFilter, ClockConfig, SchedulingConfig, SecurityConfig, RateLimitFilter, SlidingWindowLimiter, MigrationsSeedGuardTest

### Community 7 - "Pedido: textos y respuestas"
Cohesion: 0.06
Nodes (20): CreatedOrderResponse, Line, Payment, Item, OrderDetailResponse, TextResponse, Order, OrderChannel (+12 more)

### Community 8 - "Distritos y zonas de delivery"
Cohesion: 0.10
Nodes (13): DeliveryController, DistrictRequest, DistrictResponse, PublicDistrictResponse, ZoneRequest, ZoneResponse, DeliveryZone, District (+5 more)

### Community 9 - "Esquema SQL (V1) y tablas"
Cohesion: 0.10
Nodes (35): audit_logs, categories, delivery_zones, districts, order_items, orders, products, stock_movements (+27 more)

### Community 10 - "Entidades Usuario, Categoría y Producto"
Cohesion: 0.12
Nodes (4): Category, CategoryRepository, AuditLog, Auditable

### Community 13 - "Documentación de endpoints (ENDPOINTS.md)"
Cohesion: 0.18
Nodes (14): Endpoints admin (ROLE_ADMIN), Endpoints auth (login, logout, me, change-password), BRINDA API Endpoints v1, Imagenes imageUrl / imageKey, Endpoints publicos (catalogo, distritos, POST orders), Reglas a recordar (promo, combo, oferta, stock), Formula lleva N paga M, PROMPT-CLI-V4 (lote de cambios V4) (+6 more)

### Community 14 - "Estado y avances del proyecto"
Cohesion: 0.17
Nodes (14): Backend Spring Boot 3.4.5 / Java 21 cerrado para Hito 1, Frontend Angular (Hito 2), Arquitectura backend com.brinda.api (auth, catalog, inventory, order, delivery, shared, config), Diseno visual hibrido (paleta y tipografias), CONTEXTO-BRINDA (documento de traspaso), Garantia y acuerdos con el cliente, Hitos 1-3 y plan de trabajo, IntelliMarket (proyecto ZIP de referencia) (+6 more)

### Community 15 - "Pendientes legales y de producción"
Cohesion: 0.16
Nodes (15): Legal y privacidad (Ley 29733, SUNAT, edad, terminos), Pendiente 1: IP real detras del proxy (ABIERTO), Pendiente 5: rol cajero para el hijo (ABIERTO), Pendiente 8: usuario admin adivinable, bloqueo (ABIERTO), Pendiente 10: sin captcha, limite en memoria (ABIERTO), Pendiente 11: pedidos rechazados por falta de stock no registrados (ABIERTO), Pendiente 12: desarmar combos, ofertas con inicio, promos mixtas (ABIERTO), Pendiente 13: validar con asesor venta de cigarros y alcohol (ABIERTO) (+7 more)

### Community 17 - "Decisiones V4: promos, ofertas e imágenes"
Cohesion: 0.18
Nodes (12): Promocion lleva N paga M, Ofertas de precio con fecha de fin, Pendiente 21: subida de fotos desde el panel, WebP y R2 (DIFERIDO), Seccion 18 decisiones lote V4 y etapa V8-V9, setup/02_grants.sql fuente unica de privilegios de brinda_app, Orden de ejecucion de scripts SQL, Migracion V1 schema, Migracion V2 indices y triggers (+4 more)

### Community 18 - "Entorno de desarrollo y qué sigue"
Cohesion: 0.15
Nodes (13): avances.md registro de estado, Entorno de desarrollo PC nueva (Docker brinda-db, JDK 21, DBeaver), Que sigue: frontend Angular Hito 2, datos reales, despliegue, Verificacion: 45 tests unitarios y Newman 133 peticiones 0 fallos, CLAUDE.md Directrices Core Brinda Web, Skills de frontend (UI Pro Max, Taste, mobile-first, a11y), Skill Ponytail (minimalismo), Reglas de seguridad y alcance (no secretos, no commit sin pedir, no destructivo BD) (+5 more)

### Community 20 - "Estados del pedido"
Cohesion: 0.17
Nodes (6): PendingCountResponse, OrderStatus, CANCELLED, CONFIRMED, EXPIRED, PENDING

### Community 21 - "Infraestructura y contexto del negocio"
Cohesion: 0.18
Nodes (12): Docker Compose Postgres 16 (puerto 5433 local), BRINDA licoreria delivery Lima, Lucia (duena, usuaria del panel), Pendiente 2: cuenta real de la duena (ABIERTO), Stack: Angular, Spring Boot, PostgreSQL, Credenciales semilla (solo hash BCrypt en V3, no en produccion), database/README.md BD PostgreSQL, Reglas en la BD (NUMERIC, TIMESTAMPTZ, RESTRICT, solo-insercion) (+4 more)

### Community 22 - "Tipos de movimiento de inventario"
Cohesion: 0.18
Nodes (9): MovementType, ADJUSTMENT, CANCEL_RETURN, COMBO_BUILD, COMBO_CONSUME, COMBO_DISASSEMBLE, COMBO_RETURN, RESTOCK (+1 more)

### Community 24 - "Modelo de datos ERD v2"
Cohesion: 0.36
Nodes (10): Entidad AUDIT_LOGS, Entidad CATEGORIES, Combos pre-armados (combos, combo_items), Entidades DELIVERY_ZONES y DISTRICTS, Modelo de datos ERD v2, Entidad ORDER_ITEMS, Entidad ORDERS, Entidad PRODUCTS (+2 more)

### Community 25 - "Decisiones: DNI siempre y vencimiento 20 min"
Cohesion: 0.20
Nodes (8): DNI obligatorio y cifrado para boletas, Flujo del pedido (carrito, solicitar, WhatsApp, Finalizada), Estados de pedido PENDING/CONFIRMED/CANCELLED/EXPIRED, Pago Yape/Plin verificado a mano (sin capturas), Pendiente 4: respaldo DNI_ENCRYPTION_KEY (ABIERTO), Reglas de negocio (precios, stock, delivery, DNI, pagos, edad), Stock: descuento atomico al confirmar, sin reserva, Migracion V8 DNI obligatorio (trigger INSERT)

## Knowledge Gaps
- **52 isolated node(s):** `com.brinda:api`, `ROLE_ADMIN`, `ROLE_CASHIER`, `ALL`, `VISIBLE` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 167 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Product` connect `Productos y stock (admin)` to `Autenticación y DTOs de usuario`, `Combos y catálogo público`, `Pedido: textos y respuestas`, `Entidades Usuario, Categoría y Producto`, `Repositorio de productos`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **What connects `com.brinda:api`, `ROLE_ADMIN`, `ROLE_CASHIER` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Productos y stock (admin)` be split into smaller, more focused modules?**
  _Cohesion score 0.06639427987742594 - nodes in this community are weakly interconnected._
- **Why does `Order` connect `Pedido: textos y respuestas` to `Autenticación y DTOs de usuario`, `Combos y catálogo público`, `Distritos y zonas de delivery`, `Entidades Usuario, Categoría y Producto`, `Repositorio de productos`, `Movimientos de stock`, `Estados del pedido`, `Generador de código de pedido`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `Autenticación y DTOs de usuario` be split into smaller, more focused modules?**
  _Cohesion score 0.06080246913580247 - nodes in this community are weakly interconnected._
- **Why does `BusinessRuleException` connect `Productos y stock (admin)` to `Autenticación y DTOs de usuario`, `Combos y catálogo público`, `Login, logout y cambio de clave`, `Pedido: textos y respuestas`, `Distritos y zonas de delivery`, `Errores y manejo de excepciones`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `Combos y catálogo público` be split into smaller, more focused modules?**
  _Cohesion score 0.0560126582278481 - nodes in this community are weakly interconnected._