import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../core/config';
import { Category } from '../../models/category';
import { Page } from '../../models/page';

export type StockLevel = 'OUT' | 'LOW' | 'NORMAL' | 'HIGH';
export type Visibility = 'ALL' | 'VISIBLE' | 'HIDDEN';

/** Forma de `AdminProductResponse`. `imageKey` es el valor guardado (el que se reenvía al editar). */
export interface AdminProduct {
  id: string;
  categoryId: number;
  categoryName: string;
  sku: string | null;
  name: string;
  slug: string;
  productType: 'PRODUCT' | 'COMBO';
  description: string | null;
  price: number;
  discountPrice: number | null;
  offerEndsAt: string | null;
  offerActive: boolean;
  offerExpired: boolean;
  promoBuy: number | null;
  promoPay: number | null;
  promoEndsAt: string | null;
  promoActive: boolean;
  finalPrice: number;
  imageUrl: string | null;
  imageKey: string | null;
  stockQuantity: number;
  minStock: number;
  maxStock: number;
  stockLevel: StockLevel;
  available: boolean;
  featured: boolean;
}

/** Cuerpo de `ProductRequest`. El stock no viaja aquí: se repone o ajusta aparte. */
export interface ProductRequest {
  categoryId: number;
  sku: string | null;
  name: string;
  description: string | null;
  price: number;
  discountPrice: number | null;
  offerEndsAt: string | null;
  imageUrl: string | null;
  minStock: number;
  maxStock: number;
  available: boolean;
  featured: boolean;
}

export interface ProductFilters {
  q: string;
  categoryId: number | null;
  visibility: Visibility;
  lowStock: boolean;
  page: number;
}

/** Forma de `MovementResponse`: una entrada del historial de stock. */
export interface Movement {
  id: number;
  type: string;
  quantityChange: number;
  stockAfter: number;
  reason: string | null;
  createdAt: string;
}

export const MOVEMENT_LABEL: Record<string, string> = {
  SALE: 'Venta',
  RESTOCK: 'Reposición',
  ADJUSTMENT: 'Ajuste',
  CANCEL_RETURN: 'Devolución por anulación',
  COMBO_BUILD: 'Combo armado',
  COMBO_CONSUME: 'Usado en un combo',
  COMBO_DISASSEMBLE: 'Combo desarmado',
};

/** Forma de `ComboDetailResponse`. `buildableNow` = combos que aún se pueden armar con el stock actual. */
export interface ComboDetail {
  combo: AdminProduct;
  items: { productId: string; name: string; quantity: number; stockQuantity: number; available: boolean }[];
  buildableNow: number;
}

/** Cuerpo de `ComboUpdateRequest` (sin categoría, composición ni stock). */
export type ComboUpdate = Omit<ProductRequest, 'categoryId' | 'sku'>;

/** Cuerpo de `CreateComboRequest`. */
export interface ComboCreate {
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  minStock: number;
  maxStock: number;
  featured: boolean;
  available: boolean;
  items: { productId: string; quantity: number }[];
  unitsToBuild: number;
}

export function stockLabel(p: Pick<AdminProduct, 'stockLevel' | 'stockQuantity'>): string {
  if (p.stockLevel === 'OUT') {
    return 'Agotado';
  }
  return p.stockLevel === 'LOW' ? `Stock bajo: ${p.stockQuantity}` : `Stock: ${p.stockQuantity}`;
}

const BASE = `${API_URL}/admin`;

@Injectable({ providedIn: 'root' })
export class ProductsAdmin {
  private readonly http = inject(HttpClient);

  list(f: ProductFilters, size = 20): Promise<Page<AdminProduct>> {
    let params = new HttpParams().set('page', f.page).set('size', size).set('visibility', f.visibility);
    if (f.q.trim()) params = params.set('q', f.q.trim());
    if (f.categoryId) params = params.set('categoryId', f.categoryId);
    if (f.lowStock) params = params.set('lowStock', true);
    return firstValueFrom(this.http.get<Page<AdminProduct>>(`${BASE}/products`, { params }));
  }

  categories(): Promise<Category[]> {
    return firstValueFrom(this.http.get<Category[]>(`${BASE}/categories`));
  }

  get(id: string): Promise<AdminProduct> {
    return firstValueFrom(this.http.get<AdminProduct>(this.url(id)));
  }

  create(req: ProductRequest): Promise<AdminProduct> {
    return firstValueFrom(this.http.post<AdminProduct>(`${BASE}/products`, req));
  }

  update(id: string, req: ProductRequest): Promise<AdminProduct> {
    return firstValueFrom(this.http.put<AdminProduct>(this.url(id), req));
  }

  setOffer(id: string, discountPrice: number, endsAt: string): Promise<AdminProduct> {
    return firstValueFrom(
      this.http.put<AdminProduct>(`${this.url(id)}/offer`, { discountPrice, endsAt }),
    );
  }

  clearOffer(id: string): Promise<AdminProduct> {
    return firstValueFrom(this.http.delete<AdminProduct>(`${this.url(id)}/offer`));
  }

  /** Sube una foto (PNG, JPG o WebP). `key` es lo que se guarda en el producto; `url`, para verla ya. */
  uploadImage(file: File): Promise<{ key: string; url: string }> {
    const body = new FormData();
    body.append('file', file);
    return firstValueFrom(this.http.post<{ key: string; url: string }>(`${BASE}/images`, body));
  }

  /** "Lleva N, paga M" con fecha de fin. Excluye la oferta de precio. */
  setPromo(id: string, buy: number, pay: number, endsAt: string): Promise<AdminProduct> {
    return firstValueFrom(this.http.put<AdminProduct>(`${this.url(id)}/promo`, { buy, pay, endsAt }));
  }

  clearPromo(id: string): Promise<AdminProduct> {
    return firstValueFrom(this.http.delete<AdminProduct>(`${this.url(id)}/promo`));
  }

  movements(id: string, size = 10): Promise<Page<Movement>> {
    return firstValueFrom(
      this.http.get<Page<Movement>>(
        `${BASE}/inventory/products/${encodeURIComponent(id)}/movements`,
        { params: { page: 0, size } },
      ),
    );
  }

  combo(id: string): Promise<ComboDetail> {
    return firstValueFrom(this.http.get<ComboDetail>(`${BASE}/combos/${encodeURIComponent(id)}`));
  }

  createCombo(req: ComboCreate): Promise<ComboDetail> {
    return firstValueFrom(this.http.post<ComboDetail>(`${BASE}/combos`, req));
  }

  updateCombo(id: string, req: ComboUpdate): Promise<ComboDetail> {
    return firstValueFrom(
      this.http.put<ComboDetail>(`${BASE}/combos/${encodeURIComponent(id)}`, req),
    );
  }

  /** Arma más unidades del combo: descuenta sus componentes. */
  buildCombo(id: string, units: number, reason: string): Promise<ComboDetail> {
    return firstValueFrom(
      this.http.post<ComboDetail>(`${BASE}/combos/${encodeURIComponent(id)}/build`, {
        units,
        reason: reason.trim() || null,
      }),
    );
  }

  /** Entrada de mercadería. */
  restock(id: string, quantity: number, reason: string): Promise<unknown> {
    return firstValueFrom(
      this.http.post(`${BASE}/inventory/products/${encodeURIComponent(id)}/restock`, {
        quantity,
        reason: reason.trim() || null,
      }),
    );
  }

  /** Corrección (merma, rotura, conteo): positivo suma, negativo resta. Motivo obligatorio. */
  adjust(id: string, quantityChange: number, reason: string): Promise<unknown> {
    return firstValueFrom(
      this.http.post(`${BASE}/inventory/products/${encodeURIComponent(id)}/adjust`, {
        quantityChange,
        reason: reason.trim(),
      }),
    );
  }

  private url(id: string): string {
    return `${BASE}/products/${encodeURIComponent(id)}`;
  }
}
