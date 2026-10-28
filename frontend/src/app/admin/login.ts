import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuth, apiError } from './admin-auth.service';

@Component({
  selector: 'app-admin-login',
  styleUrl: './admin-ui.css',
  template: `
    <section class="page narrow">
      <h1 class="page-title">Ingresar al panel</h1>
      <form class="panel" (submit)="submit($event)" novalidate>
        <div class="field">
          <label class="label" for="user">Usuario</label>
          <input
            id="user"
            class="input"
            name="username"
            autocomplete="username"
            autocapitalize="none"
            spellcheck="false"
            required
            [value]="username()"
            (input)="username.set($any($event.target).value)"
          />
        </div>
        <div class="field">
          <label class="label" for="pass">Contraseña</label>
          <input
            id="pass"
            class="input"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            [value]="password()"
            (input)="password.set($any($event.target).value)"
          />
        </div>
        @if (error(); as e) {
          <p class="error" role="alert">{{ e }}</p>
        }
        <button type="submit" class="btn btn-ghost" [disabled]="busy()">
          {{ busy() ? 'Ingresando…' : 'Ingresar' }}
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
export class AdminLogin {
  private readonly auth = inject(AdminAuth);
  private readonly router = inject(Router);

  protected readonly username = signal('');
  protected readonly password = signal('');
  protected readonly busy = signal(false);
  protected readonly error = signal('');

  protected async submit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.busy()) {
      return;
    }
    if (!this.username().trim() || !this.password()) {
      this.error.set('Escribe tu usuario y tu contraseña.');
      return;
    }
    this.busy.set(true);
    this.error.set('');
    try {
      const user = await this.auth.login(this.username().trim(), this.password());
      await this.router.navigateByUrl(user.mustChangePassword ? '/admin/cambiar-clave' : '/admin/reclamos');
    } catch (e) {
      this.error.set(apiError(e, 'No se pudo ingresar. Inténtalo de nuevo.'));
    } finally {
      this.password.set('');
      this.busy.set(false);
    }
  }
}
