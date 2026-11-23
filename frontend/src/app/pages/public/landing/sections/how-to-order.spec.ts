import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { ORDER } from '../../../../core/config';
import { HowToOrder } from './how-to-order';

// GSAP necesita un navegador real: en jsdom se sustituye (la animación no se prueba aquí).
vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: () => undefined,
    context: (fn: () => void) => {
      fn();
      return { revert: () => undefined };
    },
    from: () => undefined,
    set: () => undefined,
    to: () => undefined,
  },
}));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));

describe('HowToOrder', () => {
  it('4 pasos: el envío por WhatsApp es un paso propio y el plazo sale de ORDER', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const f = TestBed.createComponent(HowToOrder);
    f.detectChanges();
    const el: HTMLElement = f.nativeElement;
    const titles = [...el.querySelectorAll('.step h3')].map((h) => h.textContent?.trim());
    expect(titles).toEqual([
      'Elige',
      'Deja tus datos',
      'Envíalo por WhatsApp',
      'Paga con Yape o Plin',
    ]);
    const text = el.textContent ?? '';
    expect(text).toContain('Sin ese mensaje, tu pedido no avanza.');
    expect(text).toContain(`Tu pedido se mantiene ${ORDER.expiryMinutes} minutos`);
    expect(text).not.toMatch(/reserva/i);
  });
});
