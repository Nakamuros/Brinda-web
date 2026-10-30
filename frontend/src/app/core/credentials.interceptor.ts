import { HttpInterceptorFn } from '@angular/common/http';
import { API_URL } from './config';

/** Con la API en otro subdominio, la cookie de sesión solo viaja si la petición lo pide. Con ruta relativa no hace falta. */
export const credentialsFor =
  (apiUrl: string): HttpInterceptorFn =>
  (req, next) =>
    apiUrl.startsWith('http') && req.url.startsWith(apiUrl)
      ? next(req.clone({ withCredentials: true }))
      : next(req);

export const credentialsInterceptor = credentialsFor(API_URL);
