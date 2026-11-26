// Verifica el formulario público de /libro-de-reclamaciones contra la API REAL (backend :8080 vía proxy).
// CREA 3 RECLAMOS REALES en la BD local (DNI a 360, CE a 768, menor con apoderado a 1440) y descarga su PDF.
// El límite público es 3 reclamos/min por IP: espera un minuto antes de repetir (o de correr Newman 12b).
// Honeypot y 429 se simulan interceptando la respuesta (no gastan el límite).
// Uso: node scripts/reclamos-publico.mjs   (con backend y `ng serve` encendidos)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const base = process.env.BASE_URL ?? 'http://localhost:4200';
mkdirSync('capturas', { recursive: true });
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL });
const out = [];
const check = (label, ok, extra = '') => out.push(`${ok ? 'OK ' : 'FALLA'} ${label}${extra ? ' · ' + extra : ''}`);

const CASES = {
  360: { doc: 'DNI', number: '12345678', minor: false },
  768: { doc: 'CE', number: 'AB1234567', minor: false },
  1440: { doc: 'DNI', number: '87654321', minor: true },
};

async function fill(page, c) {
  await page.fill('#consumerName', 'Prueba Playwright');
  await page.locator('label.choice', { hasText: c.doc }).click();
  await page.fill('#documentNumber', c.number);
  await page.fill('#address', 'Av. Prueba 123');
  await page.fill('#phone', '987654321');
  await page.fill('#email', 'prueba@example.com');
  if (c.minor) {
    await page.locator('input[formControlName="minor"]').check();
    await page.fill('#guardianName', 'Apoderada Prueba');
  }
  await page.locator('label.choice', { hasText: 'Producto' }).click();
  await page.fill('#claimedAmount', '45.50');
  await page.fill('#goodDescription', 'Producto de prueba automática');
  await page.locator('label.choice', { hasText: 'Reclamo' }).click();
  await page.fill('#detail', 'Detalle de prueba automática (Playwright).');
  await page.fill('#consumerRequest', 'Pedido de prueba automática.');
  await page.locator('input[formControlName="privacyAccepted"]').check();
}

for (const { name, width, height } of [
  { name: '360', width: 360, height: 780 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
]) {
  const ctx = await browser.newContext({ viewport: { width, height }, acceptDownloads: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  const L = (t) => `${name}px ${t}`;

  await page.goto(`${base}/libro-de-reclamaciones`, { waitUntil: 'networkidle' });
  await page.waitForSelector('app-complaint-form form');
  const text = await page.locator('main').innerText();
  check(L('proveedor con el domicilio unificado y tipo de hoja'), text.includes('Av. Alfredo Benavides 707, int. 1403, Miraflores') && text.includes('HOJA DE RECLAMACIÓN VIRTUAL'));
  check(L('3 secciones de la hoja en orden'), (await page.locator('legend.legend').allInnerTexts()).map((t) => t.trim()[0]).join('') === '123');
  check(L('sin control de edad'), (await page.locator('dialog[open], .age-gate').count()) === 0);

  // Errores al tocar y al enviar vacío
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(200);
  const alerts = await page.locator('.msg[role="alert"]').count();
  check(L('enviar vacío marca los obligatorios'), alerts >= 10, `${alerts} errores`);
  await page.locator('label.choice', { hasText: 'DNI' }).click();
  await page.fill('#documentNumber', '12ab');
  check(L('DNI solo dígitos'), (await page.inputValue('#documentNumber')) === '12');
  await page.locator('#documentNumber').blur();
  check(L('error de DNI'), (await page.locator('#documentNumber-msg').innerText()).includes('8 dígitos'));
  await page.locator('label.choice', { hasText: 'CE' }).click();
  await page.fill('#documentNumber', 'AB12');
  await page.locator('#documentNumber').blur();
  const ceError = await page.waitForFunction(() => document.querySelector('#documentNumber-msg')?.textContent?.includes('entre 8 y 12'), null, { timeout: 2000 }).then(() => true, () => false);
  check(L('error de CE'), ceError, await page.locator('#documentNumber-msg').innerText().catch(() => ''));
  await page.fill('#email', 'no-es-correo');
  await page.locator('#email').blur();
  check(L('error de e-mail'), (await page.locator('#email-msg').count()) === 1);
  await page.locator('input[formControlName="minor"]').check();
  await page.locator('#guardianName').focus();
  await page.locator('#guardianName').blur();
  check(L('menor exige apoderado'), (await page.locator('#guardianName-msg').innerText()).includes('apoderado'));
  await page.locator('input[formControlName="minor"]').uncheck();
  await page.screenshot({ path: `capturas/reclamos-${name}-errores.png`, fullPage: true });

  // Honeypot oculto y fuera del orden de tabulación
  const hp = await page.evaluate(() => {
    const i = document.querySelector('#website');
    const r = i.getBoundingClientRect();
    return { hidden: !!i.closest('[aria-hidden="true"]'), tab: i.tabIndex, ac: i.autocomplete, offscreen: r.right < 0 };
  });
  check(L('honeypot oculto, tabindex -1, autocomplete off'), hp.hidden && hp.tab === -1 && hp.ac === 'off' && hp.offscreen);

  // Objetivos táctiles, desborde
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('app-complaint-form form');
  const small = await page.evaluate(() =>
    [...document.querySelectorAll('main button, main a, main input:not([type=checkbox]):not([type=radio]):not(#website), main textarea, main label.check, main label.choice')]
      .map((e) => e.getBoundingClientRect())
      .filter((r) => r.width > 0 && (r.height < 43.5 || r.width < 43.5)).length,
  );
  check(L('objetivos táctiles >= 44px'), small === 0, `${small} menores`);
  check(L('sin scroll horizontal'), (await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0);

  if (name === '360') {
    // Privacidad en pestaña nueva sin perder lo escrito
    await page.fill('#consumerName', 'Se conserva');
    const [popup] = await Promise.all([ctx.waitForEvent('page'), page.locator('app-complaint-form a[href="/privacidad"]').click()]);
    check(L('privacidad abre en pestaña nueva'), popup.url().includes('/privacidad'));
    await popup.close();
    check(L('el formulario conserva lo escrito'), (await page.inputValue('#consumerName')) === 'Se conserva');

    // Honeypot simulado: el servidor "acepta" sin guardar → no se dice "registrado"
    await page.route('**/api/v1/complaints', (r) =>
      r.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ code: 'LR-0000-000000', number: 0, year: 0, filedOn: '2026-01-01', copyToken: '', copyPath: '' }) }),
    );
    await fill(page, CASES[360]);
    await page.locator('button[type="submit"]').click();
    await page.waitForSelector('.alert');
    check(L('honeypot: "No pudimos registrar tu reclamo"'), (await page.locator('.alert').innerText()).includes('No pudimos registrar tu reclamo') && !(await page.locator('main').innerText()).includes('quedó registrado'));
    // 429 simulado
    await page.unroute('**/api/v1/complaints');
    await page.route('**/api/v1/complaints', (r) => r.fulfill({ status: 429, contentType: 'application/json', body: '{"status":429,"code":"TOO_MANY_REQUESTS"}' }));
    await page.locator('button[type="submit"]').click();
    await page.waitForFunction(() => document.querySelector('.alert')?.textContent?.includes('Espera un minuto'));
    check(L('429: pide esperar y conserva los datos'), (await page.inputValue('#detail')).length > 0);
    await page.unroute('**/api/v1/complaints');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('app-complaint-form form');
  }

  // Envío real
  const c = CASES[name];
  await fill(page, c);
  const [res] = await Promise.all([
    page.waitForResponse((r) => r.url().endsWith('/api/v1/complaints') && r.request().method() === 'POST'),
    page.locator('button[type="submit"]').click(),
  ]);
  const body = await res.json().catch(() => ({}));
  check(L(`envío real con ${c.doc}${c.minor ? ' y apoderado' : ''} → 201`), res.status() === 201, `${res.status()} ${body.code ?? body.message ?? ''}`);
  if (res.status() === 201) {
    await page.waitForSelector('#claim-done-title');
    check(L('muestra el N° del reclamo'), (await page.locator('.done .code').innerText()) === body.code);
    check(L('el foco va al título'), await page.waitForFunction(() => document.activeElement?.id === 'claim-done-title', null, { timeout: 2000 }).then(() => true, () => false));
    const href = await page.locator('a[download]').getAttribute('href');
    check(L('enlace de copia con el token'), href === `/api/v1/complaints/copy/${body.copyToken}`);
    const [download] = await Promise.all([page.waitForEvent('download'), page.locator('a[download]').click()]);
    const path = await download.path();
    const { readFileSync } = await import('node:fs');
    const head = readFileSync(path).subarray(0, 5).toString();
    check(L('descarga el PDF'), head === '%PDF-' && download.suggestedFilename().includes(body.code), download.suggestedFilename());
    const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }));
    check(L('nada personal en el navegador'), !stored.includes(c.number) && !stored.includes('987654321') && !stored.includes('prueba@example.com'));
    check(L('aviso de correo solo en desarrollo'), (await page.locator('.done .dev').count()) === 1);
    const small2 = await page.evaluate(() =>
      [...document.querySelectorAll('.done a, .done button')].map((e) => e.getBoundingClientRect()).filter((r) => r.height < 43.5).length,
    );
    check(L('confirmación: objetivos >= 44px'), small2 === 0);
    check(L('confirmación: sin scroll horizontal'), (await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0);
    await page.screenshot({ path: `capturas/reclamos-${name}-enviado.png`, fullPage: true });
  }
  // El 429 simulado deja un error de recurso en consola: es esperado.
  const real = errors.filter((e) => !e.includes('429'));
  check(L('errores de consola'), real.length === 0, real.join(' | '));
  await ctx.close();
}
await browser.close();
console.log(out.join('\n'));
