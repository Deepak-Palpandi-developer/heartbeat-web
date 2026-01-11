import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'heart-beat-label',
  imports: [],
  template: `
    <label
      [attr.for]="for()"
      [class]="labelClasses()"
      [class.opacity-50]="disabled()"
      [class.cursor-not-allowed]="disabled()"
    >
      <span class="inline-flex items-center gap-1">
        <ng-content></ng-content>
        @if (required()) {
        <span class="text-red-500" aria-label="required">*</span>
        } @if (optional()) {
        <span class="text-gray-400 text-xs font-normal">(optional)</span>
        }
      </span>
      @if (hint()) {
      <span class="block text-xs font-normal text-gray-500 dark:text-gray-500 mt-0.5">
        {{ hint() }}
      </span>
      }
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelComponent {
  // Input for the associated form control ID
  for = input<string>('');

  // Additional CSS classes to apply
  class = input<string>('');

  // Mark field as required
  required = input<boolean>(false);

  // Mark field as optional
  optional = input<boolean>(false);

  // Show hint text below label
  hint = input<string>('');

  // Disabled state styling
  disabled = input<boolean>(false);

  // Computed label classes
  labelClasses = computed(() => {
    const baseClasses = 'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400';
    const customClasses = this.class();
    return customClasses ? `${baseClasses} ${customClasses}` : baseClasses;
  });
}
