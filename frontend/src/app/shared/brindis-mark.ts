import { Component } from '@angular/core';

/** Motivo propio de BRINDA: dos copas que brindan. Marca de agua decorativa. */
@Component({
  selector: 'app-brindis-mark',
  template: `
    <svg viewBox="0 0 400 520" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
      <g transform="translate(152 214) rotate(-17)">
        <ellipse cx="0" cy="0" rx="70" ry="12" />
        <path d="M-70 0 C-70 72 -35 108 0 108 C35 108 70 72 70 0" />
        <path d="M0 108 V236" />
        <ellipse cx="0" cy="244" rx="46" ry="8" />
        <path d="M-56 22 C-52 52 -34 76 -10 88" opacity=".6" />
      </g>
      <g transform="translate(248 214) rotate(17)">
        <ellipse cx="0" cy="0" rx="70" ry="12" />
        <path d="M-70 0 C-70 72 -35 108 0 108 C35 108 70 72 70 0" />
        <path d="M0 108 V236" />
        <ellipse cx="0" cy="244" rx="46" ry="8" />
        <path d="M-56 22 C-52 52 -34 76 -10 88" opacity=".6" />
      </g>
      <path d="M200 150 V122 M174 160 L156 136 M226 160 L244 136 M158 184 L130 172 M242 184 L270 172" />
    </svg>
  `,
  styles: `
    :host {
      display: block;
    }
    svg {
      width: 100%;
      height: auto;
    }
  `,
})
export class BrindisMark {}
