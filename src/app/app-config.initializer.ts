import { inject } from '@angular/core';
import { APP_INITIALIZER, Provider } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AppSignalService } from './shared/signals/app-signal.service';
import { API_ROUTES } from './shared/const/api-routes.const';
import { CustomHttpService } from './core/services/custom-http.service';

export function appConfigInitializerFactory(): () => Promise<void> {
  const http = inject(CustomHttpService);
  const appSignal = inject(AppSignalService);
  const translate = inject(TranslateService);

  return async () => {
    try {
      // Initialize translations
      translate.setDefaultLang('en');
      await firstValueFrom(translate.use('en'));

      // Fetch app config
      const response: any = await firstValueFrom(http.get<any>(API_ROUTES.APP_CONFIG));
      if (response && Array.isArray(response?.data)) {
        appSignal.setAppConfigs(
          response.data.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
          }, {})
        );
      }
    } catch (err) {
      console.error('Failed to initialize app:', err);
      appSignal.setAppConfigs({});
    }
  };
}

export const APP_CONFIG_INITIALIZER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: appConfigInitializerFactory,
  multi: true,
};
