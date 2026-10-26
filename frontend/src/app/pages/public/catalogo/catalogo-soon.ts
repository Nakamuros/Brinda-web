import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../shared/reveal.directive';

/** "Catálogo muy pronto": lo que se ve en producción mientras no haya API ni productos reales. */
@Component({
  selector: 'app-catalogo-soon',
  imports: [RouterLink, RevealDirective],
  template: `
    <section class="soon candle-edge" aria-labelledby="soon-title">
      <div class="container inner">
        <h1 id="soon-title" class="title" appReveal="lines">
          <span class="line"><span>Catálogo</span></span>
          <span class="line"
            ><span><span class="accent">muy pronto</span></span></span
          >
        </h1>
        <p class="lead" appReveal>
          Estamos preparando la selección completa. Mientras tanto, conoce cómo pedir.
        </p>
        <a class="btn btn-ghost" routerLink="/" fragment="como-pedir">Cómo pedir</a>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    .soon {
      position: relative;
      isolation: isolate;
      display: grid;
      align-items: center;
      min-height: calc(100svh - var(--nav-h) - var(--announce-h));
      padding-block: var(--space-8);
      text-align: center;
    }
    .inner {
      display: grid;
      justify-items: center;
      gap: var(--space-5);
    }
    .title {
      font-size: var(--step-4);
      font-weight: 700;
      line-height: 1.04;
    }
    .line {
      display: block;
      overflow: clip;
      padding-bottom: 0.12em;
    }
    .line > span {
      display: block;
    }
    .lead {
      max-width: 40ch;
      font-family: var(--font-display);
      font-style: italic;
      font-size: var(--step-1);
      line-height: 1.6;
      color: var(--text-soft);
    }
  `,
})
export class CatalogoSoon {}
