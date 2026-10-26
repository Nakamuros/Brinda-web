import { computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { MediaPrefs } from '../../../../core/media-prefs';
import { HeroVideo } from './hero-video';

interface Setup {
  reducedMotion?: boolean;
  saveData?: boolean;
  isMobile?: boolean;
  inputs?: Record<string, string>;
}

async function render({ reducedMotion = false, saveData = false, isMobile = false, inputs = {} }: Setup) {
  const rm = signal(reducedMotion);
  const sd = signal(saveData);
  const fakePrefs = {
    reducedMotion: rm,
    saveData: sd,
    isMobile: signal(isMobile),
    allowVideo: computed(() => !rm() && !sd()),
  };
  TestBed.configureTestingModule({
    imports: [HeroVideo],
    providers: [{ provide: MediaPrefs, useValue: fakePrefs }],
  });
  const fixture = TestBed.createComponent(HeroVideo);
  for (const [key, value] of Object.entries({ poster: 'p.webp', posterMobile: 'pm.webp', ...inputs })) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  await fixture.whenStable();
  return fixture;
}

const el = (f: { nativeElement: HTMLElement }) => f.nativeElement;

describe('HeroVideo', () => {
  it('sin URL de video muestra solo el poster', async () => {
    const f = await render({});
    expect(el(f).querySelector('video')).toBeNull();
    expect(el(f).querySelector('img.poster')?.getAttribute('src')).toBe('p.webp');
  });

  it('con URL monta un video mudo, en bucle e inline, con poster', async () => {
    const f = await render({ inputs: { src: 'https://cdn.test/hero.mp4' } });
    const video = el(f).querySelector('video')!;
    expect(video).not.toBeNull();
    for (const attr of ['muted', 'loop', 'autoplay', 'playsinline']) {
      expect(video.hasAttribute(attr)).toBe(true);
    }
    expect(video.getAttribute('preload')).toBe('metadata');
    expect(video.getAttribute('poster')).toBe('p.webp');
    expect(video.querySelector('source[type="video/mp4"]')?.getAttribute('src')).toBe('https://cdn.test/hero.mp4');
  });

  it('agrega la fuente WebM cuando existe', async () => {
    const f = await render({ inputs: { src: 'a.mp4', webmSrc: 'a.webm' } });
    expect(el(f).querySelector('source[type="video/webm"]')?.getAttribute('src')).toBe('a.webm');
  });

  it('con prefers-reduced-motion no carga el video', async () => {
    const f = await render({ reducedMotion: true, inputs: { src: 'a.mp4' } });
    expect(el(f).querySelector('video')).toBeNull();
    expect(el(f).querySelector('img.poster')).not.toBeNull();
  });

  it('con ahorro de datos no carga el video', async () => {
    const f = await render({ saveData: true, inputs: { src: 'a.mp4' } });
    expect(el(f).querySelector('video')).toBeNull();
  });

  it('en celular usa la versión liviana y el poster móvil', async () => {
    const f = await render({ isMobile: true, inputs: { src: 'a.mp4', mobileSrc: 'a-m.mp4' } });
    expect(el(f).querySelector('source[type="video/mp4"]')?.getAttribute('src')).toBe('a-m.mp4');
    expect(el(f).querySelector('img.poster')?.getAttribute('src')).toBe('pm.webp');
  });

  it('en celular sin versión liviana usa el video principal', async () => {
    const f = await render({ isMobile: true, inputs: { src: 'a.mp4' } });
    expect(el(f).querySelector('source[type="video/mp4"]')?.getAttribute('src')).toBe('a.mp4');
  });

  it('si el video falla vuelve al poster', async () => {
    const f = await render({ inputs: { src: 'roto.mp4' } });
    el(f).querySelector('video')!.dispatchEvent(new Event('error'));
    f.detectChanges();
    await f.whenStable();
    expect(el(f).querySelector('video')).toBeNull();
    expect(el(f).querySelector('img.poster')).not.toBeNull();
  });

  it('el video aparece con fundido solo cuando puede reproducir', async () => {
    const f = await render({ inputs: { src: 'a.mp4' } });
    const video = el(f).querySelector('video')!;
    expect(video.classList.contains('ready')).toBe(false);
    video.dispatchEvent(new Event('canplay'));
    f.detectChanges();
    await f.whenStable();
    expect(el(f).querySelector('video')!.classList.contains('ready')).toBe(true);
  });
});
