# Prompt de inicio de sesión (Claude Code)

Pega el bloque de abajo al abrir una sesión nueva en la raíz del repo. Actualízalo cuando cambie el estado (sobre todo "DÓNDE QUEDAMOS" y "QUÉ SIGUE").

---

```text
LEE, en este orden (no recorras el código ni leas archivos que no se piden):
1. CLAUDE.md (reglas del proyecto).
2. avances.md: la sección "Resumen" y "Libro de Reclamaciones funcional" son lo más reciente; "Qué sigue" dice por dónde seguir.
3. PRODUCT.md y DESIGN.md (producto y sistema visual "El Salón a Media Luz", con las piezas del catálogo, el checkout, los avisos legales y el panel).
4. graphify-out/GRAPH_REPORT.md (comunidades y nodos principales). No leas graph.json completo. Para dudas puntuales usa `graphify query "ComplaintService"`, `graphify path "ComplaintController" "DniCipher"` o `graphify explain "AdminAuth"`; el grafo ya incluye el Libro de Reclamaciones, el panel /admin y los avisos legales. Compara `git rev-parse --short HEAD` con "Built from commit" del informe: si hubo cambios de código después, corre `graphify update .` (sin costo de LLM).
5. CONTEXTO-BRINDA.md: solo las secciones 18 y 19 (decisiones, incluidas las del frontend, y pendientes antes de producción).
6. FRONTEND-BRIEF-BRINDA.md solo si vas a tocar el diseño: secciones 6 (identidad), 9 (responsive), 10 (animaciones) y 11 (landing).
7. frontend/src/app/core/config.ts: aquí vive lo editable (video del hero, posters, WhatsApp, zonas, horario, avisos legales, API_URL).
Solo si hace falta: backend/ENDPOINTS.md (contrato de la API; no inventes rutas ni campos) y readme.md (cómo levantar el entorno).

DÓNDE QUEDAMOS
- Backend (Spring Boot 3.5.16 / Java 21, PostgreSQL 16, V1–V10): Hito 1 cerrado + Libro de Reclamaciones (registro público, PDF oficial, panel de respuesta) + ventas (`GET /api/v1/admin/reports/sales`) + subida de fotos (`POST /api/v1/admin/images`, archivos en `IMAGES_UPLOAD_DIR`, no en la BD). 100 tests.
- Frontend (Angular 21, standalone, signals, zoneless, GSAP+Lenis): landing (categorías reales de la API), catálogo, carrito, **pedido real** (`/pedido` valida y crea el pedido; `/pedido/:codigo` con código, aviso de 20 min y WhatsApp; el código se recuerda 1 h 30 min en el navegador), `/terminos` y `/privacidad` ("Próximamente"), cumplimiento legal y **panel /admin completo salvo gráficas**: Pedidos, Productos (fotos, stock, ofertas, promo, combos), Categorías, Ventas, Zonas y Reclamos. 69 tests y build en verde.
- Libro de Reclamaciones: Etapas A y B hechas; falta la Etapa C (formulario público en /libro-de-reclamaciones). Esa ruta NO puede salir a producción sin el formulario funcional y la confirmación del asesor (correo, conservación, firma, validez de la copia digital).
- Todo commiteado, sin push (verifica con `git log -12` y `git status`). El panel solo se probó en navegador con datos simulados (`scripts/admin-*.mjs`): falta la prueba con sesión real de admin.
- Los servicios locales están APAGADOS (Docker/brinda-db, backend 8080, Angular 4200). Para levantarlos sigue readme.md; no los enciendas hasta que haga falta.
- La BD local tiene el seed de desarrollo (5 productos, 4 categorías, 20 distritos, usuario admin) más pedidos y reclamos de prueba. Usuario del panel: `admin`; su clave NO está en ningún archivo (la conoce solo el usuario; para los scripts se pasa por `$env:ADMIN_PASSWORD`).
- PRIMER PUNTO DE ESTA SESIÓN: revisar lo que encontró el usuario al probar el panel con su sesión (subida de fotos, combos, promo, categorías, Ventas) y corregirlo.

REGLAS (vigentes)
- No hagas commit ni push sin que yo lo pida. Sin claves ni .env en los commits.
- No generes ni imprimas secretos (.env, DNI_ENCRYPTION_KEY, JWT, contraseñas). Nada destructivo en la BD sin confirmarme antes.
- No toques .claude/ ni las skills sin avisar.
- No inventes productos, precios, promociones, horarios, distritos, números de WhatsApp/Yape/Plin ni textos legales: esperan datos de Lucía y del asesor. La app no trae datos de ejemplo (solo el fixture de pruebas `frontend/scripts/fixtures/catalogo.json`).
- No toques paleta, tipografías ni el botón fantasma del hero. El burdeos es solo para botones de pedir.
- No instales dependencias nuevas sin consultarme. No mates procesos por nombre (taskkill /IM node.exe): detén solo el proceso por su puerto.
- Verifica toda pantalla a 360, 768 y 1440 px, corre `npx ng test --no-watch` y `npx ng build` al terminar, y actualiza avances.md. Si los tests se caen por memoria ("heap out of memory"), apaga `ng serve` y usa `VITEST_MAX_FORKS=2`.
- Animaciones: solo transform y opacity, con alternativa para prefers-reduced-motion.

ENTORNO
- Frontend: en frontend/, `npx ng serve --host 0.0.0.0` (puerto 4200); pruebas `npx ng test --no-watch`; build `npx ng build`. Verificaciones con Playwright en frontend/scripts/ (usa PowerShell para `node scripts/...`; si no hay navegador de Playwright, `$env:PW_CHANNEL='chrome'`). Newman: `npx newman run` en postman/ con `--env-var` de la clave leída de backend/.env (sin imprimirla); la carpeta 13 bloquea al admin 15 min.
- Backend: JDK 21 (JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot), `mvn spring-boot:run "-Dspring-boot.run.profiles=local"` en backend/. BD en Docker (contenedor brinda-db, puerto 5433, base brinda; claves solo en backend/.env y brinda-db/.env).

QUÉ SIGUE (yo elijo al empezar; dame tu recomendación en 5 líneas)
0) Corregir lo que salga de la prueba del panel con sesión real.
a) Etapa C del Libro de Reclamaciones (formulario público); al cerrarla, Newman completo y proponer (sin ejecutar) la actualización del grafo.
b) Decidir la caducidad del enlace de copia (propuesta: 30 días desde el registro).
c) Decisiones del usuario pendientes: dónde guardar las fotos en producción (el disco de Render se borra en cada despliegue: disco persistente o R2) y columna de costo (V11) para ver ganancia y costo del inventario en Ventas.
d) Datos reales de Lucía (productos con fotos, categorías, zonas y tarifas, WhatsApp/Yape/Plin); gráficas de ventas (pospuestas); correo real; /impeccable critique y audit; despliegue.

Cuando termines de leer, dame un resumen de máximo 12 líneas: estado, qué se hizo últimamente, qué sigue y decisiones ya tomadas. Después espera mi indicación.
```
