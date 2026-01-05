import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  // Signal to track the number of active HTTP requests
  private _loaderCount = signal(0);

  // Expose readonly signal for components
  readonly loaderCount = this._loaderCount.asReadonly();

  show(): void {
    this._loaderCount.update((count) => count + 1);
  }

  hide(): void {
    this._loaderCount.update((count) => (count > 0 ? count - 1 : 0));
  }

  isLoading(): boolean {
    return this._loaderCount() > 0;
  }
}
