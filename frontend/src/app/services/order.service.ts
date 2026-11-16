import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../core/config';
import { CreateOrderRequest, CreatedOrder } from '../models/order';

export interface OrderFailure {
  message: string;
  /** Errores por campo del servidor (400). */
  fields: Record<string, string>;
  /** El problema está en el carrito (stock o producto no disponible). */
  cart: boolean;
}

/** Traduce el error de `POST /orders` a un mensaje claro. No incluye ni registra datos del cliente. */
export function orderFailure(error: unknown): OrderFailure {
  const res = error instanceof HttpErrorResponse ? error : null;
  const body = res?.error && typeof res.error === 'object' ? res.error : {};
  const fail = (message: string, extra: Partial<OrderFailure> = {}): OrderFailure => ({
    message,
    fields: {},
    cart: false,
    ...extra,
  });
  switch (res?.status) {
    case 400:
      return fail('Revisa los datos marcados e inténtalo de nuevo.', {
        fields: typeof body.fields === 'object' && body.fields ? body.fields : {},
      });
    case 409:
    case 422:
      // Regla de negocio (stock insuficiente, producto o distrito no disponible): el servidor dice cuál.
      return typeof body.message === 'string' && body.code === 'BUSINESS_RULE'
        ? fail(`${body.message}.`, { cart: true })
        : fail('No pudimos registrar tu pedido. Revisa tu carrito e inténtalo de nuevo.', {
            cart: true,
          });
    case 429:
      return fail('Hiciste demasiados intentos seguidos. Espera un minuto y vuelve a intentarlo.');
    case 0:
      return fail('No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.');
    default:
      return fail('Ocurrió un error al registrar tu pedido. Inténtalo de nuevo en un momento.');
  }
}

const RECENT_KEY = 'brinda.order.v1';
/** Tiempo que el código del último pedido se recuerda en el navegador. */
const RECENT_MS = 90 * 60 * 1000;

/** Lo único que se guarda del pedido en el navegador: su código y cuándo se creó. Sin datos personales. */
export interface RecentOrder {
  code: string;
  at: number;
}

function readRecent(): RecentOrder | null {
  try {
    const r = JSON.parse(localStorage.getItem(RECENT_KEY) ?? 'null');
    const fresh =
      typeof r?.code === 'string' &&
      /^[A-Z]{2}\d{2,4}$/.test(r.code) &&
      typeof r.at === 'number' &&
      Date.now() - r.at < RECENT_MS;
    return fresh ? { code: r.code, at: r.at } : null;
  } catch {
    return null;
  }
}

/**
 * Crea el pedido. El detalle vive solo en memoria (su enlace de WhatsApp lleva datos personales);
 * el código se recuerda 1 h 30 min en el navegador para que el cliente no lo pierda al recargar o cerrar.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  readonly last = signal<CreatedOrder | null>(null);
  readonly recent = signal<RecentOrder | null>(readRecent());

  async create(request: CreateOrderRequest): Promise<CreatedOrder> {
    const order = await firstValueFrom(this.http.post<CreatedOrder>(`${API_URL}/orders`, request));
    this.last.set(order);
    const recent: RecentOrder = { code: order.code, at: Date.now() };
    this.recent.set(recent);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    } catch {
      // Sin almacenamiento: el código solo se ve hasta recargar.
    }
    return order;
  }
}
