import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DOCUMENT_LABEL, PAYMENT_LABEL } from '../../models/order';
import { formatPrice } from '../../shared/format';
import { apiError } from '../admin-auth.service';
import { formatDateTime } from '../reclamos/reclamo.models';
import { ORDER_STATUS, OrderDetail, OrdersAdmin } from './pedidos.service';

const MAX_REASON = 255;
/** Soles con hasta 2 decimales (punto o coma). El tope lo valida el servidor (`brinda.order.max-delivery-fee`). */
const FEE = /^\d{1,6}([.,]\d{1,2})?$/;

@Component({
  selector: 'app-pedido-detalle',
  imports: [NgTemplateOutlet, RouterLink],
  styleUrls: ['../admin-ui.css', '../reclamos/reclamo-detalle.css', './pedido-detalle.css'],
  templateUrl: './pedido-detalle.html',
})
export class PedidoDetalle implements OnInit {
  private readonly api = inject(OrdersAdmin);
  private readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';

  protected readonly o = signal<OrderDetail | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  /** Paso abierto: confirmar el pago, anular o corregir el delivery de un pedido confirmado. */
  protected readonly asking = signal<'confirm' | 'cancel' | 'fix' | null>(null);
  /** "Delivery cobrado (S/)": empieza vacío, sin valor por defecto. */
  protected readonly feeText = signal('');
  /** S/ 0 solo con confirmación explícita. */
  protected readonly freeOk = signal(false);
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
      payment: PAYMENT_LABEL[o.paymentMethod],
      document: DOCUMENT_LABEL[o.documentType] ?? o.documentType,
      marketing: o.marketingConsent
        ? `Aceptó${o.marketingConsentAt ? ' el ' + formatDateTime(o.marketingConsentAt) : ''}`
        : 'No aceptó',
      // Lo cobrado si ya se confirmó; en pedidos sin confirmar o antiguos, el estimado.
      // La API omite los nulos: sin confirmar (o antes de V11) estos campos no vienen.
      final: o.finalDeliveryFee != null && o.finalTotal != null ? { fee: o.finalDeliveryFee, total: o.finalTotal } : null,
      charged: o.finalTotal ?? o.total,
      // Un pedido vencido aún se puede confirmar si el pago llegó tarde.
      canConfirm: o.status === 'PENDING' || o.status === 'EXPIRED',
      canCancel: o.status !== 'CANCELLED',
      restock: o.status === 'CONFIRMED',
    };
  });

  /** Delivery escrito, en soles; null si está vacío o no es un monto válido. */
  protected readonly fee = computed(() => {
    const t = this.feeText().trim();
    return FEE.test(t) ? Number(t.replace(',', '.')) : null;
  });
  protected readonly feeError = computed(() =>
    this.feeText().trim() && this.fee() === null ? 'Escribe un monto en soles, con hasta 2 decimales.' : '',
  );
  /** Total final en vivo: productos (con promociones) + delivery cobrado. */
  protected readonly finalTotal = computed(() => {
    const o = this.o();
    const fee = this.fee();
    return o && fee !== null ? Math.round((o.subtotal + fee) * 100) / 100 : null;
  });
  protected readonly feeValid = computed(() => {
    const fee = this.fee();
    return fee !== null && (fee > 0 || this.freeOk());
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

  protected ask(step: 'confirm' | 'cancel' | 'fix' | null): void {
    this.actionError.set('');
    if (step === 'fix') {
      this.setFee('');
    }
    this.asking.set(step);
  }

  protected setFee(text: string): void {
    this.feeText.set(text);
    this.freeOk.set(false);
  }

  protected async confirm(): Promise<void> {
    const fee = this.fee();
    if (fee === null || !this.feeValid()) {
      return;
    }
    await this.run(() => this.api.confirm(this.id, fee, fee === 0), 'No se pudo confirmar el pedido.');
  }

  protected async fixDelivery(): Promise<void> {
    const fee = this.fee();
    if (fee === null || !this.feeValid()) {
      return;
    }
    await this.run(() => this.api.fixDelivery(this.id, fee, fee === 0), 'No se pudo corregir el delivery.');
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
      this.setFee('');
      this.copied.set(null); // el texto copiado antes ya no refleja los montos nuevos
    } catch (e) {
      this.actionError.set(apiError(e, fallback));
    } finally {
      this.saving.set(false);
    }
  }
}
