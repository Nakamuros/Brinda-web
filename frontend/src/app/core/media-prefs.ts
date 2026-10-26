import { Injectable, computed, signal } from '@angular/core';

interface NetworkInformationLike {
  saveData?: boolean;
}

/** Preferencias del dispositivo que condicionan movimiento y descarga de video. */
@Injectable({ providedIn: 'root' })
export class MediaPrefs {
  readonly reducedMotion = signal(false);
  readonly saveData = signal(false);
  readonly isMobile = signal(false);
  /** El video solo se carga con movimiento permitido y sin ahorro de datos. */
  readonly allowVideo = computed(() => !this.reducedMotion() && !this.saveData());

  constructor() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion.set(motion.matches);
    motion.addEventListener('change', (e) => this.reducedMotion.set(e.matches));

    // Celular y tablet: hero a una columna, con el poster vertical y el video liviano.
    const mobile = window.matchMedia('(max-width: 63.99rem)');
    this.isMobile.set(mobile.matches);
    mobile.addEventListener('change', (e) => this.isMobile.set(e.matches));

    const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
    this.saveData.set(connection?.saveData === true);
  }
}
