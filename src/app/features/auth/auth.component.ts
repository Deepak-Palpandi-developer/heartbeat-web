import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { GridShapeComponent } from '../../shared/components/grid-shape.component';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle.component';

@Component({
  selector: 'heart-beat-auth',
  imports: [RouterOutlet, RouterLink, GridShapeComponent, ThemeToggleComponent],
  template: `
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0"
      >
        <router-outlet></router-outlet>
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
                  src="/logo/heartbeat-logo-dark.svg"
                  alt="HeartBeat application logo"
                />
              </a>
              <p class="text-center text-gray-400 dark:text-white/60">
                Your Health, Our Priority - Monitor, Track, and Manage Your Well-being
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
export class AuthComponent {}
