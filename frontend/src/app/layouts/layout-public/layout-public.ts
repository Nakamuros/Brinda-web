import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnnouncementBar } from './announcement-bar';
import { SiteFooter } from './site-footer';
import { SiteNav } from './site-nav';

@Component({
  selector: 'app-layout-public',
  imports: [RouterOutlet, AnnouncementBar, SiteNav, SiteFooter],
  template: `
    <a class="skip" href="#contenido">Saltar al contenido</a>
    <app-announcement-bar />
    <app-site-nav />
    <main id="contenido" tabindex="-1"><router-outlet /></main>
    <app-site-footer />
  `,
  styles: `
    .skip {
      position: absolute;
      left: var(--space-3);
      top: var(--space-3);
      z-index: 100;
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
export class LayoutPublic {}
