// Verifica /pedido contra la API REAL (backend :8080 vía proxy). Solo lectura: el botón no crea pedidos.
// Uso: node scripts/pedido.mjs   (con backend y `ng serve` encendidos)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const base = process.env.BASE_URL ?? 'http://localhost:4200';
mkdirSync('capturas', { recursive: true });
const districts = await (await fetch(`${base}/api/v1/delivery/districts`)).json();
const zones = new Set(districts.map((d) => d.zoneName));
const pick = (name) => districts.find((d) => d.name === name);
const near = pick('Barranco');
const far = pick('Callao');

const browser = await chromium.launch();
const out = [];
const check = (label, ok, extra = '') => out.push(`${ok ? 'OK ' : 'FALLA'} ${label}${extra ? ' · ' + extra : ''}`);
const money = (t) => Math.round(parseFloat(t.replace(/ /g, ' ').replace(/[^\d.]/g, '')) * 100);

for (const { name, width, height } of [
  { name: '360', width: 360, height: 780 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
]) {
  const ctx = await browser.newContext({ viewport: { width, height } });
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
  await page.fill('#dni', '12ab34');
  check(L('DNI solo dígitos'), (await page.inputValue('#dni')) === '1234');
  await page.locator('#dni').blur();
  await page.fill('#phone', '98765');
  await page.locator('#phone').blur();
  await page.locator('#firstName').focus();
  await page.locator('#firstName').blur();
  await page.locator('#address').focus();
  await page.locator('#address').blur();
  for (const id of ['adultConfirmed', 'termsAccepted', 'privacyAccepted']) {
    await page.locator(`input[formControlName="${id}"]`).focus();
    await page.locator(`input[formControlName="${id}"]`).blur();
  }
  await until(async () => (await page.locator('#dni-msg[role="alert"]').count()) === 1);
  check(L('error de DNI'), (await page.locator('#dni-msg').innerText()).includes('8 dígitos'));
  check(L('error de celular'), (await page.locator('#phone-msg').innerText()).includes('9 dígitos'));
  check(L('error de nombres y dirección'), (await page.locator('#firstName-msg').count()) === 1 && (await page.locator('#address-msg').count()) === 1);
  check(L('errores de las 3 casillas'), (await page.locator('.group:last-of-type .msg').count()) === 3);
  check(L('campos inválidos marcados aria-invalid'), (await page.locator('#dni[aria-invalid="true"]').count()) === 1);
  await page.screenshot({ path: `capturas/pedido-${name}-errores.png`, fullPage: true });

  // Formulario completo
  await page.fill('#firstName', 'Ana María');
  await page.fill('#lastName', "Pérez O'Brien");
  await page.fill('#phone', '987654321');
  await page.fill('#dni', '12345678');
  await page.fill('#address', 'Av. Larco 123');
  await page.fill('#reference', 'Frente al parque');
  await page.locator('.choice', { hasText: 'Yape' }).click();
  for (const id of ['adultConfirmed', 'termsAccepted', 'privacyAccepted']) {
    await page.locator(`input[formControlName="${id}"]`).check();
  }
  await until(async () => (await page.locator('[role="alert"]').count()) === 0);
  check(L('formulario completo sin errores'), (await page.locator('[role="alert"]').count()) === 0);
  check(L('el formulario es válido'), (await page.locator('form.ng-valid').count()) === 1);
  await page.screenshot({ path: `capturas/pedido-${name}-lleno.png`, fullPage: true });

  // DNI y datos personales no se guardan en el navegador
  const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }));
  check(L('DNI y celular no se guardan en el navegador'), !stored.includes('12345678') && !stored.includes('987654321'));

  // "Finalizar compra": no hace nada
  const urlBefore = page.url();
  await page.getByRole('button', { name: 'Finalizar compra' }).click();
  await page.waitForTimeout(900);
  check(L('"Finalizar compra" no navega ni abre pestañas'), page.url() === urlBefore && popups === 0);
  check(L('"Finalizar compra" no hace ninguna petición POST'), posts.length === 0, posts.join(' '));
  check(L('sigue en el formulario'), (await page.locator('form').count()) === 1);

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
  const page = await ctx.newPage();
  await page.goto(`${base}/pedido`, { waitUntil: 'networkidle' });
  await page.waitForSelector('app-state-panel');
  check('carrito vacío en /pedido: sin formulario', (await page.locator('form').count()) === 0);
  await page.screenshot({ path: 'capturas/pedido-360-sin-carrito.png' });
  await ctx.close();
}
await browser.close();
console.log(out.join('\n'));
