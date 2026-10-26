import { Injectable, inject, signal } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { MediaPrefs } from './media-prefs';

/** Scroll suave (Lenis) sincronizado con ScrollTrigger. Se omite con prefers-reduced-motion. */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly prefs = inject(MediaPrefs);
  private lenis: Lenis | null = null;
  private started = false;

  /** true cuando la página bajó lo suficiente para que la navegación pase a fondo sólido. */
  readonly scrolled = signal(false);

  start(): void {
    if (this.started || typeof window === 'undefined') {
      return;
    }
    this.started = true;
    gsap.registerPlugin(ScrollTrigger);

    const update = () => this.scrolled.set(window.scrollY > 40);
    window.addEventListener('scroll', update, { passive: true });
    update();

    if (!this.prefs.reducedMotion()) {
      this.lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
      this.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => this.lenis?.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }

  lock(locked: boolean): void {
    if (locked) {
      this.lenis?.stop();
    } else {
      this.lenis?.start();
    }
    document.documentElement.classList.toggle('menu-open', locked);
  }
}
