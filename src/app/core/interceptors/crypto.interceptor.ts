import { HttpHandlerFn, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { CryptoService } from '../services/crypto.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';

export const cryptoInterceptor: HttpInterceptorFn = (req, next: HttpHandlerFn) => {
  const cryptoService = inject(CryptoService);
  let clonedReq = req;

  if (environment.IS_ENCRYPTION_ENABLED) {
    if (req.body) {
      const encryptedBody = cryptoService.encrypt(req.body);

      clonedReq = req.clone({
        setHeaders: { 'Content-Type': 'application/json' },
        body: { payload: encryptedBody },
      });
    }

    return next(clonedReq).pipe(
      map((event) => {
        if (
          event instanceof HttpResponse &&
          typeof event.body === 'object' &&
          event.body !== null &&
          'payload' in event.body
        ) {
          try {
            const decrypted = cryptoService.decrypt((event.body as { payload: string }).payload);
            return event.clone({ body: decrypted });
          } catch (e) {
            console.error('Decryption failed:', e);
            return event; // ✅ Return the original event on error
          }
        }
        return event;
      })
    );
  } else {
    return next(clonedReq);
  }
};
