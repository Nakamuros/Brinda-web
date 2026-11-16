import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProductoForm, amount, wholeNumber } from './producto-form';

const PRODUCT = {
  id: 'p1',
  categoryId: 2,
  categoryName: 'Piscos',
  sku: null,
  name: 'Pisco Quebranta',
  slug: 'pisco-quebranta',
  productType: 'PRODUCT',
  description: null,
  price: 48,
  discountPrice: 40,
  offerEndsAt: '2030-01-15T23:59:00-05:00',
  offerActive: true,
  offerExpired: false,
  promoBuy: null,
  promoPay: null,
  promoEndsAt: null,
  promoActive: false,
  finalPrice: 40,
  imageUrl: null,
  imageKey: 'products/pisco.webp',
  stockQuantity: 5,
  minStock: 3,
  maxStock: 50,
  stockLevel: 'NORMAL',
  available: true,
  featured: false,
};

describe('importes y cantidades del panel', () => {
  it('acepta importes con hasta dos decimales y mayores que cero', () => {
    expect(amount('12.90')).toBe(12.9);
    expect(amount('0')).toBeNull();
    expect(amount('12.999')).toBeNull();
    expect(amount('abc')).toBeNull();
    expect(amount('-5')).toBeNull();
  });

  it('acepta solo enteros dentro del rango', () => {
    expect(wholeNumber('-2', -100000, 100000)).toBe(-2);
    expect(wholeNumber('1.5', 0, 10)).toBeNull();
    expect(wholeNumber('', 0, 10)).toBeNull();
    expect(wholeNumber('11', 0, 10)).toBeNull();
  });
});

describe('ProductoForm (editar)', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('al guardar reenvía la oferta y la imagen guardadas, sin tocar el stock', async () => {
    TestBed.configureTestingModule({
      imports: [ProductoForm],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 'p1' }) } },
        },
      ],
    });
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(ProductoForm);
    const settle = async () => {
      await new Promise((r) => setTimeout(r));
      await fixture.whenStable();
      fixture.detectChanges();
    };
    fixture.detectChanges();
    http.expectOne('/api/v1/admin/categories').flush([{ id: 2, name: 'Piscos', active: true }]);
    http.expectOne('/api/v1/admin/products/p1').flush(PRODUCT);
    await settle();

    const el = fixture.nativeElement as HTMLElement;
    const price = el.querySelector('#price') as HTMLInputElement;
    price.value = '50';
    price.dispatchEvent(new Event('input'));
    (el.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    const req = http.expectOne({ method: 'PUT', url: '/api/v1/admin/products/p1' });
    expect(req.request.body).toEqual({
      categoryId: 2,
      sku: null,
      name: 'Pisco Quebranta',
      description: null,
      price: 50,
      discountPrice: 40,
      offerEndsAt: '2030-01-15T23:59:00-05:00',
      imageUrl: 'products/pisco.webp',
      minStock: 3,
      maxStock: 50,
      available: true,
      featured: false,
    });
    req.flush({ ...PRODUCT, price: 50 });
    await settle();
    expect(el.textContent).toContain('Cambios guardados.');
  });
});
