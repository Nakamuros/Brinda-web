import { Component } from '@angular/core';
import { SITE } from '../../core/config';

@Component({
  selector: 'app-announcement-bar',
  template: `<p class="bar">{{ text }}</p>`,
  styles: `
    :host {
      display: block;
      background: var(--bg-deep);
      border-bottom: 1px solid var(--line-soft);
    }
    .bar {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: var(--announce-h);
      padding: var(--space-1) var(--gutter);
      text-align: center;
      font-size: 0.75rem;
      line-height: 1.3;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--cream);
    }
    @media (min-width: 48rem) {
      .bar {
        font-size: 0.8125rem;
        letter-spacing: 0.2em;
      }
    }
  `,
})
export class AnnouncementBar {
  protected readonly text = SITE.announcement;
}
