import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { formatPrice } from '../../shared/format';
import { apiError } from '../admin-auth.service';
import { formatDateTime } from '../reclamos/reclamo.models';
import { ORDER_STATUS, OrderDetail, OrdersAdmin } from './pedidos.service';

const MAX_REASON = 255;

@Component({
  selector: 'app-pedido-detalle',
  imports: [RouterLink],
  styleUrls: ['../admin-ui.css', '../reclamos/reclamo-detalle.css', './pedido-detalle.css'],
  templateUrl: './pedido-detalle.html',
})
export class PedidoDetalle implements OnInit {
  private readonly api = inject(OrdersAdmin);
  private readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';

  protected readonly o = signal<OrderDetail | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  /** Paso de confirmación abierto: finalizar o anular. */
  protected readonly asking = signal<'confirm' | 'cancel' | null>(null);
  protected readonly reason = signal('');
  protected readonly saving = signal(false);
  protected readonly actionError = signal('');
  /** Texto pedido al servidor para copiar (entrega o boleta). */
  protected readonly copied = signal<{ label: string; text: string; ok: boolean } | null>(null);

  protected readonly maxReason = MAX_REASON;
  protected readonly money = formatPrice;

  protected readonly view = computed(() => {
    const o = this.o();
    if (!o) {
      return null;
    }
    return {
      status: ORDER_STATUS[o.status],
      created: formatDateTime(o.createdAt),
      expires: formatDateTime(o.expiresAt),
      confirmed: o.confirmedAt ? formatDateTime(o.confirmedAt) : '',
      payment: o.paymentMethod === 'YAPE' ? 'Yape' : 'Plin',
      // Un pedido vencido aún se puede confirmar si el pago llegó tarde.
      canConfirm: o.status === 'PENDING' || o.status === 'EXPIRED',
      canCancel: o.status !== 'CANCELLED',
      restock: o.status === 'CONFIRMED',
    };
  });

  ngOnInit(): void {
    void this.load();
  }

  protected async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      this.o.set(await this.api.detail(this.id));
    } catch (e) {
      this.error.set(apiError(e, 'No se pudo cargar el pedido.'));
    } finally {
      this.loading.set(false);
    }
  }

  protected ask(step: 'confirm' | 'cancel' | null): void {
    this.actionError.set('');
    this.asking.set(step);
  }

  protected async confirm(): Promise<void> {
    await this.run(() => this.api.confirm(this.id), 'No se pudo confirmar el pedido.');
  }

  protected async cancel(): Promise<void> {
    const reason = this.reason().trim();
    if (!reason) {
      this.actionError.set('Escribe el motivo de la anulación.');
      return;
    }
    await this.run(() => this.api.cancel(this.id, reason), 'No se pudo anular el pedido.');
  }

  protected async copy(kind: 'delivery' | 'receipt'): Promise<void> {
    const label = kind === 'delivery' ? 'Datos de entrega' : 'Datos para la boleta';
    this.actionError.set('');
    try {
      const text = await this.api.copyText(this.id, kind);
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        // Sin permiso de portapapeles: el texto queda a la vista para copiarlo a mano.
      }
      this.copied.set({ label, text, ok });
    } catch (e) {
      this.actionError.set(apiError(e, 'No se pudo obtener el texto.'));
    }
  }

  private async run(action: () => Promise<OrderDetail>, fallback: string): Promise<void> {
    if (this.saving()) {
      return;
    }
    this.saving.set(true);
    this.actionError.set('');
    try {
      this.o.set(await action());
      this.asking.set(null);
      this.reason.set('');
    } catch (e) {
      this.actionError.set(apiError(e, fallback));
    } finally {
      this.saving.set(false);
    }
  }
}
