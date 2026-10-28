// Verifica el control de edad, el pie legal, el aviso de menores y /libro-de-reclamaciones a 360/768/1440.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { AGE_KEY, passAgeGate } from './age.mjs';

const base = process.env.BASE_URL ?? 'http://localhost:4200';
const sizes = [
  { name: '360', width: 360, height: 780 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
];
mkdirSync('capturas', { recursive: true });
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL });
const out = [];
const check = (l, ok, x = '') => out.push(`${ok ? 'OK ' : 'FALLA'} ${l}${x ? ' · ' + x : ''}`);

for (const { name, width, height } of sizes) {
  const L = (t) => `${name}px ${t}`;
  // 1) Primera visita: modal.
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const dlg = page.locator('[role=dialog][aria-modal=true]');
  check(L('modal visible en la primera visita'), await dlg.isVisible());
  check(L('foco dentro del modal'), await page.evaluate(() => !!document.activeElement?.closest('[role=dialog]')));
  check(L('fondo inerte y sin scroll'), await page.evaluate(() => document.querySelector('.page')?.hasAttribute('inert') && ['hidden', 'clip'].includes(getComputedStyle(document.documentElement).overflow)));
  await page.keyboard.press('Escape');
  await page.mouse.click(5, 5);
  check(L('Esc y clic fuera no cierran'), await dlg.isVisible());
  for (let i = 0; i < 4; i++) await page.keyboard.press('Tab');
  check(L('Tab no sale del modal'), await page.evaluate(() => !!document.activeElement?.closest('[role=dialog]')));
  await page.screenshot({ path: `capturas/legal-${name}-modal.png` });
  await page.getByRole('button', { name: 'No', exact: true }).click();
  check(L('"No" muestra el mensaje'), await page.getByText('Lo sentimos, solo vendemos a mayores de 18 años.').isVisible());
  await page.screenshot({ path: `capturas/legal-${name}-modal-no.png` });
  await page.getByRole('button', { name: 'Volver a la pregunta' }).click();
  await page.getByRole('button', { name: 'Sí, soy mayor de 18' }).click();
  await page.waitForTimeout(200);
  check(L('"Sí" cierra el modal'), !(await dlg.isVisible()));
  check(L('"Sí" se recuerda en localStorage'), (await page.evaluate((k) => localStorage.getItem(k), AGE_KEY)) === '1');
  await page.reload({ waitUntil: 'networkidle' });
  check(L('no vuelve a preguntar'), !(await dlg.isVisible()));
  check(L('scroll liberado'), await page.evaluate(() => !['hidden', 'clip'].includes(getComputedStyle(document.documentElement).overflow)));

  // 2) Pie: advertencia, logo y enlace.
  const footer = page.locator('app-site-footer');
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  check(L('advertencia de alcohol en el pie'), await footer.getByText('TOMAR BEBIDAS ALCOHÓLICAS EN EXCESO ES DAÑINO', { exact: false }).isVisible());
  const logo = footer.locator('a.claims');
  const box = await logo.boundingBox();
  check(L('logo del libro ≥44px y ≥120px de ancho'), box && box.height >= 44 && box.width >= 120, JSON.stringify(box && { w: Math.round(box.width), h: Math.round(box.height) }));
  check(L('logo carga completo'), await logo.locator('img').evaluate((i) => i.complete && i.naturalWidth > 0));
  check(L('alt del logo'), (await logo.locator('img').getAttribute('alt')) === 'Libro de Reclamaciones');
  check(L('sin scroll horizontal'), await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: `capturas/legal-${name}-footer.png` });
  await logo.click();
  await page.waitForURL('**/libro-de-reclamaciones');
  await page.waitForTimeout(400);
  check(L('libro: encabezado y notas'), (await page.locator('main').innerText()).includes('20616579607') && (await page.locator('main').innerText()).includes('quince (15) días hábiles'));
  check(L('libro: sin formulario'), (await page.locator('main form, main input, main textarea').count()) === 0);
  check(L('libro: aviso de desarrollo'), await page.getByText('Formulario pendiente de implementar').isVisible());
  check(L('libro: sin scroll horizontal'), await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: `capturas/legal-${name}-libro.png`, fullPage: true });
  check(L('consola limpia'), errors.length === 0, errors.join(' | '));
  await ctx.close();

  // 3) El Libro nunca queda bloqueado en la primera visita.
  const c2 = await browser.newContext({ viewport: { width, height } });
  const p2 = await c2.newPage();
  await p2.goto(base + '/libro-de-reclamaciones', { waitUntil: 'networkidle' });
  check(L('libro sin modal en primera visita'), !(await p2.locator('[role=dialog]').isVisible()));
  await c2.close();

  // 4) Aviso de menores en carrito y pedido (carrito con producto de ejemplo).
  const c3 = await browser.newContext({ viewport: { width, height } });
  await passAgeGate(c3);
  await c3.addInitScript(() => localStorage.setItem('brinda.mock', '1'));
  const p3 = await c3.newPage();
  await p3.goto(base + '/catalogo', { waitUntil: 'networkidle' });
  await p3.locator('app-product-card button', { hasText: /Agregar/ }).first().click();
  for (const r of ['/carrito', '/pedido']) {
    await p3.goto(base + r, { waitUntil: 'networkidle' });
    const n = p3.locator('app-legal-notice p.minors');
    check(L(`${r}: aviso de menores visible`), await n.isVisible() && (await n.innerText()).includes('DNI físico'));
    await p3.screenshot({ path: `capturas/legal-${name}${r.replace('/', '-')}.png` });
  }
  await c3.close();
}
console.log(out.join('\n'));
await browser.close();
process.exit(out.some((l) => l.startsWith('FALLA')) ? 1 : 0);
