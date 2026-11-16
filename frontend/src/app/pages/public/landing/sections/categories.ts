import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../../../services/catalog.service';
import { BottlePlaceholder } from '../../../../shared/bottle-placeholder';
import { RevealDirective } from '../../../../shared/reveal.directive';

/** Categorías reales del catálogo (API). Sin categorías (o sin API), la sección no se muestra. */
@Component({
  selector: 'app-categories',
  imports: [RouterLink, RevealDirective, BottlePlaceholder],
  template: `
    @if (categories().length) {
      <section id="categorias" class="cats ambient candle-edge" aria-labelledby="cats-title">
        <div class="container">
          <h2 id="cats-title" class="title" appReveal>Para cada ocasión</h2>
          <p class="hint" aria-hidden="true">Desliza para ver más</p>
        </div>
        <ul class="rail" appReveal="stagger" aria-label="Categorías">
          @for (c of categories(); track c.id) {
            <li class="tile" [attr.data-cat]="c.slug">
              <a
                routerLink="/catalogo"
                [queryParams]="{ categoria: c.slug }"
                [attr.aria-label]="'Ver ' + c.name + ' en el catálogo'"
              >
                <span class="media">
                  @if (c.iconUrl; as src) {
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
    }
  `,
  styleUrl: './categories.css',
})
export class Categories {
  private readonly catalog = inject(CatalogService);
  protected readonly categories = this.catalog.categories;

  constructor() {
    void this.catalog.load();
  }
}
