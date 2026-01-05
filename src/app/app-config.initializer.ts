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

      console.log('Fetched app config (raw):', response);

      let config: any;
      if (environment.IS_ENCRYPTION_ENABLED && response?.Payload) {
        config = cryptoService.decrypt(response.Payload);
        console.log('Decrypted app config:', config);
      } else {
        config = response;
      }

      if (config && Array.isArray(config)) {
        appSignal.setAppConfigs(config);
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
