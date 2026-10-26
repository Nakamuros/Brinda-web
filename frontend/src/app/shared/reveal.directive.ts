import { AfterViewInit, Directive, ElementRef, OnDestroy, inject, input } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MediaPrefs } from '../core/media-prefs';

gsap.registerPlugin(ScrollTrigger);

export type RevealMode = 'up' | 'lines' | 'stagger';

/**
 * Aparición al entrar en pantalla. Solo transform y opacity.
 * - up: el elemento sube y aparece.
 * - lines: cada `.line > span` sube dentro de su máscara.
 * - stagger: los hijos directos entran escalonados.
 * El contenido es visible por defecto: el estado oculto lo pone JS y solo con movimiento permitido.
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective implements AfterViewInit, OnDestroy {
  readonly appReveal = input<RevealMode | ''>('up');
  readonly revealDelay = input(0);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly prefs = inject(MediaPrefs);
  private ctx: gsap.Context | null = null;

  ngAfterViewInit(): void {
    if (this.prefs.reducedMotion()) {
      return;
    }
    const mode: RevealMode = this.appReveal() || 'up';
    const delay = this.revealDelay();

    this.ctx = gsap.context(() => {
      const trigger = { trigger: this.el, start: 'top 88%', once: true };
      if (mode === 'lines') {
        const lines = this.el.querySelectorAll('.line > span');
        gsap.from(lines, { yPercent: 115, duration: 1.25, ease: 'expo.out', stagger: 0.12, delay, scrollTrigger: trigger });
      } else if (mode === 'stagger') {
        gsap.from(Array.from(this.el.children), {
          y: 32,
          opacity: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.14,
          delay,
          scrollTrigger: trigger,
        });
      } else {
        gsap.from(this.el, { y: 28, opacity: 0, duration: 1.2, ease: 'expo.out', delay, scrollTrigger: trigger });
      }
    }, this.el);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
