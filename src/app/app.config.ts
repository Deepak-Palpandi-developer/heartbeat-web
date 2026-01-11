import { APP_CONFIG_INITIALIZER } from './app-config.initializer';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, ErrorHandler } from '@angular/core';

import { GlobalErrorHandler } from './core/services/global-error-handler.service';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { securityInterceptor } from './core/interceptors/security.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { cryptoInterceptor } from './core/interceptors/crypto.interceptor';

import { provideIcons } from '@ng-icons/core';
import { appIcons } from './shared/const/app.icons';

export const appConfig: ApplicationConfig = {
  providers: [
    APP_CONFIG_INITIALIZER,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([securityInterceptor, cryptoInterceptor, authInterceptor])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'en',
      lang: 'en',
    }),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideIcons(appIcons),
  ],
};
