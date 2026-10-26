// Verifica el menú móvil (apertura, foco, Escape) y el scroll con movimiento normal. Solo desarrollo.
import { chromium } from 'playwright';

const base = process.env.BASE_URL ?? 'http://localhost:4200';
const browser = await chromium.launch();

const ctx = await browser.newContext({ viewport: { width: 360, height: 780 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2800);
await page.screenshot({ path: 'capturas/motion-360-fold.png' });

await page.click('button.toggle');
await page.waitForTimeout(1200);
const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
await page.screenshot({ path: 'capturas/menu-360-open.png' });
await page.keyboard.press('Escape');
await page.waitForTimeout(600);
const expanded = await page.getAttribute('button.toggle', 'aria-expanded');
console.log('foco al abrir:', focused, '| aria-expanded tras Escape:', expanded);

await page.click('button.toggle');
await page.waitForTimeout(900);
await page.click('.menu a:has-text("Catálogo")');
await page.waitForTimeout(1200);
console.log('ruta tras elegir Catálogo:', new URL(page.url()).pathname);
await page.screenshot({ path: 'capturas/catalogo-360.png' });

// scroll con movimiento normal: las secciones deben revelarse
await page.goto(base + '/', { waitUntil: 'networkidle' });
for (const y of [700, 1500, 2400, 3300, 4200]) {
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(900);
}
await page.waitForTimeout(1200);
await page.screenshot({ path: 'capturas/motion-360-scrolled.png' });
const hidden = await page.evaluate(() =>
  [...document.querySelectorAll('.step, .card, .tile, .col')].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.top < innerHeight && r.bottom > 0 && parseFloat(getComputedStyle(el).opacity) < 0.05;
  }).length,
);
console.log('elementos visibles con opacidad ~0:', hidden, '| errores:', errors.length ? errors : 'ninguno');
await browser.close();
