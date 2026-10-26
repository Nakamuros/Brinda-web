import { Component, input } from '@angular/core';

/** Estado vacío o de error: título, texto y una acción proyectada. */
@Component({
  selector: 'app-state-panel',
  template: `
    <div class="state">
      <p class="title">{{ title() }}</p>
      <p class="text">{{ text() }}</p>
      <ng-content />
    </div>
  `,
  styles: `
    .state {
      display: grid;
      justify-items: center;
      gap: var(--space-4);
      padding-block: var(--space-8);
      text-align: center;
    }
    .title {
      font-family: var(--font-display);
      font-size: var(--step-2);
      line-height: 1.2;
    }
    .text {
      max-width: 34ch;
      color: var(--text-soft);
    }
  `,
})
export class StatePanel {
  readonly title = input.required<string>();
  readonly text = input.required<string>();
}
