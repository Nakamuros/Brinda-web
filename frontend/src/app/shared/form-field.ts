import { Component, input } from '@angular/core';

/** Etiqueta + control proyectado + ayuda o error. El control debe llevar `[id]="controlId"`. */
@Component({
  selector: 'app-field',
  template: `
    <div class="field">
      <label class="label" [attr.for]="controlId()">
        {{ label() }}
        @if (optional()) {
          <span class="opt">(opcional)</span>
        }
      </label>
      <ng-content />
      @if (error(); as e) {
        <p class="msg" [id]="controlId() + '-msg'" role="alert">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v5.5M12 16.5v.01" />
          </svg>
          {{ e }}
        </p>
      } @else if (hint(); as h) {
        <p class="msg hint" [id]="controlId() + '-msg'">{{ h }}</p>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .field {
      display: grid;
      gap: var(--space-2);
    }
    .label {
      font-size: var(--step--1);
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .opt {
      letter-spacing: 0.04em;
      text-transform: none;
      color: var(--text-soft);
    }
    .msg {
      display: flex;
      align-items: flex-start;
      gap: var(--space-2);
      font-size: var(--step--1);
      line-height: 1.45;
    }
    .msg svg {
      flex: none;
      margin-top: 0.1rem;
      color: var(--promo);
    }
    .hint {
      color: var(--text-soft);
    }
  `,
})
export class FormField {
  readonly label = input.required<string>();
  readonly controlId = input.required<string>();
  readonly error = input('');
  readonly hint = input('');
  readonly optional = input(false);
}
