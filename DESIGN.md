---
name: BRINDA
description: Licorería de Lima con delivery. Un salón a media luz: marrón medianoche, ciruela y latón, con la vela como única luz.
colors:
  midnight-brown: "#431821"
  deep-plum: "#4b1e3a"
  cream: "#fbf4e1"
  ivory: "#fff8ed"
  brass: "#b2864f"
  burgundy-cta: "#a1163b"
  terracotta-promo: "#ca5a4e"
  petrol-teal: "#00585e"
  stone: "#7d7267"
typography:
  display:
    fontFamily: "'Libre Baskerville', Baskerville, Georgia, serif"
    fontSize: "clamp(2.5rem, 1.4rem + 4.4vw, 4.75rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "'Libre Baskerville', Baskerville, Georgia, serif"
    fontSize: "clamp(1.875rem, 1.4rem + 2.4vw, 3.25rem)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Libre Baskerville', Baskerville, Georgia, serif"
    fontSize: "clamp(1.125rem, 1.05rem + 0.4vw, 1.375rem)"
    fontWeight: 700
    lineHeight: 1.25
  lead:
    fontFamily: "'Libre Baskerville', Baskerville, Georgia, serif"
    fontSize: "clamp(1.125rem, 1.05rem + 0.4vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.6
  accent:
    fontFamily: "Limelight, 'Libre Baskerville', serif"
    fontSize: "0.94em"
    fontWeight: 400
    letterSpacing: "0.01em"
  body:
    fontFamily: "Jost, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "clamp(1rem, 0.97rem + 0.15vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Jost, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    letterSpacing: "0.2em"
rounded:
  sm: "6px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "72px"
components:
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "12px 28px"
    height: "48px"
  button-ghost-hover:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.midnight-brown}"
  button-cta:
    backgroundColor: "{colors.burgundy-cta}"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "12px 28px"
    height: "48px"
  button-cta-hover:
    backgroundColor: "{colors.burgundy-cta}"
    textColor: "{colors.cream}"
  order-bar:
    backgroundColor: "{colors.midnight-brown}"
    textColor: "{colors.cream}"
    padding: "12px 20px"
  category-tile:
    backgroundColor: "{colors.deep-plum}"
    textColor: "{colors.cream}"
    typography: "{typography.lead}"
    rounded: "{rounded.lg}"
---

# Design System: BRINDA

## Overview

**Creative North Star: "El Salón a Media Luz"**

BRINDA es una licorería de barrio de Lima que solo reparte. Su sistema visual es un bar de autor a la luz de una vela: casi todo es oscuro, cálido y quieto, y la única luz que brilla es el latón. El ambiente es íntimo, sobrio y cálido: mucho espacio vacío, pocas piezas por pantalla, una sola columna, nada que grite. La luz de la vela nace en el hero y baja, apenas como un resplandor, a cada cambio de sección.

La densidad es baja y el ritmo es editorial. Los títulos van en una serif de libro (Libre Baskerville), una o dos palabras del titular en la tipografía de cartel Limelight, y el texto en Jost, una sans geométrica y sobria. El color se reparte por campos de región entera (marrón medianoche, ciruela, un solo bloque verde azulado), no como acentos sueltos. El lujo es discreto: líneas finas de latón en lugar de sombras, botones de contorno en lugar de bloques llenos.

Se rechaza con claridad el aspecto de tienda promocional (rojo y amarillo de oferta, urgencia, tarjetas cargadas), el negro y dorado genérico de licorería, y cualquier plantilla que sirva igual a otra marca.

**Key Characteristics:**
- Oscuro por defecto: marrón medianoche como fondo, ciruela para alternar, crema como texto.
- Latón solo para líneas, filetes, íconos y títulos grandes; nunca como fondo ni texto pequeño.
- La vela (halo, bokeh, resplandor en los bordes de sección) es la firma; el hero tiene un solo protagonista.
- El burdeos es la acción: solo los botones de pedir.
- Movimiento sobrio: entrada escalonada y reveals por scroll, siempre con alternativa estática.

## Colors

Una paleta de licorería nocturna: marrones y ciruelas profundos, crema cálida, latón y un burdeos que solo se usa para actuar. El verde azulado petróleo es el único contraste frío.

### Primary
- **Burdeos BRINDA** (#a1163b): el color de la acción. Botones "Pedir ahora" sólidos (barra fija móvil y cierre de "Cómo pedir"), siempre con texto crema y un filete de latón de 1px que lo separa del fondo oscuro. Nunca en otro lugar.

### Secondary
- **Dorado ámbar / latón** (#b2864f): líneas, filetes, íconos, bordes finos y titulares grandes (la palabra en Limelight, los números de los pasos). Sobre marrón da 4.61:1, así que solo texto grande o decorativo; sobre ciruela solo texto grande; sobre crema no se usa para texto.

### Tertiary
- **Terracota de promo** (#ca5a4e): etiquetas de promoción y destellos en la ilustración. Con crema solo da 3.76:1: texto grande o en negrita, o texto marrón con borde terracota.
- **Verde azulado petróleo** (#00585e): el bloque de contraste (combos y promociones). Con crema da 7.48:1.

### Neutral
- **Marrón medianoche** (#431821): fondo principal, la mayor parte de la superficie. Crema encima da 13.75:1.
- **Ciruela profunda** (#4b1e3a): secciones alternas (categorías) y menú móvil. Crema encima da 12.37:1.
- **Crema** (#fbf4e1): texto principal sobre oscuro, contorno de botones y bloque de lectura.
- **Marfil** (#fff8ed): superficies claras (el pie de las ilustraciones, tarjetas claras si vuelven).
- **Gris piedra** (#7d7267): solo como tinte de fichas de categoría; nunca como texto (no llega a 4.5:1 sobre claro ni sobre oscuro).

Derivados con `color-mix` desde esos tokens, sin hex nuevos: el fondo más oscuro del pie y de la barra de anuncio (marrón al 78% con negro), la línea de latón al 55% y su versión suave al 28%, el texto secundario (crema al 84% con marrón) y el hover del burdeos (88% con crema).

### Named Rules
**The Brass Is Light Rule.** El latón es la luz de la escena, no pintura. Solo líneas, filetes, íconos y texto grande; si aparece como fondo o como texto pequeño, está mal.

**The One Action Color Rule.** El burdeos es la acción y nada más. Ninguna otra superficie ni etiqueta lo usa.

**The Tokens Only Rule.** Ningún hex suelto fuera de `tokens.css`; todo lo demás sale de las variables o de `color-mix` sobre ellas.

## Typography

**Display Font:** Libre Baskerville (con Baskerville, Georgia, serif)
**Accent Font:** Limelight (solo una o dos palabras por titular)
**Body Font:** Jost (con system-ui, sans-serif)

**Character:** una serif de libro, segura y de otra época, contra una sans geométrica y limpia. Limelight, de cartel art déco, aparece como un destello en una palabra ("brindis", "promociones", "sin") y nunca como sistema.

### Hierarchy
- **Display** (700, `clamp(2.5rem, 1.4rem + 4.4vw, 4.75rem)`, 1.04): el titular del hero. Máximo 4.75rem; "Tu brindis, a domicilio".
- **Headline** (400, `clamp(1.875rem, 1.4rem + 2.4vw, 3.25rem)`, 1.12): títulos de sección, en peso normal y no en negrita ("Para cada ocasión", "Cómo pedir").
- **Title** (700, `clamp(1.125rem, 1.05rem + 0.4vw, 1.375rem)`, 1.25): títulos de pasos y nombres de categoría.
- **Lead** (400 cursiva, mismo tamaño que Title, 1.6): subtítulo del hero y frases de presentación, en Libre Baskerville cursiva, ancho contenido (34 a 46ch).
- **Body** (400, `clamp(1rem, 0.97rem + 0.15vw, 1.0625rem)`, 1.6): texto corrido en Jost. Medida de 62ch como máximo.
- **Label** (500, 0.8125rem, tracking 0.2em, mayúsculas): botones, menú de escritorio (0.78rem, 0.17em), avisos, encabezados de columnas.
- **Wordmark** (700, `clamp(1.5rem, 1rem + 2.6vw, 2.75rem)`, tracking 0.5em): BRINDA en mayúsculas muy espaciadas, con un filete de latón debajo.

### Named Rules
**The Two Words Rule.** Limelight solo en una o dos palabras de un titular. Si hay más, deja de ser un acento.

**The Quiet Case Rule.** Las mayúsculas espaciadas son para etiquetas y botones; los títulos van en minúscula y mayúscula inicial. Sin sobretítulos encima de los titulares.

## Layout

Una columna central, centrada, con mucho aire. Contenedor de 76rem máximo y gutter fluido de 1.25rem a 3rem (20px en celular). Secciones con relleno vertical fluido de 4.5rem a 9rem; las franjas informativas compactas bajan a 4.5rem. Ritmo: una sección densa seguida de una quieta, nunca cuatro iguales.

Mobile-first: se diseña a 360px y se amplía. Puntos de corte: 48rem (tablet), 64rem (columnas y barra fija desaparece) y 75rem (el menú de escritorio sustituye a la hamburguesa). Hasta 64rem el hero usa el poster vertical y el video liviano. Los objetivos táctiles miden 44px como mínimo y sin hover obligatorio. Las alturas de pantalla completa usan `svh`.

El hero pasa por debajo de la navegación transparente; el rail de categorías es un carrusel con asomo de la siguiente tarjeta en celular y una fila de seis en escritorio.

### Named Rules
**The Thumb Rule.** En celular la acción principal vive abajo: la barra fija "Pedir ahora" aparece al dejar atrás el hero y se oculta mientras el botón de "Cómo pedir" está a la vista.

## Elevation & Depth

Plano por defecto. La profundidad no viene de sombras, sino de capas tonales (marrón, ciruela, verde azulado), de líneas finas de latón y de la luz de la vela. Las sombras, si reaparecen, son suaves y difusas con desplazamiento real; nunca un halo sin desplazamiento ni una sombra dura.

### Shadow Vocabulary
- **Soft** (`box-shadow: 0 1px 2px rgba(0,0,0,.22), 0 14px 38px -12px rgba(0,0,0,.48)`): definida pero hoy sin usar; reservada para tarjetas claras sobre fondos de color.
- **Candle Edge** (`radial-gradient(ellipse 55% 100% at 50% 0%, latón al 24%, transparente 76%)`, 9 a 15rem de alto): un resplandor estático en el borde superior de las secciones de categorías, promos, "Cómo pedir" y zonas.

### Named Rules
**The Candle Edge Rule.** La luz baja desde el hero a los cambios de sección como un resplandor; es estático, de una sola capa y nunca compite con el contenido.

## Shapes

Esquinas apenas redondeadas. Botones de 6px, fichas y tarjetas de 12px, y círculo completo para el sello +18. Los bordes son filetes de 1px de latón (completo o al 28%); no hay bordes de color gruesos. La marca de agua propia de BRINDA son dos copas que brindan, dibujadas en trazo fino, a muy baja opacidad.

## Components

Refinados y contenidos: el contorno fino es la regla, el relleno sólido es la excepción.

### Buttons
- **Shape:** esquinas de 6px, altura mínima de 48px, mayúsculas de 13px con tracking 0.2em en Jost 500.
- **Ghost (principal del hero y de las franjas):** transparente con contorno de crema de 1px. Al pasar el ratón se rellena de crema con texto marrón y sube 2px; al pulsar baja 1px. Es el botón fijado por el brief para el hero.
- **CTA (acción real):** fondo burdeos, texto crema, filete de latón de 1px. Al pasar el ratón el burdeos se aclara hacia crema (88/12) y sube 2px.
- **Foco:** contorno de crema de 2px con separación de 3px, siempre visible con teclado.
- **Deshabilitado:** opacidad 0.55, sin eventos.

### Navigation
- **Escritorio (≥75rem):** transparente sobre el hero, sólida (marrón) al hacer scroll con un filete suave abajo. Enlaces centrados en mayúsculas de 0.78rem con tracking 0.17em; el subrayado de latón se dibuja de izquierda a derecha al pasar el ratón y queda fijo en la página activa. La marca aparece a la izquierda solo tras el scroll. Carrito a la derecha: ícono con contador en un círculo crema (late al cambiar la cantidad) y enlace a `/carrito`.
- **Móvil y tablet:** hamburguesa que se convierte en X; menú a pantalla completa sobre ciruela con enlaces en Libre Baskerville grandes y separados por filetes, que entran escalonados. Se cierra con Escape y devuelve el foco al botón.

### Barra fija "Pedir ahora"
Franja fija al pie en celular y tablet: fondo marrón profundo casi opaco, filete de latón arriba, botón CTA de ancho completo con margen de seguridad inferior. Entra desde abajo tras el hero y sale mientras el CTA de "Cómo pedir" está a la vista. No existe en escritorio.

### Category tile
- **Corner Style:** 12px, filete de latón al 28%.
- **Background:** degradado vertical que tiñe cada categoría con un token (latón, burdeos, terracota, ciruela, verde azulado, piedra) mezclado hacia el marrón.
- **Contenido:** silueta de botella genérica ("sin foto") en el centro y el nombre en Libre Baskerville al pie, sobre un degradado oscuro.
- **Hover:** el borde pasa a latón, la ficha sube 4px y la botella crece un 6%.
- **Layout:** carrusel con asomo en celular; seis en fila desde 64rem.

### Product card
- **Estructura:** `article` de 12px con filete de latón al 28%: botón que abre el detalle (foto teñida por categoría, etiqueta, nombre en Libre Baskerville 700 y precio en Jost con tabulares) y una franja al pie con "Agregar".
- **Etiqueta:** una sola por producto. Promo: texto marrón sobre crema con filete terracota (no crema sobre terracota); combo: crema sobre verde azulado; agotado: fondo oscuro con la foto atenuada y sin acción.
- **Precio:** oferta con el precio anterior tachado (filete terracota). Sin foto: botella genérica.
- **Agregar:** franja de 44px en mayúsculas espaciadas, contorno y no relleno; al agregar se vuelve el selector de cantidad. Hover: sube 4px y el borde pasa a latón.
- **Entrada:** sube y se aclara una sola vez al entrar en pantalla, escalonada (solo transform y opacity).

### Qty stepper
Selector de − / cantidad / + con botones de 44px. Con cantidad 1, el "−" es una papelera (quita el producto). Se usa en la tarjeta, el detalle y el carrito.

### Detalle de producto
`<dialog>` nativo: hoja desde abajo en celular y ventana de dos columnas (foto | datos) desde 48rem. Cierra con Escape, el fondo o la X. Muestra categoría, nombre, etiqueta, precio, fecha de fin de oferta, descripción en cursiva y, en combos, "Incluye". La acción de pedir ("Agregar al pedido") es CTA burdeos.

### Filtros del catálogo
Fila fija bajo el menú: chips de 44px (categorías y "Ofertas") con contorno fino; el elegido se rellena de crema con texto marrón. En celular se desplaza horizontalmente con el borde derecho difuminado; desde 64rem se reparte en filas. La búsqueda es un campo de 48px con lupa de latón.

### Campos de formulario
Etiqueta en mayúsculas espaciadas sobre un campo de 48px (`.input`: fondo marrón profundo al 55%, filete de latón al 28%, foco con contorno crema). El error lleva borde terracota, ícono y mensaje en crema (la terracota como texto no llega a 4.5:1). Casillas y opciones de pago (Yape/Plin) de 44px; la opción elegida se rellena de crema. Los datos sensibles (DNI) no se guardan en el navegador.

### Resumen del pedido
Tarjeta de 12px con filete de latón: líneas, subtotal, promoción, delivery (según el distrito) y total estimado en Libre Baskerville 700. Siempre aclara que el servidor confirma el total final. "Finalizar compra" y "Continuar con el pedido" son CTA burdeos.

### Sello +18
Un círculo de 44px con filete de latón y "+18" en Libre Baskerville, junto a "Venta solo para mayores de 18 años", en el pie.

### Pie
Fondo marrón profundo con filete de latón arriba, marca centrada con su lema en cursiva, sello +18 y enlaces legales en mayúsculas pequeñas, hoy inertes y rotulados como pendientes.

### Control de edad (+18)
Modal centrado sobre un velo marrón casi opaco: sello +18, pregunta en Libre Baskerville y dos botones de contorno ("Sí, soy mayor de 18" y "No"; el burdeos queda para pedir). Entra con un fundido y un leve ascenso (alternativa estática con `prefers-reduced-motion`). Sin cierre con Esc ni clic fuera; foco atrapado y fondo inerte.

### Avisos legales
La advertencia de alcohol va en mayúsculas espaciadas, crema sobre fondo oscuro (contraste mayor a 13:1), siempre en el pie. El aviso de menores y DNI físico es un recuadro de filete fino dentro del resumen del carrito y del checkout. El logo del Libro de Reclamaciones va sobre una pastilla marfil de 12px de radio (el PNG oficial sin tocar colores ni proporciones), de al menos 120px de ancho en celular y con objetivo táctil de 44px.

### Panel de administración
Sobrio y operativo (el panel prioriza rapidez y claridad sobre expresividad): marco propio sin barra de anuncio ni carrito, tarjetas de 12px con filete de latón al 28%, contadores que filtran (el elegido se rellena de crema) y etiquetas de plazo: vencido o por vencer en terracota tenue con borde terracota, ícono y texto crema (nunca solo color), respondido en latón apagado. Reutiliza `.input` y `.btn-ghost`; las acciones del panel no usan burdeos.

## Do's and Don'ts

### Do:
- **Do** usar el burdeos (#a1163b) con texto crema y filete de latón solo para acciones de pedir.
- **Do** reservar el latón (#b2864f) para líneas, filetes, íconos y texto grande (≥24px, o 19px en negrita).
- **Do** poner una o dos palabras de un titular en Limelight, y nada más.
- **Do** mantener el hero con un solo protagonista: la vela con su halo y su bokeh.
- **Do** animar solo `transform` y `opacity`, con entrada desde un estado ya visible, y dar una versión estática con `prefers-reduced-motion`.
- **Do** verificar cada pantalla a 360, 768 y 1440px y dejar los objetivos táctiles en 44px o más.
- **Do** definir todo color como token en `tokens.css` y derivar los matices con `color-mix`.

### Don't:
- **Don't** usar el latón como fondo, ni como texto pequeño sobre crema (2.98:1).
- **Don't** usar gris piedra como texto, ni terracota con texto crema pequeño (3.76:1).
- **Don't** poner gradientes en el texto, ni sombras duras de desplazamiento fijo, ni halos sin desplazamiento como profundidad.
- **Don't** repetir el mismo ícono de botella como identidad de cada categoría una vez haya fotos reales; hasta entonces, sin recortes propios por categoría.
- **Don't** inventar productos, precios, horarios, distritos ni promociones de ejemplo; los marcadores internos ("Por confirmar") y el catálogo de ejemplo solo existen en desarrollo.
- **Don't** mostrar cigarros hasta que el asesor lo confirme, ni redactar avisos legales por cuenta propia.
- **Don't** añadir sobretítulos encima de los titulares, ni numerar secciones que no sean una secuencia real (solo "Cómo pedir").
- **Don't** convertir el sistema en una tienda de ofertas: nada de rojo y amarillo promocional ni cuenta regresiva.
