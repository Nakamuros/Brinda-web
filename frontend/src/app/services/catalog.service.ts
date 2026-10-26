import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MOCK_CATEGORIES, mockProducts } from '../core/catalog.mock';
import { API_URL, USE_MOCK_CATALOG } from '../core/config';
import { Category } from '../models/category';
import { Page } from '../models/page';
import { Product } from '../models/product';

export type CatalogStatus = 'idle' | 'loading' | 'ready' | 'error';

/** Máximo que acepta la API por página (`size`, backend/ENDPOINTS.md). */
const PAGE_SIZE = 50;

/**
 * Catálogo público. Carga todas las páginas una vez y el filtrado y la búsqueda se hacen en el
 * navegador, conservando el orden del servidor. Con catálogos muy grandes convendrá pasar la
 * búsqueda y la categoría al servidor (`q`, `category`) y paginar de verdad.
 */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);

  readonly status = signal<CatalogStatus>('idle');
  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);

  async load(): Promise<void> {
    if (this.status() === 'loading' || this.status() === 'ready') {
      return;
    }
    this.status.set('loading');
    try {
      if (USE_MOCK_CATALOG) {
        await new Promise((resolve) => setTimeout(resolve, 450));
        this.products.set(mockProducts());
        this.categories.set(MOCK_CATEGORIES);
      } else {
        const [categories, products] = await Promise.all([
          this.fetchCategories(),
          this.fetchAllProducts(),
        ]);
        this.categories.set(categories);
        this.products.set(products);
      }
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }

  retry(): Promise<void> {
    this.status.set('idle');
    return this.load();
  }

  private fetchCategories(): Promise<Category[]> {
    return firstValueFrom(this.http.get<Category[]>(`${API_URL}/catalog/categories`));
  }

  private async fetchAllProducts(): Promise<Product[]> {
    const first = await this.fetchPage(0);
    const rest = await Promise.all(
      Array.from({ length: Math.max(first.totalPages - 1, 0) }, (_, i) => this.fetchPage(i + 1)),
    );
    return [first, ...rest].flatMap((p) => p.content);
  }

  private fetchPage(page: number): Promise<Page<Product>> {
    return firstValueFrom(
      this.http.get<Page<Product>>(`${API_URL}/catalog/products`, {
        params: { page, size: PAGE_SIZE },
      }),
    );
  }
}
