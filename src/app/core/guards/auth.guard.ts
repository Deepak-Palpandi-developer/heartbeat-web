import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LOCAL_CACHE_KEYS } from '../../shared/const/app.local.cache.const';
import { DefaultInitializerService } from '../../features/default.initializer.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const defaultInitializer = inject(DefaultInitializerService);

  const rememberMe = localStorage.getItem(LOCAL_CACHE_KEYS.AUTH.IS_REMEBER_ME) === 'true';
  const storage = rememberMe ? localStorage : sessionStorage;
  const token = storage.getItem(LOCAL_CACHE_KEYS.AUTH.TOKEN);

  if (token) {
    defaultInitializer.startInitialization();
    // User is authenticated, allow access
    return true;
  }

  // User is not authenticated, redirect to login
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
