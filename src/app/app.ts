import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './shared/components/loader.component';
import { AlertContainerComponent } from './shared/components/container/alert-container.component';
import { CustomHttpService } from './core/services/custom-http.service';
import { firstValueFrom } from 'rxjs';
import { API_ROUTES } from './shared/const/api-routes.const';

@Component({
  selector: 'heart-beat-root',
  imports: [RouterOutlet, LoaderComponent, AlertContainerComponent],
  template: `<heart-beat-loader /><heart-beat-alert-container /><router-outlet />`,
})
export class App {
  private customHttpService = inject(CustomHttpService);

  async ngOnInit() {
    const response: any = await firstValueFrom(
      this.customHttpService.get<any>(API_ROUTES.APP_CONFIG)
    );

    console.log('App Component Fetched config:', response);
  }
}
