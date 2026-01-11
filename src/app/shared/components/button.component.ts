import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'heart-beat-button',
  imports: [NgIconComponent],
  template: `
    <button
      [type]="type()"
      [class]="buttonClasses()"
      [disabled]="disabled()"
      (click)="onClick($event)"
    >
      @if (iconStart()) {
      <ng-icon [name]="iconStart()!" [size]="iconSize()" />
      }
      <ng-content></ng-content>
      @if (iconEnd()) {
      <ng-icon [name]="iconEnd()!" [size]="iconSize()" />
      }
    </button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  // Inputs
  type = input<'button' | 'submit' | 'reset'>('button');
  size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  variant = input<'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'>('primary');
  disabled = input<boolean>(false);
  fullWidth = input<boolean>(false);
  className = input<string>('');
  iconStart = input<string>();
  iconEnd = input<string>();
  iconSize = input<string>('18');

  // Output
  btnClick = output<Event>();

  // Computed classes
  private sizeClasses = computed(() => {
    const sizes = {
      xs: 'px-3 py-2 text-xs',
      sm: 'px-3.5 py-2.5 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-5 py-3 text-base',
      xl: 'px-6 py-3.5 text-base',
    };
    return sizes[this.size()];
  });

  private variantClasses = computed(() => {
    const variants = {
      primary:
        'bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/20 disabled:bg-brand-300 disabled:cursor-not-allowed dark:bg-brand-600 dark:hover:bg-brand-700',
      secondary:
        'bg-gray-100 text-gray-900 shadow-theme-xs hover:bg-gray-200 focus:ring-4 focus:ring-gray-500/20 disabled:bg-gray-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
      outline:
        'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-4 focus:ring-gray-500/20 disabled:bg-gray-50 disabled:cursor-not-allowed dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-800',
      ghost:
        'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-4 focus:ring-gray-500/20 disabled:bg-transparent disabled:cursor-not-allowed dark:text-gray-300 dark:hover:bg-gray-800',
      danger:
        'bg-error-500 text-white shadow-theme-xs hover:bg-error-600 focus:ring-4 focus:ring-error-500/20 disabled:bg-error-300 disabled:cursor-not-allowed',
    };
    return variants[this.variant()];
  });

  buttonClasses = computed(() => {
    const baseClasses =
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-hidden';
    const widthClass = this.fullWidth() ? 'w-full' : '';
    const disabledClass = this.disabled() ? 'opacity-50' : '';

    return `${baseClasses} ${this.sizeClasses()} ${this.variantClasses()} ${widthClass} ${disabledClass} ${this.className()}`.trim();
  });

  onClick(event: Event): void {
    if (!this.disabled()) {
      this.btnClick.emit(event);
    }
  }
}
