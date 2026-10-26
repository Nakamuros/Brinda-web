import { Component } from '@angular/core';

/** Imagen genérica "sin foto" para productos y categorías sin imageUrl. */
@Component({
  selector: 'app-bottle-placeholder',
  template: `
    <svg viewBox="0 0 120 220" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M52 8h16v30c0 10 22 22 22 56v110a8 8 0 0 1-8 8H38a8 8 0 0 1-8-8V94c0-34 22-46 22-56z" />
      <path d="M52 8h16" />
      <path d="M30 118h60M30 168h60" opacity=".55" />
      <path d="M44 96c-4 14-4 30-4 44" opacity=".5" />
    </svg>
  `,
  styles: `
    :host {
      display: block;
      color: var(--brass);
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
})
export class BottlePlaceholder {}
