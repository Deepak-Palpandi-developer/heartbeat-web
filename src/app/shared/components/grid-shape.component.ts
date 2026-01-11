import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'heart-beat-grid-shape',
  imports: [],
  template: `
    <!-- Top Right Grid -->
    @if (showTopRight()) {
      <div 
        [class]="topRightClasses()" 
        [style.opacity]="opacity()"
        aria-hidden="true"
      >
        <img 
          [src]="imagePath()" 
          [alt]="imageAlt()"
          [class]="imageClasses()"
          loading="lazy"
        />
      </div>
    }

    <!-- Bottom Left Grid -->
    @if (showBottomLeft()) {
      <div 
        [class]="bottomLeftClasses()"
        [style.opacity]="opacity()"
        aria-hidden="true"
      >
        <img 
          [src]="imagePath()" 
          [alt]="imageAlt()"
          [class]="imageClasses()"
          loading="lazy"
        />
      </div>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridShapeComponent {
  // Inputs
  imagePath = input<string>('/images/shape/grid-01.svg');
  imageAlt = input<string>('grid');
  showTopRight = input<boolean>(true);
  showBottomLeft = input<boolean>(true);
  opacity = input<number>(1);
  maxWidth = input<string>('62.5'); // Tailwind value without 'max-w-' prefix
  maxWidthXl = input<string>('112.5'); // XL breakpoint max width
  zIndex = input<string>('-1'); // z-index value
  customTopRightClass = input<string>('');
  customBottomLeftClass = input<string>('');
  imageClass = input<string>('');

  // Computed classes
  topRightClasses = computed(() => {
    const maxW = this.maxWidth();
    const maxWXl = this.maxWidthXl();
    const zIdx = this.zIndex();
    const custom = this.customTopRightClass();
    
    return `absolute right-0 top-0 -z-${zIdx} w-full max-w-${maxW} xl:max-w-${maxWXl} ${custom}`.trim();
  });

  bottomLeftClasses = computed(() => {
    const maxW = this.maxWidth();
    const maxWXl = this.maxWidthXl();
    const zIdx = this.zIndex();
    const custom = this.customBottomLeftClass();
    
    return `absolute bottom-0 left-0 -z-${zIdx} w-full max-w-${maxW} rotate-180 xl:max-w-${maxWXl} ${custom}`.trim();
  });

  imageClasses = computed(() => {
    const custom = this.imageClass();
    return `w-full h-auto ${custom}`.trim();
  });
}
