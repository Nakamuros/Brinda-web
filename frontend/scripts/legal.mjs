// Verifica el control de edad, el pie legal, el aviso de menores y /libro-de-reclamaciones (con formulario) a 360/768/1440.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { AGE_KEY, passAgeGate } from './age.mjs';
import { mockCatalog } from './fixture.mjs';

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
  const sorry = page.getByText('Lo sentimos, solo vendemos a mayores de 18 años.');
  await sorry.waitFor({ timeout: 3000 }).catch(() => {});
  check(L('"No" muestra el mensaje'), await sorry.isVisible());
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
  // Desde el 2026-11-22 el Libro tiene formulario (el envío real lo prueba reclamos-publico.mjs; aquí no se envía nada).
  const main = await page.locator('main').innerText();
  check(L('libro: formulario con nombre, documento, detalle y botón de envío'), (await page.locator('app-complaint-form form').count()) === 1 && (await page.locator('#consumerName, #documentNumber, #detail').count()) === 3 && (await page.getByRole('button', { name: 'Enviar hoja de reclamación' }).count()) === 1);
  check(L('libro: domicilio unificado del proveedor'), main.includes('Av. Alfredo Benavides 707, int. 1403, Miraflores'));
  check(L('libro: aviso "no puede salir a producción" (solo en desarrollo)'), main.includes('no puede salir a producción'));
  check(L('libro: sin scroll horizontal'), await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: `capturas/legal-${name}-libro.png`, fullPage: true });

  // /terminos y /privacidad: texto del asesor, sin fecha mientras LEGAL.documentsUpdatedAt esté vacía.
  for (const [path, file] of [['/terminos', 'terminos'], ['/privacidad', 'privacidad']]) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    const text = await page.locator('main').innerText();
    check(L(`${path}: 13 secciones, negritas y sin corchetes`), (await page.locator('main h2').count()) === 13 && (await page.locator('main strong').count()) > 0 && !/[[\]]/.test(text));
    check(L(`${path}: sin "Última actualización" (fecha vacía)`), !text.includes('Última actualización'));
    check(L(`${path}: sin espacio antes de coma o punto (negritas)`), !/\S [,.](\s|$)/.test(text), (text.match(/.{20}\S [,.](\s|$)/) ?? [''])[0]);
    check(L(`${path}: domicilio unificado (§1 y §13)`), text.split('Av. Alfredo Benavides 707, int. 1403, Miraflores').length - 1 === 2);
    check(L(`${path}: sin scroll horizontal`), await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: `capturas/legal-${name}-${file}.png`, fullPage: true });
  }
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
  await mockCatalog(c3);
  const p3 = await c3.newPage();
  await p3.goto(base + '/catalogo', { waitUntil: 'networkidle' });
  await p3.locator('app-product-card button', { hasText: /Agregar/ }).first().click();
  // El carrito se guarda en un effect: esperar a que quede en localStorage antes de navegar.
  await p3.waitForFunction(() => (localStorage.getItem('brinda.cart.v1') ?? '[]') !== '[]');
  for (const r of ['/carrito', '/pedido']) {
    await p3.goto(base + r, { waitUntil: 'networkidle' });
    const n = p3.locator('app-legal-notice p.minors');
    await n.waitFor({ timeout: 3000 }).catch(() => {});
    check(L(`${r}: aviso de menores visible`), await n.isVisible() && (await n.innerText()).includes('documento de identidad'));
    await p3.screenshot({ path: `capturas/legal-${name}${r.replace('/', '-')}.png` });
  }
  await c3.close();
}
console.log(out.join('\n'));
await browser.close();
process.exit(out.some((l) => l.startsWith('FALLA')) ? 1 : 0);
