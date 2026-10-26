import { Component } from '@angular/core';
import { CONTACT, PENDING } from '../../../../core/config';
import { RevealDirective } from '../../../../shared/reveal.directive';

@Component({
  selector: 'app-info-columns',
  imports: [RevealDirective],
  template: `
    <section id="zonas" class="info ambient" aria-labelledby="info-title">
      <div class="container">
        <h2 id="info-title" class="sr-only">Zonas de entrega, horario y contacto</h2>
        <div class="cols" appReveal="stagger">
          <div class="col">
            <h3>Zonas de entrega</h3>
            <p [class.pending]="zones === pending">{{ zones }}</p>
          </div>
          <div class="col">
            <h3>Horario</h3>
            <p [class.pending]="hours === pending">{{ hours }}</p>
          </div>
          <div id="contacto" class="col">
            <h3>Contacto</h3>
            <p>WhatsApp</p>
            @if (whatsappHref) {
              <a class="btn btn-cta" [href]="whatsappHref" target="_blank" rel="noopener noreferrer"
                >Escribir por WhatsApp</a
              >
            } @else {
              <p class="pending">Número por confirmar</p>
              <button type="button" class="btn btn-cta" disabled>WhatsApp disponible pronto</button>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './info-columns.css',
})
export class InfoColumns {
  protected readonly pending = PENDING;
  protected readonly zones = CONTACT.zones;
  protected readonly hours = CONTACT.hours;
  protected readonly whatsappHref = CONTACT.whatsappNumber
    ? `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`
    : '';
}
