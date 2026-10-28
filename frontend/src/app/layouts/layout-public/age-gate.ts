import { Component, ElementRef, HostListener, effect, inject, viewChild } from '@angular/core';
import { AgeGate } from '../../core/age-gate.service';
import { ScrollService } from '../../core/scroll.service';

/** Modal de mayoría de edad: sin cierre con Esc ni clic fuera; foco atrapado; fondo inerte (ver LayoutPublic). */
@Component({
  selector: 'app-age-gate',
  template: `
    @if (gate.open()) {
      <div class="backdrop">
        <div
          #dialog
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="age-title"
          aria-describedby="age-text"
        >
          <span class="badge" aria-hidden="true">+18</span>
          @if (gate.denied()) {
            <h2 id="age-title" class="title">Lo sentimos</h2>
            <p id="age-text" class="text" role="alert">Lo sentimos, solo vendemos a mayores de 18 años.</p>
            <div class="actions">
              <button type="button" class="btn btn-ghost" (click)="gate.retry()">Volver a la pregunta</button>
            </div>
          } @else {
            <h2 id="age-title" class="title">¿Eres mayor de 18 años?</h2>
            <p id="age-text" class="text">Para ver el catálogo necesitamos confirmar tu edad.</p>
            <div class="actions">
              <button type="button" class="btn btn-ghost" (click)="gate.accept()">Sí, soy mayor de 18</button>
              <button type="button" class="btn btn-ghost" (click)="gate.deny()">No</button>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: `
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 300;
      display: grid;
      place-items: center;
      padding: var(--gutter);
      background: color-mix(in srgb, var(--bg-deep) 94%, transparent);
      animation: fade 0.35s var(--ease-out);
    }
    .dialog {
      display: grid;
      justify-items: center;
      gap: var(--space-4);
      width: min(100%, 28rem);
      padding: var(--space-7) var(--space-5);
      text-align: center;
      background: var(--bg);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-soft);
      animation: rise 0.5s var(--ease-out);
    }
    .badge {
      display: grid;
      place-items: center;
      width: 3.5rem;
      height: 3.5rem;
      border: 1px solid var(--brass);
      border-radius: 50%;
      font-family: var(--font-display);
      font-weight: 700;
    }
    .title {
      font-family: var(--font-display);
      font-size: var(--step-2);
      line-height: 1.15;
    }
    .text {
      max-width: 34ch;
      color: var(--text-soft);
    }
    .actions {
      display: grid;
      gap: var(--space-3);
      width: 100%;
      margin-top: var(--space-3);
    }
    @keyframes fade {
      from {
        opacity: 0;
      }
    }
    @keyframes rise {
      from {
        opacity: 0;
        transform: translateY(1rem);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .backdrop,
      .dialog {
        animation: none;
      }
    }
  `,
})
export class AgeGateDialog {
  protected readonly gate = inject(AgeGate);
  private readonly scroll = inject(ScrollService);
  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');

  constructor() {
    effect(() => {
      const open = this.gate.open();
      this.scroll.lock(open, 'age');
      if (open) {
        // Foco al primer control (o al título tras responder "No") cuando cambia el contenido.
        this.gate.denied();
        setTimeout(() => this.focusFirst(), 0);
      }
    });
  }

  private controls(): HTMLElement[] {
    return [...(this.dialog()?.nativeElement.querySelectorAll<HTMLElement>('button') ?? [])];
  }

  private focusFirst(): void {
    this.controls()[0]?.focus();
  }

  @HostListener('document:keydown', ['$event'])
  protected onKey(e: KeyboardEvent): void {
    if (!this.gate.open()) {
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      return;
    }
    if (e.key !== 'Tab') {
      return;
    }
    const items = this.controls();
    if (!items.length) {
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !items.includes(active as HTMLElement))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !items.includes(active as HTMLElement))) {
      e.preventDefault();
      first.focus();
    }
  }
}
