// Comprueba la build de producción servida en BASE_URL: marcadores internos, objetivos táctiles y barra fija.
import { chromium } from 'playwright';

const base = process.env.BASE_URL ?? 'http://127.0.0.1:4300';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 360, height: 780 }, reducedMotion: 'reduce' });
await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.waitForSelector('app-hero h1', { timeout: 10000 });
await page.waitForTimeout(500);

const text = await page.evaluate(() => document.body.innerText);
console.log(
  'Por confirmar:', /por confirmar/i.test(text),
  '| Espacio reservado:', /espacio reservado/i.test(text),
  '| disponible pronto:', /disponible pronto/i.test(text),
);

const small = await page.evaluate(() =>
  [...document.querySelectorAll('a, button')]
    .filter((e) => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.height < 44 && !e.closest('[inert]') && getComputedStyle(e).visibility !== 'hidden';
    })
    .map((e) => `${(e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 28)} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`),
);
console.log('objetivos < 44px (360):', JSON.stringify(small));

const barBefore = await page.evaluate(() => document.querySelector('app-order-bar .bar')?.classList.contains('visible'));
await page.mouse.wheel(0, 1400);
await page.waitForTimeout(1500);
const barAfter = await page.evaluate(() => document.querySelector('app-order-bar .bar')?.classList.contains('visible'));
console.log('barra fija visible arriba:', barBefore, '| tras scroll:', barAfter);
await page.screenshot({ path: 'capturas/prod-360-scrolled.png' });
await page.evaluate(() => document.querySelector('#como-pedir .cta')?.scrollIntoView({ block: 'center' }));
await page.waitForTimeout(1500);
const barOnCta = await page.evaluate(() => document.querySelector('app-order-bar .bar')?.classList.contains('visible'));
console.log('barra fija visible con el CTA de "Como pedir" a la vista:', barOnCta);
await page.screenshot({ path: 'capturas/prod-360-cta.png' });
await browser.close();
