import { Injectable, inject } from '@angular/core';
import { CustomHttpService } from './custom-http.service';
import { API_ROUTES } from '../../shared/const/api-routes.const';

export interface TraceEvent {
  userId: string;
  module: string;
  activity: string;
  state: 'start' | 'end' | string;
  details?: any;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class TraceService {
  private http = inject(CustomHttpService);

  trace(userId: string, module: string, activity: string, state: string, details?: any): void {
    const event: TraceEvent = {
      userId,
      module,
      activity,
      state,
      details,
      timestamp: new Date().toISOString(),
    };
    this.http.post(API_ROUTES.TRACE, event).subscribe({
      next: () => {},
      error: (err) => { console.error('Trace failed', err); }
    });
  }
}
