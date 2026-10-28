import { Routes } from '@angular/router';
import { adminGuard } from './admin/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/layout-public/layout-public').then((m) => m.LayoutPublic),
    children: [
      {
        path: '',
        title: 'BRINDA · Licorería a domicilio en Lima',
        loadComponent: () => import('./pages/public/landing/landing').then((m) => m.Landing),
      },
      {
        path: 'catalogo',
        title: 'Catálogo · BRINDA',
        loadComponent: () => import('./pages/public/catalogo/catalogo').then((m) => m.Catalogo),
      },
      {
        path: 'pedido',
        title: 'Tu pedido · BRINDA',
        loadComponent: () => import('./pages/public/pedido/pedido').then((m) => m.Pedido),
      },
      {
        path: 'carrito',
        title: 'Carrito · BRINDA',
        loadComponent: () => import('./pages/public/carrito/carrito').then((m) => m.Carrito),
      },
      {
        // No puede salir a producción sin el formulario funcional (ver avances.md).
        path: 'libro-de-reclamaciones',
        title: 'Libro de Reclamaciones · BRINDA',
        loadComponent: () =>
          import('./pages/public/libro-reclamaciones/libro-reclamaciones').then((m) => m.LibroReclamaciones),
      },
    ],
  },
  {
    // Panel de administración: fuera del layout público (sin control de edad, carrito ni barra de pedir).
    path: 'admin',
    loadComponent: () => import('./admin/layout-admin').then((m) => m.LayoutAdmin),
    children: [
      {
        path: 'login',
        title: 'Ingresar · Panel BRINDA',
        loadComponent: () => import('./admin/login').then((m) => m.AdminLogin),
      },
      {
        path: '',
        canActivate: [adminGuard],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'reclamos' },
          {
            path: 'cambiar-clave',
            title: 'Cambiar contraseña · Panel BRINDA',
            loadComponent: () => import('./admin/cambiar-clave').then((m) => m.AdminPassword),
          },
          {
            path: 'reclamos',
            title: 'Reclamos · Panel BRINDA',
            loadComponent: () =>
              import('./admin/reclamos/reclamos-lista').then((m) => m.ReclamosLista),
          },
          {
            path: 'reclamos/:id',
            title: 'Reclamo · Panel BRINDA',
            loadComponent: () =>
              import('./admin/reclamos/reclamo-detalle').then((m) => m.ReclamoDetalle),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
