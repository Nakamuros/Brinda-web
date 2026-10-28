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
7. frontend/src/app/core/config.ts: aquí vive lo editable (video del hero, posters, WhatsApp, zonas, horario, avisos legales, API_URL, bandera del catálogo de ejemplo).
Solo si hace falta: backend/ENDPOINTS.md (contrato de la API; no inventes rutas ni campos) y readme.md (cómo levantar el entorno).

DÓNDE QUEDAMOS
- Backend (Spring Boot 3.4.5 / Java 21, PostgreSQL 16, V1–V10): Hito 1 cerrado + Libro de Reclamaciones (registro público, PDF oficial rellenado con PDFBox, correo de desarrollo, panel de respuesta). 80 tests.
- Frontend (Angular 21, standalone, signals, zoneless, GSAP+Lenis): landing, catálogo conectado a la API real (proxy /api → localhost:8080), carrito local, checkout /pedido solo formulario ("Finalizar compra" NO hace nada todavía, decisión del usuario), cumplimiento legal (control de edad, advertencia de alcohol, aviso de menores, logo del Libro) y panel /admin SOLO con Reclamos (login, cambio de clave, lista y detalle con respuesta). El resto del panel (pedidos, productos, ofertas, combos, stock, zonas) NO existe. 49 tests y build en verde.
- Libro de Reclamaciones: Etapas A y B hechas; falta la Etapa C (formulario público en /libro-de-reclamaciones). Esa ruta NO puede salir a producción sin el formulario funcional y la confirmación del asesor (correo, conservación, firma, validez de la copia digital).
- Todo commiteado, sin push (verifica con `git log -12` y `git status`).
- Los servicios locales están APAGADOS (Docker/brinda-db, backend 8080, Angular 4200). Para levantarlos sigue readme.md; no los enciendas hasta que haga falta.
- La BD local tiene el seed de desarrollo (5 productos, 4 categorías, 20 distritos, usuario admin) más pedidos y reclamos de prueba. Usuario del panel: `admin`; su clave vigente está en `backend/.env` (variable POSTMAN_ADMIN_NEW_PASSWORD): NO la imprimas.
- PRIMER PUNTO DE ESTA SESIÓN: borrar los datos hardcodeados. Pregúntame cuáles antes de borrar (candidatos: core/catalog.mock.ts, categorías de ejemplo de la landing en core/config.ts, textos de relleno, reclamos y pedidos de prueba de la BD local). Nada destructivo en la BD sin mi confirmación.

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
- Frontend: en frontend/, `npx ng serve --host 0.0.0.0` (puerto 4200); pruebas `npx ng test --no-watch`; build `npx ng build`. Verificaciones con Playwright en frontend/scripts/ (usa PowerShell para `node scripts/...`; si no hay navegador de Playwright, `$env:PW_CHANNEL='chrome'`). Newman: `npx newman run` en postman/ con `--env-var` de la clave leída de backend/.env (sin imprimirla); la carpeta 13 bloquea al admin 15 min.
- Backend: JDK 21 (JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot), `mvn spring-boot:run "-Dspring-boot.run.profiles=local"` en backend/. BD en Docker (contenedor brinda-db, puerto 5433, base brinda; claves solo en backend/.env y brinda-db/.env).

QUÉ SIGUE (yo elijo al empezar; dame tu recomendación en 5 líneas)
0) Borrar los datos hardcodeados (primero).
a) Etapa C del Libro de Reclamaciones (formulario público); al cerrarla, Newman completo y proponer (sin ejecutar) la actualización del grafo.
b) Decidir la caducidad del enlace de copia (propuesta: 30 días desde el registro).
c) Pedido real: validar, POST /api/v1/orders, manejar 429, vaciar el carrito, /pedido/:codigo con aviso de 20 min y "Enviar por WhatsApp".
d) Categorías reales y datos reales de Lucía; resto del panel admin; correo real; /impeccable critique y audit; despliegue.

Cuando termines de leer, dame un resumen de máximo 12 líneas: estado, qué se hizo últimamente, qué sigue y decisiones ya tomadas. Después espera mi indicación.
```
