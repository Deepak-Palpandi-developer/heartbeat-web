import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';
import { AlertService } from './alert.service';
import { CustomTranslateService } from './custom-translate.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomHttpService {
  private http = inject(HttpClient);
  private loader = inject(LoaderService);
  private alertService = inject(AlertService);
  private translate = inject(CustomTranslateService);
  private errorShown = new Set<string>();

  get<T>(url: string, options?: object): Observable<T> {
    const requestId = this.generateRequestId('GET', url);
    this.loader.show();
    
    return this.http.get<T>(environment.API_URL + url, options).pipe(
      catchError((error) => this.handleError(error, requestId)),
      finalize(() => {
        this.loader.hide();
        setTimeout(() => this.errorShown.delete(requestId), 100);
      })
    );
  }

  post<T>(url: string, body: any, options?: object): Observable<T> {
    const requestId = this.generateRequestId('POST', url);
    this.loader.show();
    
    return this.http.post<T>(environment.API_URL + url, body, options).pipe(
      catchError((error) => this.handleError(error, requestId)),
      finalize(() => {
        this.loader.hide();
        setTimeout(() => this.errorShown.delete(requestId), 100);
      })
    );
  }

  put<T>(url: string, body: any, options?: object): Observable<T> {
    const requestId = this.generateRequestId('PUT', url);
    this.loader.show();
    
    return this.http.put<T>(environment.API_URL + url, body, options).pipe(
      catchError((error) => this.handleError(error, requestId)),
      finalize(() => {
        this.loader.hide();
        setTimeout(() => this.errorShown.delete(requestId), 100);
      })
    );
  }

  patch<T>(url: string, body: any, options?: object): Observable<T> {
    const requestId = this.generateRequestId('PATCH', url);
    this.loader.show();
    
    return this.http.patch<T>(environment.API_URL + url, body, options).pipe(
      catchError((error) => this.handleError(error, requestId)),
      finalize(() => {
        this.loader.hide();
        setTimeout(() => this.errorShown.delete(requestId), 100);
      })
    );
  }

  delete<T>(url: string, options?: object): Observable<T> {
    const requestId = this.generateRequestId('DELETE', url);
    this.loader.show();
    
    return this.http.delete<T>(environment.API_URL + url, options).pipe(
      catchError((error) => this.handleError(error, requestId)),
      finalize(() => {
        this.loader.hide();
        setTimeout(() => this.errorShown.delete(requestId), 100);
      })
    );
  }

  private generateRequestId(method: string, url: string): string {
    return `${method}-${url}-${Date.now()}`;
  }

  private handleError = (error: HttpErrorResponse, requestId: string): Observable<never> => {
    // Only show error once per request
    if (this.errorShown.has(requestId)) {
      return throwError(() => new Error('Error already shown'));
    }
    
    this.errorShown.add(requestId);
    
    let errorMessage: string;
    let translateKey: string;
    let translateParams: any = {};
    
    if (error.error instanceof ErrorEvent) {
      translateKey = 'alert.apiError.message';
      const translated = this.translate.translate(translateKey);
      errorMessage = typeof translated === 'string' ? translated : translateKey;
    } else {
      translateKey = 'alert.apiError.serverMessage';
      translateParams = { status: error.status, message: error.message };
      const translated = this.translate.translate(translateKey, translateParams);
      errorMessage = typeof translated === 'string' ? translated : translateKey;
    }
    
    this.alertService.show({
      variant: 'error',
      title: 'alert.apiError.title',
      message: errorMessage,
      translateKey,
      translateParams,
    });
    
    return throwError(() => new Error(errorMessage));
  };
}
