import { AfterViewInit, Directive, ElementRef, OnDestroy, inject, input, numberAttribute } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MediaPrefs } from '../core/media-prefs';

gsap.registerPlugin(ScrollTrigger);

/** Parallax leve: desplaza el elemento en Y (porcentaje de su altura) mientras su contenedor cruza la pantalla. */
@Directive({ selector: '[appParallax]' })
export class ParallaxDirective implements AfterViewInit, OnDestroy {
  readonly appParallax = input(8, { transform: (v: unknown) => numberAttribute(v, 8) });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly prefs = inject(MediaPrefs);
  private ctx: gsap.Context | null = null;

  ngAfterViewInit(): void {
    if (this.prefs.reducedMotion()) {
      return;
    }
    const amount = this.appParallax();
    this.ctx = gsap.context(() => {
      gsap.fromTo(
        this.el,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: {
            trigger: this.el.parentElement ?? this.el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    }, this.el);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
