import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { ScrollService } from '../../core/scroll.service';
import { SiteNav } from './site-nav';

// GSAP/ScrollTrigger necesitan un navegador real: en jsdom se sustituye el servicio.

async function render() {
  const fakeScroll = { scrolled: signal(false), start: () => undefined, lock: () => undefined };
  TestBed.configureTestingModule({
    imports: [SiteNav],
    providers: [provideRouter([]), { provide: ScrollService, useValue: fakeScroll }],
  });
  const fixture = TestBed.createComponent(SiteNav);
  fixture.detectChanges();
  await fixture.whenStable();
  return fixture;
}

describe('SiteNav', () => {
  it('muestra los seis enlaces principales', async () => {
    const f = await render();
    const labels = [...f.nativeElement.querySelectorAll('.links a')].map((a) =>
      (a as HTMLElement).textContent?.trim(),
    );
    expect(labels).toEqual([
      'Inicio',
      'Catálogo',
      'Combos y promociones',
      'Cómo pedir',
      'Zonas y horario',
      'Contacto',
    ]);
  });

  it('el botón del menú alterna aria-expanded y Escape lo cierra', async () => {
    const f = await render();
    const btn: HTMLButtonElement = f.nativeElement.querySelector('button.toggle');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    btn.click();
    f.detectChanges();
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    f.detectChanges();
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('el carrito enlaza a /carrito y no muestra contador vacío', async () => {
    const f = await render();
    const link: HTMLAnchorElement = f.nativeElement.querySelector('a.cart');
    expect(link.getAttribute('href')).toBe('/carrito');
    expect(link.getAttribute('aria-label')).toBe('Carrito, 0 productos');
    expect(f.nativeElement.querySelector('.cart-count')).toBeNull();
  });
});
