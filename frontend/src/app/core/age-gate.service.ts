import { Injectable, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { AGE_GATE } from './config';

/** Control de edad (+18) de la primera visita. Solo recuerda el "Sí"; sin cookies ni datos personales. */
@Injectable({ providedIn: 'root' })
export class AgeGate {
  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  readonly confirmed = signal(readStored());
  /** El usuario respondió "No": el contenido sigue bloqueado. */
  readonly denied = signal(false);
  readonly exempt = computed(() => {
    const path = this.url().split(/[?#]/)[0];
    return AGE_GATE.exemptPaths.some((p) => path === p || path.startsWith(p + '/'));
  });
  readonly open = computed(() => !this.confirmed() && !this.exempt());

  accept(): void {
    this.confirmed.set(true);
    this.denied.set(false);
    try {
      localStorage.setItem(AGE_GATE.storageKey, '1');
    } catch {
      // Sin almacenamiento: la página sigue y volverá a preguntar en la próxima visita.
    }
  }

  deny(): void {
    this.denied.set(true);
  }

  retry(): void {
    this.denied.set(false);
  }
}

function readStored(): boolean {
  try {
    return localStorage.getItem(AGE_GATE.storageKey) === '1';
  } catch {
    return false;
  }
}
