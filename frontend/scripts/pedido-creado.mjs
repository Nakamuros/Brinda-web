// Verifica /pedido/:codigo (paso pendiente de WhatsApp) y la sección "Cómo pedir" de la landing.
// NO crea pedidos: el POST /orders se intercepta con una respuesta simulada (el mensaje real lo prueba Newman).
// Uso: node scripts/pedido-creado.mjs   (con backend y `ng serve` encendidos: el catálogo y los distritos son reales)
import { chromium } from 'playwright';
import { passAgeGate } from './age.mjs';
import { mkdirSync } from 'node:fs';

const base = process.env.BASE_URL ?? 'http://localhost:4200';
mkdirSync('capturas', { recursive: true });
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL });
const out = [];
const check = (label, ok, extra = '') => out.push(`${ok ? 'OK ' : 'FALLA'} ${label}${extra ? ' · ' + extra : ''}`);

const WA =
  'https://wa.me/51900000000?text=*Pedido%20BRINDA%20PW12*%0A2%20%C3%97%20Producto%20de%20prueba%0ADelivery%20base%3A%20S%2F%206.00%0ATotal%20estimado%3A%20S%2F%20102.00%0APago%3A%20Transferencia';
// Cuenta de prueba (simulada): no son datos reales.
const TRANSFER = { bank: 'Banco de prueba', account: '000-0000000-0-00', cci: '00000000000000000000', holder: 'Titular de prueba' };
const created = (expiresAt) => ({
  code: 'PW12', status: 'PENDING', subtotal: 96, deliveryFee: 6, total: 102, expiresAt,
  items: [{ name: 'Producto de prueba', quantity: 2, unitPrice: 48, subtotal: 96 }],
  payment: { method: 'TRANSFER', number: null, transfer: TRANSFER, amount: 102 }, whatsappUrl: WA,
});

/** Contraste WCAG entre dos colores `rgb(...)`. */
const contrastFn = () => {
  const lum = (c) => {
    const [r, g, b] = c.match(/[\d.]+/g).slice(0, 3).map((v) => {
      const s = Number(v) / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const btn = document.querySelector('a.btn-whatsapp');
  const cs = getComputedStyle(btn);
  const [a, b] = [lum(cs.backgroundColor), lum(cs.color)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
};

const sizes = [
  { name: '360', width: 360, height: 780 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
];

// A · "Cómo pedir"
for (const { name, width, height } of sizes) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  await passAgeGate(ctx);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  const L = (t) => `${name}px Cómo pedir: ${t}`;
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  const how = page.locator('#como-pedir');
  await how.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const titles = await how.locator('.step h3').allInnerTexts();
  check(L('4 pasos'), titles.length === 4, titles.join(' / '));
  const text = await how.innerText();
  check(L('paso de WhatsApp explícito'), text.includes('Sin ese mensaje, tu pedido no avanza.'));
  check(L('plazo de 20 minutos, sin "reserva"'), text.includes('se mantiene 20 minutos') && !/reserv/i.test(text));
  const clipped = await how.evaluate((s) => [...s.querySelectorAll('.step, .step h3, .step p')].filter((e) => e.scrollWidth > e.clientWidth + 1).length);
  check(L('sin desbordes de texto'), clipped === 0, `${clipped}`);
  const cols = await how.evaluate((s) => new Set([...s.querySelectorAll('.step')].map((e) => Math.round(e.getBoundingClientRect().left))).size);
  check(L('columnas'), cols === (width >= 1024 ? 4 : width >= 768 ? 2 : 1), `${cols}`);
  check(L('sin scroll horizontal'), (await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0);
  check(L('errores de consola'), errors.length === 0, errors.join(' | '));
  await how.screenshot({ path: `capturas/como-pedir-${name}.png` });
  await ctx.close();
}

// B · /pedido/:codigo
for (const { name, width, height } of sizes) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  await passAgeGate(ctx);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  const L = (t) => `${name}px /pedido/:codigo: ${t}`;
  let sent = null;
  await page.route('**/api/v1/orders', (r) =>
    r.request().method() === 'POST'
      ? ((sent = r.request().postDataJSON()), r.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(created(new Date(Date.now() + 20 * 60000).toISOString())) }))
      : r.continue(),
  );

  // Carrito real → checkout → "Finalizar compra" (respuesta simulada)
  await page.goto(`${base}/catalogo`, { waitUntil: 'networkidle' });
  await page.waitForSelector('app-product-card');
  const card = page.locator('app-product-card', { hasText: 'Pisco Quebranta' });
  await card.getByRole('button', { name: /^Agregar/ }).click();
  await card.locator('app-qty-stepper').waitFor();
  await page.locator('a.cart').click();
  await page.getByRole('link', { name: 'Continuar con el pedido' }).click();
  await page.waitForURL('**/pedido');
  await page.waitForSelector('form');
  await page.fill('#firstName', 'Ana');
  await page.fill('#lastName', 'Prueba');
  await page.fill('#phone', '987654321');
  await page.selectOption('#documentType', 'CE');
  await page.fill('#documentNumber', 'x1234567');
  await page.selectOption('#districtId', { index: 1 });
  await page.fill('#address', 'Av. Prueba 123');
  await page.locator('.choice', { hasText: 'Transferencia' }).click();
  for (const id of ['#adult-yes', 'input[formControlName="termsAccepted"]', 'input[formControlName="privacyAccepted"]']) await page.locator(id).check();
  await page.locator('#marketing').check();
  await page.getByRole('button', { name: 'Finalizar compra' }).click();
  await page.waitForURL('**/pedido/PW12');
  await page.waitForSelector('.pending');
  await page.waitForTimeout(900);
  check(L('envía tipo de documento, CE en mayúsculas, transferencia y promociones'),
    sent?.documentType === 'CE' && sent?.documentNumber === 'X1234567' && sent?.paymentMethod === 'TRANSFER' && sent?.marketingConsent === true && !('dni' in sent),
    JSON.stringify({ documentType: sent?.documentType, paymentMethod: sent?.paymentMethod, marketingConsent: sent?.marketingConsent }));
  const pay = async () => (await page.locator('.pay').innerText()).replace(/\s+/g, ' ');
  const payText = await pay();
  check(L('datos de la cuenta: banco, cuenta, CCI y titular'), ['Transferencia', TRANSFER.bank, TRANSFER.account, TRANSFER.cci, TRANSFER.holder].every((t) => payText.includes(t)), payText);
  check(L('resumen: "Total estimado"'), (await page.locator('.sum-total dt').innerText()).includes('Total estimado'));
  check(L('aviso de delivery con la tarifa mínima de la API'), /Delivery desde S\/\s?\d/.test(await page.locator('app-delivery-notice .title').innerText()));

  const pend = await page.evaluate(() => {
    const p = document.querySelector('.pending');
    const btn = p.querySelector('a.btn-whatsapp');
    const r = btn.getBoundingClientRect();
    const bar = [...document.querySelectorAll('app-order-bar *')].map((e) => e.getBoundingClientRect()).filter((x) => x.height > 0 && x.top < innerHeight && x.bottom > 0);
    const covered = bar.some((x) => x.top < r.bottom && x.bottom > r.top);
    return { text: p.innerText, btnBottom: r.bottom, h: r.height, w: r.width, vh: innerHeight, covered, first: document.querySelector('.next')?.firstElementChild === p };
  });
  check(L('"Falta un paso" con el código'), pend.text.toLowerCase().includes('falta un paso') && pend.text.includes('PW12'));
  check(L('el paso pendiente es lo primero del bloque'), pend.first);
  check(L('botón visible sin scroll'), pend.btnBottom <= pend.vh && !pend.covered, `fondo ${Math.round(pend.btnBottom)} de ${pend.vh}`);
  check(L('botón >= 44px'), pend.h >= 44 && pend.w >= 44);
  const ratio = await page.evaluate(contrastFn);
  check(L('contraste texto/fondo del botón >= 4.5:1'), ratio >= 4.5, ratio.toFixed(2));
  check(L('enlace wa.me del servidor'), (await page.locator('a.btn-whatsapp').getAttribute('href')) === WA);
  const anim = await page.evaluate(() => [getComputedStyle(document.querySelector('.pending')).animationName, getComputedStyle(document.querySelector('a.btn-whatsapp'), '::after').animationName]);
  check(L('con movimiento: animación activa'), anim[0] !== 'none' && anim[1] !== 'none', anim.join(', '));
  check(L('sin scroll horizontal'), (await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0);
  const small = await page.evaluate(() =>
    [...document.querySelectorAll('main a, main button')].map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0 && (r.height < 43.5 || r.width < 43.5)).length,
  );
  check(L('objetivos táctiles >= 44px'), small === 0, `${small} menores`);
  await page.screenshot({ path: `capturas/pedido-creado-${name}.png` });

  // Recargar: el enlace (sin datos personales) se recupera con el código
  const stored = await page.evaluate(() => localStorage.getItem('brinda.order.v1'));
  check(L('se guarda código + enlace + datos de pago, sin datos personales'), stored.includes('wa.me') && stored.includes(TRANSFER.cci) && !/Ana|987654321|X1234567|x1234567|Prueba 123/.test(stored));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.pending');
  check(L('tras recargar sigue el botón de WhatsApp'), (await page.locator('a.btn-whatsapp').getAttribute('href')) === WA);
  check(L('tras recargar no hay detalle del pedido'), (await page.locator('.summary').count()) === 0);
  check(L('tras recargar siguen los datos de la cuenta'), (await pay()).includes(TRANSFER.cci));
  check(L('tras recargar sigue el aviso de delivery'), (await page.locator('app-delivery-notice').count()) === 1);
  const smallReload = await page.evaluate(() =>
    [...document.querySelectorAll('main a, main button')].map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0 && (r.height < 43.5 || r.width < 43.5)).length,
  );
  check(L('tras recargar: objetivos >= 44px y sin scroll horizontal'), smallReload === 0 && (await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0);
  await page.screenshot({ path: `capturas/pedido-creado-${name}-recarga.png` });
  check(L('errores de consola'), errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// Transferencia sin cuenta configurada (guardada sin `transfer`): aviso de WhatsApp tras recargar
{
  const ctx = await browser.newContext({ viewport: { width: 360, height: 780 } });
  await passAgeGate(ctx);
  await ctx.addInitScript((wa) => localStorage.setItem('brinda.order.v1', JSON.stringify({ code: 'PW12', at: Date.now(), whatsappUrl: wa, payment: { method: 'TRANSFER', number: null, transfer: null, amount: 102 } })), WA);
  const page = await ctx.newPage();
  await page.goto(`${base}/pedido/PW12`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.pay');
  check('360px transferencia sin cuenta: "Te enviaremos los datos de la cuenta por WhatsApp"', (await page.locator('.pay').innerText()).includes('Te enviaremos los datos de la cuenta por WhatsApp'));
  await page.screenshot({ path: 'capturas/pedido-creado-360-transferencia-sin-cuenta.png', fullPage: true });
  await ctx.close();
}

// Reduced motion
{
  const ctx = await browser.newContext({ viewport: { width: 360, height: 780 }, reducedMotion: 'reduce' });
  await passAgeGate(ctx);
  await ctx.addInitScript((wa) => localStorage.setItem('brinda.order.v1', JSON.stringify({ code: 'PW12', at: Date.now(), whatsappUrl: wa })), WA);
  const page = await ctx.newPage();
  await page.goto(`${base}/pedido/PW12`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.pending');
  const anim = await page.evaluate(() => [getComputedStyle(document.querySelector('.pending')).animationName, getComputedStyle(document.querySelector('a.btn-whatsapp'), '::after').animationName]);
  check('360px reduced-motion: sin animaciones', anim.every((a) => a === 'none'), anim.join(', '));
  await ctx.close();
}
await browser.close();
console.log(out.join('\n'));
