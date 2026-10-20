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
| POST | `/api/v1/orders` | Límite 5/min por IP. Devuelve código, total, pago y `whatsappUrl` |

Cuerpo de `POST /api/v1/orders` (el servidor ignora cualquier precio/total enviado):
```json
{
  "items": [{ "productId": "<uuid>", "quantity": 2 }],
  "firstName": "Ana", "lastName": "Pérez", "phone": "987654321",
  "dni": "12345678", "address": "Av. Larco 123", "reference": "Frente al parque",
  "districtId": 1, "paymentMethod": "YAPE",
  "adultConfirmed": true, "termsAccepted": true, "privacyAccepted": true
}
```
`dni` opcional salvo que el total supere S/ 700.

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
| GET | `/api/v1/admin/orders?status=PENDING&page=&size=` |
| GET | `/api/v1/admin/orders/pending-count` (polling del panel) |
| GET | `/api/v1/admin/orders/{id}` (incluye DNI descifrado; queda en auditoría) |
| POST | `/api/v1/admin/orders/{id}/confirm` ("Finalizada": descuenta stock) |
| POST | `/api/v1/admin/orders/{id}/cancel` `{reason}` (si estaba confirmada, devuelve el stock) |
| GET | `/api/v1/admin/orders/{id}/copy/delivery` · `/copy/receipt` |

## Reglas a recordar
- "Lleva N, paga M": grupos = floor(q/N), gratis = grupos x (N-M). El stock baja por todas las unidades entregadas; el subtotal, el total y el umbral de DNI usan lo ya descontado. Línea del pedido: `promoDiscount`, `promoType=BUY_X_PAY_Y`. Público: `promoBuy/promoPay/promoLabel/promoEndsAt` (solo si está activa; cuenta como `onOffer`).
- Combo = producto con stock propio y composición fija (sin combos dentro de combos). Armar resta de los componentes (`COMBO_CONSUME`, con `comboId`) y suma al combo (`COMBO_BUILD`); no es venta. Se vende y se anula como cualquier producto. Público: `productType` y `items` (`name`, `quantity`).
- Oferta activa = `discountPrice` y (sin fecha de fin o fecha de fin futura); se evalúa al consultar, sin tareas. Público: `discountPrice/onOffer/discountPercent/offerEndsAt` solo si está activa. Admin: `offerActive` / `offerExpired`.
- Un pedido conserva el precio (y `promoType=OFFER`) del momento de crearlo aunque la oferta venza antes de confirmarlo.
- El stock se descuenta **solo al confirmar**. Si no alcanza, el pedido sigue `PENDING` y no cambia nada.
- Un pedido `EXPIRED` (45 min sin confirmar) aún se puede confirmar si el pago llegó tarde.
- Nada se borra: se desactiva (`active`/`available`) o se cancela con motivo.
- Los pedidos conservan la tarifa y precios de su momento aunque luego se editen.
