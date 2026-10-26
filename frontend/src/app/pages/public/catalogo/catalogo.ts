import { Location } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogoSoon } from './catalogo-soon';
import { USE_MOCK_CATALOG } from '../../../core/config';
import { Product } from '../../../models/product';
import { CartService } from '../../../services/cart.service';
import { CatalogService } from '../../../services/catalog.service';
import { normalize } from '../../../shared/format';
import { ProductCard } from '../../../shared/product-card';
import { ProductDetail } from '../../../shared/product-detail';
import { ProductSkeleton } from '../../../shared/product-skeleton';
import { RevealDirective } from '../../../shared/reveal.directive';
import { RiseDirective } from '../../../shared/rise.directive';
import { StatePanel } from '../../../shared/state-panel';

/** Productos por tanda ("Ver más"): como el `size` de la API. */
const PAGE = 12;

@Component({
  selector: 'app-catalogo',
  imports: [
    CatalogoSoon,
    RevealDirective,
    RiseDirective,
    ProductCard,
    ProductDetail,
    ProductSkeleton,
    StatePanel,
  ],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo {
  private readonly catalog = inject(CatalogService);
  private readonly cart = inject(CartService);
  private readonly location = inject(Location);
  private readonly params = inject(ActivatedRoute).snapshot.queryParamMap;

  protected readonly status = this.catalog.status;
  protected readonly categories = this.catalog.categories;
  protected readonly isMock = USE_MOCK_CATALOG;
  protected readonly skeletons = Array.from({ length: 8 }, (_, i) => i);
  protected readonly page = PAGE;

  protected readonly query = signal(this.params.get('q') ?? '');
  protected readonly categorySlug = signal(this.params.get('categoria') ?? '');
  protected readonly onlyOffers = signal(this.params.get('ofertas') === '1');
  private readonly limit = signal(PAGE);
  protected readonly selected = signal<Product | null>(null);

  /** La categoría de la URL solo cuenta si existe en el catálogo cargado. */
  protected readonly category = computed(() => {
    const slug = this.categorySlug();
    return this.categories().some((c) => c.slug === slug) ? slug : '';
  });

  protected readonly filtered = computed(() => {
    const tokens = normalize(this.query()).split(/\s+/).filter(Boolean);
    const category = this.category();
    const offers = this.onlyOffers();
    return this.catalog.products().filter((p) => {
      if (category && p.categorySlug !== category) {
        return false;
      }
      if (offers && !p.onOffer) {
        return false;
      }
      const haystack = normalize(`${p.name} ${p.description} ${p.categoryName}`);
      return tokens.every((t) => haystack.includes(t));
    });
  });

  protected readonly shown = computed(() => this.filtered().slice(0, this.limit()));
  protected readonly remaining = computed(() => this.filtered().length - this.shown().length);
  /** La API respondió pero todavía no hay productos publicados. */
  protected readonly isEmpty = computed(
    () => this.status() === 'ready' && this.catalog.products().length === 0,
  );
  protected readonly hasFilters = computed(
    () => !!this.query().trim() || !!this.category() || this.onlyOffers(),
  );

  constructor() {
    void this.catalog.load();
    effect(() => {
      if (this.status() === 'ready') {
        this.cart.sync(this.catalog.products());
      }
    });

    // Refleja los filtros en la URL sin navegar (no dispara la transición de página).
    effect(() => {
      const search = new URLSearchParams();
      if (this.query().trim()) search.set('q', this.query().trim());
      if (this.category()) search.set('categoria', this.category());
      if (this.onlyOffers()) search.set('ofertas', '1');
      const qs = search.toString();
      const path = this.location.path().split('?')[0];
      this.location.replaceState(path, qs);
    });
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.limit.set(PAGE);
  }

  protected clearSearch(input: HTMLInputElement): void {
    this.query.set('');
    this.limit.set(PAGE);
    input.focus();
  }

  protected pickCategory(slug: string): void {
    this.categorySlug.set(slug);
    this.limit.set(PAGE);
  }

  protected toggleOffers(): void {
    this.onlyOffers.update((v) => !v);
    this.limit.set(PAGE);
  }

  protected clearFilters(): void {
    this.query.set('');
    this.categorySlug.set('');
    this.onlyOffers.set(false);
    this.limit.set(PAGE);
  }

  protected more(): void {
    this.limit.update((n) => n + PAGE);
  }

  protected retry(): void {
    void this.catalog.retry();
  }
}
