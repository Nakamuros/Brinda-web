# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Angular (frontend, Hito 2) sobre backend Spring Boot 3.4.5 / Java 21 y PostgreSQL 16 ya cerrado (Hito 1). Despliegue previsto: Angular en Vercel/Netlify, API en Railway, dominio en Cloudflare.

## Users
- **Clientes finales:** adultos (+18) en Lima que piden licor y cigarros a domicilio, principalmente desde el celular, y cierran el pedido por WhatsApp con pago Yape/Plin.
- **Lucía (dueña) y posiblemente su hijo:** gestionan catálogo, stock, ofertas, combos, distritos/tarifas y pedidos desde un panel admin. El rol de cajero para el hijo está pendiente de decidir.

## Product Purpose
Licorería con delivery en Lima: catálogo en línea con ofertas, combos y promociones "lleva N paga M", checkout que genera el pedido y el enlace de WhatsApp, y panel para operar el negocio. Éxito: el cliente completa un pedido rápido y confiable; Lucía controla stock y pedidos sin fricción.

## Positioning
Catálogo propio de una licorería local con delivery por distrito, promociones reales (ofertas con fecha de fin, combos, 2x1/3x2) y cierre del pedido por WhatsApp y Yape/Plin, sin pasarela de pago.

## Operating Context
- Pedido: carrito → solicitud → enlace de WhatsApp → confirmación manual y pago Yape/Plin verificado a mano → finalizada. Estados: PENDING, CONFIRMED, CANCELLED, EXPIRED (vence a los 20 min; un pedido vencido aún puede confirmarse).
- Precios, tarifa de delivery y total se calculan en servidor; stock se descuenta al confirmar.
- DNI obligatorio siempre (boletas), cifrado en la base.
- Checkout con casillas de mayor de 18 años y aceptación de términos y privacidad.
- Sesión admin de 8 h por cookie HttpOnly.

## Capabilities and Constraints
- Backend y API cerrados (ver `backend/ENDPOINTS.md`); el frontend los consume.
- Ocultar un producto (no visible) es distinto de agotado (visible, sin stock, no pedible).
- Orden del catálogo: con stock, con promoción, combos, destacados, nombre.
- Combos con composición fija; oferta de precio y "lleva N paga M" son excluyentes.
- Imágenes por `image_url` + `IMAGES_BASE_URL`; subida desde el panel diferida.
- Pendientes legales a cargo del asesor de Lucía: avisos de licor y cigarros, términos y condiciones, política de privacidad, libro de reclamaciones virtual.
- Datos de prueba hoy: tarifas, distritos, WhatsApp, Yape y Plin; los reales los entrega Lucía.

## Brand Commitments
- Nombre: BRINDA.
- Tipografías y paleta de colores ya definidas: ver `FRONTEND-BRIEF-BRINDA.md` (vinculante; no se rediseña aquí).
- Logo pendiente: lo entregará Lucía.

## Evidence on Hand
- Disponible: backend y documentación técnica (`CONTEXTO-BRINDA.md`, `backend/ENDPOINTS.md`), brief de frontend.
- No existen aún: logo, fotos reales de productos, textos legales. No inventarlos.

## Product Principles
1. Móvil primero: el pedido se decide y se hace desde el celular.
2. Confianza y claridad en el cierre: precio, tarifa y total siempre explícitos antes de ir a WhatsApp.
3. Cumplimiento visible: mayoría de edad, DNI y avisos legales presentes sin estorbar el flujo.
4. El panel prioriza rapidez y claridad operativa sobre expresividad.
5. Stock, promociones y estados reflejan la realidad del servidor; nada se promete que el backend no valide.

## Accessibility & Inclusion
WCAG AA: contraste suficiente, navegación por teclado, foco visible, objetivos táctiles amplios.
