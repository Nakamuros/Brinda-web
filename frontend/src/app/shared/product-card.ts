import { Component, computed, inject, input, output } from '@angular/core';
import { Product } from '../models/product';
import { CartService } from '../services/cart.service';
import { BottlePlaceholder } from './bottle-placeholder';
import { formatPrice } from './format';
import { QtyStepper } from './qty-stepper';

/** Etiqueta única por producto: la promoción más relevante, o combo. Agotado va aparte. */
export function productBadge(p: Product): { kind: 'promo' | 'combo'; text: string } | null {
  if (p.discountPercent) {
    return { kind: 'promo', text: `Oferta −${p.discountPercent}%` };
  }
  if (p.promoLabel) {
    return { kind: 'promo', text: p.promoLabel };
  }
  return p.productType === 'COMBO' ? { kind: 'combo', text: 'Combo' } : null;
}

@Component({
  selector: 'app-product-card',
  imports: [BottlePlaceholder, QtyStepper],
  template: `
    <article
      class="card"
      [class.sold-out]="!product().inStock"
      [attr.data-cat]="product().categorySlug"
    >
      <button type="button" class="open" aria-haspopup="dialog" (click)="open.emit(product())">
        <span class="media">
          @if (product().imageUrl; as src) {
            <img [src]="src" [alt]="product().name" loading="lazy" decoding="async" />
          } @else {
            <app-bottle-placeholder class="ph" />
          }
          @if (!product().inStock) {
            <span class="badge badge-out">Agotado</span>
          } @else if (badge(); as b) {
            <span
              class="badge"
              [class.badge-promo]="b.kind === 'promo'"
              [class.badge-combo]="b.kind === 'combo'"
              >{{ b.text }}</span
            >
          }
        </span>
        <span class="info">
          <span class="name">{{ product().name }}</span>
          <span class="price">
            <span class="now">{{ price() }}</span>
            @if (was(); as old) {
              <s class="was"><span class="sr-only">Antes </span>{{ old }}</s>
            }
          </span>
        </span>
      </button>
      @if (product().inStock) {
        <div class="actions">
          @if (qty(); as n) {
            <app-qty-stepper
              [qty]="n"
              [label]="product().name"
              (inc)="cart.setQty(product().id, n + 1)"
              (dec)="cart.setQty(product().id, n - 1)"
            />
          } @else {
            <button type="button" class="add" (click)="cart.add(product())">
              Agregar<span class="sr-only"> {{ product().name }} al carrito</span>
            </button>
          }
        </div>
      }
    </article>
  `,
  styleUrl: './product-card.css',
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly open = output<Product>();
  protected readonly cart = inject(CartService);
  protected readonly qty = computed(() => this.cart.qtyOf(this.product().id));

  protected readonly badge = computed(() => productBadge(this.product()));
  protected readonly price = computed(() => formatPrice(this.product().finalPrice));
  protected readonly was = computed(() => {
    const p = this.product();
    return p.discountPrice ? formatPrice(p.price) : '';
  });
}
