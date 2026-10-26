import { Component, computed, inject, input, signal } from '@angular/core';
import { MediaPrefs } from '../../../../core/media-prefs';

/**
 * Fondo del hero: poster siempre; video encima solo si hay URL, movimiento permitido y sin ahorro de datos.
 * Para activar el video basta con poner la URL en HERO.videoUrl (core/config.ts).
 */
@Component({
  selector: 'app-hero-video',
  templateUrl: './hero-video.html',
  styleUrl: './hero-video.css',
})
export class HeroVideo {
  private readonly prefs = inject(MediaPrefs);

  readonly src = input('');
  readonly mobileSrc = input('');
  readonly webmSrc = input('');
  readonly poster = input('');
  readonly posterMobile = input('');

  protected readonly failed = signal(false);
  protected readonly ready = signal(false);

  /** URL del MP4 según el dispositivo: la versión liviana en celular, si existe. */
  protected readonly videoSrc = computed(() => {
    const mobile = this.mobileSrc();
    return this.prefs.isMobile() && mobile ? mobile : this.src();
  });

  protected readonly showVideo = computed(
    () => !!this.videoSrc() && this.prefs.allowVideo() && !this.failed(),
  );

  protected readonly posterSrc = computed(() => {
    const mobile = this.posterMobile();
    return this.prefs.isMobile() && mobile ? mobile : this.poster();
  });
}
