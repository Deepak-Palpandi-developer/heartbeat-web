import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomHttpService {
  private http = inject(HttpClient);
  private loader = inject(LoaderService);

  get<T>(url: string, options?: object): Observable<T> {
    this.loader.show();
    return this.http.get<T>(environment.apiBaseUrl + url, options).pipe(
      retry(3),
      catchError(this.handleError),
      finalize(() => this.loader.hide())
    );
  }

  post<T>(url: string, body: any, options?: object): Observable<T> {
    this.loader.show();
    return this.http.post<T>(environment.apiBaseUrl + url, body, options).pipe(
      retry(3),
      catchError(this.handleError),
      finalize(() => this.loader.hide())
    );
  }

  put<T>(url: string, body: any, options?: object): Observable<T> {
    this.loader.show();
    return this.http.put<T>(environment.apiBaseUrl + url, body, options).pipe(
      retry(3),
      catchError(this.handleError),
      finalize(() => this.loader.hide())
    );
  }

  patch<T>(url: string, body: any, options?: object): Observable<T> {
    this.loader.show();
    return this.http.patch<T>(environment.apiBaseUrl + url, body, options).pipe(
      retry(3),
      catchError(this.handleError),
      finalize(() => this.loader.hide())
    );
  }

  delete<T>(url: string, options?: object): Observable<T> {
    this.loader.show();
    return this.http.delete<T>(environment.apiBaseUrl + url, options).pipe(
      retry(3),
      catchError(this.handleError),
      finalize(() => this.loader.hide())
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // Only send error message after 3 failed attempts
    let errorMessage = 'An error occurred after 3 attempts.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error after 3 attempts: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code ${error.status} after 3 attempts: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
