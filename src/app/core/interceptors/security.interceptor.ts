import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CryptoService } from '../services/crypto.service';

export const securityInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const crypto = inject(CryptoService);
  const encryptionEnabled = environment.IS_ENCRYPTION_ENABLED;

  /* -------------------- REQUEST -------------------- */

  let modifiedReq = req.clone({
    headers: req.headers
      .set('X-App-Security', 'enabled')
      .set('X-Frame-Options', 'DENY')
      .set('X-Content-Type-Options', 'nosniff')
      .set('X-Encrypt-Data', String(encryptionEnabled))
      // Prevent MIME sniffing
      .set('Referrer-Policy', 'strict-origin-when-cross-origin')
      // Prevent clickjacking
      .set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none';"
      )
      // Prevent XSS in legacy browsers
      .set('X-XSS-Protection', '1; mode=block')
      // Prevent caching of sensitive data
      .set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .set('Pragma', 'no-cache')
      .set('Expires', '0'),
  });

  // Sanitize URL to prevent CRLF injection
  if (/\r|\n/.test(modifiedReq.url)) {
    throw new Error('Potential CRLF injection detected in request URL');
  }

  // Optionally, block requests to known malicious domains (example)
  const blockedDomains = ['malicious.com', 'phishing.com'];
  if (blockedDomains.some((domain) => modifiedReq.url.includes(domain))) {
    throw new Error('Blocked request to known malicious domain');
  }

  return next(modifiedReq);
};
