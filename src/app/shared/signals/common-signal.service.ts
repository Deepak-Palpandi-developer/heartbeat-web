import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CommonSignalService {
  // Example common signals
  readonly isSidebarOpen = signal(false);
  readonly isDarkMode = signal(false);
  readonly currentUserId = signal<string | null>(null);
}
