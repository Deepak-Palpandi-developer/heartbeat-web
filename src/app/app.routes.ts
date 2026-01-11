import { Routes } from '@angular/router';
import { environment } from '../environments/environment';

export const routes: Routes = [
  {
    path: 'demo-controls',
    loadComponent: () =>
      import('./features/samples/demo-controlls.component').then((m) => m.DemoControllsComponent),
    canActivate: [() => !environment.production],
  },
  {
    path: '',
    loadComponent: () => import('./features/auth/auth.component').then((m) => m.AuthComponent),
    loadChildren: () => [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth//components/login/login.component').then((m) => m.LoginComponent),
        data: { title: 'Login' },
      },
    ],
    data: { title: 'Authentication' },
  },
];
