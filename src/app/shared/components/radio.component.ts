import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'heart-beat-radio',
  imports: [NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RadioComponent,
      multi: true,
    },
  ],
  template: `
    <label
      [attr.for]="id()"
      class="relative flex cursor-pointer select-none items-center gap-3 text-sm font-medium"
      [class.cursor-not-allowed]="isDisabled()"
      [class.text-gray-300]="isDisabled()"
      [class.dark:text-gray-600]="isDisabled()"
      [class.text-gray-700]="!isDisabled()"
      [class.dark:text-gray-400]="!isDisabled()"
      [class]="className()"
    >
      <input
        [id]="id()"
        [name]="name()"
        type="radio"
        [value]="value()"
        [checked]="isChecked()"
        (change)="onChange()"
        (blur)="onTouched()"
        class="sr-only"
        [disabled]="isDisabled()"
      />
      <span
        class="flex h-5 w-5 items-center justify-center rounded-full border-[1.25px] transition-colors"
        [class.border-brand-500]="isChecked() && !isDisabled()"
        [class.bg-brand-500]="isChecked() && !isDisabled()"
        [class.border-gray-300]="!isChecked() && !isDisabled()"
        [class.dark:border-gray-700]="!isChecked() && !isDisabled()"
        [class.bg-transparent]="!isChecked() && !isDisabled()"
        [class.bg-gray-100]="isDisabled()"
        [class.dark:bg-gray-700]="isDisabled()"
        [class.border-gray-200]="isDisabled()"
        [class.dark:border-gray-700]="isDisabled()"
      >
        <span
          [ngClass]="{
            'h-2 w-2 rounded-full bg-white': true,
            block: isChecked(),
            hidden: !isChecked()
          }"
        ></span>
      </span>
      {{ label() }}
    </label>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent implements ControlValueAccessor {
  // Inputs
  id = input.required<string>();
  name = input.required<string>();
  value = input.required<string>();
  label = input.required<string>();
  className = input<string>('');
  disabled = input<boolean>(false);
  groupValue = input<string>(''); // Value from parent radio group

  // Output (for non-reactive forms usage)
  valueChange = output<string>();

  // Internal state for ControlValueAccessor
  isChecked = signal<boolean>(false);
  isDisabled = signal<boolean>(false);
  private currentValue = signal<string>('');

  // ControlValueAccessor callbacks
  private onChange_cb: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    // Sync disabled state from input
    effect(() => {
      const disabledValue = this.disabled();
      if (this.isDisabled() !== disabledValue) {
        this.isDisabled.set(disabledValue);
      }
    });

    // Sync checked state when value changes
    effect(() => {
      const currentVal = this.currentValue();
      const groupVal = this.groupValue();
      const thisVal = this.value();
      
      // Check if this radio is selected based on groupValue (priority) or currentValue
      const selectedValue = groupVal || currentVal;
      this.isChecked.set(selectedValue === thisVal);
    });
  }

  onChange(): void {
    if (this.isDisabled()) return;

    const newValue = this.value();
    this.currentValue.set(newValue);
    this.isChecked.set(true);
    this.onChange_cb(newValue);
    this.valueChange.emit(newValue);
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.currentValue.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange_cb = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
