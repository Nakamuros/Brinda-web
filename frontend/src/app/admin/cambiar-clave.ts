import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuth, apiError } from './admin-auth.service';

const MIN = 12;

/** Cambio de clave (obligatorio en el primer ingreso). Mínimo 12 caracteres, como exige el backend. */
@Component({
  selector: 'app-admin-password',
  styleUrl: './admin-ui.css',
  template: `
    <section class="page narrow">
      <h1 class="page-title">Cambiar la contraseña</h1>
      @if (auth.user()?.mustChangePassword) {
        <p class="muted">Por seguridad, cambia la contraseña inicial antes de continuar.</p>
      }
      <form class="panel" (submit)="submit($event)" novalidate>
        <div class="field">
          <label class="label" for="cur">Contraseña actual</label>
          <input id="cur" class="input" type="password" autocomplete="current-password" required
            [value]="current()" (input)="current.set($any($event.target).value)" />
        </div>
        <div class="field">
          <label class="label" for="new">Contraseña nueva</label>
          <input id="new" class="input" type="password" autocomplete="new-password" required aria-describedby="new-hint"
            [value]="next()" (input)="next.set($any($event.target).value)" />
          <p id="new-hint" class="hint">Mínimo {{ min }} caracteres.</p>
        </div>
        <div class="field">
          <label class="label" for="rep">Repite la contraseña nueva</label>
          <input id="rep" class="input" type="password" autocomplete="new-password" required
            [value]="repeat()" (input)="repeat.set($any($event.target).value)" />
        </div>
        @if (error(); as e) {
          <p class="error" role="alert">{{ e }}</p>
        }
        <button type="submit" class="btn btn-ghost" [disabled]="busy()">
          {{ busy() ? 'Guardando…' : 'Guardar contraseña' }}
        </button>
      </form>
    </section>
  `,
  styles: `
    .narrow {
      max-width: 26rem;
      margin-inline: auto;
      padding-top: var(--space-8);
    }
  `,
})
export class AdminPassword {
  protected readonly auth = inject(AdminAuth);
  private readonly router = inject(Router);

  protected readonly min = MIN;
  protected readonly current = signal('');
  protected readonly next = signal('');
  protected readonly repeat = signal('');
  protected readonly busy = signal(false);
  protected readonly error = signal('');

  protected async submit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.busy()) {
      return;
    }
    if (!this.current()) {
      this.error.set('Escribe tu contraseña actual.');
    } else if (this.next().length < MIN) {
      this.error.set(`La contraseña nueva debe tener al menos ${MIN} caracteres.`);
    } else if (this.next() !== this.repeat()) {
      this.error.set('Las contraseñas nuevas no coinciden.');
    } else {
      this.busy.set(true);
      this.error.set('');
      try {
        await this.auth.changePassword(this.current(), this.next());
        await this.router.navigateByUrl('/admin/reclamos');
      } catch (e) {
        this.error.set(apiError(e, 'No se pudo cambiar la contraseña.'));
      } finally {
        this.busy.set(false);
      }
      return;
    }
  }
}
