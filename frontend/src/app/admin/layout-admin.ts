import { Component, DestroyRef, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminAuth } from './admin-auth.service';
import { OrdersAdmin } from './pedidos/pedidos.service';

/** Cada cuánto se consulta el contador de pedidos pendientes. */
const PENDING_POLL_MS = 15_000;

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
            <a routerLink="/admin/pedidos" routerLinkActive="on">
              Pedidos
              @if (orders.pending(); as n) {
                <span class="pill" [attr.aria-label]="n + ' pendientes'">{{ n }}</span>
              }
            </a>
            <a routerLink="/admin/productos" routerLinkActive="on">Productos</a>
            <a routerLink="/admin/categorias" routerLinkActive="on">Categorías</a>
            <a routerLink="/admin/ventas" routerLinkActive="on">Ventas</a>
            <a routerLink="/admin/zonas" routerLinkActive="on">Zonas</a>
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
      flex-wrap: wrap;
      gap: 0 var(--space-4);
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
    .pill {
      display: inline-grid;
      place-items: center;
      min-width: 1.5rem;
      height: 1.5rem;
      margin-left: var(--space-2);
      padding-inline: 0.375rem;
      border-radius: 999px;
      background: var(--cream);
      color: var(--bg);
      font-weight: 700;
      letter-spacing: 0;
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
  protected readonly orders = inject(OrdersAdmin);
  private readonly router = inject(Router);

  constructor() {
    // Aviso de pedidos nuevos: solo con sesión iniciada.
    let timer: ReturnType<typeof setInterval> | undefined;
    effect(() => {
      clearInterval(timer);
      if (this.auth.user()) {
        void this.orders.refreshPending();
        timer = setInterval(() => void this.orders.refreshPending(), PENDING_POLL_MS);
      }
    });
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  protected async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/admin/login');
  }
}
