import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminAuth } from './admin-auth.service';

/** Marco del panel (sin barra de anuncio, sin carrito ni control de edad: no es la tienda). */
@Component({
  selector: 'app-layout-admin',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <a class="skip" href="#panel">Saltar al contenido</a>
    <header class="bar">
      <div class="container inner">
        <a class="brand" routerLink="/admin">BRINDA <span class="tag">Panel</span></a>
        @if (auth.user(); as u) {
          <nav class="nav" aria-label="Panel">
            <a routerLink="/admin/reclamos" routerLinkActive="on">Reclamos</a>
          </nav>
          <div class="who">
            <span class="name">{{ u.username }}</span>
            <button type="button" class="out" (click)="logout()">Salir</button>
          </div>
        }
      </div>
    </header>
    <main id="panel" tabindex="-1" class="container"><router-outlet /></main>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100svh;
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
    .bar {
      border-bottom: 1px solid var(--line-soft);
      background: var(--bg-deep);
    }
    .inner {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-2) var(--space-5);
      min-height: 3.5rem;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: var(--space-3);
      min-height: 2.75rem;
      font-family: var(--font-display);
      font-weight: 700;
      letter-spacing: 0.32em;
      text-decoration: none;
    }
    .tag {
      font-family: var(--font-text);
      font-size: var(--step--1);
      font-weight: 500;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--text-soft);
    }
    .nav {
      display: flex;
      gap: var(--space-4);
      margin-right: auto;
    }
    .nav a,
    .out {
      display: inline-flex;
      align-items: center;
      min-height: 2.75rem;
      padding-inline: var(--space-2);
      font-size: var(--step--1);
      letter-spacing: 0.14em;
      text-transform: uppercase;
      text-decoration: none;
      border-bottom: 1px solid transparent;
    }
    .nav a:hover,
    .nav a.on {
      border-bottom-color: var(--brass);
    }
    .who {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-left: auto;
    }
    .name {
      font-size: var(--step--1);
      color: var(--text-soft);
    }
    .out {
      background: none;
      border: 1px solid var(--line-soft);
      border-radius: var(--radius);
      color: var(--cream);
      font-family: inherit;
      cursor: pointer;
      transition: border-color 0.25s ease, background-color 0.25s ease;
    }
    .out:hover {
      border-color: var(--cream);
    }
    main:focus {
      outline: none;
    }
  `,
})
export class LayoutAdmin {
  protected readonly auth = inject(AdminAuth);
  private readonly router = inject(Router);

  protected async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/admin/login');
  }
}
