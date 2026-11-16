import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

/**
 * Página legal aún sin texto (/terminos, /privacidad): el contenido lo entrega el asesor de Lucía.
 * No inventar ni parafrasear textos legales aquí.
 */
@Component({
  selector: 'app-legal-soon',
  imports: [RouterLink],
  template: `
    <section class="head candle-edge" aria-labelledby="legal-title">
      <div class="container">
        <h1 id="legal-title" class="title">{{ heading }}</h1>
        <p class="lead">Próximamente</p>
      </div>
    </section>
    <div class="container body">
      <p>Este documento aún no está publicado.</p>
      <a class="home" routerLink="/">Volver al inicio</a>
    </div>
  `,
  styleUrl: '../libro-reclamaciones/libro-reclamaciones.css',
  styles: `
    .home {
      justify-self: start;
      display: inline-flex;
      align-items: center;
      min-height: 2.75rem;
      font-size: var(--step--1);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      text-decoration-color: var(--brass);
      text-underline-offset: 0.35em;
    }
  `,
})
export class LegalSoon {
  protected readonly heading: string = inject(ActivatedRoute).snapshot.data['heading'];
}
