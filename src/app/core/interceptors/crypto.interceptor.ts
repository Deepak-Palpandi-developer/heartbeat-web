import { inject } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CryptoService } from '../services/crypto.service';
import { environment } from '../../../environments/environment';

const enableEncryption = !!environment.IS_ENCRYPTION_ENABLED;

export function cryptoInterceptor(
  req: HttpRequest<any>,
  next: (req: HttpRequest<any>) => Observable<HttpEvent<any>>
): Observable<HttpEvent<any>> {
  const cryptoService = inject(CryptoService);
  let modifiedReq = req;

  if (enableEncryption && req.method !== 'GET' && req.body && !(req.body instanceof FormData)) {
    try {
      const encryptedBody = cryptoService.encrypt(req.body);
      modifiedReq = req.clone({
        body: encryptedBody,
        responseType: req.responseType === 'json' ? 'text' : req.responseType,
      });
    } catch {
      throw new Error('Failed to encrypt request payload');
    }
  }

  return next(modifiedReq).pipe(
    map((event) => {
      if (event instanceof HttpResponse) {
        console.log('Crypto Interceptor Decrypting Response');
        return handleResponse(event, cryptoService);
      }
      return event;
    })
  );
}

function handleResponse(event: HttpResponse<any>, cryptoService: CryptoService): HttpResponse<any> {
  if (!enableEncryption) {
    return event;
  }
  try {
    let decrypted = cryptoService.decrypt(event.body?.Payload);
    try {
      decrypted = JSON.parse(decrypted as string);
    } catch {
      // Not JSON, leave as is
    }
    return event.clone({ body: decrypted });
  } catch {
    throw new Error('Failed to decrypt response payload');
  }
}
