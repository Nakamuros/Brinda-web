import { Component, computed, input } from '@angular/core';
import { formatPrice } from './format';

/**
 * Aviso destacado de la tarifa de delivery (no es letra pequeña). `fee` es la tarifa mínima de los distritos
 * entregables que devuelve la API; si no se pudo cargar (null), el aviso sale sin la cifra.
 */
@Component({
  selector: 'app-delivery-notice',
  template: `
    <div class="notice" role="note" aria-labelledby="delivery-notice-title">
      <svg
        class="icon"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="6" cy="17" r="2" />
        <circle cx="18" cy="17" r="2" />
        <path d="M8 17h6l2-6h3l1 3v3h-2M4 17H3v-4l3-5h5v9" />
      </svg>
      <div>
        @if (from(); as f) {
          <p id="delivery-notice-title" class="title">Delivery desde {{ f }}.</p>
        } @else {
          <p id="delivery-notice-title" class="title">Sobre la tarifa de delivery</p>
        }
        <p class="text">
          La tarifa puede aumentar según la dirección, el contenido del pedido y la hora de envío. El
          monto final te lo confirmamos por WhatsApp antes de pagar.
        </p>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .notice {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: var(--space-3);
      align-items: start;
      padding: var(--space-4);
      color: var(--cream);
      background: var(--bg-deep);
      border: 1px solid var(--brass);
      border-radius: var(--radius);
    }
    .icon {
      color: var(--brass);
      margin-top: 0.15em;
    }
    .title {
      font-family: var(--font-display);
      font-size: var(--step-1);
      font-weight: 700;
      line-height: 1.3;
    }
    .text {
      margin-top: var(--space-2);
      font-size: var(--step-0);
      line-height: 1.5;
    }
  `,
})
export class DeliveryNotice {
  readonly fee = input<number | null>(null);
  protected readonly from = computed(() => {
    const fee = this.fee();
    return fee === null ? '' : formatPrice(fee);
  });
}
