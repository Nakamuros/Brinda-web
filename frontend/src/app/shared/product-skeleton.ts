import { Component } from '@angular/core';

/** Tarjeta de carga con la misma forma que `app-product-card`. */
@Component({
  selector: 'app-product-skeleton',
  template: `<span class="media"></span><span class="line"></span><span class="line short"></span>`,
  styles: `
    :host {
      display: grid;
      gap: var(--space-3);
      padding-bottom: var(--space-4);
      overflow: clip;
      background: color-mix(in srgb, var(--bg-deep) 55%, transparent);
      border: 1px solid var(--line-soft);
      border-radius: var(--radius-lg);
      animation: pulse 1.6s ease-in-out infinite alternate;
    }
    .media {
      aspect-ratio: 4 / 4.6;
      background: color-mix(in srgb, var(--bg-alt) 70%, var(--bg));
    }
    .line {
      height: 0.875rem;
      margin-inline: var(--space-4);
      background: var(--line-soft);
      border-radius: 2px;
    }
    .short {
      width: 40%;
    }
    @keyframes pulse {
      to {
        opacity: 0.55;
      }
    }
  `,
})
export class ProductSkeleton {}
