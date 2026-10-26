import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Product } from '../models/product';
import { CatalogService } from './catalog.service';

const product = (id: string): Product => ({
  id,
  slug: id,
  name: id,
  description: '',
  price: 10,
  finalPrice: 10,
  onOffer: false,
  categorySlug: 'cervezas',
  categoryName: 'Cervezas',
  featured: false,
  inStock: true,
  productType: 'PRODUCT',
});

const page = (content: Product[], pageNo: number, totalPages: number) => ({
  content,
  page: pageNo,
  size: 50,
  totalElements: content.length,
  totalPages,
});

describe('CatalogService (API)', () => {
  let http: HttpTestingController;
  let service: CatalogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CatalogService);
  });

  it('catálogo vacío: queda ready sin productos', async () => {
    const done = service.load();
    http.expectOne('/api/v1/catalog/categories').flush([]);
    http.expectOne((r) => r.url === '/api/v1/catalog/products').flush(page([], 0, 0));
    await done;
    expect(service.status()).toBe('ready');
    expect(service.products()).toEqual([]);
  });

  it('une todas las páginas en el orden del servidor', async () => {
    const done = service.load();
    http.expectOne('/api/v1/catalog/categories').flush([]);
    const first = http.expectOne((r) => r.params.get('page') === '0');
    first.flush(page([product('a')], 0, 2));
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve));
    http.expectOne((r) => r.params.get('page') === '1').flush(page([product('b')], 1, 2));
    await done;
    expect(service.products().map((p) => p.id)).toEqual(['a', 'b']);
    expect(first.request.params.get('size')).toBe('50');
  });

  it('un fallo de red deja el estado en error y reintentar vuelve a pedir', async () => {
    const done = service.load();
    http.expectOne('/api/v1/catalog/categories').error(new ProgressEvent('error'));
    http.expectOne((r) => r.url === '/api/v1/catalog/products').error(new ProgressEvent('error'));
    await done;
    expect(service.status()).toBe('error');

    const again = service.retry();
    http.expectOne('/api/v1/catalog/categories').flush([]);
    http.expectOne((r) => r.url === '/api/v1/catalog/products').flush(page([], 0, 0));
    await again;
    expect(service.status()).toBe('ready');
  });
});
