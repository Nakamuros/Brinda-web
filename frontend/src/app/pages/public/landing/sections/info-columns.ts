import { Component } from '@angular/core';
import { buildColumns, InfoColumn } from '../../../../core/info';
import { RevealDirective } from '../../../../shared/reveal.directive';

/**
 * Zonas, horario y contacto. En producción solo se muestran las columnas con datos reales;
 * los marcadores "Por confirmar" se ven únicamente en desarrollo (SHOW_PENDING).
 */
@Component({
  selector: 'app-info-columns',
  imports: [RevealDirective],
  template: `
    <section id="zonas" class="info ambient candle-edge" aria-labelledby="info-title">
      <div class="container">
        <h2 id="info-title" class="sr-only">Zonas de entrega, horario y contacto</h2>
        <div class="cols" [class.single]="columns.length === 1" appReveal="stagger">
          @for (c of columns; track c.title) {
            <div class="col" [attr.id]="c.id ?? null">
              <h3>{{ c.title }}</h3>
              <p [class.pending]="c.pending">{{ c.text }}</p>
              @if (c.href) {
                <a class="btn btn-cta" [href]="c.href" target="_blank" rel="noopener noreferrer"
                  >Escribir por WhatsApp</a
                >
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './info-columns.css',
})
export class InfoColumns {
  protected readonly columns: InfoColumn[] = buildColumns();
}
