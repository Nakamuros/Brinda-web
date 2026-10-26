import { Component } from '@angular/core';
import { HOW_TO_ORDER } from '../../../../core/config';
import { RevealDirective } from '../../../../shared/reveal.directive';

@Component({
  selector: 'app-how-to-order',
  imports: [RevealDirective],
  template: `
    <section id="como-pedir" class="how" aria-labelledby="how-title">
      <div class="container">
        <h2 id="how-title" class="title" appReveal>Cómo pedir</h2>
        <ol class="steps" appReveal="stagger">
          @for (s of steps; track s.title; let i = $index) {
            <li class="step">
              <span class="num" aria-hidden="true">{{ i + 1 }}</span>
              <h3>{{ s.title }}</h3>
              <p>{{ s.text }}</p>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styleUrl: './how-to-order.css',
})
export class HowToOrder {
  protected readonly steps = HOW_TO_ORDER;
}
