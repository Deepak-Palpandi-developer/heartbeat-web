import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  signal,
  effect,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'heart-beat-input-field',
  imports: [NgIconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputFieldComponent,
      multi: true,
    },
  ],
  template: `
    <div class="relative">
      @if (iconBefore()) {
      <div
        class="absolute left-3 top-0 h-11 flex items-center pointer-events-none"
        [class.text-gray-400]="!error() && !success()"
        [class.text-error-500]="error()"
        [class.text-success-500]="success()"
      >
        <ng-icon [name]="iconBefore()!" [size]="iconSize()" />
      </div>
      }

      <input
        [type]="type()"
        [id]="id()"
        [name]="name()"
        [placeholder]="placeholder()"
        [value]="inputValue()"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [disabled]="isDisabled()"
        [class]="inputClasses()"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />

      @if (iconAfter()) {
      <div
        class="absolute right-3 top-0 h-11 flex items-center"
        [class.pointer-events-none]="!iconAfterClickable()"
        [class.cursor-pointer]="iconAfterClickable()"
        [class.text-gray-400]="!error() && !success()"
        [class.text-error-500]="error()"
        [class.text-success-500]="success()"
        [class.hover:text-gray-700]="iconAfterClickable() && !error() && !success()"
        [class.dark:hover:text-gray-300]="iconAfterClickable() && !error() && !success()"
        (click)="onIconAfterClick()"
      >
        <ng-icon [name]="iconAfter()!" [size]="iconSize()" />
      </div>
      }

      @if (hint()) {
      <p
        class="mt-1.5 text-xs"
        [class.text-error-500]="error()"
        [class.text-success-500]="success()"
        [class.text-gray-500]="!error() && !success()"
      >
        {{ hint() }}
      </p>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFieldComponent implements ControlValueAccessor {
  // Inputs
  type = input<string>('text');
  id = input<string>('');
  name = input<string>('');
  placeholder = input<string>('');
  min = input<string>();
  max = input<string>();
  step = input<number>();
  disabled = input<boolean>(false);
  success = input<boolean>(false);
  error = input<boolean>(false);
  hint = input<string>();
  className = input<string>('');
  iconBefore = input<string>();
  iconAfter = input<string>();
  iconSize = input<string>('18');
  iconAfterClickable = input<boolean>(false);

  // Output (for non-reactive forms usage)
  valueChange = output<string | number>();
  iconAfterClick = output<void>();

  // Internal state for ControlValueAccessor
  inputValue = signal<string | number>('');
  isDisabled = signal<boolean>(false);

  // ControlValueAccessor callbacks
  private onChange: (value: string | number) => void = () => {};
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

  // Computed signal for input classes
  inputClasses = computed(() => {
    const hasIconBefore = !!this.iconBefore();
    const hasIconAfter = !!this.iconAfter();
    
    let inputClasses = `h-11 w-full rounded-lg border appearance-none py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${this.className()}`;
    
    // Add padding based on icon position
    if (hasIconBefore && hasIconAfter) {
      inputClasses += ` px-10`;
    } else if (hasIconBefore) {
      inputClasses += ` pl-10 pr-4`;
    } else if (hasIconAfter) {
      inputClasses += ` pl-4 pr-10`;
    } else {
      inputClasses += ` px-4`;
    }

    if (this.isDisabled()) {
      inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
    } else if (this.error()) {
      inputClasses += ` border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
    } else if (this.success()) {
      inputClasses += ` border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
    } else {
      inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800`;
    }
    return inputClasses;
  });

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = this.type() === 'number' ? +input.value : input.value;
    
    this.inputValue.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onIconAfterClick(): void {
    if (this.iconAfterClickable()) {
      this.iconAfterClick.emit();
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: string | number): void {
    this.inputValue.set(value ?? '');
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
