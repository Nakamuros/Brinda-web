import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollService } from '../core/scroll.service';

/** Barra fija "Pedir" para celular y tablet: aparece al dejar atrás el hero. */
@Component({
  selector: 'app-order-bar',
  imports: [RouterLink],
  template: `
    <div class="bar" [class.visible]="visible()" [attr.aria-hidden]="!visible()" [attr.inert]="visible() ? null : ''">
      <a class="btn btn-cta" routerLink="/catalogo">Pedir ahora</a>
    </div>
  `,
  styles: `
    .bar {
      position: fixed;
      inset: auto 0 0 0;
      z-index: 40;
      padding: var(--space-3) var(--gutter) calc(var(--space-3) + env(safe-area-inset-bottom));
      background: color-mix(in srgb, var(--bg-deep) 96%, transparent);
      border-top: 1px solid var(--line);
      transform: translateY(110%);
      transition: transform 0.6s var(--ease-out);
    }
    .bar.visible {
      transform: none;
    }
    .btn {
      width: 100%;
      min-height: 3rem;
    }
    @media (min-width: 64rem) {
      .bar {
        display: none;
      }
    }
  `,
})
export class OrderBar {
  private readonly scroll = inject(ScrollService);
  protected readonly visible = computed(() => this.scroll.pastHero() && !this.scroll.ctaInView());
}
