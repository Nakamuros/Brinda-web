import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Página provisional: solo existe para probar la transición entre páginas. */
@Component({
  selector: 'app-catalogo-provisional',
  imports: [RouterLink],
  template: `
    <section class="wrap container">
      <h1>Catálogo <span class="accent">en camino</span></h1>
      <p>Estamos preparando la selección completa. Mientras tanto, vuelve al inicio.</p>
      <a class="btn btn-ghost" routerLink="/">Volver al inicio</a>
    </section>
  `,
  styles: `
    .wrap {
      display: grid;
      justify-items: center;
      align-content: center;
      gap: var(--space-5);
      min-height: calc(100dvh - var(--nav-h) - var(--announce-h));
      padding-block: var(--space-8);
      text-align: center;
    }
    h1 {
      font-size: var(--step-3);
    }
    p {
      max-width: 36ch;
      color: var(--text-soft);
    }
  `,
})
export class CatalogoProvisional {}
