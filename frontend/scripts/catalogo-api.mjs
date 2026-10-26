// Verifica el catálogo contra la API REAL (backend en :8080 vía proxy). Solo lectura.
// Uso: node scripts/catalogo-api.mjs   (con el backend y `ng serve` encendidos)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const base = process.env.BASE_URL ?? 'http://localhost:4200';
mkdirSync('capturas', { recursive: true });

// Lo que dice la API directamente, para comparar con lo que pinta la pantalla.
const api = await (await fetch(`${base}/api/v1/catalog/products?size=50`)).json();
const cats = await (await fetch(`${base}/api/v1/catalog/categories`)).json();

const browser = await chromium.launch();
const out = [];
const check = (label, ok, extra = '') => out.push(`${ok ? 'OK ' : 'FALLA'} ${label}${extra ? ' · ' + extra : ''}`);

for (const { name, width, height } of [
  { name: '360', width: 360, height: 780 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
]) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  const requests = [];
  page.on('request', (r) => r.url().includes('/api/') && requests.push(r.url().replace(base, '')));

  await page.goto(`${base}/catalogo`, { waitUntil: 'networkidle' });
  if (api.totalElements > 0) {
    await page.waitForSelector('app-product-card');
    await page.waitForTimeout(1200);
    const names = await page.locator('app-product-card .name').allTextContents();
    check(`${name}px pinta los ${api.totalElements} productos de la API`, names.length === api.totalElements, `${names.length}`);
    check(
      `${name}px nombres iguales a la API`,
      JSON.stringify(names.map((n) => n.trim())) === JSON.stringify(api.content.map((p) => p.name)),
    );
    const chips = (await page.locator('.chip').allTextContents()).map((t) => t.trim());
    check(`${name}px chips = Todo + categorías de la API + Ofertas`, chips.length === cats.length + 2, chips.join(' | '));
    check(`${name}px sin rótulo de datos de ejemplo`, (await page.locator('.dev').count()) === 0);
    const oferta = api.content.find((p) => p.onOffer);
    if (oferta) {
      check(
        `${name}px muestra la etiqueta de oferta real`,
        await page.locator('app-product-card', { hasText: oferta.name }).locator('.badge-promo').count().then((n) => n === 1),
      );
    }
    await page.screenshot({ path: `capturas/api-${name}-catalogo.png`, fullPage: true });
  } else {
    await page.waitForSelector('app-catalogo-soon');
    check(`${name}px catálogo vacío muestra "muy pronto"`, true);
    await page.screenshot({ path: `capturas/api-${name}-vacio.png` });
  }
  check(`${name}px usa /api/v1/catalog/*`, requests.some((u) => u.startsWith('/api/v1/catalog/products')) && requests.some((u) => u.startsWith('/api/v1/catalog/categories')), requests.join(' '));
  check(`${name}px errores de consola`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}
await browser.close();
console.log(out.join('\n'));
