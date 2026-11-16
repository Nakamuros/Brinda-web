import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../core/config';
import { Page } from '../../models/page';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';

/** Forma de `OrderSummaryResponse`: fila de la lista, sin DNI. */
export interface OrderSummary {
  id: string;
  code: string;
  status: OrderStatus;
  customerName: string;
  districtName: string;
  total: number;
  paymentMethod: 'YAPE' | 'PLIN';
  createdAt: string;
  expiresAt: string;
}

/** Forma de `OrderDetailResponse`. Incluye el DNI: cada lectura queda en la auditoría. */
export interface OrderDetail {
  id: string;
  code: string;
  status: OrderStatus;
  firstName: string;
  lastName: string;
  phone: string;
  dni: string;
  address: string;
  reference: string | null;
  districtName: string;
  zoneName: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'YAPE' | 'PLIN';
  createdAt: string;
  expiresAt: string;
  confirmedAt: string | null;
  cancelReason: string | null;
  items: {
    productId: string;
    name: string;
    quantity: number;
    listPrice: number;
    unitPrice: number;
    promoDiscount: number | null;
    subtotal: number;
    promoType: 'OFFER' | 'BUY_X_PAY_Y' | null;
  }[];
}

export const ORDER_STATUS: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Anulado',
  EXPIRED: 'Vencido',
};

const BASE = `${API_URL}/admin/orders`;

@Injectable({ providedIn: 'root' })
export class OrdersAdmin {
  private readonly http = inject(HttpClient);

  /** Pedidos pendientes, para el aviso del menú (null = aún sin dato). */
  readonly pending = signal<number | null>(null);

  list(status: OrderStatus | '', page: number, size = 20): Promise<Page<OrderSummary>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) params = params.set('status', status);
    return firstValueFrom(this.http.get<Page<OrderSummary>>(BASE, { params }));
  }

  detail(id: string): Promise<OrderDetail> {
    return firstValueFrom(this.http.get<OrderDetail>(`${BASE}/${encodeURIComponent(id)}`));
  }

  confirm(id: string): Promise<OrderDetail> {
    return this.act(`${encodeURIComponent(id)}/confirm`, {});
  }

  cancel(id: string, reason: string): Promise<OrderDetail> {
    return this.act(`${encodeURIComponent(id)}/cancel`, { reason });
  }

  /** Texto listo para copiar: datos de entrega (`delivery`) o de boleta (`receipt`, lleva el DNI). */
  async copyText(id: string, kind: 'delivery' | 'receipt'): Promise<string> {
    const res = await firstValueFrom(
      this.http.get<{ text: string }>(`${BASE}/${encodeURIComponent(id)}/copy/${kind}`),
    );
    return res.text;
  }

  async refreshPending(): Promise<void> {
    try {
      const res = await firstValueFrom(this.http.get<{ pending: number }>(`${BASE}/pending-count`));
      this.pending.set(res.pending);
    } catch {
      // Sin dato: el menú no muestra contador.
      this.pending.set(null);
    }
  }

  private async act(path: string, body: object): Promise<OrderDetail> {
    const order = await firstValueFrom(this.http.post<OrderDetail>(`${BASE}/${path}`, body));
    void this.refreshPending();
    return order;
  }
}
