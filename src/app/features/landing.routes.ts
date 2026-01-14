import { Routes } from '@angular/router';
import { adminGuard } from '../core/guards/admin.guard';

export const landingRoutes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then((m) => m.AdminComponent),
    loadChildren: () => import('./admin/admin.routes').then((m) => m.adminRoutes),
    data: { title: 'Admin', code: 'admin' },
    canActivate: [adminGuard],
  },
];
