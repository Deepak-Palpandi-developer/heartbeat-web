import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { GridShapeComponent } from '../../shared/components/grid-shape.component';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle.component';
import { AppSignalService } from '../../shared/signals/app-signal.service';
import { AppConfigKeys } from '../../shared/const/app.config.const';

@Component({
  selector: 'heart-beat-auth',
  imports: [RouterOutlet, RouterLink, GridShapeComponent, ThemeToggleComponent],
  template: `
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0"
      >
        <div class="flex flex-col flex-1 justify-center">
          <router-outlet></router-outlet>
        </div>
        <aside
          class="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid relative"
          aria-label="Authentication branding"
        >
          <div class="flex items-center justify-center z-1">
            <heart-beat-grid-shape />
            <div class="flex flex-col items-center max-w-xs">
              <a routerLink="/" class="block mb-4" aria-label="Return to home page">
                <img
                  width="231"
                  height="48"
                  src="{{ appConfig[appConfigKeys.UI_KEYS.BRANDING.LOGO_DARK_URL] }}"
                  alt="{{ appConfig[appConfigKeys.UI_KEYS.BRANDING.APP_NAME] }} Logo"
                />
              </a>
              <p class="text-center text-gray-400 dark:text-white/60">
                {{ appConfig[appConfigKeys.UI_KEYS.BRANDING.TAGLINE] }}
              </p>
            </div>
          </div>
          <div class="absolute bottom-6 left-0 right-0 flex justify-center">
            <div class="px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <p class="text-sm text-gray-400 dark:text-white/60 font-mono">
                v{{ appConfig[appConfigKeys.UI_KEYS.APP.VERSION] }}
                @if (appConfig[appConfigKeys.UI_KEYS.APP.BUILD_NUMBER]) {
                <span class="text-gray-500 dark:text-white/40">
                  ({{ appConfig[appConfigKeys.UI_KEYS.APP.BUILD_NUMBER] }})
                </span>
                }
              </p>
            </div>
          </div>
        </aside>
        <div class="fixed z-50 hidden bottom-6 right-6 sm:block">
          <heart-beat-theme-toggle />
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  protected readonly appConfig = inject(AppSignalService).appConfigs();
  protected readonly appConfigKeys = AppConfigKeys;
}
