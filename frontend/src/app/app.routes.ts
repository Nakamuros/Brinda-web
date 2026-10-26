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
    ],
  },
  { path: '**', redirectTo: '' },
];
