import { Injectable, inject } from '@angular/core';
import { TranslateService as NgxTranslateService, TranslatePipe } from '@ngx-translate/core';

export interface TranslateOptions {
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class CustomTranslateService {
  private translateService = inject(NgxTranslateService);

  translate(
    key: string | string[],
    options?: TranslateOptions
  ): string | { [key: string]: string } {
    if (Array.isArray(key)) {
      // Return an object with key: translation
      const result: { [k: string]: string } = {};
      key.forEach((k) => {
        result[k] = this.translateService.instant(k, options);
      });
      return result;
    }
    // Single key
    return this.translateService.instant(key, options);
  }
}
