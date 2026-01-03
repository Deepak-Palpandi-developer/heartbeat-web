import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LoaderService } from '../../core/services/loader.service';

@Component({
  selector: 'heart-beat-loader',
  template: `
    @if (showLoader()) {
    <div class="loader-overlay" aria-busy="true" aria-live="polite">
      <div class="heartbeat-loader" role="status" aria-label="Loading">
        <svg viewBox="0 0 100 90" width="60" height="54">
          <path
            class="heart"
            d="M10,30
              A20,20 0 0,1 50,30
              A20,20 0 0,1 90,30
              Q90,60 50,85
              Q10,60 10,30Z"
          />
        </svg>
      </div>
    </div>
    }
  `,
  styles: [
    `
      .loader-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-size: 200% 200%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }
      .heartbeat-loader {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .heart {
        fill: #e63946;
        stroke: #b71c1c;
        stroke-width: 2;
        transform-origin: 50% 60%;
        animation: heartbeat 1s infinite cubic-bezier(0.4, 0, 0.6, 1);
      }
      @keyframes heartbeat {
        0% {
          transform: scale(1);
        }
        10% {
          transform: scale(1.1);
        }
        20% {
          transform: scale(1.2);
        }
        30% {
          transform: scale(1.1);
        }
        40% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
        60% {
          transform: scale(1.2);
        }
        70% {
          transform: scale(1.1);
        }
        80% {
          transform: scale(1);
        }
        100% {
          transform: scale(1);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  private loaderService = inject(LoaderService);
  showLoader = computed(() => this.loaderService.loaderCount() > 0);
}
