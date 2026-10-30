import { HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { credentialsFor } from './credentials.interceptor';

describe('credentialsInterceptor', () => {
  function withCredentials(apiUrl: string, url: string): boolean {
    let seen: HttpRequest<unknown> | undefined;
    TestBed.runInInjectionContext(() =>
      credentialsFor(apiUrl)(new HttpRequest('GET', url), (r) => {
        seen = r;
        return of();
      }),
    );
    return seen!.withCredentials;
  }

  it('con API absoluta, envía credenciales a la API', () => {
    expect(withCredentials('https://api.x.test/api/v1', 'https://api.x.test/api/v1/auth/me')).toBe(true);
  });

  it('no las envía a otros destinos', () => {
    expect(withCredentials('https://api.x.test/api/v1', 'https://otro.test/x')).toBe(false);
  });

  it('con ruta relativa no toca la petición', () => {
    expect(withCredentials('/api/v1', '/api/v1/auth/me')).toBe(false);
  });
});
