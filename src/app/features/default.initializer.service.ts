import { inject, Injectable } from '@angular/core';
import { CustomHttpService } from '../core/services/custom-http.service';
import { AppSignalService } from '../shared/signals/app-signal.service';
import { API_ROUTES } from '../shared/const/api-routes.const';

@Injectable({ providedIn: 'root' })
export class DefaultInitializerService {
  private readonly customHttp = inject(CustomHttpService);
  private readonly appSignal = inject(AppSignalService);

  startInitialization() {
    // Fetch cache URLs from the server and store them in the AppSignalService
    this.getCacheUrls();
  }

  getCacheUrls() {
    this.customHttp.get(API_ROUTES.APP_GET_CACHE_URLS).subscribe((res) => {
      console.log(res);
    });
  }
}
