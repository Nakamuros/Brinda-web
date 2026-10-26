import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Product } from '../models/product';
import { CartService, MAX_QTY, lineTotals } from './cart.service';

const product = (over: Partial<Product> = {}): Product => ({
  id: 'p1',
  slug: 'p1',
  name: 'Producto',
  description: '',
  price: 10,
  finalPrice: 10,
  onOffer: false,
  categorySlug: 'cervezas',
  categoryName: 'Cervezas',
  featured: false,
  inStock: true,
  productType: 'PRODUCT',
  ...over,
});

function service(): CartService {
  TestBed.resetTestingModule();
  return TestBed.inject(CartService);
}

describe('lineTotals', () => {
  it('lleva 3, paga 2: 7 unidades regalan 2', () => {
    const t = lineTotals({ finalPrice: 10, promoBuy: 3, promoPay: 2, quantity: 7 });
    expect(t).toEqual({ gross: 7000, free: 2, discount: 2000, net: 5000 });
  });

  it('con menos unidades que N no hay descuento', () => {
    expect(lineTotals({ finalPrice: 10, promoBuy: 3, promoPay: 2, quantity: 2 }).discount).toBe(0);
  });

  it('calcula en céntimos sin errores de coma flotante', () => {
    expect(lineTotals({ finalPrice: 0.1, quantity: 3 }).net).toBe(30);
  });
});

describe('CartService', () => {
  beforeEach(() => localStorage.clear());

  it('agrega, suma cantidades y calcula el total', () => {
    const cart = service();
    cart.add(product());
    cart.add(product());
    cart.add(product({ id: 'p2', finalPrice: 5.5, price: 5.5 }));
    expect(cart.itemCount()).toBe(3);
    expect(cart.totals().net).toBe(25.5);
    expect(cart.qtyOf('p1')).toBe(2);
  });

  it('no agrega productos agotados', () => {
    const cart = service();
    cart.add(product({ inStock: false }));
    expect(cart.itemCount()).toBe(0);
  });

  it('respeta el tope por línea y quita al llegar a 0', () => {
    const cart = service();
    cart.add(product());
    cart.setQty('p1', 999);
    expect(cart.qtyOf('p1')).toBe(MAX_QTY);
    cart.setQty('p1', 0);
    expect(cart.lines()).toEqual([]);
  });

  it('persiste y restaura desde localStorage', () => {
    const cart = service();
    cart.add(product());
    TestBed.tick();
    const again = service();
    expect(again.qtyOf('p1')).toBe(1);
  });

  it('ignora datos corruptos del almacenamiento', () => {
    localStorage.setItem('brinda.cart.v1', '{no es json');
    expect(service().lines()).toEqual([]);
    localStorage.setItem('brinda.cart.v1', JSON.stringify([{ productId: 1 }, null]));
    expect(service().lines()).toEqual([]);
  });

  it('sync marca no disponible lo agotado o ausente y actualiza precios', () => {
    const cart = service();
    cart.add(product());
    cart.add(product({ id: 'p2' }));
    cart.add(product({ id: 'p3' }));
    cart.sync([product({ finalPrice: 8, price: 10 }), product({ id: 'p2', inStock: false })]);
    const [a, b, c] = cart.lines();
    expect(a.finalPrice).toBe(8);
    expect(a.available).toBe(true);
    expect(b.available).toBe(false);
    expect(c.available).toBe(false);
    expect(cart.itemCount()).toBe(1);
    expect(cart.totals().net).toBe(8);
  });
});
