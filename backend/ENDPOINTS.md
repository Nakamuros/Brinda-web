# BRINDA API · Endpoints (v1)

Base: `http://localhost:8080` · JSON · sesión por cookie `brinda_token` (HttpOnly). En Postman las cookies se guardan solas tras el login.
Errores: `{ status, code, message, fields?, timestamp }`.

## Públicos (sin login)
| Método | Ruta | Notas |
|---|---|---|
| GET | `/api/v1/catalog/categories` | Solo categorías activas |
| GET | `/api/v1/catalog/products?category=&q=&featured=&onOffer=&page=&size=` | `size` máx. 50; `inStock` sin cantidades. Oculta `is_available=false`. Orden: con stock, en oferta, destacados, nombre |
| GET | `/api/v1/catalog/products/{slug}` | 404 si el producto está oculto |
| GET | `/api/v1/delivery/districts` | Distritos con reparto y tarifa estimada |
| GET | `/api/v1/catalog/images/{nombre}` | Foto subida desde el panel (caché de un año). 404 si no existe o el nombre no es `<uuid>.png\|jpg\|webp` |
| POST | `/api/v1/orders` | Límite 5/min por IP. Devuelve código, montos estimados, datos de pago y `whatsappUrl` |
| POST | `/api/v1/complaints` | Libro de Reclamaciones. Límite 3/min por IP. Ver sección más abajo |
| GET | `/api/v1/complaints/copy/{token}` | Copia en PDF de la hoja (aplanada), solo con el token de ese reclamo. Límite 20/min por IP. 404 si no existe |

Cuerpo de `POST /api/v1/orders` (precios, tarifa y total los calcula el servidor; Jackson rechaza con 400 cualquier campo desconocido):
```json
{
  "items": [{ "productId": "<uuid>", "quantity": 2 }],
  "firstName": "Ana", "lastName": "Pérez", "phone": "987654321",
  "documentType": "DNI", "documentNumber": "12345678",
  "address": "Av. Larco 123", "reference": "Frente al parque",
  "districtId": 1, "paymentMethod": "YAPE|PLIN|TRANSFER",
  "adultConfirmed": true, "termsAccepted": true, "privacyAccepted": true,
  "marketingConsent": false
}
```
- **Documento obligatorio siempre** (desde V11 reemplaza a `dni`): `DNI` = 8 dígitos; `CE` = 8 a 12 alfanuméricos; `PASSPORT` = 6 a 12 alfanuméricos (CE y pasaporte se guardan en mayúsculas). 400 con `fields.documentNumber` (o `fields.documentType`). El número va cifrado (AES-GCM) en `customer_dni_encrypted`, que conserva su nombre; el tipo, en `document_type`. *Criterios por confirmar con el asesor.* El Libro de Reclamaciones sigue solo con DNI y CE.
- **`marketingConsent`** (opcional, `false` si no viene): consentimiento de promociones, separado de los términos. El servidor guarda `marketing_consent` y `marketing_consent_at` (hora del servidor); el CHECK `ck_orders_marketing` exige que uno vaya con el otro.
- **Versión de los textos legales:** `terms_version` y `privacy_version` las escribe el servidor con `LEGAL_DOCUMENTS_VERSION` (nunca el navegador). Vacía (hoy) = NULL.

Respuesta `201` (sin datos personales):
```json
{ "code": "EQ12", "status": "PENDING", "subtotal": 96.00, "deliveryFee": 6.00, "total": 102.00,
  "expiresAt": "…", "items": [{ "name": "…", "quantity": 2, "unitPrice": 48.00, "promoDiscount": 0, "promo": null, "subtotal": 96.00 }],
  "payment": { "method": "TRANSFER", "number": null,
               "transfer": { "bank": "…", "account": "…", "cci": "…", "holder": "…" }, "amount": 102.00 },
  "whatsappUrl": "https://wa.me/…" }
```
- `deliveryFee` y `total` son **estimados** (tarifa base del distrito). El delivery final lo fija la dueña al confirmar.
- `payment.number`: Yape/Plin de BRINDA (`YAPE_NUMBER`/`PLIN_NUMBER`). `payment.transfer`: cuenta de BRINDA (`TRANSFER_BANK`, `TRANSFER_ACCOUNT`, `TRANSFER_CCI`, `TRANSFER_HOLDER`), solo si las **cuatro** están configuradas; si no, `null` y la web dice "Te enviaremos los datos de la cuenta por WhatsApp". Son datos de BRINDA, no del cliente: el navegador los recuerda junto al código (1 h 30 min) para mostrarlos tras recargar.

`whatsappUrl` (`https://wa.me/<número configurado>?text=…`, o `null` si no hay número) lleva **código, productos y montos, sin datos personales**:
```
*Pedido BRINDA EQ12*
2 × Pisco Quebranta 500 ml
1 × Combo Fiesta
Delivery base: S/ 6.00
Total estimado: S/ 102.00
Pago: Yape | Plin | Transferencia
```
Ni nombre, celular, dirección ni documento: el detalle lo ve la dueña en el panel. Por eso el navegador puede recordar el enlace junto al código (1 h 30 min). **Tope: 2000 caracteres** el enlace ya codificado (`WhatsAppMessageBuilder.MAX_URL_LENGTH`); si se pasa, se muestran los primeros productos y el resto como `+N productos más`. La web descarta enlaces que no empiecen por `https://wa.me/` o pasen de ese largo.

### Libro de Reclamaciones (público)
`POST /api/v1/complaints` guarda la Hoja de Reclamación (un campo por campo del PDF `public/legal/hoja-reclamacion.pdf`). **Sin pedido previo.** Responde `201`:
```json
{ "code": "LR-2026-000123", "number": 123, "year": 2026, "filedOn": "2026-10-28", "copyToken": "<43 caracteres>", "copyPath": "/api/v1/complaints/copy/<token>" }
```
Cuerpo (todo obligatorio salvo `guardianName`, `claimedAmount` y `website`):
```json
{
  "consumerName": "Ana Núñez", "documentType": "DNI|CE", "documentNumber": "12345678",
  "address": "Av. Larco 123", "phone": "987654321", "email": "ana@correo.pe",
  "guardianName": "Rosa Pérez",
  "goodType": "PRODUCT|SERVICE", "claimedAmount": 45.50, "goodDescription": "Whisky Reserva",
  "complaintType": "CLAIM|COMPLAINT", "detail": "…≤2000", "consumerRequest": "…≤1000",
  "privacyAccepted": true, "website": ""
}
```
- **Documento:** `DNI` = 8 dígitos; `CE` = 8 a 12 caracteres alfanuméricos (se guarda en mayúsculas). Error en `fields.documentNumber`. *Criterio por confirmar con el asesor.*
- **Menores:** el campo `guardianName` (padre, madre o apoderado) es opcional.
- **`website` es un honeypot:** si viene con texto se responde `201` con el código `LR-0000-000000` y token vacío, sin guardar nada ni enviar correo.
- **Correlativo** único por año (tabla `complaint_counters`, atómico) y año de Lima. El DNI/CE se guarda cifrado (AES-GCM, igual que en los pedidos) y nunca se devuelve ni se registra en logs.
- **Token de copia:** 32 bytes aleatorios (base64url). Solo se entrega en esta respuesta; la BD guarda su SHA-256. Con él, `GET /api/v1/complaints/copy/{token}` devuelve `application/pdf` (`Content-Disposition: attachment`, `Cache-Control: no-store`): la hoja oficial rellenada con los 23 campos AcroForm y aplanada. Si el reclamo ya fue respondido, la sección 4 sale rellena. No existe listado ni consulta por número.
- **Correo:** el reclamo se guarda SIEMPRE primero; el envío va aparte (copia al consumidor con el PDF adjunto y aviso a la dueña con `COMPLAINTS_OWNER_EMAIL`, sin datos personales). Cada correo tiene estado `PENDING/SENT/FAILED`, intentos y último intento; un job (cada 5 min) reintenta con espera creciente hasta `brinda.complaints.max-email-attempts` (5). **Hoy solo está `NoopEmailSender`** (`shared/mail`): no envía nada, registra solo el id del reclamo y deja `PENDING` sin contar intentos; el job no corre mientras no haya un envío real. Conectar Resend u otro servicio = un bean `EmailSender` nuevo (guía en el Javadoc de `EmailSender`); la clave solo como variable de entorno y el dominio con SPF/DKIM/DMARC.
- **Plazo (panel):** `deadline = { dueOn, businessDaysLeft, level, answeredLate }`. `dueOn` = fecha de registro (hora de Lima) + 15 días hábiles de lunes a viernes; `businessDaysLeft` es negativo si venció; `level`: `ON_TIME`, `SOON` (≤ 3 días hábiles o vence hoy), `OVERDUE` o `ANSWERED`. **Por confirmar con el asesor:** los feriados no se descuentan.
- **Sin borrado:** no existe ningún DELETE sobre reclamos (la API devuelve 405 y `brinda_app` no tiene el privilegio).
- **Conservación:** nada se borra (`brinda_app` sin `DELETE`); plazo mínimo de dos años, por confirmar con el asesor.

### Imágenes (`imageUrl`)
- `products.image_url` guarda una ruta relativa (`products/SKU-0001.webp`) o una URL absoluta. La API devuelve siempre la URL final: las relativas se resuelven con `IMAGES_BASE_URL` (si está vacía, se devuelve la ruta tal cual); las absolutas no se tocan.
- **Sin imagen**: el campo `imageUrl` **no viene en el JSON** (la API omite los nulos). El frontend debe tratar `imageUrl` ausente/`null` como "sin foto" y mostrar una imagen genérica.
- Admin: la respuesta trae `imageUrl` (final, para mostrar) e `imageKey` (valor guardado, el que se reenvía al editar). Carga masiva manual: `database/templates/update_image_urls.sql`.

## Auth
| Método | Ruta | Notas |
|---|---|---|
| POST | `/api/v1/auth/login` | `{username, password}` · límite 10/min por IP · 5 fallos = bloqueo 15 min |
| POST | `/api/v1/auth/logout` | |
| GET | `/api/v1/auth/me` | |
| POST | `/api/v1/auth/change-password` | `{currentPassword, newPassword(≥12)}` · obligatorio en el primer ingreso (antes, `/admin` da 403) |

## Admin (login + ROLE_ADMIN)
| Método | Ruta |
|---|---|
| GET/POST | `/api/v1/admin/categories` · PUT `/{id}` |
| GET/POST | `/api/v1/admin/products` · GET/PUT `/{id}` (el stock NO se edita aquí). Filtros GET: `q, categoryId, visibility=ALL\|VISIBLE\|HIDDEN, onOffer, lowStock, type=PRODUCT\|COMBO` |
| PUT/DELETE | `/api/v1/admin/products/{id}/offer` `{discountPrice, endsAt}` (fecha y hora de fin obligatoria y futura, ej. `2026-10-26T23:59:00-05:00`; DELETE quita la oferta) |
| POST | `/api/v1/admin/combos` | `{name, description, imageUrl, price, minStock, maxStock, featured, available, items[≤10]: {productId, quantity 1..100}, unitsToBuild 1..1000}`. Crea el combo y arma las primeras unidades |
| GET | `/api/v1/admin/combos/{id}` | Composición con stock de componentes y `buildableNow` |
| POST | `/api/v1/admin/combos/{id}/build` | `{units 1..1000, reason?}` "armar más" (todo o nada; el error dice qué componente falta y cuánto hay) |
| PUT | `/api/v1/admin/combos/{id}` | Nombre, descripción, foto, precio, oferta, umbrales, visibilidad. Rechaza `items` y `stockQuantity` (422) |
| PUT/DELETE | `/api/v1/admin/products/{id}/promo` `{buy, pay, endsAt}` ("lleva N, paga M"; fecha de fin obligatoria y futura; excluyente con la oferta de precio) |
| POST | `/api/v1/admin/products/visibility` `{ids[≤200], available}` (todo o nada; auditoría por producto) |
| GET | `/api/v1/admin/inventory/alerts` (agotados / en mínimo) |
| POST | `/api/v1/admin/inventory/products/{id}/restock` `{quantity, reason?}` |
| POST | `/api/v1/admin/inventory/products/{id}/adjust` `{quantityChange, reason}` (motivo obligatorio) |
| POST | `/api/v1/admin/inventory/restock-batch` `{reference?, lines[≤100]: {productId, quantity 1..100000}}` (todo o nada, sin repetidos) |
| GET | `/api/v1/admin/inventory/products/{id}/movements` |
| GET/POST | `/api/v1/admin/delivery/zones` · PUT `/{id}` `{name, fee, active}` |
| GET/POST | `/api/v1/admin/delivery/districts` · PUT `/{id}` `{zoneId, name, active}` |
| GET | `/api/v1/admin/orders?status=PENDING&marketing=true\|false&page=&size=` (`marketing` opcional: solo quienes aceptaron, o no, promociones; cada fila trae `marketingConsent` y `total` = cobrado si ya se confirmó) |
| GET | `/api/v1/admin/orders/pending-count` (polling del panel) |
| GET | `/api/v1/admin/orders/{id}` (incluye `documentType` y `documentNumber` descifrado; queda en auditoría). Montos: `deliveryFee`/`total` estimados y `finalDeliveryFee`/`finalTotal` cobrados (null si no se confirmó o es anterior a V11). Además `marketingConsent`/`marketingConsentAt` |
| POST | `/api/v1/admin/orders/{id}/confirm` `{deliveryFee, zeroFeeConfirmed}` ("Finalizada"). `deliveryFee` obligatorio, ≥ 0, 2 decimales (400 si falta o es inválido), máximo `MAX_DELIVERY_FEE` (por defecto 100; 422 si lo supera); S/ 0 exige `zeroFeeConfirmed: true` (422). En una sola transacción y bajo el mismo bloqueo: descuenta el stock y guarda `final_delivery_fee` y `final_total_amount` (= subtotal + delivery cobrado). Admite PENDING y EXPIRED. Auditoría `ORDER_CONFIRM` con `delivery <base> -> <cobrado>, total <final>` (sin datos personales) |
| POST | `/api/v1/admin/orders/{id}/delivery-fee` `{deliveryFee, zeroFeeConfirmed}` | Corrige el delivery cobrado de un pedido **confirmado** (mismas validaciones; 422 en otro estado). Recalcula el total final. Auditoría `ORDER_DELIVERY_FIX` con el valor anterior y el nuevo |
| POST | `/api/v1/admin/orders/{id}/cancel` `{reason}` (si estaba confirmada, devuelve el stock) |
| GET | `/api/v1/admin/orders/{id}/copy/delivery` · `/copy/receipt` (boleta: `<Tipo de documento>: <número>`, productos, `Envío` y `Total` cobrados —o estimados si no hay finales— y `Pago`) |
| POST | `/api/v1/admin/images` (multipart, campo `file`) | Sube una foto de producto: PNG, JPG o WebP (se comprueba por los bytes del archivo, no por el nombre), máx. 3 MB. `201 {key, url}`: `key` es lo que se guarda en `imageUrl` del producto. 422 si no es una imagen permitida, 413 si pesa más. Auditado (`IMAGE_UPLOAD`). Los archivos van a `IMAGES_UPLOAD_DIR` (por defecto `./uploads`), nunca a la BD |
| GET | `/api/v1/admin/reports/sales?from=AAAA-MM-DD&to=AAAA-MM-DD` | Ventas: solo pedidos `CONFIRMED`, por fecha de confirmación en hora de Lima. Rango inclusivo, máx. 366 días (422 si es mayor o está invertido); sin fechas, últimos 30 días. `revenue` = total cobrado y `deliveryRevenue` = delivery cobrado: usan `final_total_amount`/`final_delivery_fee` y, en confirmados anteriores a V11, la tarifa base. Devuelve `{from, to, orders, revenue, productsRevenue, deliveryRevenue, averageTicket, days[{date, orders, revenue}], topProducts[≤10 {name, units, revenue}], inventory{units, valueAtSalePrice}}`. Sin datos personales. No hay costo ni ganancia (la base no guarda precio de costo) |
| GET | `/api/v1/admin/complaints?status=RECEIVED\|ANSWERED&type=CLAIM\|COMPLAINT&q=&deadline=SOON\|OVERDUE&page=&size=` | Lista de reclamos **sin DNI/CE, teléfono, correo ni dirección**. Pendientes del más antiguo al más nuevo; el resto, del más nuevo. `deadline` solo admite SOON u OVERDUE (otro valor: 400/422) y trae solo pendientes |
| GET | `/api/v1/admin/complaints/counts` | `{pending, dueSoon, overdue}` para el aviso del panel |
| GET | `/api/v1/admin/complaints/{id}` | Detalle con el documento descifrado, plazo y estado de los dos correos. **Cada lectura queda auditada** (`COMPLAINT_VIEW`: usuario, hora e IP; sin el documento) |
| POST | `/api/v1/admin/complaints/{id}/respond` `{responseText ≤1000, responseDate}` | Sección 4 de la hoja. Pasa a `ANSWERED` (auditado `COMPLAINT_RESPOND`, `status RECEIVED -> ANSWERED`). 422 si la fecha es futura o anterior al reclamo, o si ya fue respondido (no se edita) |
| GET | `/api/v1/admin/complaints/{id}/pdf` | La hoja oficial rellenada (con la sección 4 si ya se respondió); auditada (`COMPLAINT_PDF`) |

## Reglas a recordar
- "Lleva N, paga M": grupos = floor(q/N), gratis = grupos x (N-M). El stock baja por todas las unidades entregadas; el subtotal y el total usan lo ya descontado. Línea del pedido: `promoDiscount`, `promoType=BUY_X_PAY_Y`. Público: `promoBuy/promoPay/promoLabel/promoEndsAt` (solo si está activa; cuenta como `onOffer`).
- Combo = producto con stock propio y composición fija (sin combos dentro de combos). Armar resta de los componentes (`COMBO_CONSUME`, con `comboId`) y suma al combo (`COMBO_BUILD`); no es venta. Se vende y se anula como cualquier producto. Público: `productType` y `items` (`name`, `quantity`).
- Oferta activa = `discountPrice` y (sin fecha de fin o fecha de fin futura); se evalúa al consultar, sin tareas. Público: `discountPrice/onOffer/discountPercent/offerEndsAt` solo si está activa. Admin: `offerActive` / `offerExpired`.
- Un pedido conserva el precio (y `promoType=OFFER`) del momento de crearlo aunque la oferta venza antes de confirmarlo.
- El stock se descuenta **solo al confirmar**. Si no alcanza, el pedido sigue `PENDING` y no cambia nada.
- Un pedido `EXPIRED` (20 min sin confirmar) aún se puede confirmar si el pago llegó tarde.
- Nada se borra: se desactiva (`active`/`available`) o se cancela con motivo.
- Los pedidos conservan la tarifa y precios de su momento aunque luego se editen.
- La tarifa del distrito es la **base**: el delivery real puede ser mayor (dirección, contenido, hora). Se registra al confirmar y se puede corregir después con auditoría. "Anular" no lo pide.
