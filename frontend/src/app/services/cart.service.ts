import { Injectable, computed, effect, signal } from '@angular/core';
import { CartLine } from '../models/cart-line';
import { Product } from '../models/product';

const STORAGE_KEY = 'brinda.cart.v1';
/** Tope por línea en el carrito; el servidor valida el stock real al crear el pedido. */
export const MAX_QTY = 50;

const cents = (value: number): number => Math.round(value * 100);

/** Importes de una línea en céntimos. "Lleva N, paga M": gratis = floor(q/N) × (N−M) unidades. */
export function lineTotals(
  line: Pick<CartLine, 'finalPrice' | 'promoBuy' | 'promoPay' | 'quantity'>,
) {
  const gross = cents(line.finalPrice) * line.quantity;
  const free =
    line.promoBuy && line.promoPay
      ? Math.floor(line.quantity / line.promoBuy) * (line.promoBuy - line.promoPay)
      : 0;
  const discount = free * cents(line.finalPrice);
  return { gross, free, discount, net: gross - discount };
}

/** Carrito local (signals + localStorage). Los precios son estimados: el total real lo calcula el servidor. */
@Injectable({ providedIn: 'root' })
export class CartService {
  readonly lines = signal<CartLine[]>(this.restore());
  /** Texto para el lector de pantalla cuando cambia el carrito. */
  readonly announcement = signal('');

  private readonly active = computed(() => this.lines().filter((l) => l.available));
  readonly itemCount = computed(() => this.active().reduce((n, l) => n + l.quantity, 0));
  readonly totals = computed(() => {
    const parts = this.active().map(lineTotals);
    const gross = parts.reduce((n, p) => n + p.gross, 0);
    const discount = parts.reduce((n, p) => n + p.discount, 0);
    return { gross: gross / 100, discount: discount / 100, net: (gross - discount) / 100 };
  });
  private readonly quantities = computed(
    () => new Map(this.lines().map((l) => [l.productId, l.quantity])),
  );

  constructor() {
    effect(() => this.persist(this.lines()));
  }

  qtyOf(productId: string): number {
    return this.quantities().get(productId) ?? 0;
  }

  add(product: Product): void {
    if (!product.inStock) {
      return;
    }
    const existing = this.lines().find((l) => l.productId === product.id);
    if (existing) {
      this.setQty(product.id, existing.quantity + 1);
    } else {
      this.lines.update((ls) => [...ls, this.toLine(product)]);
      this.announce(product.name, 1);
    }
  }

  setQty(productId: string, quantity: number): void {
    const line = this.lines().find((l) => l.productId === productId);
    if (!line) {
      return;
    }
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }
    const next = Math.min(quantity, MAX_QTY);
    this.lines.update((ls) =>
      ls.map((l) => (l.productId === productId ? { ...l, quantity: next } : l)),
    );
    this.announce(line.name, next);
  }

  remove(productId: string): void {
    const line = this.lines().find((l) => l.productId === productId);
    this.lines.update((ls) => ls.filter((l) => l.productId !== productId));
    if (line) {
      this.announcement.set(`${line.name} quitado del carrito.`);
    }
  }

  clear(): void {
    this.lines.set([]);
    this.announcement.set('Carrito vaciado.');
  }

  /** Reconcilia con el catálogo: refresca precios y marca lo que ya no está disponible. */
  sync(products: Product[]): void {
    const byId = new Map(products.map((p) => [p.id, p]));
    this.lines.update((ls) => {
      let changed = false;
      const next = ls.map((l) => {
        const p = byId.get(l.productId);
        const fresh: CartLine =
          p && p.inStock ? { ...this.toLine(p), quantity: l.quantity } : { ...l, available: false };
        if (JSON.stringify(fresh) !== JSON.stringify(l)) {
          changed = true;
        }
        return fresh;
      });
      return changed ? next : ls;
    });
  }

  private toLine(p: Product): CartLine {
    return {
      productId: p.id,
      slug: p.slug,
      name: p.name,
      categorySlug: p.categorySlug,
      imageUrl: p.imageUrl,
      finalPrice: p.finalPrice,
      price: p.price,
      promoBuy: p.promoBuy,
      promoPay: p.promoPay,
      quantity: 1,
      available: true,
    };
  }

  private announce(name: string, quantity: number): void {
    this.announcement.set(`${name}: ${quantity} en el carrito.`);
  }

  private restore(): CartLine[] {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      if (!Array.isArray(raw)) {
        return [];
      }
      return raw.filter(
        (l): l is CartLine =>
          typeof l?.productId === 'string' &&
          typeof l.name === 'string' &&
          typeof l.finalPrice === 'number' &&
          Number.isInteger(l.quantity) &&
          l.quantity > 0 &&
          l.quantity <= MAX_QTY,
      );
    } catch {
      return [];
    }
  }

  private persist(lines: CartLine[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Sin almacenamiento (modo privado o bloqueado): el carrito sigue en memoria.
    }
  }
}
