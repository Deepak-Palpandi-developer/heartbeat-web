import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { API_ROUTES } from '../../shared/const/api-routes.const';
import { AppSignalService } from '../../shared/signals/app-signal.service';
import { AlertService } from '../../core/services/alert.service';
import { environment } from '../../../environments/environment';
import { CryptoService } from '../services/crypto.service';

function handle401(
  req: any,
  next: any,
  storage: Storage,
  alertService: AlertService,
  router: Router
) {
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

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const appSignal = inject(AppSignalService);
  const alertService = inject(AlertService);
  const crypto = inject(CryptoService);

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

  // Encryption for outgoing requests
  let modifiedReq = req.clone({ headers });
  if (environment.IS_ENCRYPTION_ENABLED && req.body != null) {
    const bodyString = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    let encryptedHeaders = headers.set('X-Encrypt-Data', 'true');
    modifiedReq = req.clone({
      body: crypto.encrypt(bodyString),
      headers: encryptedHeaders,
    });
  }

  // Check if this API should be cached
  const cacheUrls = appSignal.cacheUrls();
  const cacheKey = req.urlWithParams;
  if (cacheUrls.some((url) => cacheKey.includes(url))) {
    const cached = appSignal.getApiCache(cacheKey);
    if (cached !== undefined) {
      return of(cached);
    }
    return next(modifiedReq).pipe(
      switchMap((event) => {
        // Decrypt response body if encrypted
        if (event && (event as any).body !== undefined && environment.IS_ENCRYPTION_ENABLED) {
          try {
            (event as any).body = crypto.decrypt((event as any).body);
          } catch {
            // fallback: leave body as is
          }
          appSignal.setApiCache(cacheKey, event);
        }
        return of(event);
      }),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return handle401(modifiedReq, next, storage, alertService, router);
        }
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
  return next(modifiedReq).pipe(
    switchMap((event) => {
      // Decrypt response body if encrypted
      if (event && (event as any).body !== undefined && environment.IS_ENCRYPTION_ENABLED) {
        try {
          (event as any).body = crypto.decrypt((event as any).body);
        } catch {
          // fallback: leave body as is
        }
      }
      return of(event);
    }),
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401(modifiedReq, next, storage, alertService, router);
      }
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
