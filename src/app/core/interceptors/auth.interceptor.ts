import { inject } from '@angular/core';
import { HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { API_ROUTES } from '../../shared/const/api-routes.const';
import { AppSignalService } from '../../shared/signals/app-signal.service';
import { AlertService } from '../../core/services/alert.service';

export const authInterceptor = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const router = inject(Router);
  const appSignal = inject(AppSignalService);
  const alertService = inject(AlertService);

  // Determine storage type based on 'remember' flag
  const remember = localStorage.getItem('remember') === 'true';
  const storage = remember ? localStorage : sessionStorage;

  const token = storage.getItem('token');
  const sessionToken = storage.getItem('session_token');
  const userId = storage.getItem('user_id');

  let headers = req.headers;
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }
  if (sessionToken) {
    headers = headers.set('session-token', sessionToken);
  }
  if (userId) {
    headers = headers.set('user-id', userId);
  }

  const cloned = req.clone({ headers });

  // Check if this API should be cached
  const cacheUrls = appSignal.cacheUrls();
  const cacheKey = req.urlWithParams;
  if (cacheUrls.some((url) => cacheKey.includes(url))) {
    const cached = appSignal.getApiCache(cacheKey);
    if (cached !== undefined) {
      // Return cached response as Observable
      return of(cached);
    }
    // If not cached, make the call and cache the response
    return next(cloned).pipe(
      switchMap((event) => {
        // Only cache HttpResponse (not progress events)
        if (event && (event as any).body !== undefined) {
          appSignal.setApiCache(cacheKey, event);
        }
        return of(event);
      }),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Try refresh token
          return handle401(cloned, next, storage, alertService, router);
        }
        // Show alert for other errors
        const message =
          error instanceof HttpErrorResponse ? error.message : 'An unexpected error occurred';
        alertService.show({
          variant: 'error',
          title: 'API Error',
          message,
        });
        return throwError(() => error);
      })
    );
  }
  // Not a cacheable API, proceed as normal
  return next(cloned).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Try refresh token
        return handle401(cloned, next, storage, alertService, router);
      }
      // Show alert for other errors
      const message =
        error instanceof HttpErrorResponse ? error.message : 'An unexpected error occurred';
      alertService.show({
        variant: 'error',
        title: 'API Error',
        message,
      });
      return throwError(() => error);
    })
  );
};

function handle401(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  storage: Storage,
  alertService: AlertService,
  router: Router
): Observable<HttpEvent<any>> {
  // Call refresh endpoint with userId in URL and send tokens in headers
  const refreshToken = storage.getItem('refresh_token');
  const sessionToken = storage.getItem('session_token');
  const userId = storage.getItem('user_id');
  if (!refreshToken || !userId) {
    alertService.show({
      variant: 'error',
      title: 'Session Expired',
      message: 'Your session has expired. Please log in again.',
    });
    router.navigate(['/login']);
    return throwError(() => new Error('No refresh token or user id'));
  }

  // Use fetch for refresh to avoid circular dependency
  return of(null).pipe(
    switchMap(() =>
      fetch(API_ROUTES.AUTH.REFRESH(userId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'refresh-token': refreshToken,
          ...(sessionToken ? { 'session-token': sessionToken } : {}),
          'user-id': userId,
        },
      })
    ),
    switchMap(async (response) => {
      if (response.ok) {
        const data = await response.json();
        // Save new tokens
        storage.setItem('token', data.token);
        if (data.session_token) storage.setItem('session_token', data.session_token);
        if (data.user_id) storage.setItem('user_id', data.user_id);
        if (data.refresh_token) storage.setItem('refresh_token', data.refresh_token);
        return true;
      } else {
        alertService.show({
          variant: 'error',
          title: 'Session Refresh Failed',
          message: 'Could not refresh your session. Please log in again.',
        });
        throw new Error('Refresh failed');
      }
    }),
    switchMap((success) => {
      if (success) {
        // Retry original request with new token
        const newToken = storage.getItem('token');
        let headers = req.headers;
        if (newToken) headers = headers.set('Authorization', `Bearer ${newToken}`);
        if (storage.getItem('session_token'))
          headers = headers.set('session-token', storage.getItem('session_token')!);
        if (storage.getItem('user_id'))
          headers = headers.set('user-id', storage.getItem('user_id')!);
        const retried = req.clone({ headers });
        return next(retried);
      } else {
        alertService.show({
          variant: 'error',
          title: 'Session Refresh Failed',
          message: 'Could not refresh your session. Please log in again.',
        });
        router.navigate(['/login']);
        return throwError(() => new Error('Refresh failed'));
      }
    }),
    catchError(() => {
      alertService.show({
        variant: 'error',
        title: 'Session Refresh Failed',
        message: 'Could not refresh your session. Please log in again.',
      });
      router.navigate(['/login']);
      return throwError(() => new Error('Refresh failed'));
    })
  );
}
