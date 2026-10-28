// Verificación del carrito (solo desarrollo). Uso: node scripts/carrito.mjs
// Flujo completo a 360/768/1440 con contexto limpio; capturas en frontend/capturas/.
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
const out = [];
const check = (label, ok, extra = '') => out.push(`${ok ? 'OK ' : 'FALLA'} ${label}${extra ? ' · ' + extra : ''}`);
const money = (t) => Math.round(parseFloat(t.replace(/[^\d.]/g, '')) * 100);

for (const { name, width, height } of sizes) {
  const ctx = await newCtx({ viewport: { width, height }, deviceScaleFactor: 1 });
  await passAgeGate(ctx);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  const label = (t) => `${name}px ${t}`;
  const cardOf = (text) => page.locator('app-product-card', { hasText: text });
  const navLabel = () => page.locator('a.cart').getAttribute('aria-label');
  // Angular (zoneless) actualiza el DOM después del clic: se sondea en vez de leer de inmediato.
  const until = async (fn) => {
    for (let i = 0; i < 25; i++) {
      if (await fn().catch(() => false)) return true;
      await page.waitForTimeout(80);
    }
    return false;
  };

  await page.goto(`${base}/catalogo`, { waitUntil: 'networkidle' });
  await page.waitForSelector('app-product-card');
  check(label('carrito vacío en el menú'), (await navLabel()) === 'Carrito, 0 productos');
  check(label('sin contador cuando está vacío'), (await page.locator('.cart-count').count()) === 0);

  // Agregar desde la tarjeta: "Agregar" -> selector de cantidad
  const pisco = cardOf('Combo pisco sour');
  await pisco.getByRole('button', { name: /^Agregar/ }).click();
  check(label('tarjeta muestra selector tras agregar'), await until(async () => (await pisco.locator('app-qty-stepper').count()) === 1));
  check(
    label('contador del menú = 1'),
    (await page.locator('.cart-count').textContent())?.trim() === '1' && (await navLabel()) === 'Carrito, 1 producto',
  );
  await pisco.getByRole('button', { name: /Aumentar cantidad/ }).click();
  check(
    label('+ sube a 2'),
    await until(async () => (await pisco.locator('.qty').textContent())?.trim() === '2' && (await navLabel()) === 'Carrito, 2 productos'),
  );
  await page.screenshot({ path: `capturas/carrito-${name}-catalogo.png` });

  // Agotado: sin botón de agregar
  const more = page.getByRole('button', { name: /Ver más/ });
  while (await more.count()) {
    await more.click();
    await page.waitForTimeout(150);
  }
  const agotado = cardOf('Vino tinto gran reserva');
  await until(async () => (await agotado.count()) === 1);
  check(
    label('agotado sin acción de agregar'),
    (await agotado.count()) === 1 && (await agotado.locator('.add, app-qty-stepper').count()) === 0,
  );

  // Agregar desde el detalle (promo 2x1) y entrar al carrito
  await page.evaluate(() => window.scrollTo(0, 0));
  await cardOf('Ron añejo').locator('.open').click();
  await page.waitForSelector('dialog[open]');
  await page.getByRole('button', { name: 'Agregar al pedido' }).click();
  check(
    label('detalle muestra selector y "Ver carrito"'),
    await until(
      async () =>
        (await page.locator('dialog app-qty-stepper').count()) === 1 &&
        (await page.locator('dialog a:has-text("Ver carrito")').count()) === 1,
    ),
  );
  await page.locator('dialog').getByRole('button', { name: /Aumentar cantidad/ }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `capturas/carrito-${name}-detalle.png` });
  await page.locator('dialog a:has-text("Ver carrito")').click();
  await page.waitForURL('**/carrito');
  await page.waitForSelector('.row');
  await page.waitForTimeout(1500);

  check(label('2 líneas en el carrito'), (await page.locator('.row').count()) === 2);
  const rowTotals = await page.locator('.row .total').allTextContents();
  const sum = rowTotals.reduce((n, t) => n + money(t), 0);
  const total = money(await page.locator('.sum-total dd').textContent());
  check(label('total = suma de líneas'), sum === total, `${sum / 100} vs ${total / 100}`);
  check(label('promo 2x1: Ron ×2 = S/ 72.00'), rowTotals.some((t) => money(t) === 7200));
  check(
    label('muestra "1 gratis" y fila Promoción'),
    (await page.locator('.note:has-text("1 gratis")').count()) === 1 &&
      (await page.locator('.sum dt:has-text("Promoción")').count()) === 1,
  );
  check(label('pisco ×2 con oferta = S/ 132.00'), rowTotals.some((t) => money(t) === 13200));
  await page.screenshot({ path: `capturas/carrito-${name}-pagina.png`, fullPage: true });

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(label('carrito sin scroll horizontal'), overflow <= 0, `${overflow}px`);
  const small = await page.evaluate(
    () =>
      [...document.querySelectorAll('main button, main a')]
        .map((e) => e.getBoundingClientRect())
        .filter((r) => r.width > 0 && (r.height < 43.5 || r.width < 43.5)).length,
  );
  check(label('carrito: objetivos >= 44px'), small === 0, `${small} menores`);

  // Persistencia al recargar
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.row');
  check(label('persiste al recargar'), (await page.locator('.row').count()) === 2 && (await navLabel()) === 'Carrito, 4 productos');

  // Quitar una línea: el "−" con cantidad 1 es la papelera
  const ron = page.locator('.row', { hasText: 'Ron añejo' });
  await ron.getByRole('button', { name: /Disminuir cantidad/ }).click();
  await ron.locator('app-qty-stepper').getByRole('button', { name: /^Quitar/ }).click();
  await page.waitForTimeout(300);
  check(label('quitar una línea'), (await page.locator('.row').count()) === 1);

  // No disponible: id inexistente en el almacenamiento
  await page.evaluate(() => {
    const k = 'brinda.cart.v1';
    const ls = JSON.parse(localStorage.getItem(k));
    ls.push({
      productId: 'ya-no-existe',
      slug: 'x',
      name: 'Producto retirado',
      categorySlug: 'vinos',
      finalPrice: 10,
      price: 10,
      quantity: 1,
      available: true,
    });
    localStorage.setItem(k, JSON.stringify(ls));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.row');
  await page.waitForTimeout(800);
  check(
    label('producto retirado se marca no disponible'),
    (await page.locator('.row.gone .note:has-text("Ya no está disponible")').count()) === 1,
  );
  const afterTotal = money(await page.locator('.sum-total dd').textContent());
  check(label('no disponible no suma al total'), afterTotal === 13200, `${afterTotal / 100}`);
  if (name === '360') await page.screenshot({ path: 'capturas/carrito-360-nodisponible.png', fullPage: true });

  // Vaciar
  await page.getByRole('button', { name: 'Vaciar carrito' }).click();
  check(
    label('vaciar muestra estado vacío'),
    await until(
      async () => (await page.locator('app-state-panel').count()) === 1 && (await navLabel()) === 'Carrito, 0 productos',
    ),
  );
  if (name === '360') await page.screenshot({ path: 'capturas/carrito-360-vacio.png' });

  check(label('errores de consola'), errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// Movimiento reducido: sin animación, contenido visible
{
  const ctx = await newCtx({ viewport: { width: 360, height: 780 }, reducedMotion: 'reduce' });
  await passAgeGate(ctx);
  const page = await ctx.newPage();
  await page.goto(`${base}/catalogo`, { waitUntil: 'networkidle' });
  await page.waitForSelector('app-product-card');
  await page.locator('app-product-card .add').first().click();
  check('reduced-motion: agregar funciona', (await page.locator('.cart-count').textContent())?.trim() === '1');
  await ctx.close();
}
await browser.close();
console.log(out.join('\n'));
