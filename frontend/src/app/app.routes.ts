import { Routes } from '@angular/router';

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
  { path: '**', redirectTo: '' },
];
