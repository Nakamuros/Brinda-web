import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES, IMAGES } from '../../../../core/config';
import { BottlePlaceholder } from '../../../../shared/bottle-placeholder';
import { RevealDirective } from '../../../../shared/reveal.directive';

@Component({
  selector: 'app-categories',
  imports: [RouterLink, RevealDirective, BottlePlaceholder],
  template: `
    <section id="categorias" class="cats ambient candle-edge" aria-labelledby="cats-title">
      <div class="container">
        <h2 id="cats-title" class="title" appReveal>Para cada ocasión</h2>
        <p class="hint" aria-hidden="true">Desliza para ver más</p>
      </div>
      <ul class="rail" appReveal="stagger" aria-label="Categorías">
        @for (c of categories; track c.id) {
          <li class="tile" [attr.data-cat]="c.id">
            <a routerLink="/catalogo" [queryParams]="{ categoria: c.id }" [attr.aria-label]="'Ver ' + c.name + ' en el catálogo'">
              <span class="media">
                @if (image(c.id); as src) {
                  <img [src]="src" [alt]="c.name" loading="lazy" decoding="async" />
                } @else {
                  <app-bottle-placeholder class="ph" />
                }
              </span>
              <span class="name">{{ c.name }}</span>
            </a>
          </li>
        }
      </ul>
    </section>
  `,
  styleUrl: './categories.css',
})
export class Categories {
  protected readonly categories = CATEGORIES;
  protected image(id: string): string {
    return IMAGES.categories[id] ?? '';
  }
}
