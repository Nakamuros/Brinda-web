import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AgeGate } from '../../core/age-gate.service';
import { AGE_GATE } from '../../core/config';
import { ScrollService } from '../../core/scroll.service';
import { AgeGateDialog } from './age-gate';

const lock = vi.fn();

async function render(url = '/') {
  TestBed.configureTestingModule({
    imports: [AgeGateDialog],
    providers: [
      provideRouter([{ path: '**', children: [] }]),
      { provide: ScrollService, useValue: { scrolled: signal(false), start: () => undefined, lock } },
    ],
  });
  await TestBed.inject(Router).navigateByUrl(url);
  const fixture = TestBed.createComponent(AgeGateDialog);
  fixture.detectChanges();
  await fixture.whenStable();
  return fixture;
}

const q = (f: { nativeElement: HTMLElement }, sel: string) => f.nativeElement.querySelector<HTMLElement>(sel);

describe('AgeGate', () => {
  beforeEach(() => {
    localStorage.clear();
    lock.mockClear();
    TestBed.resetTestingModule();
  });

  it('pregunta en la primera visita con un diálogo modal y bloquea el fondo', async () => {
    const f = await render();
    const d = q(f, '[role=dialog]');
    expect(d?.getAttribute('aria-modal')).toBe('true');
    expect(d?.textContent).toContain('¿Eres mayor de 18 años?');
    expect(lock).toHaveBeenCalledWith(true, 'age');
  });

  it('"Sí" cierra, recuerda la respuesta y libera el fondo', async () => {
    const f = await render();
    q(f, 'button')!.click();
    f.detectChanges();
    expect(q(f, '[role=dialog]')).toBeNull();
    expect(localStorage.getItem(AGE_GATE.storageKey)).toBe('1');
    expect(lock).toHaveBeenLastCalledWith(false, 'age');
  });

  it('"No" muestra el mensaje y no desbloquea; Escape no cierra', async () => {
    const f = await render();
    (f.nativeElement as HTMLElement).querySelectorAll('button')[1].click();
    f.detectChanges();
    expect(q(f, '[role=dialog]')?.textContent).toContain('Lo sentimos, solo vendemos a mayores de 18 años');
    const ev = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
    document.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    expect(q(f, '[role=dialog]')).not.toBeNull();
    expect(localStorage.getItem(AGE_GATE.storageKey)).toBeNull();
  });

  it('no aparece si ya se confirmó antes', async () => {
    localStorage.setItem(AGE_GATE.storageKey, '1');
    const f = await render();
    expect(q(f, '[role=dialog]')).toBeNull();
  });

  it('no aparece en el Libro de Reclamaciones', async () => {
    const f = await render('/libro-de-reclamaciones');
    expect(q(f, '[role=dialog]')).toBeNull();
  });

  it('si el almacenamiento falla, la página sigue funcionando y vuelve a preguntar', async () => {
    const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    const f = await render();
    expect(q(f, '[role=dialog]')).not.toBeNull();
    q(f, 'button')!.click();
    f.detectChanges();
    expect(q(f, '[role=dialog]')).toBeNull();
    expect(TestBed.inject(AgeGate).confirmed()).toBe(true);
    get.mockRestore();
    set.mockRestore();
  });

  it('atrapa el foco con Tab entre los dos botones', async () => {
    const f = await render();
    const [yes, no] = [...(f.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('button')];
    no.focus();
    const ev = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    document.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(yes);
  });
});
