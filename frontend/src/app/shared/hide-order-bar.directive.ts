import { AfterViewInit, Directive, ElementRef, OnDestroy, inject } from '@angular/core';
import { ScrollService } from '../core/scroll.service';

/** Mientras el elemento está a la vista, oculta la barra fija "Pedir ahora" (evita CTA duplicados). */
@Directive({ selector: '[appHideOrderBar]' })
export class HideOrderBarDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly scroll = inject(ScrollService);
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }
    this.observer = new IntersectionObserver(([entry]) => this.scroll.ctaInView.set(entry.isIntersecting), {
      threshold: 0.4,
    });
    this.observer.observe(this.el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.scroll.ctaInView.set(false);
  }
}
