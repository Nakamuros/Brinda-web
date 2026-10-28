import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgeGate } from '../../core/age-gate.service';
import { CartService } from '../../services/cart.service';
import { AgeGateDialog } from './age-gate';
import { AnnouncementBar } from './announcement-bar';
import { SiteFooter } from './site-footer';
import { SiteNav } from './site-nav';

@Component({
  selector: 'app-layout-public',
  imports: [RouterOutlet, AgeGateDialog, AnnouncementBar, SiteNav, SiteFooter],
  template: `
    <div class="page" [attr.inert]="gate.open() ? '' : null">
      <a class="skip" href="#contenido">Saltar al contenido</a>
      <app-announcement-bar />
      <app-site-nav />
      <main id="contenido" tabindex="-1"><router-outlet /></main>
      <p class="sr-only" role="status">{{ cart.announcement() }}</p>
      <app-site-footer />
    </div>
    <app-age-gate />
  `,
  styles: `
    .page {
      display: contents;
    }
    .skip {
      position: absolute;
      left: var(--space-3);
      top: var(--space-3);
      z-index: 100;
      display: inline-flex;
      align-items: center;
      min-height: 2.75rem;
      padding: var(--space-2) var(--space-4);
      background: var(--cream);
      color: var(--bg);
      transform: translateY(-200%);
    }
    .skip:focus {
      transform: none;
    }
    main:focus {
      outline: none;
    }
  `,
})
export class LayoutPublic {
  protected readonly cart = inject(CartService);
  protected readonly gate = inject(AgeGate);
}
