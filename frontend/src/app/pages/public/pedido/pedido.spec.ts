import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Product } from '../../../models/product';
import { CartService } from '../../../services/cart.service';
import { Pedido } from './pedido';

// GSAP/ScrollTrigger necesitan un navegador real: en jsdom se sustituyen (la animación no se prueba aquí).
vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: () => undefined,
    context: (fn: () => void) => {
      fn();
      return { revert: () => undefined };
    },
    from: () => undefined,
  },
}));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));

const product: Product = {
  id: 'p1',
  slug: 'p1',
  name: 'Pisco Quebranta 500 ml',
  description: '',
  price: 48,
  finalPrice: 48,
  onOffer: false,
  categorySlug: 'piscos-y-whiskys',
  categoryName: 'Piscos y Whiskys',
  featured: false,
  inStock: true,
  productType: 'PRODUCT',
};

const DISTRICTS = [
  { id: 4, name: 'Barranco', zoneName: 'Zona 1 - Cercanos', fee: 6 },
  { id: 20, name: 'Callao', zoneName: 'Zona 3 - Lejanos', fee: 13 },
];

async function render(withItems = true) {
  localStorage.clear();
  TestBed.configureTestingModule({
    imports: [Pedido],
    providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
  });
  const http = TestBed.inject(HttpTestingController);
  if (withItems) {
    TestBed.inject(CartService).add(product);
    TestBed.inject(CartService).add(product);
  }
  const fixture = TestBed.createComponent(Pedido);
  fixture.detectChanges();
  http.expectOne('/api/v1/delivery/districts').flush(DISTRICTS);
  await fixture.whenStable();
  fixture.detectChanges();
  return { fixture, http, el: fixture.nativeElement as HTMLElement };
}

/** Texto sin el espacio de no separación que pone Intl entre "S/" y el importe. */
const money = (el: Element | null) => el?.textContent?.replace(/\u00a0/g, ' ').trim();

function select(el: HTMLElement, value: string) {
  const s = el.querySelector('select') as HTMLSelectElement;
  s.value = s.options[[...s.options].findIndex((o) => o.textContent?.trim() === value)].value;
  s.dispatchEvent(new Event('change'));
}

describe('Pedido (checkout, solo formulario)', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('sin productos muestra el carrito vacío y no el formulario', async () => {
    const { el } = await render(false);
    expect(el.querySelector('form')).toBeNull();
    expect(el.textContent).toContain('Tu carrito está vacío');
  });

  it('el distrito se elige de una lista agrupada por zona', async () => {
    const { el } = await render();
    const groups = [...el.querySelectorAll('optgroup')].map((g) => g.label);
    expect(groups).toEqual(['Zona 1 - Cercanos', 'Zona 3 - Lejanos']);
  });

  it('al elegir distrito suma la tarifa al total', async () => {
    const { fixture, el } = await render();
    expect(money(el.querySelector('.sum-total dd'))).toBe('S/ 96.00');
    expect(el.textContent).toContain('Elige tu distrito');

    select(el, 'Callao');
    fixture.detectChanges();
    expect(money(el.querySelector('.sum-total dd'))).toBe('S/ 109.00');

    select(el, 'Barranco');
    fixture.detectChanges();
    expect(money(el.querySelector('.sum-total dd'))).toBe('S/ 102.00');
  });

  it('celular y DNI aceptan solo dígitos y respetan el largo', async () => {
    const { fixture, el } = await render();
    const dni = el.querySelector('#dni') as HTMLInputElement;
    dni.value = '12a3-4567890';
    dni.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(dni.value).toBe('12345678');
    const phone = el.querySelector('#phone') as HTMLInputElement;
    phone.value = '98 765 4321 99';
    phone.dispatchEvent(new Event('input'));
    expect(phone.value).toBe('987654321');
  });

  it('muestra el error de un campo solo después de tocarlo', async () => {
    const { fixture, el } = await render();
    expect(el.querySelector('#dni-msg')?.getAttribute('role')).toBeNull();
    const dni = el.querySelector('#dni') as HTMLInputElement;
    dni.value = '123';
    dni.dispatchEvent(new Event('input'));
    dni.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(el.querySelector('#dni-msg')?.textContent).toContain('El DNI debe tener 8 dígitos.');
    expect(dni.getAttribute('aria-invalid')).toBe('true');
  });

  it('"Finalizar compra" no hace nada: sin pedidos ni peticiones', async () => {
    const { fixture, http, el } = await render();
    (el.querySelector('.finish') as HTMLButtonElement).click();
    fixture.detectChanges();
    http.verify(); // ninguna petición pendiente (ni POST /orders)
    expect(el.querySelector('form')).not.toBeNull();
  });
});
