import { Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { authGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './shared/components/not-found.component';

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
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
    data: { title: 'Authentication' },
  },
  {
    path: '',
    loadComponent: () => import('./features/landing.component').then((m) => m.LandingComponent),
    loadChildren: () => import('./features/landing.routes').then((m) => m.landingRoutes),
    data: { title: 'Heart Beat' },
    canActivate: [authGuard],
  },
  {
    path: '**',
    component: NotFoundComponent,
    data: { title: 'Angular NotFound Dashboard | TailAdmin - Angular Admin Dashboard Template' },
  },
];
