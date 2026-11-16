// Verifica Productos y Zonas del panel /admin a 360/768/1440.
// La clave del admin se toma de ADMIN_PASSWORD o de backend/.env (POSTMAN_ADMIN_NEW_PASSWORD) y NUNCA se imprime.
//  - Sin clave: modo SIMULADO. Sesión, productos, inventario y zonas se interceptan con datos en memoria
//    armados a partir del catálogo público real; comprueba la interfaz completa (crear, editar, stock, oferta, zonas).
//  - Con clave: API real, SOLO LECTURA (listas y detalle; no crea ni modifica nada).
// Requiere backend (8080) y `ng serve` (4200). Uso: node scripts/admin-productos.mjs
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';

const base = process.env.BASE_URL ?? 'http://localhost:4200';
const env = readFileSync(new URL('../../backend/.env', import.meta.url), 'utf8');
const password = process.env.ADMIN_PASSWORD || /^POSTMAN_ADMIN_NEW_PASSWORD=(.*)$/m.exec(env)?.[1]?.trim();
const SIM = !password;
mkdirSync('capturas', { recursive: true });
const out = [];
const check = (l, ok, x = '') => out.push(`${ok ? 'OK ' : 'FALLA'} ${l}${x ? ' · ' + x : ''}`);

const get = async (p) => (await fetch(`${base}/api/v1${p}`)).json();
const pubCategories = await get('/catalog/categories');
const pubProducts = (await get('/catalog/products?size=50')).content;
const pubDistricts = await get('/delivery/districts');

/** Estado simulado con la forma de las respuestas reales del panel. */
function newState() {
  const level = (p) => (p.stockQuantity === 0 ? 'OUT' : p.stockQuantity <= p.minStock ? 'LOW' : 'NORMAL');
  const products = pubProducts.map((p, i) => ({
    id: p.id, categoryId: pubCategories.find((c) => c.slug === p.categorySlug)?.id ?? 1, categoryName: p.categoryName,
    sku: `SKU-${i + 1}`, name: p.name, slug: p.slug, productType: p.productType, description: p.description,
    price: p.price, discountPrice: null, offerEndsAt: null, offerActive: false, offerExpired: false,
    promoBuy: null, promoPay: null, promoEndsAt: null, promoActive: false, finalPrice: p.price,
    imageUrl: null, imageKey: null, stockQuantity: i === 0 ? 0 : i === 1 ? 2 : 20, minStock: 3, maxStock: 50,
    available: i !== 2, featured: false,
  }));
  const zoneNames = [...new Set(pubDistricts.map((d) => d.zoneName))];
  const zones = zoneNames.map((name, i) => ({ id: i + 1, name, fee: pubDistricts.find((d) => d.zoneName === name).fee, active: true }));
  const districts = pubDistricts.map((d) => ({ id: d.id, name: d.name, zoneId: zoneNames.indexOf(d.zoneName) + 1, active: true }));
  products.push({ ...products[4], id: '00000000-0000-4000-8000-0000000000c0', name: 'Combo de prueba', slug: 'combo-de-prueba',
    productType: 'COMBO', sku: null, stockQuantity: 4, available: true });
  const categories = pubCategories.map((c) => ({ ...c }));
  return { products, zones, districts, categories, level, sent: [], moves: [] };
}

async function simulate(ctx, st) {
  const json = (route, body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
  const view = (p) => ({ ...p, stockLevel: st.level(p), finalPrice: p.discountPrice ?? p.price, offerActive: p.discountPrice != null, promoActive: p.promoBuy != null });
  const comboOf = (p) => ({ combo: view(p), buildableNow: 5, items: [
    { productId: st.products[1].id, name: st.products[1].name, quantity: 1, stockQuantity: st.products[1].stockQuantity, available: true },
    { productId: st.products[2].id, name: st.products[2].name, quantity: 2, stockQuantity: st.products[2].stockQuantity, available: false }] });
  const PNG_1PX = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  await ctx.route('**/api/v1/admin/images', (route) => {
    st.sent.push({ kind: 'image', body: route.request().headers()['content-type'] });
    return json(route, { key: '/api/v1/catalog/images/00000000-0000-4000-8000-000000000001.png', url: PNG_1PX }, 201);
  });
  await ctx.route(/\/api\/v1\/admin\/inventory\/products\/[^/]+\/movements/, (route) =>
    json(route, { content: st.moves, page: 0, size: 10, totalElements: st.moves.length, totalPages: 1 }));
  await ctx.route(/\/api\/v1\/admin\/combos(\/|$)/, (route) => {
    const req = route.request();
    const [, id, action] = new URL(req.url()).pathname.split('/admin/combos')[1].split('/');
    if (!id) {
      const body = req.postDataJSON();
      st.sent.push({ kind: 'combo-create', body });
      const c = { ...st.products[0], ...body, id: '00000000-0000-4000-8000-0000000000c1', productType: 'COMBO', stockQuantity: body.unitsToBuild, imageKey: null, imageUrl: null, slug: 'c' };
      st.products.push(c);
      return json(route, comboOf(c), 201);
    }
    const c = st.products.find((x) => x.id === id);
    if (action === 'build') { const body = req.postDataJSON(); st.sent.push({ kind: 'combo-build', body }); c.stockQuantity += body.units; }
    else if (req.method() === 'PUT') { const body = req.postDataJSON(); st.sent.push({ kind: 'combo-update', body }); Object.assign(c, body, { imageKey: body.imageUrl, imageUrl: null }); }
    return json(route, comboOf(c));
  });
  await ctx.route('**/api/v1/auth/me', (r) => json(r, { id: 'u1', username: 'admin', email: 'admin@example.com', role: 'ROLE_ADMIN', mustChangePassword: false }));
  await ctx.route('**/api/v1/auth/logout', (r) => r.fulfill({ status: 204 }));
  await ctx.route('**/api/v1/admin/orders/pending-count', (r) => json(r, { pending: 0 }));
  await ctx.route(/\/api\/v1\/admin\/categories(\/\d+)?$/, (route) => {
    const req = route.request();
    if (req.method() === 'GET') return json(route, st.categories);
    const body = req.postDataJSON();
    st.sent.push({ kind: 'category', body });
    const id = /\/(\d+)$/.exec(req.url())?.[1];
    if (id) Object.assign(st.categories.find((c) => c.id === Number(id)), body);
    else st.categories.push({ id: 900, slug: 'nueva', ...body });
    return json(route, body, id ? 200 : 201);
  });
  await ctx.route(/\/api\/v1\/admin\/inventory\/products\/[^/]+\/(restock|adjust)$/, (route) => {
    const [, id, kind] = /products\/([^/]+)\/(restock|adjust)$/.exec(route.request().url());
    const body = route.request().postDataJSON();
    st.sent.push({ kind, body });
    const prod = st.products.find((p) => p.id === id);
    prod.stockQuantity += kind === 'restock' ? body.quantity : body.quantityChange;
    st.moves.unshift({ id: st.moves.length + 1, type: kind === 'restock' ? 'RESTOCK' : 'ADJUSTMENT', quantityChange: kind === 'restock' ? body.quantity : body.quantityChange,
      stockAfter: prod.stockQuantity, reason: body.reason, createdAt: new Date().toISOString() });
    return json(route, {}, 201);
  });
  await ctx.route(/\/api\/v1\/admin\/products(\/|\?|$)/, (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const [, id, sub] = url.pathname.split('/admin/products')[1].split('/');
    if (!id && req.method() === 'GET') {
      const q = (url.searchParams.get('q') ?? '').toLowerCase();
      const vis = url.searchParams.get('visibility');
      const content = st.products
        .filter((p) => p.name.toLowerCase().includes(q))
        .filter((p) => vis === 'HIDDEN' ? !p.available : vis === 'VISIBLE' ? p.available : true)
        .filter((p) => !url.searchParams.get('lowStock') || st.level(p) !== 'NORMAL')
        .map(view);
      return json(route, { content, page: 0, size: 20, totalElements: content.length, totalPages: 1 });
    }
    if (!id) {
      const body = req.postDataJSON();
      st.sent.push({ kind: 'create', body });
      const p = { ...st.products[0], ...body, id: '00000000-0000-4000-8000-0000000000aa', imageKey: body.imageUrl, imageUrl: null,
        categoryName: pubCategories.find((c) => c.id === body.categoryId).name, slug: 'nuevo', stockQuantity: 0 };
      st.products.push(p);
      return json(route, view(p), 201);
    }
    const p = st.products.find((x) => x.id === id);
    if (sub === 'promo') {
      const body = req.method() === 'PUT' ? req.postDataJSON() : { buy: null, pay: null, endsAt: null };
      st.sent.push({ kind: 'promo', body });
      Object.assign(p, { promoBuy: body.buy, promoPay: body.pay, promoEndsAt: body.endsAt });
    } else if (sub === 'offer') {
      const body = req.method() === 'PUT' ? req.postDataJSON() : { discountPrice: null, endsAt: null };
      st.sent.push({ kind: 'offer', body });
      Object.assign(p, { discountPrice: body.discountPrice, offerEndsAt: body.endsAt });
    } else if (req.method() === 'PUT') {
      const body = req.postDataJSON();
      st.sent.push({ kind: 'update', body });
      Object.assign(p, body, { imageKey: body.imageUrl, imageUrl: body.imageUrl ? PNG_1PX : null });
    }
    return json(route, view(p));
  });
  await ctx.route(/\/api\/v1\/admin\/delivery\/(zones|districts)(\/\d+)?$/, (route) => {
    const req = route.request();
    const [, kind, rawId] = /delivery\/(zones|districts)(?:\/(\d+))?$/.exec(req.url());
    const list = st[kind];
    if (req.method() === 'GET') return json(route, list);
    const body = req.postDataJSON();
    st.sent.push({ kind, body });
    if (rawId) Object.assign(list.find((x) => x.id === Number(rawId)), body);
    else list.push({ id: 900 + list.length, ...body });
    return json(route, body, rawId ? 200 : 201);
  });
}

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL });
const sizes = [
  { name: '360', width: 360, height: 780 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
];
const small = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('main button, main a, main select, main input:not([type=checkbox]):not([type=file]), main label.pick, main textarea, main label.check, header a, header button')]
      .map((e) => ({ r: e.getBoundingClientRect(), t: (e.textContent.trim() || e.id).slice(0, 20) }))
      .filter(({ r }) => r.width > 0 && (r.height < 43.5 || r.width < 43.5))
      .map(({ r, t }) => `${t} ${Math.round(r.width)}x${Math.round(r.height)}`),
  );
const noOverflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - innerWidth <= 0);
const seen = (locator) => locator.waitFor({ timeout: 4000 }).then(() => true, () => false);

for (const { name, width, height } of sizes) {
  const L = (t) => `${name}px ${t}`;
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && !/401|Unauthorized/.test(m.text()) && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  const st = newState();
  if (SIM) await simulate(ctx, st);
  const shape = async (label) => {
    const s = await small(page);
    check(L(`${label}: objetivos táctiles >= 44px`), s.length === 0, s.join(', '));
    check(L(`${label}: sin scroll horizontal`), await noOverflow(page));
  };

  await page.goto(`${base}/admin/productos`, { waitUntil: 'networkidle' });
  if (!SIM) {
    await page.getByLabel('Usuario').fill('admin');
    await page.getByLabel('Contraseña').fill(password);
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await page.waitForURL('**/admin/pedidos');
    await page.getByRole('link', { name: 'Productos' }).click();
  }
  await page.getByRole('list', { name: 'Productos' }).waitFor();

  // Lista.
  const rows = await page.locator('main .row').count();
  check(L('lista de productos'), rows > 0 && (!SIM || rows === st.products.length), `${rows}`);
  if (SIM) {
    const text = await page.locator('main').innerText();
    check(L('marca agotado, stock bajo y oculto'), ['Agotado', 'Stock bajo: 2', 'Oculto'].every((t) => text.includes(t)));
    await page.selectOption('#low', '1');
    await page.waitForFunction(() => document.querySelectorAll('main .row').length === 2);
    check(L('filtro de stock bajo o agotado'), true);
    await page.selectOption('#low', '');
    await page.fill('#q', st.products[3].name.slice(0, 6));
    check(L('búsqueda por nombre'), await page.waitForFunction(() => document.querySelectorAll('main .row').length === 1).then(() => true, () => false));
    await page.fill('#q', '');
    await page.waitForFunction((n) => document.querySelectorAll('main .row').length === n, st.products.length);
  }
  await shape('lista');
  await page.screenshot({ path: `capturas/admin-productos-${name}-lista.png`, fullPage: true });

  // Editar.
  await page.locator('main .row').nth(1).click();
  await page.waitForURL(/\/admin\/productos\/[0-9a-f-]{36}$/);
  await page.locator('#name').waitFor();
  check(L('editar: formulario con los datos del producto'), (await page.inputValue('#name')).length > 0 && (await page.inputValue('#price')) !== '' && (await page.inputValue('#category')) !== '');
  await shape('editar');
  await page.screenshot({ path: `capturas/admin-productos-${name}-editar.png`, fullPage: true });

  if (SIM) {
    const p = st.products[1];
    await page.fill('#price', '0');
    await page.getByRole('button', { name: 'Guardar cambios' }).click();
    check(L('editar: valida el precio'), await seen(page.getByText('El precio debe ser mayor que cero')));
    await page.fill('#price', '55.5');
    await page.getByRole('button', { name: 'Guardar cambios' }).click();
    check(L('editar: guarda'), await seen(page.getByText('Cambios guardados.')));
    const upd = st.sent.find((s) => s.kind === 'update')?.body;
    check(L('editar: envía los campos del backend y conserva la oferta'), !!upd && upd.price === 55.5 && upd.name === p.name && upd.discountPrice === null && !('stockQuantity' in upd));

    // Stock: reponer y ajustar.
    await page.fill('#rq', '10');
    await page.getByRole('button', { name: 'Reponer' }).click();
    check(L('stock: reponer suma'), await seen(page.locator('.stock-now', { hasText: /^12$/ })));
    await page.fill('#aq', '-2');
    await page.getByRole('button', { name: 'Ajustar' }).click();
    check(L('stock: el ajuste exige motivo'), await seen(page.getByText('Escribe el motivo del ajuste.')));
    await page.fill('#ar', 'Rotura');
    await page.getByRole('button', { name: 'Ajustar' }).click();
    check(L('stock: ajustar resta'), await seen(page.locator('.stock-now', { hasText: /^10$/ })));
    check(L('stock: historial de movimientos'), (await seen(page.locator('.moves li').first())) && (await page.locator('.moves').innerText()).includes('Ajuste') && (await page.locator('.moves').innerText()).includes('Rotura'));
    check(L('stock: cuerpos enviados'), JSON.stringify(st.sent.filter((s) => s.kind === 'restock' || s.kind === 'adjust').map((s) => s.body)) === JSON.stringify([{ quantity: 10, reason: null }, { quantityChange: -2, reason: 'Rotura' }]));

    // Oferta.
    await page.fill('#op', '999');
    await page.getByRole('button', { name: 'Poner oferta' }).click();
    check(L('oferta: debe ser menor que el precio'), await seen(page.getByText('El precio de oferta debe ser menor')));
    await page.fill('#op', '40');
    await page.fill('#oe', '2030-01-15T23:59');
    await page.getByRole('button', { name: 'Poner oferta' }).click();
    check(L('oferta: se fija con la hora de Lima'), (await seen(page.getByRole('button', { name: 'Quitar oferta' }))) && st.sent.find((s) => s.kind === 'offer')?.body.endsAt === '2030-01-15T23:59:00-05:00');
    await page.getByRole('button', { name: 'Quitar oferta' }).click();
    check(L('oferta: se quita'), await seen(page.getByText('Sin oferta.')));
    // Promoción "lleva y paga" (excluye la oferta de precio).
    await page.fill('#pb', '2');
    await page.fill('#pp', '3');
    await page.fill('#pe', '2030-02-01T23:59');
    await page.getByRole('button', { name: 'Poner promoción' }).click();
    check(L('promo: paga debe ser menor que lleva'), await seen(page.getByText('M debe ser menor que N')));
    await page.fill('#pb', '3');
    await page.fill('#pp', '2');
    await page.getByRole('button', { name: 'Poner promoción' }).click();
    check(L('promo: se fija y oculta la oferta de precio'), (await seen(page.getByText('Lleva 3, paga 2'))) && (await page.locator('#op').count()) === 0 && JSON.stringify(st.sent.find((s) => s.kind === 'promo')?.body) === JSON.stringify({ buy: 3, pay: 2, endsAt: '2030-02-01T23:59:00-05:00' }));
    await page.getByRole('button', { name: 'Quitar promoción' }).click();
    check(L('promo: se quita'), await seen(page.locator('#op')));

    // Foto: subir desde el equipo, vista previa grande y guardar.
    const box = await page.locator('.photo-box').boundingBox();
    check(L('foto: espacio amplio para la imagen'), !!box && box.width >= 200 && Math.abs(box.width - box.height) < 2, box ? `${Math.round(box.width)}x${Math.round(box.height)}` : '');
    await page.locator('input[type=file]').setInputFiles({ name: 'nota.txt', mimeType: 'text/plain', buffer: Buffer.from('hola') });
    check(L('foto: rechaza lo que no es imagen'), await seen(page.getByText('La foto debe ser PNG, JPG o WebP.')));
    await page.locator('input[type=file]').setInputFiles({ name: 'foto.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64') });
    check(L('foto: se sube y se ve de inmediato'), (await seen(page.locator('.photo-box img'))) && (await seen(page.getByText('Foto subida.'))) && /multipart\/form-data/.test(st.sent.find((s) => s.kind === 'image')?.body ?? ''));
    check(L('foto: la ruta queda en el formulario'), (await page.inputValue('#image')).startsWith('/api/v1/catalog/images/'));
    await page.getByRole('button', { name: 'Guardar cambios' }).click();
    await seen(page.getByText('Cambios guardados.'));
    check(L('foto: se guarda en el producto'), st.sent.filter((s) => s.kind === 'update').at(-1)?.body.imageUrl?.startsWith('/api/v1/catalog/images/'));
    await page.screenshot({ path: `capturas/admin-productos-${name}-foto.png`, fullPage: true });
    await shape('editar con stock, oferta y foto');

    // La lista muestra la miniatura.
    await page.goto(`${base}/admin/productos`, { waitUntil: 'networkidle' });
    await page.getByRole('list', { name: 'Productos' }).waitFor();
    const mini = await page.locator('.prow .mini').first().boundingBox();
    check(L('lista: miniatura de la foto en cada fila'), (await page.locator('.prow .mini').count()) === st.products.length && (await page.locator('.prow .mini img').count()) === 1 && !!mini && mini.width >= 70, mini ? `${Math.round(mini.width)}px` : '');
    await page.screenshot({ path: `capturas/admin-productos-${name}-lista-foto.png`, fullPage: true });

    // Combo existente: composición y armar más.
    await page.locator('.prow', { hasText: 'Combo de prueba' }).click();
    await page.locator('#bq').waitFor();
    check(L('combo: muestra qué incluye y cuántos se pueden armar'), (await seen(page.locator('.parts li').nth(1))) && (await page.locator('aside').innerText()).includes('se pueden armar 5 más'));
    check(L('combo: sin "Reponer" y con la categoría bloqueada'), (await page.getByRole('button', { name: 'Reponer' }).count()) === 0 && (await page.locator('#category').isDisabled()));
    await page.fill('#bq', '3');
    await page.getByRole('button', { name: 'Armar', exact: true }).click();
    check(L('combo: armar suma al stock'), (await seen(page.locator('.stock-now', { hasText: /^7$/ }))) && st.sent.find((s) => s.kind === 'combo-build')?.body.units === 3);
    await page.fill('#price', '199');
    await page.getByRole('button', { name: 'Guardar cambios' }).click();
    await seen(page.getByText('Cambios guardados.'));
    const cu = st.sent.find((s) => s.kind === 'combo-update')?.body;
    check(L('combo: se guarda por su propia ruta, sin categoría ni SKU'), !!cu && cu.price === 199 && !('categoryId' in cu) && !('sku' in cu));
    await shape('combo');

    // Combo nuevo.
    await page.goto(`${base}/admin/combos/nuevo`, { waitUntil: 'networkidle' });
    await page.locator('#name').waitFor();
    await page.getByRole('button', { name: 'Crear combo' }).click();
    check(L('combo nuevo: valida'), await seen(page.getByText('Escribe el nombre del combo.')));
    await page.fill('#name', 'Combo nuevo');
    await page.fill('#price', '80');
    await page.selectOption('#ip0', { index: 2 });
    await page.getByRole('button', { name: '+ Agregar otro producto' }).click();
    await page.selectOption('#ip1', { index: 2 });
    await page.getByRole('button', { name: 'Crear combo' }).click();
    check(L('combo nuevo: no admite productos repetidos'), await seen(page.getByText('Hay un producto repetido')));
    await page.selectOption('#ip1', { index: 3 });
    await page.fill('#iq1', '2');
    await page.fill('#units', '2');
    await shape('combo nuevo');
    await page.screenshot({ path: `capturas/admin-combo-${name}-nuevo.png`, fullPage: true });
    await page.getByRole('button', { name: 'Crear combo' }).click();
    await page.waitForURL(/\/admin\/productos\/[0-9a-f-]{36}$/);
    const cc = st.sent.find((s) => s.kind === 'combo-create')?.body;
    check(L('combo nuevo: envía composición y unidades'), !!cc && cc.name === 'Combo nuevo' && cc.price === 80 && cc.unitsToBuild === 2 && cc.items.length === 2 && cc.items[1].quantity === 2);

    // Categorías.
    await page.getByRole('link', { name: 'Categorías' }).click();
    await page.getByRole('heading', { name: 'Nueva categoría' }).waitFor();
    const firstCat = st.categories[0];
    await page.fill(`#co${firstCat.id}`, 'x');
    await page.locator('section.panel').first().getByRole('button', { name: 'Guardar' }).click();
    check(L('categorías: valida el orden'), await seen(page.getByText('El orden debe ser un número')));
    await page.fill(`#co${firstCat.id}`, '7');
    await page.locator('section.panel').first().getByRole('button', { name: 'Guardar' }).click();
    await page.waitForFunction(() => !document.querySelector('main .error'));
    check(L('categorías: guarda orden y conserva el resto'), firstCat.displayOrder === 7 && firstCat.name.length > 0 && firstCat.active === true);
    await page.fill('#cn0', 'Categoría de prueba');
    await page.getByRole('button', { name: 'Crear categoría' }).click();
    check(L('categorías: crea una'), await seen(page.getByRole('heading', { name: 'Categoría de prueba' })));
    await shape('categorías');
    await page.screenshot({ path: `capturas/admin-categorias-${name}.png`, fullPage: true });

    // Crear.
    await page.goto(`${base}/admin/productos/nuevo`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Crear producto' }).click();
    check(L('crear: valida el nombre'), await seen(page.getByText('Escribe el nombre del producto.')));
    await page.fill('#name', 'Producto de prueba');
    await page.selectOption('#category', { index: 1 });
    await page.fill('#price', '12.90');
    await page.fill('#image', 'products/prueba.webp');
    await shape('crear');
    await page.screenshot({ path: `capturas/admin-productos-${name}-nuevo.png`, fullPage: true });
    await page.getByRole('button', { name: 'Crear producto' }).click();
    await page.waitForURL(/\/admin\/productos\/[0-9a-f-]{36}$/);
    const created = st.sent.find((s) => s.kind === 'create')?.body;
    check(L('crear: envía el producto y abre su ficha'), !!created && created.name === 'Producto de prueba' && created.price === 12.9 && created.imageUrl === 'products/prueba.webp' && created.available === true && created.minStock === 0);
  }

  // Zonas.
  await page.getByRole('link', { name: 'Zonas' }).click();
  await page.waitForURL('**/admin/zonas');
  await page.getByRole('heading', { name: 'Nueva zona' }).waitFor();
  const zoneCount = await page.locator('main section.panel').count();
  check(L('zonas con sus distritos'), zoneCount >= 1 && (!SIM || (await page.locator('.districts li').count()) === st.districts.length));
  await shape('zonas');
  await page.screenshot({ path: `capturas/admin-zonas-${name}.png`, fullPage: true });
  if (SIM) {
    const first = st.districts.find((d) => d.zoneId === 1);
    await page.getByRole('button', { name: `Desactivar ${first.name}` }).click();
    check(L('zonas: desactivar un distrito'), (await seen(page.getByRole('button', { name: `Activar ${first.name}` }))) && first.active === false);
    await page.fill('#zf1', 'abc');
    await page.locator('section.panel').first().getByRole('button', { name: 'Guardar zona' }).click();
    check(L('zonas: valida la tarifa'), await seen(page.getByText('La tarifa debe ser un importe')));
    await page.fill('#zf1', '7.5');
    await page.locator('section.panel').first().getByRole('button', { name: 'Guardar zona' }).click();
    await page.waitForFunction(() => document.querySelector('#zf1')?.value === '7.5' && !document.querySelector('main .error'));
    check(L('zonas: cambia la tarifa'), st.zones[0].fee === 7.5);
    await page.fill('#zd1', 'Distrito de prueba');
    await page.locator('section.panel').first().getByRole('button', { name: 'Agregar' }).click();
    check(L('zonas: agrega un distrito'), await seen(page.locator('.districts li', { hasText: 'Distrito de prueba' })));
    await page.fill('#zn0', 'Zona de prueba');
    await page.fill('#zf0', '15');
    await page.getByRole('button', { name: 'Crear zona' }).click();
    check(L('zonas: crea una zona'), await seen(page.getByRole('heading', { name: 'Zona de prueba' })));
  }

  check(L('consola limpia'), errors.length === 0, errors.join(' | '));
  await ctx.close();
}

await browser.close();
console.log(out.join('\n'));
console.log(SIM ? '\nMODO SIMULADO: sin clave de admin, solo se comprobó la interfaz (no el backend).' : '\nContra la API real, solo lectura.');
const fails = out.filter((l) => l.startsWith('FALLA')).length;
console.log(`\n${out.length - fails}/${out.length} comprobaciones en verde`);
process.exit(fails ? 1 : 0);
