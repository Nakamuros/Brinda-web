import { Component, computed, input, output } from '@angular/core';
import { MAX_QTY } from '../services/cart.service';

/** Selector de cantidad: − y + de 44 px; con cantidad 1 el "−" quita el producto. */
@Component({
  selector: 'app-qty-stepper',
  template: `
    <div class="stepper" role="group" [attr.aria-label]="'Cantidad de ' + label()">
      <button
        type="button"
        class="btn-qty"
        [attr.aria-label]="qty() <= 1 ? 'Quitar ' + label() : 'Disminuir cantidad de ' + label()"
        (click)="dec.emit()"
      >
        @if (qty() <= 1) {
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" />
          </svg>
        } @else {
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M6 12h12" />
          </svg>
        }
      </button>
      <output class="qty" aria-live="off">{{ qty() }}</output>
      <button
        type="button"
        class="btn-qty"
        [disabled]="atMax()"
        [attr.aria-label]="'Aumentar cantidad de ' + label()"
        (click)="inc.emit()"
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M6 12h12M12 6v12" />
        </svg>
      </button>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .stepper {
      display: grid;
      grid-template-columns: 2.75rem 1fr 2.75rem;
      align-items: center;
      height: 2.75rem;
    }
    .btn-qty {
      display: grid;
      place-items: center;
      width: 100%;
      height: 100%;
      padding: 0;
      color: var(--cream);
      cursor: pointer;
      background: none;
      border: 0;
      transition:
        background-color 0.25s ease,
        color 0.25s ease;
    }
    .btn-qty:hover {
      background: color-mix(in srgb, var(--cream) 10%, transparent);
    }
    .btn-qty:active {
      background: color-mix(in srgb, var(--cream) 18%, transparent);
    }
    .btn-qty:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .btn-qty:focus-visible {
      outline-offset: -4px;
    }
    .qty {
      text-align: center;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }
  `,
})
export class QtyStepper {
  readonly qty = input.required<number>();
  readonly label = input.required<string>();
  readonly inc = output<void>();
  readonly dec = output<void>();

  protected readonly atMax = computed(() => this.qty() >= MAX_QTY);
}
