import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppSignalService {
  readonly cacheUrls = signal<string[]>([]);
  readonly appConfigs = signal<Record<string, any>>({});

  readonly apiCache = signal<Record<string, any>>({});

  setCacheUrlList(urls: string[]): void {
    this.cacheUrls.set(urls);
  }

  setAppConfigs(configs: Record<string, any>): void {
    this.appConfigs.set(configs);
  }

  setApiCache(url: string, response: any): void {
    this.apiCache.update((cache) => ({ ...cache, [url]: response }));
  }

  getApiCache(url: string): any | undefined {
    return this.apiCache()[url];
  }

  clearApiCache(url?: string): void {
    if (url) {
      const { [url]: _, ...rest } = this.apiCache();
      this.apiCache.set(rest);
    } else {
      this.apiCache.set({});
    }
  }
}
