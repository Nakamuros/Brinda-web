import { Component } from '@angular/core';
import { SITE } from '../../core/config';

@Component({
  selector: 'app-announcement-bar',
  template: `
    <p class="bar">
      <span class="short">{{ short }}</span>
      <span class="long">{{ long }}</span>
    </p>
  `,
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
      height: var(--announce-h);
      padding-inline: var(--gutter);
      white-space: nowrap;
      overflow: hidden;
      font-size: 0.75rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--cream);
    }
    .long {
      display: none;
    }
    @media (min-width: 48rem) {
      .bar {
        font-size: 0.8125rem;
        letter-spacing: 0.2em;
      }
      .short {
        display: none;
      }
      .long {
        display: inline;
      }
    }
  `,
})
export class AnnouncementBar {
  protected readonly short = SITE.announcementShort;
  protected readonly long = SITE.announcement;
}
