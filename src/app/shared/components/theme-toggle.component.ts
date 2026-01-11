import { Component, ChangeDetectionStrategy, inject, computed, input } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { ThemeService } from '../../core/services/theme.service';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'heart-beat-theme-toggle',
  imports: [NgIconComponent, ButtonComponent],
  template: `
    <heart-beat-button
      [variant]="variant()"
      [size]="size()"
      [className]="buttonClasses()"
      [attr.aria-label]="ariaLabel()"
      (btnClick)="toggleTheme()"
    >
      @if (currentTheme() === 'dark') {
        <!-- Sun icon for dark mode (switch to light) -->
        <ng-icon
          name="lucideSun"
          size="20"
          aria-hidden="true"
        />
      } @else {
        <!-- Moon icon for light mode (switch to dark) -->
        <ng-icon
          name="lucideMoon"
          size="20"
          aria-hidden="true"
        />
      }
    </heart-beat-button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);

  // Inputs for customization
  size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  variant = input<'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'>('primary');
  className = input<string>('');

  // Computed properties
  currentTheme = this.themeService.theme;
  
  ariaLabel = computed(() => 
    this.currentTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  );

  buttonClasses = computed(() => {
    // Additional classes for rounded-full style
    const customClass = this.className();
    return `rounded-full ${customClass}`.trim();
  });

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
