import { Component, computed, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ORDER } from '../../../core/config';
import { PAYMENT_LABEL } from '../../../models/order';
import { DeliveryService } from '../../../services/delivery.service';
import { OrderService, safeWhatsappUrl } from '../../../services/order.service';
import { DeliveryNotice } from '../../../shared/delivery-notice';
import { formatPrice } from '../../../shared/format';
import { LegalNotice } from '../../../shared/legal-notice';
import { StatePanel } from '../../../shared/state-panel';

const HOUR = new Intl.DateTimeFormat('es-PE', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'America/Lima',
});

/**
 * Confirmación del pedido recién creado. Lo primero que se ve es el paso pendiente: enviar el pedido
 * por WhatsApp. El detalle vive solo en memoria (`OrderService.last`); al recargar quedan el código, el
 * enlace de WhatsApp y los datos para pagar (1 h 30 min), que no llevan datos personales.
 */
@Component({
  selector: 'app-pedido-creado',
  imports: [DeliveryNotice, LegalNotice, NgTemplateOutlet, RouterLink, StatePanel],
  templateUrl: './pedido-creado.html',
  styleUrls: ['./pedido.css', './pedido-creado.css'],
})
export class PedidoCreado {
  private readonly code = inject(ActivatedRoute).snapshot.paramMap.get('codigo');
  private readonly orders = inject(OrderService);
  private readonly last = this.orders.last;
  protected readonly delivery = inject(DeliveryService);

  protected readonly minutes = ORDER.expiryMinutes;
  protected readonly money = formatPrice;

  protected readonly order = computed(() => {
    const o = this.last();
    return o && o.code === this.code ? o : null;
  });
  /** Tras recargar o volver más tarde: solo queda el código (1 h 30 min), sin el detalle. */
  private readonly saved = computed(() => {
    const recent = this.orders.recent();
    return !this.order() && recent?.code === this.code ? recent : null;
  });
  protected readonly savedCode = computed(() => this.saved()?.code ?? null);
  protected readonly expiresAt = computed(() => {
    const o = this.order();
    return o ? HOUR.format(new Date(o.expiresAt)) : '';
  });
  /** Datos para pagar: del pedido en memoria o, tras recargar, los guardados junto al código. */
  protected readonly payment = computed(() => this.order()?.payment ?? this.saved()?.payment ?? null);
  protected readonly method = computed(() => {
    const p = this.payment();
    return p ? PAYMENT_LABEL[p.method] : '';
  });
  /** Solo un enlace wa.me del servidor; sin número configurado llega null y se muestra el aviso. */
  protected readonly whatsappUrl = computed(() =>
    safeWhatsappUrl(this.order()?.whatsappUrl ?? this.saved()?.whatsappUrl),
  );

  constructor() {
    void this.delivery.load(); // "Delivery desde S/ X" sale de la API
  }
}
