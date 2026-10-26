import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollService } from '../core/scroll.service';
import { Product } from '../models/product';
import { CartService } from '../services/cart.service';
import { BottlePlaceholder } from './bottle-placeholder';
import { formatDay, formatPrice } from './format';
import { productBadge } from './product-card';
import { QtyStepper } from './qty-stepper';

/** Detalle de producto en un <dialog> nativo: foco atrapado, Escape y fondo cierran. */
@Component({
  selector: 'app-product-detail',
  imports: [BottlePlaceholder, QtyStepper, RouterLink],
  template: `
    <dialog
      #dlg
      class="dlg"
      data-lenis-prevent
      [attr.aria-labelledby]="'pd-title'"
      (close)="closed.emit()"
      (click)="onBackdrop($event)"
    >
      <article class="panel" [attr.data-cat]="product().categorySlug">
        <button type="button" class="x" aria-label="Cerrar detalle" (click)="close()">
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>

        <div class="media">
          @if (product().imageUrl; as src) {
            <img [src]="src" [alt]="product().name" decoding="async" />
          } @else {
            <app-bottle-placeholder class="ph" />
          }
        </div>

        <div class="body">
          <p class="cat">{{ product().categoryName }}</p>
          <h2 id="pd-title" class="title">{{ product().name }}</h2>

          @if (!product().inStock) {
            <p class="tag tag-out">Agotado por ahora</p>
          } @else if (badge(); as b) {
            <p
              class="tag"
              [class.tag-promo]="b.kind === 'promo'"
              [class.tag-combo]="b.kind === 'combo'"
            >
              {{ b.text }}
            </p>
          }

          <p class="price">
            <span class="now">{{ price() }}</span>
            @if (was(); as old) {
              <s class="was"><span class="sr-only">Antes </span>{{ old }}</s>
            }
          </p>
          @if (until(); as d) {
            <p class="until">Válido hasta el {{ d }}</p>
          }

          <p class="desc">{{ product().description }}</p>

          @if (product().items?.length) {
            <div class="inc">
              <h3 class="inc-title">Incluye</h3>
              <ul>
                @for (it of product().items; track it.name) {
                  <li>
                    <span class="qty">{{ it.quantity }} ×</span> {{ it.name }}
                  </li>
                }
              </ul>
            </div>
          }
          @if (product().inStock) {
            <div class="buy">
              @if (qty(); as n) {
                <div class="buy-qty">
                  <app-qty-stepper
                    [qty]="n"
                    [label]="product().name"
                    (inc)="cart.setQty(product().id, n + 1)"
                    (dec)="cart.setQty(product().id, n - 1)"
                  />
                </div>
                <a class="btn btn-ghost" routerLink="/carrito" (click)="close()">Ver carrito</a>
              } @else {
                <button type="button" class="btn btn-cta" (click)="cart.add(product())">
                  Agregar al pedido
                </button>
              }
            </div>
          }
        </div>
      </article>
    </dialog>
  `,
  styleUrl: './product-detail.css',
})
export class ProductDetail implements AfterViewInit, OnDestroy {
  readonly product = input.required<Product>();
  readonly closed = output<void>();

  private readonly dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');
  private readonly scroll = inject(ScrollService);
  protected readonly cart = inject(CartService);
  protected readonly qty = computed(() => this.cart.qtyOf(this.product().id));

  protected readonly badge = computed(() => productBadge(this.product()));
  protected readonly price = computed(() => formatPrice(this.product().finalPrice));
  protected readonly was = computed(() =>
    this.product().discountPrice ? formatPrice(this.product().price) : '',
  );
  protected readonly until = computed(() => {
    const p = this.product();
    const end = p.inStock ? (p.offerEndsAt ?? p.promoEndsAt) : undefined;
    return end ? formatDay(end) : '';
  });

  ngAfterViewInit(): void {
    this.scroll.lock(true);
    this.dlg().nativeElement.showModal();
  }

  ngOnDestroy(): void {
    this.scroll.lock(false);
  }

  protected close(): void {
    this.dlg().nativeElement.close();
  }

  /** Clic sobre el fondo (el propio <dialog>, fuera del panel) cierra. */
  protected onBackdrop(event: MouseEvent): void {
    if (event.target === this.dlg().nativeElement) {
      this.close();
    }
  }
}
