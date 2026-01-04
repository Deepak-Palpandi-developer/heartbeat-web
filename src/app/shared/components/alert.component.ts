import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'heart-beat-alert',
  imports: [NgIcon, RouterLink],
  template: `
    <div class="rounded-xl border p-4" [class]="variantClasses().container">
      <div class="flex items-start gap-3">
        <div class="mt-1" [class]="variantClasses().icon">
          <ng-icon [name]="iconSvg()" />
        </div>

        <div>
          <h4 class="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90">
            {{ title() }}
          </h4>

          <p class="text-sm text-gray-500 dark:text-gray-400">{{ message() }}</p>

          @if (showLink()) {
          <a
            [routerLink]="linkHref()"
            class="inline-block mt-3 text-sm font-medium text-gray-500 underline dark:text-gray-400"
          >
            {{ linkText() }}
          </a>
          }
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class AlertComponent {
  variant = input<'success' | 'error' | 'warning' | 'info'>('info');
  title = input<string>('');
  message = input<string>('');
  showLink = input<boolean>(false);
  linkHref = input<string>('#');
  linkText = input<string>('Learn more');

  variantClasses = computed(() => {
    const variantMap = {
      success: {
        container:
          'border-success-500 bg-success-50 dark:border-success-500/30 dark:bg-success-500/15',
        icon: 'text-success-500',
      },
      error: {
        container: 'border-error-500 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15',
        icon: 'text-error-500',
      },
      warning: {
        container:
          'border-warning-500 bg-warning-50 dark:border-warning-500/30 dark:bg-warning-500/15',
        icon: 'text-warning-500',
      },
      info: {
        container:
          'border-blue-light-500 bg-blue-light-50 dark:border-blue-light-500/30 dark:bg-blue-light-500/15',
        icon: 'text-blue-light-500',
      },
    };
    return variantMap[this.variant()];
  });

  iconSvg = computed(() => {
    const iconMap = {
      success: 'lucideCheckCircle2',
      error: 'lucideAlertCircle',
      warning: 'lucideInfo',
      info: 'lucideInfo',
    };
    return iconMap[this.variant()];
  });
}
