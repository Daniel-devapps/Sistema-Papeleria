import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/categorias', pathMatch: 'full' },
  { path: 'categorias', loadComponent: () => import('./categorias/categorias.component').then(m => m.CategoriasComponent) },
  { path: 'categorias/nueva', loadComponent: () => import('./categorias/categoria-form.component').then(m => m.CategoriaFormComponent) },
  { path: 'categorias/:id', loadComponent: () => import('./categorias/categoria-form.component').then(m => m.CategoriaFormComponent) },
  { path: 'productos', loadComponent: () => import('./productos/productos.component').then(m => m.ProductosComponent) },
  { path: 'productos/nuevo', loadComponent: () => import('./productos/producto-form.component').then(m => m.ProductoFormComponent) },
  { path: 'productos/:id', loadComponent: () => import('./productos/producto-form.component').then(m => m.ProductoFormComponent) }
];
