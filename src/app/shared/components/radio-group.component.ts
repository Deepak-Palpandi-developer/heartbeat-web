import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioComponent } from './radio.component';

export interface RadioOption {
  id?: string;
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'heart-beat-radio-group',
  imports: [RadioComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RadioGroupComponent,
      multi: true,
    },
  ],
  template: `
    <div
      [class]="containerClasses()"
      role="radiogroup"
      [attr.aria-labelledby]="ariaLabelledBy()"
    >
      @for (option of options(); track option.id || option.value) {
        <heart-beat-radio
          [id]="option.id || option.value"
          [name]="name()"
          [value]="option.value"
          [label]="option.label"
          [disabled]="option.disabled || isDisabled()"
          [className]="radioClassName()"
          [groupValue]="selectedValue()"
          (valueChange)="onRadioChange($event)"
        />
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupComponent implements ControlValueAccessor {
  // Inputs
  name = input.required<string>();
  options = input.required<RadioOption[]>();
  orientation = input<'vertical' | 'horizontal'>('vertical');
  gap = input<'sm' | 'md' | 'lg'>('md');
  disabled = input<boolean>(false);
  className = input<string>('');
  radioClassName = input<string>('');
  ariaLabelledBy = input<string>();

  // Output
  valueChange = output<string>();

  // Internal state
  selectedValue = signal<string>('');
  isDisabled = signal<boolean>(false);

  // ControlValueAccessor callbacks
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Sync disabled state
    effect(() => {
      const disabledValue = this.disabled();
      if (this.isDisabled() !== disabledValue) {
        this.isDisabled.set(disabledValue);
      }
    });
  }

  containerClasses = () => {
    const gapSizes = {
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
    };

    const baseClasses = 'flex';
    const orientationClass = this.orientation() === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col';
    const gapClass = gapSizes[this.gap()];

    return `${baseClasses} ${orientationClass} ${gapClass} ${this.className()}`.trim();
  };

  onRadioChange(value: string): void {
    if (this.isDisabled()) return;

    this.selectedValue.set(value);
    this.onChange(value);
    this.onTouched();
    this.valueChange.emit(value);
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.selectedValue.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
