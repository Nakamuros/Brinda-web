# BRINDA — Brief de frontend (para `/impeccable init` y para el CLI)

Documento de partida para el frontend (Hito 2). Resume el negocio, lo que se rescata de la estructura de IntelliMarket, lo que NO se rescata, las pantallas, la identidad visual (fuentes, paleta, referencias) y los requisitos legales. El contrato de la API NO está aquí: la fuente de verdad es `backend/ENDPOINTS.md` y `CONTEXTO-BRINDA.md`. No inventar rutas ni campos.

---

## 1. El producto

- **BRINDA**: licorería de barrio en Lima. **Solo delivery, sin local físico.** Dueña: Lucía; su hijo es socio.
- Catálogo público anónimo (sin registro de clientes). El cliente arma un carrito local, llena sus datos y el pedido se guarda en el servidor con un **código corto** (ej. `EQ12`). Luego se abre **WhatsApp** con un mensaje prellenado. Lucía verifica el pago (Yape/Plin) en su app y confirma el pedido desde `/admin`.
- Público: sobre todo desde **celular**. Diseño **mobile-first**.
- Vende alcohol y cigarros: avisos legales visibles (ver §7).

## 2. Stack y convenciones (tomadas de IntelliMarket)

- Angular **21** (mismo del proyecto previo), componentes **standalone**, **signals**, rutas **lazy** (`loadComponent`), control flow `@if/@for`, tests con **Vitest**.
- Carpeta nueva `frontend/` en el repo (el backend está en `backend/`).
- Cliente HTTP con `provideHttpClient(withInterceptors([...]))`.
- `environments/` con `apiUrl` para dev (`http://localhost:8080`) y prod (`https://api.<dominio>`).

## 3. Estructura rescatada de IntelliMarket (solo el esqueleto)

```
src/app/
  app.config.ts          # provideRouter + provideHttpClient(withInterceptors)
  app.routes.ts          # rutas lazy agrupadas por layout
  core/
    guards/              # adminGuard (sesión admin), publicGuard (login)
    interceptors/        # errorInterceptor (401/403/429), sin JWT en header
  layouts/
    layout-public/       # navbar + footer legal + <router-outlet>
    layout-admin/        # menú lateral del panel
  models/                # una interfaz por archivo (product, order, combo, zone...)
  pages/
    public/              # landing, catalogo, carrito, checkout, pedido-confirmado, legal/*
    admin/               # login, cambio-clave, pedidos, productos, ofertas, combos, stock, zonas
  services/              # *.service.ts con signals (catalog, cart, order, auth, delivery, toast)
  shared/components/     # toast-container, product-card, price-tag, empty-state, modal
```

Patrones concretos que sí se reutilizan:
- Rutas agrupadas por layout con `loadComponent`, y rutas hijas por módulo (`inventory.routes.ts` → `admin/productos.routes.ts`).
- Servicios con `signal` + `computed` para totales del carrito (`totalItems`, `totalPrice`).
- `ToastService` + `ToastContainer` (sustituir colores por la paleta de BRINDA).
- Modal de detalle de producto desde el catálogo (`product-detail-modal`).
- Layout de login separado (`auth-layout`) → `admin/login`.
- Redirección SPA y proxy de `netlify.toml` como referencia del patrón (en BRINDA el hosting es Vercel/Cloudflare Pages; ver §8).

## 4. Qué NO se rescata (propio de IntelliMarket)

| Descartar | Motivo |
|---|---|
| `TokenService` con JWT en `localStorage` + `jwtInterceptor` con `Authorization: Bearer` | BRINDA usa **cookie HttpOnly SameSite=Strict**. El frontend no toca el token: usar `withCredentials: true` y un `AuthService` que consulta el estado a la API. |
| `alert()` nativo en el `errorInterceptor` | Usar toasts / modal propio. |
| Carrito en el servidor (`/orders/cart/...`) | En BRINDA el carrito es **local** (signals + `localStorage` con try/catch). El precio final lo calcula el servidor al crear el pedido. |
| Multi-tienda, vendedor, registro de clientes, perfil, historial, reseñas, estadísticas de vendedor, chat IA, `MarketStateService` (datos mock) | No existen en BRINDA. |
| Roboto, azul `#0c8ce9`, textos, equipo, imágenes (`hero.png`, fotos del equipo), íconos de IntelliMarket | Identidad distinta. |
| Rutas comentadas, `Cart` vacío, URLs de Render | Limpieza. |

## 5. Pantallas de BRINDA

**Público**
1. **Landing** (`/`): foco de diseño (ver §6).
2. **Catálogo** (`/catalogo`): búsqueda, filtro por categoría, orden del servidor (con stock primero, promo activa, combos, destacados, nombre). Producto en stock 0 → etiqueta **AGOTADO** (no se puede agregar). Etiquetas: oferta (con fecha de fin), "lleva N paga M", combo. Categoría "Combos y promociones".
3. **Detalle de producto** (modal).
4. **Carrito** (`/carrito`): cantidades, subtotal; el total real lo confirma el servidor.
5. **Checkout** (`/pedido`): nombre, teléfono, **distrito** (define zona y tarifa de delivery), dirección, referencia, **DNI de 8 dígitos (siempre obligatorio)**, casilla **"soy mayor de 18"**, casillas de **términos y privacidad**.
6. **Pedido creado** (`/pedido/:codigo`): código corto, resumen, botón **"Enviar por WhatsApp"** (abre `wa.me` con el mensaje), aviso de vencimiento (**20 min**) y cómo pagar (Yape/Plin).
7. **Legales**: términos y condiciones, política de privacidad, y **libro de reclamaciones virtual** (pendiente 18 de `CONTEXTO`; confirmar con el asesor si es obligatorio desde el inicio).

**Admin** (`/admin`, solo Lucía y su hijo)
1. Login y **cambio de clave obligatorio** en el primer ingreso.
2. **Pedidos**: estados `PENDING`, `CONFIRMED`, `CANCELLED`, `EXPIRED`; botón **"Finalizada"** (confirma y descuenta stock); anular con motivo; un pedido vencido aún se puede confirmar si el pago llegó tarde.
3. **Productos**: crear/editar, `image_url`, visible/oculto (`is_available`), acciones por lote.
4. **Ofertas** (precio + fecha de fin) y **"lleva N paga M"**.
5. **Combos** (kits armados, composición fija).
6. **Stock**: reposición por lote, ajustes, movimientos.
7. **Zonas, distritos y tarifas**.

Nombres de campos, rutas y códigos de error: leer `ENDPOINTS.md`.

## 6. Identidad visual

### Tipografía
| Uso | Fuente |
|---|---|
| Títulos | **Libre Baskerville** Bold / Italic |
| Acento | **Limelight**, solo en 1 o 2 palabras |
| Texto | **Jost** |

Cargar desde Google Fonts con `display=swap` y solo los pesos usados.

### Paleta
| Rol | Color | Hex |
|---|---|---|
| Fondo principal (60%) | Marrón medianoche | `#431821` |
| Secciones alternas | Ciruela profundo | `#4B1E3A` |
| Texto y secciones claras (30%) | Crema / Marfil | `#FBF4E1` / `#FFF8ED` |
| Líneas, íconos, detalles "latón" (10%) | Dorado ámbar | `#B2864F` |
| Botones CTA | Burdeos Brinda | `#A1163B` |
| Etiquetas de promo | Terracota | `#CA5A4E` |
| Sección de contraste (combos, hielo) | Verde azulado | `#00585E` |
| Texto secundario sobre claro | Gris piedra | `#7D7267` |

Definir como variables CSS (`--bg`, `--bg-alt`, `--cream`, `--ivory`, `--brass`, `--cta`, `--promo`, `--teal`, `--stone`) y no repetir hex sueltos.

### Contraste (calculado, WCAG 2.x)
| Par (texto/fondo) | Ratio | Uso permitido |
|---|---|---|
| Crema sobre marrón `#431821` | 13.75 | Todo |
| Crema sobre ciruela | 12.37 | Todo |
| Crema sobre burdeos (CTA) | 7.10 | Botones |
| Crema sobre verde azulado | 7.48 | Todo |
| Dorado sobre marrón | 4.61 | Texto normal justo; mejor para líneas, íconos y títulos grandes |
| Dorado sobre ciruela | 4.15 | Solo texto grande (≥ 24 px, o 19 px en negrita) o decorativo |
| Gris piedra sobre marfil / crema | 4.45 / 4.27 | **No** llega a 4.5: usar solo texto grande o oscurecer el gris |
| Crema sobre terracota | 3.76 | Solo texto grande/negrita de etiquetas; para texto chico usar marrón sobre crema |
| Dorado sobre crema | 2.98 | **No usar** para texto |

Si una etiqueta de promo necesita texto pequeño, ajustar el tono de la terracota o usar texto marrón con borde terracota, y validar de nuevo.

### Referencias (The Violet Hour: observado en capturas estáticas; Raising the Bar: observado solo en el código y el copy. El movimiento no se vio en ninguna, así que las animaciones exactas no son concluyentes)

**The Violet Hour** (referencia principal de la **landing**). Observado en capturas de pantalla estáticas del usuario; el movimiento NO se vio, así que cualquier animación de abajo es una propuesta, no algo confirmado.
- **Hero:** foto a pantalla completa, con poca profundidad de campo (velas desenfocadas al fondo, una vela nítida en primer plano) y una luz cálida sobre tonos azul petróleo y negro. El logotipo va centrado sobre la imagen, en mayúsculas muy espaciadas con serif ancha, con "the" en cursiva pequeña encima. La navegación va centrada arriba, sobre la foto y sin fondo, en mayúsculas con serif y espaciado generoso.
- **Segunda pantalla:** fondo negro liso. Titular en minúsculas, serif con espaciado entre letras ("experience the violet hour"). Debajo, una línea en mayúsculas espaciadas (horario) y un **botón fantasma**: borde blanco fino, sin relleno, texto en mayúsculas.
- **Texto de presentación:** párrafos centrados en **cursiva serif**, tamaño pequeño, ancho de línea contenido.
- **Imagen de producto integrada al fondo:** la foto de la copa tiene fondo negro y se funde con el fondo de la página; su reflejo y el halo de luz hacen que parezca flotar. Sin marco ni tarjeta.
- **Elemento decorativo:** una ilustración grande (unicornio con textura de manchas) en gris azulado desaturado, pegada al borde derecho, que sirve de marca de agua.
- **Datos al final:** tres columnas centradas (LOCATION / HOURS / CONTACT). Encabezado en mayúsculas espaciadas y datos en cursiva, con enlaces subrayados finos.
- **Rasgos generales:** casi nada de color de interfaz. El color viene de la fotografía. Mucho espacio vacío, una sola columna, alineación centrada, pocos elementos por pantalla.
- **Adaptación a BRINDA** (con la paleta marrón/ciruela en vez de negro/azul):
  - Hero a pantalla completa con foto de botellas, copas o hielo (poca profundidad de campo), logotipo centrado y navegación transparente arriba.
  - Segunda pantalla con titular en Libre Baskerville y 1 o 2 palabras en Limelight; botón fantasma **"Pedir ahora"** con borde crema o dorado, que lleva al catálogo.
  - Párrafo corto en cursiva; foto de un producto o combo con fondo marrón que se funde con la sección.
  - Tres columnas: **ZONAS DE ENTREGA / HORARIO / CONTACTO (WhatsApp)**. No hay local físico, así que no va "ubicación".
  - Un motivo gráfico propio de BRINDA como marca de agua (no copiar el unicornio).
  - Animaciones propuestas: aparición suave del hero, cambio de la nav al hacer scroll, texto que se revela al entrar en pantalla, leve parallax en las fotos, y fundido de la foto de producto con el fondo.

**Raising the Bar** (referencia de **tienda y estructura comercial**)
- Barra de anuncio superior (promo del mes), cabecera con búsqueda, cuenta y contador del carrito.
- Hero con titular corto y un único botón de acción.
- Frase de marca en grande, bloques de 4 beneficios con ícono + título en mayúsculas + una línea.
- Producto destacado del mes, **cómo funciona en 3 pasos numerados con foto**, cuadrícula de productos con "Agregar", reseñas, pie con enlaces y aviso legal.
- **Adaptación a BRINDA:** barra de anuncio para ofertas vigentes y combos; "cómo pedir" en 3 pasos (elige → envía por WhatsApp → paga con Yape/Plin); tarjetas de combos destacadas.

### Lineamientos de diseño
- Fondo oscuro cálido, sensación de bar de autor, sobrio. Evitar el aspecto genérico de plantilla.
- Títulos en Libre Baskerville; **una o dos palabras** del titular en Limelight dorado/crema (no más).
- Dorado como "latón": filetes, íconos, bordes finos, detalles. No como fondo ni texto pequeño.
- CTA siempre burdeos con texto crema. Promos en terracota. Combos y "hielo" en la sección verde azulado.
- Fotografía de producto sobre fondos que no choquen con la paleta; imagen genérica "sin foto" cuando `imageUrl` no viene.
- Animaciones sobrias (entrada suave, hover, barra animada de ofertas); respetar `prefers-reduced-motion`. El pulido de movimiento va al final.

## 7. Requisitos legales y de cumplimiento en pantalla

- **Avisos clásicos de licor y cigarros**: texto exacto lo entrega el asesor de Lucía (pendiente). Dejar espacios/props para insertarlos en footer, checkout y catálogo, sin inventar la redacción.
- Casilla **"Soy mayor de 18 años"** (el backend ya exige `adultConfirmed`) y aceptación de **privacidad** (`privacyAccepted`) y **términos**.
- **DNI siempre obligatorio** (8 dígitos). No guardarlo en el cliente.
- **Libro de reclamaciones virtual**: acceso visible (footer); implementación a confirmar.
- No mostrar claves, tokens ni mensajes internos del servidor; mostrar errores del servidor de forma amable (los errores del backend son opacos).

## 8. Despliegue y conexión con la API

- Frontend: Vercel o Cloudflare Pages (revisar términos de uso comercial). Backend: Railway en `api.<dominio>`.
- La cookie es `SameSite=Strict`: frontend y API deben compartir dominio registrable (`brinda.com` y `api.brinda.com`). Todas las peticiones del admin con `withCredentials: true`; CORS solo con los orígenes exactos.
- Alternativa: proxy `/api/*` hacia el backend en el hosting del frontend (patrón del `netlify.toml` de IntelliMarket) para que todo sea mismo origen.
- Rate limit del servidor: 5 pedidos/min por IP y 10 logins/min → manejar `429` con un mensaje claro.

## 9. Responsive: celular y computadora (requisito obligatorio)

Toda pantalla debe verse bien y funcionar en **celular (360 px) y en laptop/PC (1440 px)**, y en los anchos intermedios (tablet, 768 px a 1024 px). No es idéntico: se adapta, pero ninguna versión es "la secundaria".

- **Mobile-first:** se diseña y escribe primero para 360 px y se amplía con *breakpoints*. Sin scroll horizontal en ningún ancho.
- **Layout:** celular = una columna; escritorio = columnas y mayor espacio. El contenido y las acciones principales (pedir, carrito, WhatsApp) existen y son alcanzables en ambos.
- **Táctil:** objetivos de al menos 44 × 44 px, separación suficiente entre botones, campos de formulario con teclado adecuado (`inputmode="numeric"` para teléfono y DNI).
- **Hover:** nunca es necesario para entender o usar algo; en celular no existe. Todo efecto hover tiene equivalente táctil (foco, toque) o es solo decorativo.
- **Altura de pantalla completa:** usar `dvh`/`svh` en vez de `vh`, para que el hero no se corte con la barra del navegador móvil.
- **Tipografía fluida:** tamaños con `clamp()`; el titular del hero legible en 360 px sin desbordar.
- **Navegación:** celular = menú de pantalla completa con enlaces que entran escalonados; escritorio = barra centrada, transparente sobre el hero y sólida al hacer scroll.
- **Imágenes y video:** `srcset`/`sizes` y formatos AVIF o WebP; el video del hero con versión liviana en celular y solo el `poster` con ahorro de datos o `prefers-reduced-motion`.
- **Carruseles y tablas:** en celular, carrusel horizontal con *scroll snap* o lista apilada; las tablas del admin pasan a tarjetas o a scroll controlado.
- **Admin:** pensado para escritorio y tablet, pero **también usable en celular** (Lucía puede confirmar pedidos desde el teléfono); con menos pulido visual, sin perder función.
- **Verificación obligatoria al terminar cada pantalla:** revisar a 360, 768 y 1440 px; probar en un celular real a través de la red local (`ng serve --host 0.0.0.0`); y, si es posible, en un celular de gama media o baja. Informar qué se probó y a qué tamaños.

## 10. Animaciones (alcance por pantalla)

Reglas generales: animar solo `transform` y `opacity`; respetar `prefers-reduced-motion` con una versión estática; sin animaciones infinitas pesadas; un efecto con propósito por sección, no cinco; probar en celular real.

| Tipo | Landing | Catálogo | Carrito / Checkout | Admin |
|---|---|---|---|---|
| Transición entre páginas | Sí (View Transitions del router, con respaldo sin animación) | Sí, suave | Mínima | No |
| Animaciones de scroll | Sí: aparición, titulares que se revelan por líneas, parallax leve, "Cómo pedir" escalonado | Aparición suave de tarjetas | No | No |
| Hero | Video de fondo, logotipo, titular y botón escalonados, indicador de scroll | — | — | — |
| Fondos animados | Sutil en secciones ciruela (CSS), con versión estática | No | No | No |
| Menú de navegación | Transparente → sólido; menú de pantalla completa en celular | Igual | Igual | Menú lateral sin animación llamativa |
| Efectos hover | Tarjetas, botones, enlaces (subrayado dorado) | Tarjetas de producto | Mínimos | Mínimos |

Herramientas permitidas: CSS nativo, View Transitions del router de Angular, **GSAP (+ScrollTrigger)** y **Lenis**. Verificar la licencia de uso comercial de GSAP y de Lenis antes de instalarlas. No usar React ni librerías de componentes de React (Skiper UI, Vengeance UI); sirven solo como inspiración. Cualquier otra dependencia se consulta antes.

## 11. Landing: secciones (primera pantalla a construir)

Copys en español de Perú, **propuestas editables** (no son definitivos).

1. **Barra de anuncio:** "Delivery en Lima · Pide por WhatsApp · Paga con Yape o Plin" (texto en una constante).
2. **Navegación:** transparente, centrada, mayúsculas con serif y espaciado. Inicio, Catálogo, Combos y promociones, Cómo pedir, Zonas y horario, Contacto; ícono de carrito con contador (placeholder).
3. **Hero a pantalla completa:** video de fondo (placeholder), logotipo BRINDA centrado (provisional en texto hasta que haya logo), titular "Tu brindis, a domicilio" con "brindis" en Limelight, subtítulo corto, botón fantasma **"Pedir ahora"** hacia el catálogo, indicador de scroll.
4. **Presentación:** párrafo corto en cursiva serif centrado y una imagen de producto cuyo fondo se funde con la sección; marca de agua gráfica propia de BRINDA.
5. **Categorías:** cervezas, vinos, destilados, licores, mezcladores y snacks; tarjetas con imagen y efecto hover. No mostrar cigarros hasta que el asesor lo confirme.
6. **Combos y promociones:** sección verde azulado, tarjetas con etiquetas terracota ("Oferta", "Combo", "Lleva 3 paga 2"), datos placeholder.
7. **Cómo pedir en 3 pasos:** elige → envía por WhatsApp → paga con Yape o Plin.
8. **Zonas de entrega, horario y contacto:** tres columnas (ZONAS DE ENTREGA / HORARIO / CONTACTO) y botón de WhatsApp. Datos placeholder; no inventar distritos ni horarios.
9. **Pie:** logotipo, enlaces a Términos, Privacidad y Libro de reclamaciones (aún inexistentes) y un espacio reservado para los avisos legales de licor y cigarros, sin redacción inventada.

## 12. Material visual (assets)

- **Video del hero:** copa de vino sirviéndose en cámara lenta u otro plano cinematográfico, sobre fondo oscuro. Bucle de 5 a 10 s, sin sonido, `muted`, `playsinline`, `preload="metadata"`, con `poster`. 1080p, MP4 (y WebM si es posible), 2 a 4 MB. No versionar el definitivo en el repo: se sirve desde una URL configurable (almacenamiento externo, por ejemplo Cloudflare R2).
- **Fotos:** tono oscuro y cálido (ámbar y burdeos) para que armonicen con la paleta. Una sola gradación de color para todo el material.
- **Catálogo y combos:** fotos reales de los productos de Lucía, con SKU. El material de stock es solo ambiente.
- **Origen:** fotos o video propios de Lucía, stock con licencia comercial, o generados por IA (revisar los términos de uso comercial y que las etiquetas y botellas no tengan errores). Guardar el comprobante de licencia.
- **Contenido sensible:** que el asesor revise antes de publicar. Evitar consumo excesivo, menores de edad, alcohol al volante y tabaco.
- **Mientras llegan:** placeholders locales livianos y rutas configurables.

## 13. Cómo usar este documento

1. Abrir `claude` en la raíz del repo y comprobar con `/skills` que `impeccable` esté instalada (`npx impeccable install --providers=claude --scope=global`; reiniciar `claude` después). `PRODUCT.md` ya existe; este documento es la fuente de la identidad visual y del diseño de pantallas.
2. Preparar la pantalla con `/impeccable shape landing`. Luego construirla con `/impeccable craft` o con el prompt de la landing, sin repetir lo definido aquí.
3. Revisar con `/impeccable critique` y `/impeccable audit`; afinar con `typeset`, `colorize`, `layout`; animar con `animate`; pulir con `polish`; revisar el rendimiento en celular con `optimize`. Para ver todos los comandos, escribir `/impeccable`.
4. El movimiento final se revisa con `emil-design-eng`.
5. Conectar con la API solo después de leer `backend/ENDPOINTS.md`, contra el backend local (`http://localhost:8080`).
6. Mantener `avances.md` y el grafo (`/graphify . --update`) al terminar cada pantalla. No hacer commits sin pedirlo.
7. Pendiente de Lucía: confirmar el diseño (híbrido), logo, textos legales, fotos con SKU, video, tarifas y distritos reales, y los números de WhatsApp, Yape y Plin.
