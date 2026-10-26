# Prompt de inicio de sesión (Claude Code)

Pega el bloque de abajo al abrir una sesión nueva en la raíz del repo. Actualízalo cuando cambie el estado (sobre todo "DÓNDE QUEDAMOS" y "QUÉ SIGUE").

---

```text
LEE, en este orden (no recorras el código ni leas archivos que no se piden):
1. CLAUDE.md (reglas del proyecto).
2. avances.md: la sección "Resumen" y "Frontend (Hito 2)" son lo más reciente; "Qué sigue" dice por dónde seguir.
3. PRODUCT.md y DESIGN.md (producto y sistema visual "El Salón a Media Luz", con las piezas del catálogo y el checkout).
4. graphify-out/GRAPH_REPORT.md. No leas graph.json completo. Para dudas puntuales usa `graphify query`, `graphify path` o `graphify explain`. El grafo puede estar algo desactualizado respecto al último código.
5. CONTEXTO-BRINDA.md: solo las secciones 18 y 19 (decisiones, incluidas las del frontend, y pendientes antes de producción).
6. FRONTEND-BRIEF-BRINDA.md solo si vas a tocar el diseño: secciones 6 (identidad), 9 (responsive), 10 (animaciones) y 11 (landing).
7. frontend/src/app/core/config.ts: aquí vive lo editable (video del hero, posters, WhatsApp, zonas, horario, avisos legales, API_URL, bandera del catálogo de ejemplo).
Solo si hace falta: backend/ENDPOINTS.md (contrato de la API; no inventes rutas ni campos) y readme.md (cómo levantar el entorno).

DÓNDE QUEDAMOS
- Backend (Spring Boot 3.4.5 / Java 21, PostgreSQL 16, V1–V9): cerrado para el Hito 1.
- Frontend (Angular 21, standalone, signals, zoneless, GSAP+Lenis): landing, catálogo conectado a la API real (proxy /api → localhost:8080), carrito local y checkout /pedido solo formulario. El botón "Finalizar compra" NO hace nada todavía (decisión del usuario): falta validar, POST /api/v1/orders, pantalla /pedido/:codigo con código corto y "Enviar por WhatsApp".
- 33 tests del frontend y build de producción en verde. Todo commiteado (verifica con `git log -5` y `git status`).
- Los servicios locales están APAGADOS (Docker/brinda-db, backend 8080, Angular 4200). Para levantarlos sigue readme.md; no los enciendas hasta que haga falta y avísame antes si el equipo va justo de memoria.
- La BD local tiene el seed de desarrollo: 5 productos de prueba, 4 categorías (Piscos y Whiskys, Snacks, Hielo y Bebidas, Combos y promociones), 20 distritos y el usuario admin del seed. Las categorías de la landing (cervezas, vinos…) NO coinciden con las de la BD: está por decidir.
- Última crítica de la landing: 23/32. El catálogo y el checkout aún no pasaron por /impeccable critique ni audit.

REGLAS (vigentes)
- No hagas commit ni push sin que yo lo pida. Sin claves ni .env en los commits.
- No generes ni imprimas secretos (.env, DNI_ENCRYPTION_KEY, JWT, contraseñas). Nada destructivo en la BD sin confirmarme antes.
- No toques .claude/ ni las skills sin avisar.
- No inventes productos, precios, promociones, horarios, distritos, números de WhatsApp/Yape/Plin ni textos legales: esperan datos de Lucía y del asesor. Los datos de ejemplo (catalog.mock.ts) solo son una herramienta de diseño en desarrollo.
- No toques paleta, tipografías ni el botón fantasma del hero. El burdeos es solo para botones de pedir.
- No instales dependencias nuevas sin consultarme. No mates procesos por nombre (taskkill /IM node.exe): detén solo el proceso por su puerto.
- Verifica toda pantalla a 360, 768 y 1440 px, corre `npx ng test --no-watch` y `npx ng build` al terminar, y actualiza avances.md.
- Animaciones: solo transform y opacity, con alternativa para prefers-reduced-motion.

ENTORNO
- Frontend: en frontend/, `npx ng serve --host 0.0.0.0` (puerto 4200); pruebas `npx ng test --no-watch`; build `npx ng build`. Verificaciones con Playwright en frontend/scripts/ (usa PowerShell para `node scripts/...`).
- Backend: JDK 21 (JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot), `mvn spring-boot:run "-Dspring-boot.run.profiles=local"` en backend/. BD en Docker (contenedor brinda-db, puerto 5433, base brinda; claves solo en backend/.env y brinda-db/.env).

QUÉ SIGUE (yo elijo al empezar; dame tu recomendación en 5 líneas)
a) Pedido real: al finalizar, validar el formulario, POST /api/v1/orders, manejar 429 y errores, vaciar el carrito, pantalla /pedido/:codigo con aviso de 20 min y "Enviar por WhatsApp".
b) Definir las categorías reales (landing vs BD) y cargar datos reales de Lucía.
c) Panel admin (login, cambio de clave, pedidos, productos, ofertas, combos, stock, zonas).
d) /impeccable critique y audit del catálogo y el checkout; probar en celular real.
e) Despliegue (Vercel/Netlify + Railway + dominio).

Cuando termines de leer, dame un resumen de máximo 12 líneas: estado, qué se hizo últimamente, qué sigue y decisiones ya tomadas. Después espera mi indicación.
```
