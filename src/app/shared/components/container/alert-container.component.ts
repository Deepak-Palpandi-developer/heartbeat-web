import { Component, inject } from '@angular/core';
import { AlertComponent } from '../alert.component';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'heart-beat-alert-container',
  imports: [AlertComponent],
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md">
      @for (alert of alertService.alerts(); track alert.id) {
      <div class="animate-slide-in relative">
        <heart-beat-alert
          [variant]="alert.variant"
          [title]="alert.title"
          [message]="alert.message"
          [showLink]="alert.showLink ?? false"
          [linkHref]="alert.linkHref ?? '#'"
          [linkText]="alert.linkText ?? 'Learn more'"
        />
        <button
          (click)="dismiss(alert.id)"
          class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Close alert"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      }
    </div>
  `,
  styles: `
    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
  `,
})
export class AlertContainerComponent {
  alertService = inject(AlertService);

  dismiss(id: string) {
    this.alertService.dismiss(id);
  }
}
