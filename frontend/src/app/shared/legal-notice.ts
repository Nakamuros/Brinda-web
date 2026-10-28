import { Component, input } from '@angular/core';
import { LEGAL } from '../core/config';

/** Avisos legales de texto fijo (config.ts → LEGAL): advertencia de alcohol y aviso de menores. */
@Component({
  selector: 'app-legal-notice',
  template: `
    @if (kind() === 'alcohol') {
      <p class="alcohol">{{ alcohol }}</p>
    } @else {
      <p class="minors" role="note">{{ minors }}</p>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    p {
      color: var(--cream);
      line-height: 1.5;
    }
    .alcohol {
      font-size: var(--step-0);
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-align: center;
    }
    .minors {
      margin-block: var(--space-4);
      padding: var(--space-3) var(--space-4);
      font-size: var(--step-0);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: color-mix(in srgb, var(--bg-deep) 55%, transparent);
    }
  `,
})
export class LegalNotice {
  readonly kind = input<'alcohol' | 'minors'>('alcohol');
  protected readonly alcohol = LEGAL.alcoholWarning;
  protected readonly minors = LEGAL.minorsNotice;
}
