// Catálogo de EJEMPLO solo para las pruebas de navegador (catalogo.mjs, carrito.mjs): intercepta la API
// con `fixtures/catalogo.json`. Nombres y precios son inventados; nunca entran al código de la app.
import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(new URL('./fixtures/catalogo.json', import.meta.url), 'utf8'));
const soon = new Date(Date.now() + 5 * 86_400_000).toISOString();
const products = data.products.map((p) => ({
  ...p,
  ...(p.offerEndsAt && { offerEndsAt: soon }),
  ...(p.promoEndsAt && { promoEndsAt: soon }),
}));
const json = (body) => ({ contentType: 'application/json', body: JSON.stringify(body) });

/** Responde `/catalog/categories` y `/catalog/products` con el catálogo de ejemplo. */
export async function mockCatalog(context) {
  await context.route('**/api/v1/catalog/categories', (r) => r.fulfill(json(data.categories)));
  await context.route('**/api/v1/catalog/products?*', (r) =>
    r.fulfill(
      json({ content: products, page: 0, size: 50, totalElements: products.length, totalPages: 1 }),
    ),
  );
}
