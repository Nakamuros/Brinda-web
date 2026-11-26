// Verifica la sección Pedidos del panel /admin contra la API real a 360/768/1440.
// La clave del admin se toma de la variable de entorno ADMIN_PASSWORD o de backend/.env
// (POSTMAN_ADMIN_NEW_PASSWORD) y NUNCA se imprime.
//  - Con clave: API real. Crea 2 pedidos de prueba: uno (Yape, DNI, sin promociones) se anula y el otro
//    (transferencia, pasaporte, acepta promociones) se confirma con su delivery cobrado, se corrige el
//    delivery y luego se anula (el stock vuelve).
//  - Sin clave: modo SIMULADO. La sesión y /admin/orders se interceptan con datos de ejemplo; solo
//    comprueba la interfaz, no el backend.
// Requiere backend (8080) y `ng serve` (4200). Uso: node scripts/admin-pedidos.mjs
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';

const base = process.env.BASE_URL ?? 'http://localhost:4200';
const env = readFileSync(new URL('../../backend/.env', import.meta.url), 'utf8');
const password = process.env.ADMIN_PASSWORD || /^POSTMAN_ADMIN_NEW_PASSWORD=(.*)$/m.exec(env)?.[1]?.trim();
const SIM = !password;
mkdirSync('capturas', { recursive: true });
const out = [];
const check = (l, ok, x = '') => out.push(`${ok ? 'OK ' : 'FALLA'} ${l}${x ? ' · ' + x : ''}`);

const districts = await (await fetch(`${base}/api/v1/delivery/districts`)).json();
const products = (await (await fetch(`${base}/api/v1/catalog/products?size=50`)).json()).content;
const cheap = products.filter((p) => p.inStock).sort((a, b) => a.finalPrice - b.finalPrice)[0];
const codes = SIM ? ['SM11', 'SM22'] : [];
/** Pedido 1: Yape + DNI, sin promociones. Pedido 2: transferencia + pasaporte, con promociones. */
const KIND = [
  { lastName: 'Panel Uno', documentType: 'DNI', documentNumber: '12345678', paymentMethod: 'YAPE', marketingConsent: false },
  { lastName: 'Panel Dos', documentType: 'PASSPORT', documentNumber: 'PW123456', paymentMethod: 'TRANSFER', marketingConsent: true },
];
for (const k of SIM ? [] : KIND) {
  const r = await fetch(`${base}/api/v1/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ productId: cheap.id, quantity: 1 }],
      firstName: 'Cliente', phone: '987654321', ...k,
      address: 'Calle Prueba 123', reference: 'Puerta azul', districtId: districts[0].id,
      adultConfirmed: true, termsAccepted: true, privacyAccepted: true,
    }),
  });
  if (r.status !== 201) {
    console.log('No se pudo crear el pedido de prueba:', r.status, '(¿límite de 5/min? espera un minuto)');
    process.exit(2);
  }
  codes.push((await r.json()).code);
}
const [toCancel, toConfirm] = codes;

/** Modo simulado: sesión de admin y pedidos en memoria, con la forma de las respuestas reales. */
const simOrders = codes.map((code, i) => ({
  id: `00000000-0000-4000-8000-00000000000${i + 1}`, code, status: 'PENDING', channel: 'WEB',
  firstName: 'Cliente', lastName: KIND[i].lastName, phone: '987654321',
  documentType: KIND[i].documentType, documentNumber: KIND[i].documentNumber,
  address: 'Calle Prueba 123', reference: 'Puerta azul', districtName: districts[0].name, zoneName: districts[0].zoneName,
  subtotal: cheap.finalPrice, deliveryFee: districts[0].fee, total: cheap.finalPrice + districts[0].fee,
  finalDeliveryFee: null, finalTotal: null,
  paymentMethod: KIND[i].paymentMethod, marketingConsent: KIND[i].marketingConsent,
  marketingConsentAt: KIND[i].marketingConsent ? new Date().toISOString() : null,
  createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 20 * 60000).toISOString(),
  confirmedAt: null, cancelReason: null,
  items: [{ productId: cheap.id, name: cheap.name, quantity: 1, listPrice: cheap.price, unitPrice: cheap.finalPrice, promoDiscount: null, subtotal: cheap.finalPrice, promoType: null }],
}));
async function simulate(ctx) {
  const json = (route, body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
  await ctx.route('**/api/v1/auth/me', (r) => json(r, { id: 'u1', username: 'admin', email: 'admin@example.com', role: 'ROLE_ADMIN', mustChangePassword: false }));
  await ctx.route('**/api/v1/auth/logout', (r) => r.fulfill({ status: 204 }));
  await ctx.route(/\/api\/v1\/admin\/orders/, (route) => {
    const url = new URL(route.request().url());
    const [, id, action, kind] = url.pathname.split('/admin/orders')[1].split('/');
    if (id === 'pending-count') return json(route, { pending: simOrders.filter((o) => o.status === 'PENDING').length });
    if (!id) {
      const status = url.searchParams.get('status');
      const marketing = url.searchParams.get('marketing');
      const content = simOrders
        .filter((o) => (!status || o.status === status) && (marketing === null || String(o.marketingConsent) === marketing))
        .map((o) => ({ ...o, customerName: `${o.firstName} ${o.lastName}`, total: o.finalTotal ?? o.total }));
      return json(route, { content, page: 0, size: 20, totalElements: content.length, totalPages: 1 });
    }
    const o = simOrders.find((x) => x.id === id);
    // Igual que el servidor: delivery cobrado obligatorio (S/ 0 solo con zeroFeeConfirmed) y total final.
    const charge = () => {
      const { deliveryFee, zeroFeeConfirmed } = route.request().postDataJSON() ?? {};
      if (typeof deliveryFee !== 'number' || deliveryFee < 0 || (deliveryFee === 0 && !zeroFeeConfirmed)) return false;
      return Object.assign(o, { finalDeliveryFee: deliveryFee, finalTotal: Math.round((o.subtotal + deliveryFee) * 100) / 100 });
    };
    if (action === 'confirm' || action === 'delivery-fee') {
      if (!charge()) return json(route, { status: 400, code: 'VALIDATION_ERROR', message: 'Datos inválidos' }, 400);
      if (action === 'confirm') Object.assign(o, { status: 'CONFIRMED', confirmedAt: new Date().toISOString() });
    }
    if (action === 'cancel') Object.assign(o, { status: 'CANCELLED', cancelReason: route.request().postDataJSON().reason });
    if (action === 'copy') return json(route, { text: `${o.code} (${kind})\n${o.firstName} ${o.lastName}\n${o.address}` });
    return json(route, o);
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
    [...document.querySelectorAll('main button, main a, main select, main input:not([type=checkbox]), main label.check, main textarea, header a, header button')]
      .map((e) => ({ r: e.getBoundingClientRect(), t: e.textContent.trim().slice(0, 20) }))
      .filter(({ r }) => r.width > 0 && (r.height < 43.5 || r.width < 43.5))
      .map(({ r, t }) => `${t} ${Math.round(r.width)}x${Math.round(r.height)}`),
  );
const noOverflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - innerWidth <= 0);

for (const { name, width, height } of sizes) {
  const L = (t) => `${name}px ${t}`;
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  // El 401 de /auth/me sin sesión es esperado (el guard comprueba la sesión).
  page.on('console', (m) => m.type() === 'error' && !/401|Unauthorized/.test(m.text()) && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));

  if (SIM) {
    simOrders.find((o) => o.code === toConfirm).status = 'PENDING';
    await simulate(ctx);
  }
  await page.goto(`${base}/admin/pedidos`, { waitUntil: 'networkidle' });
  if (!SIM) {
    check(L('sin sesión → /admin/login'), page.url().endsWith('/admin/login'));
    await page.getByLabel('Usuario').fill('admin');
    await page.getByLabel('Contraseña').fill(password);
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await page.waitForURL('**/admin/pedidos');
  }
  await page.getByRole('list', { name: 'Pedidos' }).waitFor();

  // Lista: pendientes por defecto, sin datos personales más allá del nombre.
  const body = await page.locator('main').innerText();
  const mine = name === '360' ? toCancel : toConfirm;
  check(L('lista de pendientes con el código del pedido'), body.includes(mine), mine);
  check(L('la lista NO muestra documento, celular ni dirección'), !['12345678', 'PW123456', '987654321', 'Calle Prueba 123'].some((p) => body.includes(p)));
  if (name === '360') {
    // Filtro de promociones: "Aceptaron" deja el pedido 2 y quita el 1; "No aceptaron", al revés.
    const rowsText = async (v) => {
      await page.selectOption('#mk', v);
      await page.waitForTimeout(600);
      return page.locator('main .rows').innerText().catch(() => '');
    };
    const yes = await rowsText('yes');
    check(L('filtro "Aceptaron promociones"'), yes.includes(toConfirm) && !yes.includes(toCancel) && yes.includes('Acepta promociones'));
    const no = await rowsText('no');
    check(L('filtro "No aceptaron promociones"'), no.includes(toCancel) && !no.includes(toConfirm));
    await rowsText('');
  }
  check(L('contador de pendientes en el menú'), /^\d+$/.test((await page.locator('header .pill').innerText()).trim()));
  await page.fill('#code', mine.toLowerCase());
  await page.waitForFunction(() => document.querySelectorAll('main .row').length === 1);
  check(L('filtro por código'), (await page.locator('main .row .code').innerText()).trim() === mine);
  let s = await small(page);
  check(L('lista: objetivos táctiles >= 44px'), s.length === 0, s.join(', '));
  check(L('lista: sin scroll horizontal'), await noOverflow(page));
  await page.screenshot({ path: `capturas/admin-pedidos-${name}-lista.png`, fullPage: true });

  // Detalle.
  await page.locator('main .row').click();
  await page.waitForURL(/\/admin\/pedidos\/[0-9a-f-]{36}$/);
  await page.getByRole('heading', { name: mine }).waitFor();
  const detail = await page.locator('main').innerText();
  const [docLabel, docNumber] = mine === toCancel ? ['DNI', '12345678'] : ['Pasaporte', 'PW123456'];
  check(L(`detalle: cliente, ${docLabel} y número, dirección y productos`), [docLabel, docNumber, '987654321', 'Calle Prueba 123', 'Puerta azul', cheap.name].every((p) => detail.toLowerCase().includes(p.toLowerCase())));
  check(L('detalle: sin "NaN"'), !detail.includes('NaN'));
  check(L('detalle: promociones'), detail.includes(mine === toCancel ? 'No aceptó' : 'Aceptó el'));
  check(L('detalle: "Total estimado" = producto + delivery base'), detail.includes('Total estimado') && detail.includes((cheap.finalPrice + districts[0].fee).toFixed(2)));
  // Delivery cobrado: obligatorio, vacío, con la tarifa base de ayuda; "Confirmar pago" desactivado hasta que sea válido.
  check(L('delivery cobrado vacío y con la tarifa base de ayuda'), (await page.inputValue('#fee')) === '' && (await page.locator('#fee-hint').innerText()).includes(districts[0].fee.toFixed(2)));
  check(L('"Confirmar pago" desactivado sin delivery'), await page.getByRole('button', { name: 'Confirmar pago' }).isDisabled());
  await page.getByRole('button', { name: 'Copiar datos de entrega' }).click();
  await page.locator('.copied .pre').waitFor();
  check(L('texto de entrega listo para copiar'), (await page.locator('.copied .pre').innerText()).includes('Calle Prueba 123'));
  s = await small(page);
  check(L('detalle: objetivos táctiles >= 44px'), s.length === 0, s.join(', '));
  check(L('detalle: sin scroll horizontal'), await noOverflow(page));
  await page.screenshot({ path: `capturas/admin-pedidos-${name}-detalle.png`, fullPage: true });

  if (name === '768') {
    // S/ 0 solo con confirmación explícita; letras = monto inválido. No confirma nada.
    await page.fill('#fee', 'abc');
    check(L('monto inválido: error y botón desactivado'), (await page.getByText('con hasta 2 decimales').count()) === 1 && (await page.getByRole('button', { name: 'Confirmar pago' }).isDisabled()));
    await page.fill('#fee', '0');
    check(L('S/ 0 sin casilla: botón desactivado'), await page.getByRole('button', { name: 'Confirmar pago' }).isDisabled());
    await page.locator('#free').check();
    const enabled = await page.waitForFunction(() => [...document.querySelectorAll('button')].some((b) => b.textContent.trim() === 'Confirmar pago' && !b.disabled), null, { timeout: 3000 }).then(() => true, () => false);
    check(L('S/ 0 con "El delivery fue gratis": botón activo'), enabled);
    const fs = await small(page);
    check(L('campo de delivery: objetivos >= 44px'), fs.length === 0, fs.join(', '));
    await page.fill('#fee', '');
  }
  if (name === '360') {
    // Anular un pendiente: exige motivo (y no pide el delivery).
    await page.getByRole('button', { name: 'Anular', exact: true }).click();
    await page.getByRole('button', { name: 'Anular pedido' }).click();
    await page.getByText('Escribe el motivo de la anulación.').waitFor();
    check(L('anular exige motivo'), true);
    await page.fill('#reason', 'Pedido de prueba');
    await page.getByRole('button', { name: 'Anular pedido' }).click();
    await page.getByText('Motivo: Pedido de prueba').waitFor();
    check(L('pedido anulado con su motivo'), (await page.locator('.head .badge').first().innerText()).trim() === 'Anulado');
    check(L('un anulado ya no ofrece acciones'), (await page.getByRole('button', { name: /Confirmar pago|^Anular$/ }).count()) === 0);
  }
  if (name === '1440') {
    // Confirmar con el delivery cobrado (descuenta stock), corregirlo y luego anular (devuelve el stock).
    const final = (fee) => (Math.round((cheap.finalPrice + fee) * 100) / 100).toFixed(2);
    await page.fill('#fee', '12,5');
    check(L('total final en vivo'), (await page.locator('#fee-total').innerText()).includes(final(12.5)));
    await page.getByRole('button', { name: 'Confirmar pago' }).click();
    check(L('confirmar pide un segundo paso'), await page.getByRole('button', { name: 'Sí, confirmar' }).waitFor({ timeout: 3000 }).then(() => true, () => false));
    const ask = (await page.locator('.confirm .ask').innerText()).replace(/\s+/g, ' ');
    check(L('"¿Recibiste S/ X por Transferencia?"'), ask.includes(`¿Recibiste S/ ${final(12.5)} por Transferencia?`), ask);
    await page.getByRole('button', { name: 'Sí, confirmar' }).click();
    await page.getByText('el stock ya se descontó.').waitFor();
    check(L('pedido confirmado'), (await page.locator('.head .badge').first().innerText()).trim() === 'Confirmado');
    const totals = await page.locator('.totals').innerText();
    check(L('delivery cobrado y total cobrado'), totals.includes('Delivery cobrado') && totals.includes('12.50') && totals.includes('Total cobrado') && totals.includes(final(12.5)));
    await page.getByRole('button', { name: 'Copiar datos de boleta' }).click();
    await page.locator('.copied .pre', { hasText: 'Productos:' }).waitFor();
    if (!SIM) {
      const receipt = await page.locator('.copied .pre').innerText();
      check(L('boleta: pasaporte, total final y pago'), receipt.includes('Pasaporte: PW123456') && receipt.includes(`Total: S/ ${final(12.5)}`) && receipt.includes('Pago: Transferencia'));
    }
    await page.getByRole('button', { name: 'Corregir delivery' }).click();
    await page.fill('#fee', '15');
    await page.getByRole('button', { name: 'Guardar delivery' }).click();
    await page.getByRole('button', { name: 'Corregir delivery' }).waitFor();
    check(L('delivery corregido: total recalculado'), (await page.locator('.totals .total').innerText()).includes(final(15)));
    await page.screenshot({ path: `capturas/admin-pedidos-${name}-confirmado.png`, fullPage: true });
    await page.getByRole('button', { name: 'Anular', exact: true }).click();
    check(L('avisa que el stock vuelve al anular un confirmado'), await page.getByText('el stock vuelve al inventario').waitFor({ timeout: 3000 }).then(() => true, () => false));
    await page.fill('#reason', 'Pedido de prueba');
    await page.getByRole('button', { name: 'Anular pedido' }).click();
    await page.getByText('Motivo: Pedido de prueba').waitFor();
    check(L('confirmado → anulado'), (await page.locator('.head .badge').first().innerText()).trim() === 'Anulado');
  }

  await page.getByRole('button', { name: 'Salir' }).click();
  await page.waitForURL('**/admin/login');
  check(L('consola limpia'), errors.length === 0, errors.join(' | '));
  await ctx.close();
}

await browser.close();
console.log(out.join('\n'));
console.log(SIM ? '\nMODO SIMULADO: sin clave de admin, solo se comprobó la interfaz (no el backend).' : '\nContra la API real.');
const fails = out.filter((l) => l.startsWith('FALLA')).length;
console.log(`\n${out.length - fails}/${out.length} comprobaciones en verde`);
process.exit(fails ? 1 : 0);
