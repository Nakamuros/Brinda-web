import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuth } from './admin-auth.service';

/** Solo entra una sesión de administrador; si debe cambiar la clave inicial, va primero a esa pantalla. */
export const adminGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AdminAuth);
  const router = inject(Router);
  const user = await auth.load();
  if (!user || user.role !== 'ROLE_ADMIN') {
    return router.createUrlTree(['/admin/login']);
  }
  if (user.mustChangePassword && !state.url.startsWith('/admin/cambiar-clave')) {
    return router.createUrlTree(['/admin/cambiar-clave']);
  }
  return true;
};
