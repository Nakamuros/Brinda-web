// Verifica el pedido real (checkout) contra la API REAL local a 360/768/1440.
// Uso: node scripts/pedido-real.mjs   (backend en perfil local + `ng serve`; PW_CHANNEL=chrome si falta Chromium)
// OJO: crea 3 pedidos de prueba por corrida y agota el límite de 5 pedidos/min de la IP local:
// espera un minuto antes de repetirla. Lo único simulado (interceptando la respuesta) es
// "WhatsApp sin configurar" (768 px) y "sin zonas de reparto"; el resto son respuestas reales.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { passAgeGate } from './age.mjs';

const base = process.env.BASE_URL ?? 'http://localhost:4200';
const ORDERS = `${base}/api/v1/orders`;
mkdirSync('capturas', { recursive: true });

const districts = await (await fetch(`${base}/api/v1/delivery/districts`)).json();
const products = (await (await fetch(`${base}/api/v1/catalog/products?size=50`)).json()).content;
const near = districts.find((d) => d.name === 'Barranco') ?? districts[0];
const cheap = [...products].filter((p) => p.inStock).sort((a, b) => a.finalPrice - b.finalPrice)[0];
const pricey = [...products].sort((a, b) => b.finalPrice - a.finalPrice)[0];
const CLIENT = { dni: '12345678', phone: '987654321', first: 'Ana María', address: 'Av. Larco 123' };

const sizes = [
  { name: '360', width: 360, height: 780 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
];
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL });
const out = [];
const check = (label, ok, extra = '') =>
  out.push(`${ok ? 'OK ' : 'FALLA'} ${label}${extra ? ' · ' + extra : ''}`);
const money = (t) => Math.round(parseFloat(t.replace(/[^\d.]/g, '')) * 100);
const cents = (n) => Math.round(n * 100);
const line = (p, quantity) => ({
  productId: p.id,
  slug: p.slug,
  name: p.name,
  categorySlug: p.categorySlug,
  finalPrice: p.finalPrice,
  price: p.price,
  quantity,
  available: true,
});

/** Contexto con el control de edad resuelto y, si se pide, un carrito ya guardado. */
async function open(size, cart) {
  const ctx = await browser.newContext({ viewport: { width: size.width, height: size.height } });
  await passAgeGate(ctx);
  if (cart) {
    await ctx.addInitScript((c) => {
      if (!sessionStorage.getItem('seeded')) {
        localStorage.setItem('brinda.cart.v1', c);
        sessionStorage.setItem('seeded', '1');
      }
    }, JSON.stringify(cart));
  }
  const page = await ctx.newPage();
  const errors = [];
  let popups = 0;
  // Un 4xx esperado deja en la consola de Chrome "Failed to load resource": no es un error de la app.
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource.*(422|429)/.test(m.text())) {
      errors.push(m.text());
    }
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  ctx.on('page', () => popups++);
  return { ctx, page, errors, popups: () => popups };
}

const until = async (page, fn) => {
  for (let i = 0; i < 40; i++) {
    if (await fn().catch(() => false)) return true;
    await page.waitForTimeout(80);
  }
  return false;
};

async function fill(page) {
  await page.waitForSelector('#districtId option:not([disabled])', { state: 'attached' });
  await page.fill('#firstName', CLIENT.first);
  await page.fill('#lastName', "Pérez O'Brien");
  await page.fill('#phone', CLIENT.phone);
  await page.fill('#dni', CLIENT.dni);
  await page.selectOption('#districtId', { label: near.name });
  await page.fill('#address', CLIENT.address);
  await page.locator('.choice', { hasText: 'Yape' }).click();
  for (const id of ['adultConfirmed', 'termsAccepted', 'privacyAccepted']) {
    await page.locator(`input[formControlName="${id}"]`).check();
  }
}

/** Pulsa "Finalizar compra" y devuelve la respuesta de POST /orders. */
async function finish(page) {
  const [res] = await Promise.all([
    page.waitForResponse((r) => r.url() === ORDERS && r.request().method() === 'POST'),
    page.getByRole('button', { name: 'Finalizar compra' }).click(),
  ]);
  return res;
}

const smallTargets = (page) =>
  page.evaluate(() =>
    [
      ...document.querySelectorAll(
        'main button, main a, main select, main input:not([type=checkbox]):not([type=radio]), main label.check, main label.choice',
      ),
    ]
      .map((e) => ({ r: e.getBoundingClientRect(), t: e.textContent.trim().slice(0, 24) }))
      .filter(({ r }) => r.width > 0 && (r.height < 43.5 || r.width < 43.5))
      .map(({ r, t }) => `${t} ${Math.round(r.width)}x${Math.round(r.height)}`),
  );
const noOverflow = (page) =>
  page.evaluate(() => document.documentElement.scrollWidth - innerWidth <= 0);
const stored = (page) =>
  page.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }));
const noPersonalData = (s) => !Object.values(CLIENT).some((v) => s.includes(v));

// ───────── 1) Pedido válido (un pedido real por ancho) ─────────
for (const size of sizes) {
  const L = (t) => `${size.name}px ${t}`;
  const { ctx, page, errors, popups } = await open(size);
  const fakeNoWhatsapp = size.name === '768';
  if (fakeNoWhatsapp) {
    // El pedido se crea de verdad; solo se quita el enlace para ver el estado "sin WhatsApp".
    await page.route(ORDERS, async (route) => {
      const response = await route.fetch();
      const body = await response.json();
      await route.fulfill({ response, json: { ...body, whatsappUrl: null } });
    });
  }

  // Carrito real desde el catálogo: 2 unidades del producto más barato.
  await page.goto(`${base}/catalogo`, { waitUntil: 'networkidle' });
  const card = page.locator('app-product-card', { hasText: cheap.name });
  await card.getByRole('button', { name: /^Agregar/ }).click();
  await until(page, async () => (await card.locator('app-qty-stepper').count()) === 1);
  await card.getByRole('button', { name: /Aumentar cantidad/ }).click();
  await page.locator('a.cart').click();
  await page.getByRole('link', { name: 'Continuar con el pedido' }).click();
  await page.waitForURL('**/pedido');
  await page.waitForSelector('form');
  await page.waitForTimeout(900);

  // Formulario vacío: valida todo y no envía nada.
  const posts = [];
  page.on('request', (r) => r.method() === 'POST' && posts.push(r.url()));
  await page.getByRole('button', { name: 'Finalizar compra' }).click();
  await until(page, async () => (await page.locator('main [role="alert"]').count()) >= 10);
  check(L('vacío: muestra todos los errores'), (await page.locator('main [role="alert"]').count()) === 10, `${await page.locator('main [role="alert"]').count()} avisos`);
  check(L('vacío: no envía el pedido'), posts.length === 0);
  check(L('vacío: foco en el primer campo con error'), (await page.evaluate(() => document.activeElement?.id)) === 'firstName');
  await page.screenshot({ path: `capturas/pedido-real-${size.name}-errores.png`, fullPage: true });

  const docs = await page.locator('a.doc').evaluateAll((as) => as.map((a) => `${a.getAttribute('href')} ${a.target}`));
  check(L('casillas enlazan a /terminos y /privacidad (otra pestaña)'), docs.join() === '/terminos _blank,/privacidad _blank', docs.join());

  await fill(page);
  await until(page, async () => (await page.locator('main [role="alert"]').count()) === 0);
  let small = await smallTargets(page);
  check(L('/pedido: objetivos táctiles >= 44px'), small.length === 0, small.join(', '));

  const res = await finish(page);
  const sent = res.request().postDataJSON();
  const order = await res.json();
  check(L('POST /orders responde 201'), res.status() === 201, String(res.status()));
  check(L('envía solo productId y cantidad (sin precios)'), JSON.stringify(sent.items) === JSON.stringify([{ productId: cheap.id, quantity: 2 }]) && !/price|total|fee/i.test(JSON.stringify(sent)));

  await page.waitForURL(`**/pedido/${order.code}`);
  await page.waitForSelector('.summary');
  await page.waitForTimeout(900);
  check(L('pantalla /pedido/:codigo con el código corto'), /^[A-Z]{2}\d{2,4}$/.test(order.code) && (await page.locator('h1').innerText()).trim() === order.code, order.code);
  check(L('total y delivery = los del servidor'), money(await page.locator('.sum-total dd').innerText()) === cents(order.total) && cents(order.deliveryFee) === cents(near.fee) && cents(order.total) === cents(cheap.finalPrice * 2 + near.fee), `S/ ${order.total}`);
  check(L('resumen con las líneas del pedido'), (await page.locator('.items').innerText()).includes(`2 × ${cheap.name}`));
  check(L('aviso de 20 minutos'), (await page.locator('.deadline').innerText()).includes('20 minutos'));
  if (fakeNoWhatsapp) {
    check(L('sin WhatsApp: no hay botón'), (await page.locator('a.send').count()) === 0);
    check(L('sin WhatsApp: aviso honesto con el código'), (await page.locator('.unavailable').innerText()).includes('aún no está disponible') && (await page.locator('.unavailable').innerText()).includes(order.code));
  } else {
    const href = await page.locator('a.send').getAttribute('href');
    check(L('"Enviar por WhatsApp" usa el whatsappUrl del servidor'), !!order.whatsappUrl && href === order.whatsappUrl && href.startsWith('https://wa.me/'));
    check(L('WhatsApp se abre solo al pulsar, en otra pestaña'), popups() === 0 && (await page.locator('a.send').getAttribute('target')) === '_blank');
  }
  const s = await stored(page);
  check(L('carrito vacío tras crear el pedido'), (await page.evaluate(() => localStorage.getItem('brinda.cart.v1'))) === '[]');
  check(L('DNI y datos personales fuera del navegador'), noPersonalData(s) && !s.includes('wa.me'));
  small = await smallTargets(page);
  check(L('/pedido/:codigo: objetivos táctiles >= 44px'), small.length === 0, small.join(', '));
  check(L('sin scroll horizontal'), await noOverflow(page));
  await page.screenshot({ path: `capturas/pedido-real-${size.name}-creado.png`, fullPage: true });

  await page.reload({ waitUntil: 'networkidle' });
  check(L('al recargar queda solo el código, sin detalle ni WhatsApp'), (await page.locator('h1').innerText()).trim() === order.code && (await page.locator('.summary, a.send').count()) === 0);
  check(L('lo guardado es solo el código'), /^\{"code":"[A-Z]{2}\d{2,4}","at":\d+\}$/.test(await page.evaluate(() => localStorage.getItem('brinda.order.v1'))));
  await page.goto(`${base}/carrito`, { waitUntil: 'networkidle' });
  check(L('/carrito recuerda el último pedido'), (await page.locator('.recent a').innerText()).trim() === order.code && (await smallTargets(page)).length === 0);
  check(L('consola limpia'), errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// ───────── 2) Stock insuficiente (respuesta real del servidor) ─────────
{
  const size = sizes[0];
  const { ctx, page, errors } = await open(size, [line(pricey, 50)]);
  await page.goto(`${base}/pedido`, { waitUntil: 'networkidle' });
  await fill(page);
  const res = await finish(page);
  await page.waitForSelector('.alert');
  const alert = await page.locator('.alert').innerText();
  check('stock: el servidor rechaza el pedido (422 regla de negocio; el 409 se trata igual)', res.status() === 422, String(res.status()));
  check('stock: mensaje claro con el producto', alert.includes('Sin stock suficiente') && alert.includes(pricey.name), alert);
  check('stock: enlace para revisar el carrito', (await page.locator('.alert a').getAttribute('href')) === '/carrito');
  check('stock: sigue en /pedido con el carrito y los datos', page.url().endsWith('/pedido') && (await page.evaluate(() => localStorage.getItem('brinda.cart.v1'))).includes(pricey.id) && (await page.inputValue('#dni')) === CLIENT.dni);
  const small = await smallTargets(page);
  check('stock: objetivos táctiles >= 44px', small.length === 0, small.join(', '));
  check('stock: consola limpia', errors.length === 0, errors.join(' | '));
  await page.screenshot({ path: 'capturas/pedido-real-360-stock.png', fullPage: true });
  await ctx.close();
}

// ───────── 3) 429 real: se agota el límite de la IP y se intenta en los tres anchos ─────────
for (let i = 0; i < 8; i++) {
  const r = await fetch(ORDERS, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  if (r.status === 429) break;
}
for (const size of sizes) {
  const L = (t) => `${size.name}px ${t}`;
  const { ctx, page, errors } = await open(size, [line(cheap, 1)]);
  await page.goto(`${base}/pedido`, { waitUntil: 'networkidle' });
  await fill(page);
  const res = await finish(page);
  await page.waitForSelector('.alert');
  check(L('429: el servidor limita la IP'), res.status() === 429, String(res.status()));
  check(L('429: mensaje claro'), (await page.locator('.alert').innerText()).includes('Espera un minuto'));
  check(L('429: conserva carrito y datos, botón activo'), (await page.evaluate(() => localStorage.getItem('brinda.cart.v1'))).includes(cheap.id) && (await page.inputValue('#dni')) === CLIENT.dni && (await page.getByRole('button', { name: 'Finalizar compra' }).isEnabled()));
  check(L('429: DNI fuera del navegador'), noPersonalData(await stored(page)));
  check(L('429: sin scroll horizontal'), await noOverflow(page));
  check(L('429: consola limpia'), errors.length === 0, errors.join(' | '));
  await page.screenshot({ path: `capturas/pedido-real-${size.name}-429.png`, fullPage: true });
  await ctx.close();
}

// ───────── 4) Sin zonas de reparto (distritos vacíos, simulado) y páginas legales ─────────
for (const size of sizes) {
  const L = (t) => `${size.name}px ${t}`;
  const { ctx, page, errors } = await open(size, [line(cheap, 1)]);
  await page.route('**/api/v1/delivery/districts', (r) => r.fulfill({ json: [] }));
  await page.goto(`${base}/pedido`, { waitUntil: 'networkidle' });
  await page.waitForSelector('app-state-panel');
  check(L('sin zonas: estado claro'), (await page.locator('main').innerText()).includes('Aún no tenemos zonas de reparto'));
  check(L('sin zonas: sin formulario ni botón de finalizar'), (await page.locator('form').count()) === 0 && (await page.getByRole('button', { name: 'Finalizar compra' }).count()) === 0);
  check(L('sin zonas: el carrito se conserva'), (await page.evaluate(() => localStorage.getItem('brinda.cart.v1'))).includes(cheap.id));
  const small = await smallTargets(page);
  check(L('sin zonas: objetivos táctiles >= 44px'), small.length === 0, small.join(', '));
  check(L('sin zonas: sin scroll horizontal'), await noOverflow(page));
  await page.screenshot({ path: `capturas/pedido-real-${size.name}-sin-zonas.png`, fullPage: true });
  check(L('sin zonas: consola limpia'), errors.length === 0, errors.join(' | '));
  await ctx.close();

  // /terminos y /privacidad: "Próximamente", sin texto legal y sin control de edad.
  const c2 = await browser.newContext({ viewport: { width: size.width, height: size.height } });
  const p2 = await c2.newPage();
  for (const [path, title] of [['/terminos', 'Términos y condiciones'], ['/privacidad', 'Política de privacidad']]) {
    await p2.goto(base + path, { waitUntil: 'networkidle' });
    const text = (await p2.locator('main').innerText()).replace(/\s+/g, ' ').trim();
    check(L(`${path}: "Próximamente" sin texto legal`), /^.{0,40}Próximamente Este documento aún no está publicado\. Volver al inicio$/i.test(text) && text.toLowerCase().startsWith(title.toLowerCase()), text);
    check(L(`${path}: sin control de edad`), !(await p2.locator('[role=dialog]').isVisible()));
    check(L(`${path}: sin scroll horizontal`), await noOverflow(p2));
  }
  await p2.screenshot({ path: `capturas/pedido-real-${size.name}-privacidad.png` });
  await c2.close();
}

await browser.close();
console.log(out.join('\n'));
const fails = out.filter((l) => l.startsWith('FALLA')).length;
console.log(`\n${out.length - fails}/${out.length} comprobaciones en verde`);
process.exit(fails ? 1 : 0);
