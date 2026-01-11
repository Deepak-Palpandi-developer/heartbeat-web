import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'heart-beat-checkbox',
  imports: [NgIconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckboxComponent,
      multi: true,
    },
  ],
  template: `
    <label
      class="flex items-center space-x-3 group cursor-pointer"
      [class.cursor-not-allowed]="isDisabled()"
      [class.opacity-60]="isDisabled()"
    >
      <div class="relative w-5 h-5">
        <input
          [id]="id()"
          type="checkbox"
          class="w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20"
          [class]="className()"
          [checked]="isChecked()"
          (change)="onChange($event)"
          (blur)="onTouched()"
          [disabled]="isDisabled()"
        />
        @if (isChecked()) {
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
          [class.text-white]="!isDisabled()"
          [class.text-gray-300]="isDisabled()"
        >
          <ng-icon name="lucideCheck" size="14" strokeWidth="2.5" />
        </div>
        }
      </div>
      @if (label()) {
      <span
        class="text-sm font-medium select-none"
        [class.text-gray-800]="!isDisabled()"
        [class.text-gray-500]="isDisabled()"
        [class.dark:text-gray-200]="!isDisabled()"
        [class.dark:text-gray-600]="isDisabled()"
      >
        {{ label() }}
      </span>
      }
    </label>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent implements ControlValueAccessor {
  // Inputs
  label = input<string>();
  id = input<string>('');
  className = input<string>('');
  disabled = input<boolean>(false);

  // Output (for non-reactive forms usage)
  checkedChange = output<boolean>();

  // Internal state for ControlValueAccessor
  isChecked = signal<boolean>(false);
  isDisabled = signal<boolean>(false);

  // ControlValueAccessor callbacks
  private onChange_cb: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    // Sync disabled state from input
    effect(() => {
      const disabledValue = this.disabled();
      if (this.isDisabled() !== disabledValue) {
        this.isDisabled.set(disabledValue);
      }
    });
  }

  onChange(event: Event): void {
    if (this.isDisabled()) return;

    const input = event.target as HTMLInputElement;
    const checked = input.checked;

    this.isChecked.set(checked);
    this.onChange_cb(checked);
    this.checkedChange.emit(checked);
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this.isChecked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange_cb = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
