import { inject } from '@angular/core';
import { APP_INITIALIZER, Provider } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AppSignalService } from './shared/signals/app-signal.service';
import { API_ROUTES } from './shared/const/api-routes.const';
import { CustomHttpService } from './core/services/custom-http.service';
import { CryptoService } from './core/services/crypto.service';
import { environment } from '../environments/environment';

export function appConfigInitializerFactory(): () => Promise<void> {
  const http = inject(CustomHttpService);
  const appSignal = inject(AppSignalService);
  const cryptoService = inject(CryptoService);

  return async () => {
    try {
      const response: any = await firstValueFrom(http.get<any>(API_ROUTES.APP_CONFIG));
      console.log('App Config Initializer Fetched config:', response);
      if (response && Array.isArray(response)) {
        appSignal.setAppConfigs(response);
      }
    } catch (err) {
      console.error('Failed to fetch app config:', err);
      appSignal.setAppConfigs({});
    }
  };
}

export const APP_CONFIG_INITIALIZER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: appConfigInitializerFactory,
  multi: true,
};
