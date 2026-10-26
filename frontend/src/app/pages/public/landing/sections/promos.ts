import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROMO_EXAMPLES } from '../../../../core/config';
import { BottlePlaceholder } from '../../../../shared/bottle-placeholder';
import { RevealDirective } from '../../../../shared/reveal.directive';

@Component({
  selector: 'app-promos',
  imports: [RouterLink, RevealDirective, BottlePlaceholder],
  template: `
    <section id="promos" class="promos" aria-labelledby="promos-title">
      <div class="container">
        <h2 id="promos-title" class="title" appReveal>Combos y <span class="accent">promociones</span></h2>

        <ul class="grid" appReveal="stagger">
          @for (p of promos; track p.tag) {
            <li class="card" [class.featured]="p.featured">
              <div class="visual" aria-hidden="true">
                <app-bottle-placeholder class="ph" />
              </div>
              <div class="info">
                <span class="chip">{{ p.tag }}</span>
                <h3>{{ p.title }}</h3>
                <p>{{ p.text }}</p>
                <a class="more" routerLink="/catalogo">Ver en el catálogo</a>
              </div>
            </li>
          }
        </ul>

        <p class="note">Ejemplos ilustrativos. Las promociones vigentes se mostrarán en el catálogo.</p>
      </div>
    </section>
  `,
  styleUrl: './promos.css',
})
export class Promos {
  protected readonly promos = PROMO_EXAMPLES;
}
