import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../core/config';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  mustChangePassword: boolean;
}

/** Sesión del panel: cookie HttpOnly del backend (8 h). El navegador nunca ve el token. */
@Injectable({ providedIn: 'root' })
export class AdminAuth {
  private readonly http = inject(HttpClient);
  private loaded = false;

  readonly user = signal<AdminUser | null>(null);

  async load(force = false): Promise<AdminUser | null> {
    if (this.loaded && !force) {
      return this.user();
    }
    try {
      this.user.set(await firstValueFrom(this.http.get<AdminUser>(`${API_URL}/auth/me`)));
    } catch {
      this.user.set(null);
    }
    this.loaded = true;
    return this.user();
  }

  async login(username: string, password: string): Promise<AdminUser> {
    const user = await firstValueFrom(this.http.post<AdminUser>(`${API_URL}/auth/login`, { username, password }));
    this.user.set(user);
    this.loaded = true;
    return user;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<AdminUser> {
    const user = await firstValueFrom(
      this.http.post<AdminUser>(`${API_URL}/auth/change-password`, { currentPassword, newPassword }),
    );
    this.user.set(user);
    return user;
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post<void>(`${API_URL}/auth/logout`, {}));
    } catch {
      // Aunque falle la red, la sesión local se descarta.
    }
    this.user.set(null);
    this.loaded = true;
  }
}

/** Mensaje legible de un error de la API (`{ message, fields }`); nunca expone detalles técnicos. */
export function apiError(e: unknown, fallback: string): string {
  if (e instanceof HttpErrorResponse) {
    if (e.status === 0) {
      return 'No hay conexión con el servidor. Inténtalo de nuevo.';
    }
    if (e.status === 429) {
      return 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.';
    }
    if (e.status >= 500) {
      return 'El servidor no responde. Revisa que el backend esté encendido e inténtalo de nuevo.';
    }
    const message = (e.error as { message?: string } | null)?.message;
    if (message && e.status < 500) {
      return message;
    }
  }
  return fallback;
}
