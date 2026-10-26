import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { ScrollService } from '../core/scroll.service';
import { OrderBar } from './order-bar';

async function render(pastHero: boolean) {
  const pastHeroSignal = signal(pastHero);
  const ctaInView = signal(false);
  TestBed.configureTestingModule({
    imports: [OrderBar],
    providers: [provideRouter([]), { provide: ScrollService, useValue: { pastHero: pastHeroSignal, ctaInView } }],
  });
  const fixture = TestBed.createComponent(OrderBar);
  fixture.detectChanges();
  await fixture.whenStable();
  return { fixture, pastHeroSignal, ctaInView };
}

describe('OrderBar', () => {
  it('está oculta e inerte mientras el hero sigue a la vista', async () => {
    const { fixture } = await render(false);
    const bar: HTMLElement = fixture.nativeElement.querySelector('.bar');
    expect(bar.classList.contains('visible')).toBe(false);
    expect(bar.getAttribute('aria-hidden')).toBe('true');
    expect(bar.hasAttribute('inert')).toBe(true);
  });

  it('se muestra al dejar atrás el hero y lleva al catálogo', async () => {
    const { fixture, pastHeroSignal } = await render(false);
    pastHeroSignal.set(true);
    fixture.detectChanges();
    const bar: HTMLElement = fixture.nativeElement.querySelector('.bar');
    expect(bar.classList.contains('visible')).toBe(true);
    expect(bar.hasAttribute('inert')).toBe(false);
    const link: HTMLAnchorElement = bar.querySelector('a')!;
    expect(link.textContent?.trim()).toBe('Pedir ahora');
    expect(link.getAttribute('href')).toBe('/catalogo');
  });

  it('se oculta mientras el CTA de "Cómo pedir" está a la vista', async () => {
    const { fixture, ctaInView } = await render(true);
    const bar: HTMLElement = fixture.nativeElement.querySelector('.bar');
    expect(bar.classList.contains('visible')).toBe(true);
    ctaInView.set(true);
    fixture.detectChanges();
    expect(bar.classList.contains('visible')).toBe(false);
    expect(bar.hasAttribute('inert')).toBe(true);
  });
});
