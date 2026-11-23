import { Component, computed, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ORDER } from '../../../core/config';
import { OrderService, safeWhatsappUrl } from '../../../services/order.service';
import { formatPrice } from '../../../shared/format';
import { LegalNotice } from '../../../shared/legal-notice';
import { StatePanel } from '../../../shared/state-panel';

const HOUR = new Intl.DateTimeFormat('es-PE', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'America/Lima',
});
const METHOD = { YAPE: 'Yape', PLIN: 'Plin' } as const;

/**
 * Confirmación del pedido recién creado. Lo primero que se ve es el paso pendiente: enviar el pedido
 * por WhatsApp. El detalle vive solo en memoria (`OrderService.last`); al recargar quedan el código y
 * el enlace de WhatsApp (1 h 30 min), que no llevan datos personales.
 */
@Component({
  selector: 'app-pedido-creado',
  imports: [LegalNotice, NgTemplateOutlet, RouterLink, StatePanel],
  templateUrl: './pedido-creado.html',
  styleUrls: ['./pedido.css', './pedido-creado.css'],
})
export class PedidoCreado {
  private readonly code = inject(ActivatedRoute).snapshot.paramMap.get('codigo');
  private readonly orders = inject(OrderService);
  private readonly last = this.orders.last;

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
  protected readonly method = computed(() => {
    const o = this.order();
    return o ? METHOD[o.payment.method] : '';
  });
  /** Solo un enlace wa.me del servidor; sin número configurado llega null y se muestra el aviso. */
  protected readonly whatsappUrl = computed(() =>
    safeWhatsappUrl(this.order()?.whatsappUrl ?? this.saved()?.whatsappUrl),
  );
}
