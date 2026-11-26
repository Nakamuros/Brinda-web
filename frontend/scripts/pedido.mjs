// Verifica el formulario de /pedido contra la API REAL (backend :8080 vía proxy). Solo lectura: no pulsa
// "Finalizar compra" (el envío del pedido se prueba en pedido-real.mjs).
// Uso: node scripts/pedido.mjs   (con backend y `ng serve` encendidos)
import { chromium } from 'playwright';
import { passAgeGate } from './age.mjs';
import { mkdirSync } from 'node:fs';

const base = process.env.BASE_URL ?? 'http://localhost:4200';
mkdirSync('capturas', { recursive: true });
const districts = await (await fetch(`${base}/api/v1/delivery/districts`)).json();
const zones = new Set(districts.map((d) => d.zoneName));
const pick = (name) => districts.find((d) => d.name === name);
const near = pick('Barranco');
const far = pick('Callao');

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL });
const minFee = Math.min(...districts.map((d) => d.fee));
/** Contraste WCAG del texto de un elemento contra el fondo del aviso (acepta rgb() y color(srgb …)). */
const contrast = (el) => {
  const parse = (c) => {
    const n = c.match(/[\d.]+/g).map(Number);
    return c.startsWith('color(') ? n.slice(0, 3) : n.slice(0, 3).map((v) => v / 255);
  };
  const lum = (c) =>
    parse(c)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
      .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  const bg = getComputedStyle(el.closest('.notice')).backgroundColor;
  const [a, b] = [lum(getComputedStyle(el).color), lum(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
};
const out = [];
const check = (label, ok, extra = '') => out.push(`${ok ? 'OK ' : 'FALLA'} ${label}${extra ? ' · ' + extra : ''}`);
const money = (t) => Math.round(parseFloat(t.replace(/ /g, ' ').replace(/[^\d.]/g, '')) * 100);

for (const { name, width, height } of [
  { name: '360', width: 360, height: 780 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
]) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  await passAgeGate(ctx);
  const page = await ctx.newPage();
  const errors = [];
  const posts = [];
  let popups = 0;
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('request', (r) => r.method() !== 'GET' && r.url().includes('/api/') && posts.push(`${r.method()} ${r.url()}`));
  ctx.on('page', () => popups++);
  const L = (t) => `${name}px ${t}`;
  const until = async (fn) => {
    for (let i = 0; i < 30; i++) {
      if (await fn().catch(() => false)) return true;
      await page.waitForTimeout(80);
    }
    return false;
  };

  // Carrito real: 2 piscos y 1 whisky (oferta) desde el catálogo
  await page.goto(`${base}/catalogo`, { waitUntil: 'networkidle' });
  await page.waitForSelector('app-product-card');
  const pisco = page.locator('app-product-card', { hasText: 'Pisco Quebranta' });
  await pisco.getByRole('button', { name: /^Agregar/ }).click();
  await until(async () => (await pisco.locator('app-qty-stepper').count()) === 1);
  await pisco.getByRole('button', { name: /Aumentar cantidad/ }).click();
  await page.locator('app-product-card', { hasText: 'Whisky Etiqueta Negra' }).getByRole('button', { name: /^Agregar/ }).click();

  // Desde el carrito: "Continuar con el pedido"
  await page.locator('a.cart').click();
  await page.waitForSelector('.row');
  const cartTotal = money(await page.locator('.sum-total dd').textContent());
  await page.getByRole('link', { name: 'Continuar con el pedido' }).click();
  await page.waitForURL('**/pedido');
  await page.waitForSelector('form');
  await page.waitForTimeout(1200);
  check(L('carrito → /pedido con el botón burdeos'), page.url().endsWith('/pedido'));

  // Distritos reales en un dropdown agrupado por zona
  const options = await page.locator('#districtId option:not([disabled])').count();
  check(L('dropdown con los distritos de la API'), options === districts.length, `${options}/${districts.length}`);
  check(L('agrupado por zona'), (await page.locator('#districtId optgroup').count()) === zones.size, `${zones.size} zonas`);

  // Aviso de delivery: visible sin scroll, con la tarifa mínima de la API y contraste >= 4.5:1
  const notice = page.locator('app-delivery-notice .notice');
  const box = await notice.boundingBox();
  check(L('aviso de delivery visible sin scroll'), !!box && box.y >= 0 && box.y + box.height <= height, box ? `${Math.round(box.y + box.height)}/${height}` : 'no está');
  check(L('aviso: "Delivery desde" la tarifa mínima de la API'), money(await notice.locator('.title').innerText()) === Math.round(minFee * 100), `S/ ${minFee}`);
  check(L('aviso: el monto final se confirma por WhatsApp'), (await notice.innerText()).includes('El monto final te lo confirmamos por WhatsApp antes de pagar.'));
  for (const sel of ['.title', '.text']) {
    const ratio = await notice.locator(sel).evaluate(contrast);
    check(L(`contraste del aviso (${sel}) >= 4.5`), ratio >= 4.5, ratio.toFixed(2));
  }
  check(L('el total se llama "Total estimado"'), (await page.locator('.sum-total dt').innerText()).includes('Total estimado'));

  // Tipo de documento: DNI por defecto; CE y pasaporte en mayúsculas con su propio largo
  check(L('documento: DNI por defecto con 3 opciones'), (await page.inputValue('#documentType')) === 'DNI' && (await page.locator('#documentType option').count()) === 3);
  await page.selectOption('#documentType', 'PASSPORT');
  await page.fill('#documentNumber', 'ab-12');
  check(L('pasaporte: letras y números en mayúsculas'), (await page.inputValue('#documentNumber')) === 'AB12');
  await page.locator('#documentNumber').blur();
  await until(async () => (await page.locator('#documentNumber-msg[role="alert"]').count()) === 1);
  check(L('pasaporte: error de 6 a 12'), (await page.locator('#documentNumber-msg').innerText()).includes('entre 6 y 12'));
  await page.fill('#documentNumber', 'ab1234');
  check(L('pasaporte de 6 válido'), (await page.locator('#documentNumber[aria-invalid="false"]').count()) === 1);
  await page.selectOption('#documentType', 'CE');
  await until(async () => (await page.locator('#documentNumber-msg[role="alert"]').count()) === 1);
  check(L('CE: el mismo número ahora es corto'), (await page.locator('#documentNumber-msg').innerText()).includes('entre 8 y 12'));
  await page.selectOption('#documentType', 'DNI');

  // Pago: Yape, Plin y Transferencia; promociones sin marcar
  check(L('3 formas de pago'), (await page.locator('.choice').allInnerTexts()).map((t) => t.trim().toUpperCase()).join(',') === 'YAPE,PLIN,TRANSFERENCIA');
  check(L('casilla de promociones sin marcar'), !(await page.locator('#marketing').isChecked()));

  // Total: sin distrito = carrito; con distrito suma la tarifa
  const t0 = money(await page.locator('.sum-total dd').textContent());
  check(L('sin distrito el total = carrito'), t0 === cartTotal, `${t0 / 100}`);
  check(L('pide elegir distrito'), (await page.locator('.sum').innerText()).includes('Elige tu distrito'));
  await page.selectOption('#districtId', { label: near.name });
  await until(async () => money(await page.locator('.sum-total dd').textContent()) === cartTotal + near.fee * 100);
  check(L(`${near.name} suma S/ ${near.fee}`), money(await page.locator('.sum-total dd').textContent()) === cartTotal + near.fee * 100);
  await page.selectOption('#districtId', { label: far.name });
  await until(async () => money(await page.locator('.sum-total dd').textContent()) === cartTotal + far.fee * 100);
  check(L(`${far.name} suma S/ ${far.fee}`), money(await page.locator('.sum-total dd').textContent()) === cartTotal + far.fee * 100);

  // Validaciones al tocar los campos
  await page.screenshot({ path: `capturas/pedido-${name}-vacio.png`, fullPage: true });
  await page.fill('#documentNumber', '12ab34');
  check(L('DNI solo dígitos'), (await page.inputValue('#documentNumber')) === '1234');
  await page.locator('#documentNumber').blur();
  await page.fill('#phone', '98765');
  await page.locator('#phone').blur();
  await page.locator('#firstName').focus();
  await page.locator('#firstName').blur();
  await page.locator('#address').focus();
  await page.locator('#address').blur();
  for (const id of ['#adult-yes', 'input[formControlName="termsAccepted"]', 'input[formControlName="privacyAccepted"]']) {
    await page.locator(id).focus();
    await page.locator(id).blur();
  }
  await until(async () => (await page.locator('#documentNumber-msg[role="alert"]').count()) === 1);
  check(L('error de DNI'), (await page.locator('#documentNumber-msg').innerText()).includes('8 dígitos'));
  check(L('error de celular'), (await page.locator('#phone-msg').innerText()).includes('9 dígitos'));
  check(L('error de nombres y dirección'), (await page.locator('#firstName-msg').count()) === 1 && (await page.locator('#address-msg').count()) === 1);
  check(L('errores de las 3 casillas'), (await page.locator('fieldset.group:has(#adult-yes) .msg').count()) === 3);
  check(L('promociones no da error (es opcional)'), (await page.locator('fieldset.optional .msg').count()) === 0);
  check(L('campos inválidos marcados aria-invalid'), (await page.locator('#documentNumber[aria-invalid="true"]').count()) === 1);
  await page.screenshot({ path: `capturas/pedido-${name}-errores.png`, fullPage: true });

  // Formulario completo
  await page.fill('#firstName', 'Ana María');
  await page.fill('#lastName', "Pérez O'Brien");
  await page.fill('#phone', '987654321');
  await page.fill('#documentNumber', '12345678');
  await page.fill('#address', 'Av. Larco 123');
  await page.fill('#reference', 'Frente al parque');
  await page.locator('.choice', { hasText: 'Yape' }).click();
  for (const id of ['#adult-yes', 'input[formControlName="termsAccepted"]', 'input[formControlName="privacyAccepted"]']) {
    await page.locator(id).check();
  }
  await until(async () => (await page.locator('[role="alert"]').count()) === 0);
  check(L('formulario completo sin errores'), (await page.locator('[role="alert"]').count()) === 0);
  check(L('el formulario es válido (sin marcar promociones)'), (await page.locator('form.ng-valid').count()) === 1 && !(await page.locator('#marketing').isChecked()));
  await page.screenshot({ path: `capturas/pedido-${name}-lleno.png`, fullPage: true });

  // DNI y datos personales no se guardan en el navegador
  const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }));
  check(L('DNI y celular no se guardan en el navegador'), !stored.includes('12345678') && !stored.includes('987654321'));

  // Tamaños táctiles (controles, etiquetas de casilla y opciones de pago) y desborde
  const small = await page.evaluate(() =>
    [...document.querySelectorAll('main button, main a, main select, main input:not([type=checkbox]):not([type=radio]), main label.check, main label.choice')]
      .map((e) => e.getBoundingClientRect())
      .filter((r) => r.width > 0 && (r.height < 43.5 || r.width < 43.5)).length,
  );
  check(L('objetivos táctiles >= 44px'), small === 0, `${small} menores`);
  check(L('sin scroll horizontal'), (await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0);
  check(L('errores de consola'), errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// Carrito vacío: no hay formulario
{
  const ctx = await browser.newContext({ viewport: { width: 360, height: 780 } });
  await passAgeGate(ctx);
  const page = await ctx.newPage();
  await page.goto(`${base}/pedido`, { waitUntil: 'networkidle' });
  await page.waitForSelector('app-state-panel');
  check('carrito vacío en /pedido: sin formulario', (await page.locator('form').count()) === 0);
  await page.screenshot({ path: 'capturas/pedido-360-sin-carrito.png' });
  await ctx.close();
}
await browser.close();
console.log(out.join('\n'));
