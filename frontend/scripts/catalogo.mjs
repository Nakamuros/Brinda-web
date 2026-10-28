// Verificación del catálogo (solo desarrollo). Uso: node scripts/catalogo.mjs
// Capturas a 360/768/1440 en frontend/capturas/ (ignorada por git) y comprobación de interacciones.
import { chromium } from 'playwright';
import { passAgeGate } from './age.mjs';
import { mkdirSync } from 'node:fs';

const base = process.env.BASE_URL ?? 'http://localhost:4200';
const sizes = [
  { name: '360', width: 360, height: 780 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
];

mkdirSync('capturas', { recursive: true });
const browser = await chromium.launch();
// Estas pruebas usan el catálogo de ejemplo (bandera de desarrollo), no la base de datos.
const newCtx = async (opts) => {
  const c = await browser.newContext(opts);
  await c.addInitScript(() => localStorage.setItem('brinda.mock', '1'));
  return c;
};
const checks = [];
const check = (label, ok, extra = '') => checks.push(`${ok ? 'OK ' : 'FALLA'} ${label}${extra ? ' · ' + extra : ''}`);

for (const { name, width, height } of sizes) {
  const context = await newCtx({ viewport: { width, height }, deviceScaleFactor: 1 });
  await passAgeGate(context);
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto(`${base}/catalogo`, { waitUntil: 'networkidle' });
  await page.waitForSelector('app-product-card');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `capturas/catalogo-${name}-fold.png` });

  // Recorre la página para activar las entradas por scroll y captura completa.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `capturas/catalogo-${name}-full.png`, fullPage: true });

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(`${name}px sin scroll horizontal`, overflow <= 0, `${overflow}px`);

  const small = await page.evaluate(() =>
    [...document.querySelectorAll('main button, main input, main a')]
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.width > 0 && (r.height < 43.5 || r.width < 43.5)).length,
  );
  check(`${name}px objetivos táctiles >= 44px`, small === 0, `${small} menores`);

  // Búsqueda sin tildes, filtro y estado vacío.
  await page.fill('#q', 'maní');
  await page.waitForTimeout(200);
  const manii = await page.locator('app-product-card').count();
  check(`${name}px búsqueda "maní"`, manii === 1, `${manii} resultado(s)`);
  await page.fill('#q', 'zzzz');
  await page.waitForTimeout(200);
  check(`${name}px estado vacío`, (await page.locator('app-state-panel').count()) === 1);
  if (name === '360') await page.screenshot({ path: 'capturas/catalogo-360-vacio.png' });
  await page.click('app-state-panel button');
  await page.waitForTimeout(200);

  await page.click('.chip:has-text("Vinos")');
  await page.waitForTimeout(300);
  const vinos = await page.locator('app-product-card').count();
  check(`${name}px filtro Vinos`, vinos === 5, `${vinos}`);
  await page.click('.chip-offers');
  await page.waitForTimeout(300);
  const ofertas = await page.locator('app-product-card').count();
  check(`${name}px Vinos + Ofertas`, ofertas === 1, `${ofertas}`);
  check(`${name}px URL refleja filtros`, page.url().includes('categoria=vinos') && page.url().includes('ofertas=1'), page.url().split('/catalogo')[1]);
  await page.click('.link:has-text("Limpiar filtros")');
  await page.waitForTimeout(300);

  // Detalle: abrir, foco dentro, Escape cierra y devuelve el foco.
  await page.locator('app-product-card button').first().focus();
  await page.keyboard.press('Enter');
  await page.waitForSelector('dialog[open]');
  await page.waitForTimeout(800);
  await page.screenshot({ path: `capturas/catalogo-${name}-detalle.png` });
  const inside = await page.evaluate(() => !!document.activeElement?.closest('dialog'));
  check(`${name}px foco dentro del detalle`, inside);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  check(`${name}px Escape cierra`, (await page.locator('dialog[open]').count()) === 0);
  const back = await page.evaluate(() => document.activeElement?.closest('app-product-card') !== null);
  check(`${name}px foco vuelve a la tarjeta`, back);

  // Combo: muestra "Incluye".
  await page.click('.chip:has-text("Combos")');
  await page.locator('app-product-card').first().click();
  await page.waitForSelector('dialog[open]');
  check(`${name}px combo muestra "Incluye"`, (await page.locator('dialog .inc').count()) === 1);
  await page.keyboard.press('Escape');

  check(`${name}px errores de consola`, errors.length === 0, errors.join(' | '));
  await context.close();
}

// Movimiento reducido: el contenido es visible sin animar.
{
  const context = await newCtx({ viewport: { width: 360, height: 780 }, reducedMotion: 'reduce' });
  await passAgeGate(context);
  const page = await context.newPage();
  await page.goto(`${base}/catalogo`, { waitUntil: 'networkidle' });
  await page.waitForSelector('app-product-card');
  const op = await page.evaluate(() => getComputedStyle(document.querySelector('app-product-card').parentElement).opacity);
  check('reduced-motion: tarjetas visibles', op === '1', `opacity ${op}`);
  await context.close();
}

await browser.close();
console.log(checks.join('\n'));
