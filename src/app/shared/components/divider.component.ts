import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'heart-beat-divider',
  imports: [],
  template: `
    <div class="relative py-3 sm:py-5">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-200 dark:border-gray-800"></div>
      </div>
      @if (text()) {
      <div class="relative flex justify-center text-sm">
        <span class="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
          {{ text() }}
        </span>
      </div>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerComponent {
  text = input<string>('Or');
}
