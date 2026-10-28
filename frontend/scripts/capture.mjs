// Capturas de verificación (solo desarrollo). Uso: node scripts/capture.mjs [ruta] [prefijo]
// Salida en frontend/capturas/ (ignorada por git).
import { chromium } from 'playwright';
import { passAgeGate } from './age.mjs';
import { mkdirSync } from 'node:fs';

const base = process.env.BASE_URL ?? 'http://localhost:4200';
const route = process.argv[2] ?? '/';
const prefix = process.argv[3] ?? 'landing';
const sizes = [
  { name: '360', width: 360, height: 780 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
];

mkdirSync('capturas', { recursive: true });
const browser = await chromium.launch();
for (const { name, width, height } of sizes) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: 'reduce',
    deviceScaleFactor: 1,
  });
  await passAgeGate(context);
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `capturas/${prefix}-${name}-fold.png` });
  await page.screenshot({ path: `capturas/${prefix}-${name}-full.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(`${name}px  overflow-x: ${overflow}px  errores: ${errors.length ? errors.join(' | ') : 'ninguno'}`);
  await context.close();
}
await browser.close();
