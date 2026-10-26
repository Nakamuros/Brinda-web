import { AfterViewInit, Directive, ElementRef, OnDestroy, inject, input } from '@angular/core';
import { MediaPrefs } from '../core/media-prefs';

/**
 * Entrada de una tarjeta al aparecer en pantalla: sube y se aclara, escalonada por `riseIndex`.
 * Solo transform y opacity (Web Animations). El elemento es visible por defecto: el estado
 * inicial lo aplica la propia animación y solo con movimiento permitido.
 */
@Directive({ selector: '[appRise]' })
export class RiseDirective implements AfterViewInit, OnDestroy {
  readonly riseIndex = input(0);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly prefs = inject(MediaPrefs);
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    if (this.prefs.reducedMotion() || typeof IntersectionObserver === 'undefined') {
      return;
    }
    // Oculta hasta que entre en pantalla; el observador la revela una sola vez.
    this.el.style.opacity = '0';
    this.observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) {
          return;
        }
        this.observer?.disconnect();
        const delay = Math.min(this.riseIndex(), 8) * 55;
        const animation = this.el.animate(
          [
            { opacity: 0, transform: 'translateY(22px)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 900, delay, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' },
        );
        this.el.style.opacity = '';
        animation.finished.catch(() => undefined);
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
    );
    this.observer.observe(this.el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
