import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, finalize } from 'rxjs/operators';
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

  get<T>(url: string, options?: object): Observable<T> {
    this.loader.show();
    return this.http.get<T>(environment.API_URL + url, options).pipe(
      retry(3),
      catchError(this.handleError),
      finalize(() => this.loader.hide())
    );
  }

  post<T>(url: string, body: any, options?: object): Observable<T> {
    this.loader.show();
    return this.http.post<T>(environment.API_URL + url, body, options).pipe(
      retry(3),
      catchError(this.handleError),
      finalize(() => this.loader.hide())
    );
  }

  put<T>(url: string, body: any, options?: object): Observable<T> {
    this.loader.show();
    return this.http.put<T>(environment.API_URL + url, body, options).pipe(
      retry(3),
      catchError(this.handleError),
      finalize(() => this.loader.hide())
    );
  }

  patch<T>(url: string, body: any, options?: object): Observable<T> {
    this.loader.show();
    return this.http.patch<T>(environment.API_URL + url, body, options).pipe(
      retry(3),
      catchError(this.handleError),
      finalize(() => this.loader.hide())
    );
  }

  delete<T>(url: string, options?: object): Observable<T> {
    this.loader.show();
    return this.http.delete<T>(environment.API_URL + url, options).pipe(
      retry(3),
      catchError(this.handleError),
      finalize(() => this.loader.hide())
    );
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
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
