// Verifica el panel /admin de reclamos contra la API real a 360/768/1440.
// La clave del admin se lee de backend/.env (POSTMAN_ADMIN_NEW_PASSWORD) y NUNCA se imprime.
// Requiere backend (8080) y `ng serve` (4200). Uso: PW_CHANNEL=chrome node scripts/admin.mjs
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';

const base = process.env.BASE_URL ?? 'http://localhost:4200';
const env = readFileSync(new URL('../../backend/.env', import.meta.url), 'utf8');
const password = /^POSTMAN_ADMIN_NEW_PASSWORD=(.*)$/m.exec(env)?.[1]?.trim();
if (!password) {
  console.log('Falta POSTMAN_ADMIN_NEW_PASSWORD en backend/.env');
  process.exit(2);
}
const sizes = [
  { name: '360', width: 360, height: 780 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
];
mkdirSync('capturas', { recursive: true });
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL });
const out = [];
const check = (l, ok, x = '') => out.push(`${ok ? 'OK ' : 'FALLA'} ${l}${x ? ' · ' + x : ''}`);
const PII = ['12345678', '987654321', 'panel.prueba@example.com', 'Calle Prueba 123'];

// 3 reclamos (el límite público es 3/min por IP): uno por tamaño, el de 1440 se responde.
const api = await browser.newContext();
const created = [];
for (let i = 1; i <= 3; i++) {
  const r = await api.request.post(`${base}/api/v1/complaints`, {
    data: {
      consumerName: ['Cliente Panel Uno', 'Cliente Panel Dos', 'Cliente Panel Tres'][i - 1], documentType: 'DNI', documentNumber: '12345678',
      address: 'Calle Prueba 123', phone: '987654321', email: 'panel.prueba@example.com',
      goodType: 'PRODUCT', claimedAmount: 30, goodDescription: `Producto de prueba ${i}`,
      complaintType: i === 2 ? 'COMPLAINT' : 'CLAIM', detail: `Detalle de prueba ${i}\nsegunda línea`,
      consumerRequest: 'Pedido de prueba', privacyAccepted: true,
    },
  });
  if (r.status() !== 201) {
    console.log('No se pudo crear el reclamo de prueba:', r.status());
    process.exit(2);
  }
  created.push((await r.json()).code);
}
await api.close();

for (const [idx, { name, width, height }] of sizes.entries()) {
  const L = (t) => `${name}px ${t}`;
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  // Los 401 de /auth/me sin sesión son esperados (el guard comprueba la sesión).
  page.on('console', (m) => m.type() === 'error' && !/401|Unauthorized/.test(m.text()) && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));

  // Sin sesión: el guard manda al login.
  await page.goto(`${base}/admin/reclamos`, { waitUntil: 'networkidle' });
  check(L('sin sesión → /admin/login'), page.url().endsWith('/admin/login'));
  check(L('el control de edad no aparece en el panel'), !(await page.locator('[role=dialog]').count()));
  await page.screenshot({ path: `capturas/admin-${name}-login.png` });

  // Clave incorrecta: mensaje, sin entrar.
  await page.getByLabel('Usuario').fill('admin');
  await page.getByLabel('Contraseña').fill('clave-incorrecta-123');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.getByRole('alert').waitFor();
  check(L('clave incorrecta muestra error y no entra'), page.url().endsWith('/admin/login'));

  // Login correcto.
  await page.getByLabel('Contraseña').fill(password);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForURL('**/admin/reclamos');
  await page.getByRole('list', { name: 'Reclamos' }).waitFor();
  const body = await page.locator('main').innerText();
  check(L('lista de reclamos visible'), body.includes(created[0]));
  check(L('la lista NO muestra DNI, teléfono, correo ni dirección'), PII.every((p) => !body.includes(p)));
  check(L('contadores visibles'), (await page.locator('.count .num').allInnerTexts()).every((t) => /^\d+$/.test(t.trim())));
  check(L('sin scroll horizontal'), await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: `capturas/admin-${name}-lista.png`, fullPage: true });

  // Objetivos táctiles ≥ 44 px en controles interactivos.
  const small = await page.evaluate(() =>
    [...document.querySelectorAll('main button, main a, main input, main select')]
      .filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 43.5; })
      .map((e) => e.tagName + ':' + (e.id || e.textContent.trim().slice(0, 20))),
  );
  check(L('objetivos táctiles ≥44px'), small.length === 0, small.join(', '));

  // Búsqueda y filtros.
  await page.getByLabel('Buscar').fill(created[1]);
  await page.waitForTimeout(700);
  const rows = await page.locator('.row').count();
  check(L('buscar por código deja 1 resultado'), rows === 1);
  await page.getByLabel('Buscar').fill('');
  await page.getByLabel('Tipo').selectOption('COMPLAINT');
  await page.waitForTimeout(500);
  const onlyComplaints = (await page.locator('.row .meta').allInnerTexts()).every((t) => t.includes('Queja'));
  check(L('filtro por tipo Queja'), onlyComplaints);
  await page.getByRole('button', { name: 'Limpiar' }).click();

  // Plazos en rojo: se simulan respuestas del servidor (sin tocar la BD).
  const mk = (code, level, left) => ({
    id: '00000000-0000-0000-0000-00000000000' + (code.length % 9), code, filedAt: '2026-10-20T15:00:00Z',
    consumerName: 'Cliente simulado', complaintType: 'CLAIM', goodType: 'PRODUCT',
    status: level === 'ANSWERED' ? 'ANSWERED' : 'RECEIVED',
    deadline: { dueOn: '2026-11-10', businessDaysLeft: left, level, answeredLate: false },
    consumerEmail: { status: 'PENDING', attempts: 0 }, ownerEmail: { status: 'PENDING', attempts: 0 },
  });
  await page.route('**/api/v1/admin/complaints?*', (route) =>
    route.fulfill({ json: { content: [mk('LR-SIM-OVERDUE', 'OVERDUE', -3), mk('LR-SIM-SOON', 'SOON', 1), mk('LR-SIM-OK', 'ON_TIME', 9), mk('LR-SIM-DONE', 'ANSWERED', null)], page: 0, size: 20, totalElements: 4, totalPages: 1 } }));
  await page.getByLabel('Buscar').fill('x');
  await page.waitForTimeout(700);
  const colors = await page.evaluate(() => {
    const bg = (s) => { const e = document.querySelector(s); return e ? getComputedStyle(e).backgroundColor : null; };
    return { over: bg('.badge-overdue'), soon: bg('.badge-soon'), over_n: document.querySelectorAll('.badge-overdue').length };
  });
  check(L('vencidos y por vencer se marcan con color propio'), colors.over_n === 1 && colors.over && colors.soon && colors.over !== colors.soon, JSON.stringify(colors));
  const overText = await page.locator('.badge-overdue').innerText();
  check(L('texto del vencido'), /Vencido hace 3 días hábiles/.test(overText), overText);
  await page.screenshot({ path: `capturas/admin-${name}-plazos.png`, fullPage: true });
  await page.unroute('**/api/v1/admin/complaints?*');

  // Detalle real.
  await page.goto(`${base}/admin/reclamos`, { waitUntil: 'networkidle' });
  await page.getByLabel('Buscar').fill(created[idx]);
  await page.waitForTimeout(700);
  await page.locator('.row').first().click();
  await page.waitForURL(/\/admin\/reclamos\/[0-9a-f-]{36}$/);
  await page.getByRole('heading', { name: created[idx] }).waitFor();
  const detail = await page.locator('main').innerText();
  check(L('detalle muestra el DNI y los datos'), detail.includes('12345678') && detail.includes('Calle Prueba 123') && detail.includes('panel.prueba@example.com'));
  check(L('detalle reproduce las 4 secciones de la hoja'), ['1. Identificación del consumidor reclamante', '2. Identificación del bien contratado', '3. Detalle de la reclamación y pedido del consumidor', '4. Observaciones y acciones adoptadas por el proveedor'].every((s) => detail.includes(s)));
  check(L('detalle sin scroll horizontal'), await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  check(L('enlace de PDF presente'), (await page.getByRole('link', { name: 'Descargar hoja en PDF' }).getAttribute('href')).includes('/pdf'));
  await page.screenshot({ path: `capturas/admin-${name}-detalle.png`, fullPage: true });

  if (name === '1440') {
    // Responder: validación, confirmación en dos pasos y estado final.
    await page.getByRole('button', { name: 'Registrar respuesta' }).click();
    check(L('responder sin texto muestra error'), await page.getByRole('alert').filter({ hasText: 'Escribe las observaciones' }).isVisible());
    await page.locator('#rt').fill('Se repone el producto y se piden disculpas.');
    await page.getByRole('button', { name: 'Registrar respuesta' }).click();
    check(L('pide confirmar antes de registrar'), await page.getByText('ya no se puede editar').isVisible());
    await page.screenshot({ path: `capturas/admin-${name}-confirmar.png` });
    await page.getByRole('button', { name: 'Sí, registrar' }).click();
    await page.getByText('La respuesta registrada no se edita').waitFor();
    const after = await page.locator('main').innerText();
    check(L('queda Respondido con la respuesta y sin formulario'), after.includes('Respondido') && after.includes('Se repone el producto') && !(await page.locator('textarea').count()));
    await page.screenshot({ path: `capturas/admin-${name}-respondido.png`, fullPage: true });
  }

  // Cerrar sesión y volver a ser bloqueado.
  await page.getByRole('button', { name: 'Salir' }).click();
  await page.waitForURL('**/admin/login');
  await page.goto(`${base}/admin/reclamos`, { waitUntil: 'networkidle' });
  check(L('tras salir, el panel vuelve a pedir login'), page.url().endsWith('/admin/login'));
  check(L('consola limpia'), errors.length === 0, errors.join(' | '));
  await ctx.close();
}

console.log(out.join('\n'));
await browser.close();
process.exit(out.some((l) => l.startsWith('FALLA')) ? 1 : 0);
