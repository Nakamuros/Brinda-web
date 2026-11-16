import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../models/category';
import { Page } from '../../models/page';
import { BottlePlaceholder } from '../../shared/bottle-placeholder';
import { formatPrice } from '../../shared/format';
import { apiError } from '../admin-auth.service';
import { AdminProduct, ProductsAdmin, Visibility, stockLabel } from './productos.service';

@Component({
  selector: 'app-productos-lista',
  imports: [RouterLink, BottlePlaceholder],
  styleUrls: ['../admin-ui.css', '../reclamos/reclamos-lista.css', './productos.css'],
  templateUrl: './productos-lista.html',
})
export class ProductosLista implements OnInit {
  private readonly api = inject(ProductsAdmin);
  private seq = 0;
  private timer: ReturnType<typeof setTimeout> | undefined;

  protected readonly q = signal('');
  protected readonly categoryId = signal<number | null>(null);
  protected readonly visibility = signal<Visibility>('ALL');
  protected readonly lowStock = signal(false);
  protected readonly pageIndex = signal(0);

  protected readonly categories = signal<Category[]>([]);
  protected readonly result = signal<Page<AdminProduct> | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  protected readonly filtered = computed(
    () => !!(this.q().trim() || this.categoryId() || this.lowStock() || this.visibility() !== 'ALL'),
  );
  protected readonly rows = computed(() =>
    (this.result()?.content ?? []).map((p) => ({
      p,
      meta: [p.categoryName, p.sku, p.productType === 'COMBO' ? 'Combo' : ''].filter(Boolean).join(' · '),
      price: formatPrice(p.finalPrice),
      was: p.offerActive ? formatPrice(p.price) : '',
      stock: stockLabel(p),
    })),
  );

  ngOnInit(): void {
    void this.load();
    this.api.categories().then(
      (c) => this.categories.set(c),
      () => this.categories.set([]),
    );
  }

  protected search(v: string): void {
    this.q.set(v);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.refresh(), 300);
  }

  protected setCategory(v: string): void {
    this.categoryId.set(v ? Number(v) : null);
    this.refresh();
  }

  protected setVisibility(v: string): void {
    this.visibility.set(v as Visibility);
    this.refresh();
  }

  protected setLowStock(v: string): void {
    this.lowStock.set(v === '1');
    this.refresh();
  }

  protected go(delta: number): void {
    this.pageIndex.update((p) => Math.max(0, p + delta));
    void this.load();
  }

  protected async load(): Promise<void> {
    const mine = ++this.seq;
    this.loading.set(true);
    this.error.set('');
    try {
      const page = await this.api.list({
        q: this.q(),
        categoryId: this.categoryId(),
        visibility: this.visibility(),
        lowStock: this.lowStock(),
        page: this.pageIndex(),
      });
      if (mine === this.seq) {
        this.result.set(page);
      }
    } catch (e) {
      if (mine === this.seq) {
        this.error.set(apiError(e, 'No se pudieron cargar los productos.'));
      }
    } finally {
      if (mine === this.seq) {
        this.loading.set(false);
      }
    }
  }

  private refresh(): void {
    this.pageIndex.set(0);
    void this.load();
  }
}
