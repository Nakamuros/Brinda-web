import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACT } from '../../../../core/config';
import { HAS_INFO_SECTION } from '../../../../core/info';
import { BrindisMark } from '../../../../shared/brindis-mark';
import { RevealDirective } from '../../../../shared/reveal.directive';

/**
 * Franja "Próximamente": combos y promociones (aún sin datos reales) y, si no hay sección de
 * zonas/horario/contacto propia, la línea de zonas de entrega.
 */
@Component({
  selector: 'app-promos',
  imports: [RouterLink, RevealDirective, BrindisMark],
  template: `
    <section id="promos" class="promos candle-edge" aria-labelledby="promos-title">
      <app-brindis-mark class="mark" />
      <div class="container inner" appReveal="stagger">
        <h2 id="promos-title" class="title">Combos y <span class="accent">promociones</span></h2>
        <p class="lead">Muy pronto: combos y ofertas para tus reuniones.</p>
        <a class="btn btn-ghost" routerLink="/catalogo">Ver el catálogo</a>
      </div>
      @if (showZones) {
        <div id="contacto" class="container zones">
          <p id="zonas"><strong>Zonas de entrega</strong> <em>{{ zones }}</em></p>
        </div>
      }
    </section>
  `,
  styleUrl: './promos.css',
})
export class Promos {
  protected readonly showZones = !HAS_INFO_SECTION;
  protected readonly zones = CONTACT.zones || CONTACT.zonesIntro;
}
