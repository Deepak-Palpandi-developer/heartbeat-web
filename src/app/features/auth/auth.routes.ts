import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../auth/components/login/login.component').then((m) => m.LoginComponent),
    data: { title: 'Login' },
  },
];
