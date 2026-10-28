import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { AdminAuth, AdminUser } from './admin-auth.service';
import { adminGuard } from './admin.guard';
import { Deadline, deadlineText, formatDate, limaToday } from './reclamos/reclamo.models';

const user = (over: Partial<AdminUser> = {}): AdminUser => ({
  id: '1',
  username: 'admin',
  email: 'a@b.pe',
  role: 'ROLE_ADMIN',
  mustChangePassword: false,
  ...over,
});

async function runGuard(current: AdminUser | null, url: string) {
  const fake = { user: signal(current), load: async () => current };
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: AdminAuth, useValue: fake }],
  });
  const result = await TestBed.runInInjectionContext(() =>
    adminGuard({} as never, { url } as never),
  );
  return { result, router: TestBed.inject(Router) };
}

describe('adminGuard', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('sin sesión manda al login', async () => {
    const { result, router } = await runGuard(null, '/admin/reclamos');
    expect(router.serializeUrl(result as never)).toBe('/admin/login');
  });

  it('un usuario que no es admin no entra', async () => {
    const { result, router } = await runGuard(user({ role: 'ROLE_CASHIER' }), '/admin/reclamos');
    expect(router.serializeUrl(result as never)).toBe('/admin/login');
  });

  it('con la clave inicial sin cambiar, va a cambiarla primero', async () => {
    const { result, router } = await runGuard(user({ mustChangePassword: true }), '/admin/reclamos');
    expect(router.serializeUrl(result as never)).toBe('/admin/cambiar-clave');
  });

  it('en la pantalla de cambio de clave no se redirige en bucle', async () => {
    const { result } = await runGuard(user({ mustChangePassword: true }), '/admin/cambiar-clave');
    expect(result).toBe(true);
  });

  it('un admin con sesión entra', async () => {
    const { result } = await runGuard(user(), '/admin/reclamos');
    expect(result).toBe(true);
  });
});

describe('plazo y fechas del panel', () => {
  const base: Deadline = { dueOn: '2026-11-18', businessDaysLeft: 5, level: 'ON_TIME', answeredLate: false };

  it('redacta cada estado del plazo', () => {
    expect(deadlineText(base)).toBe('Vence el 18/11/2026 (5 días hábiles)');
    expect(deadlineText({ ...base, level: 'SOON', businessDaysLeft: 0 })).toBe('Vence hoy');
    expect(deadlineText({ ...base, level: 'SOON', businessDaysLeft: 1 })).toBe('Vence en 1 día hábil');
    expect(deadlineText({ ...base, level: 'OVERDUE', businessDaysLeft: -2 })).toBe('Vencido hace 2 días hábiles');
    expect(deadlineText({ ...base, level: 'ANSWERED', businessDaysLeft: null })).toBe('Respondido en plazo');
    expect(deadlineText({ ...base, level: 'ANSWERED', businessDaysLeft: null, answeredLate: true })).toBe(
      'Respondido fuera de plazo',
    );
  });

  it('formatea fechas sin correrse de día (hora de Lima)', () => {
    expect(formatDate('2026-11-05')).toBe('05/11/2026');
    expect(formatDate('2026-11-06T03:00:00Z')).toBe('05/11/2026');
  });

  it('la fecha de hoy en Lima tiene forma AAAA-MM-DD', () => {
    expect(limaToday()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
