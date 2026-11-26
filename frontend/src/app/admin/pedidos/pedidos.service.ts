import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../core/config';
import { DocumentType, PaymentMethod } from '../../models/order';
import { Page } from '../../models/page';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';

/** Forma de `OrderSummaryResponse`: fila de la lista, sin documento. `total`: el cobrado si ya se confirmó. */
export interface OrderSummary {
  id: string;
  code: string;
  status: OrderStatus;
  customerName: string;
  districtName: string;
  total: number;
  paymentMethod: PaymentMethod;
  marketingConsent: boolean;
  createdAt: string;
  expiresAt: string;
}

/**
 * Forma de `OrderDetailResponse`. Incluye el documento: cada lectura queda en la auditoría.
 * `deliveryFee`/`total` son los estimados; `finalDeliveryFee`/`finalTotal`, lo cobrado al confirmar (null si no
 * se confirmó o el pedido es anterior a V11). La API omite los nulos: pueden no venir.
 */
export interface OrderDetail {
  id: string;
  code: string;
  status: OrderStatus;
  firstName: string;
  lastName: string;
  phone: string;
  documentType: DocumentType;
  documentNumber?: string | null;
  address: string;
  reference: string | null;
  districtName: string;
  zoneName: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  finalDeliveryFee?: number | null;
  finalTotal?: number | null;
  paymentMethod: PaymentMethod;
  marketingConsent: boolean;
  marketingConsentAt?: string | null;
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

  /** `marketing`: true = solo quienes aceptaron promociones; false = quienes no; null = todos. */
  list(
    status: OrderStatus | '',
    page: number,
    size = 20,
    marketing: boolean | null = null,
  ): Promise<Page<OrderSummary>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) params = params.set('status', status);
    if (marketing !== null) params = params.set('marketing', marketing);
    return firstValueFrom(this.http.get<Page<OrderSummary>>(BASE, { params }));
  }

  detail(id: string): Promise<OrderDetail> {
    return firstValueFrom(this.http.get<OrderDetail>(`${BASE}/${encodeURIComponent(id)}`));
  }

  /** Confirma el pago con el delivery cobrado (S/ 0 exige `zeroFeeConfirmed`). */
  confirm(id: string, deliveryFee: number, zeroFeeConfirmed: boolean): Promise<OrderDetail> {
    return this.act(`${encodeURIComponent(id)}/confirm`, { deliveryFee, zeroFeeConfirmed });
  }

  /** Corrige el delivery cobrado de un pedido ya confirmado (queda en la auditoría). */
  fixDelivery(id: string, deliveryFee: number, zeroFeeConfirmed: boolean): Promise<OrderDetail> {
    return this.act(`${encodeURIComponent(id)}/delivery-fee`, { deliveryFee, zeroFeeConfirmed });
  }

  cancel(id: string, reason: string): Promise<OrderDetail> {
    return this.act(`${encodeURIComponent(id)}/cancel`, { reason });
  }

  /** Texto listo para copiar: datos de entrega (`delivery`) o de boleta (`receipt`, lleva el documento). */
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
