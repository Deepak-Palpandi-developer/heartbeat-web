import { Injectable, signal } from '@angular/core';

export interface Alert {
  id: string;
  variant: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  showLink?: boolean;
  linkHref?: string;
  linkText?: string;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alertsSignal = signal<Alert[]>([]);

  alerts = this.alertsSignal.asReadonly();

  show(alert: Omit<Alert, 'id'>) {
    const id = crypto.randomUUID();
    this.alertsSignal.update((alerts) => [...alerts, { ...alert, id }]);
    return id;
  }

  dismiss(id: string) {
    this.alertsSignal.update((alerts) => alerts.filter((alert) => alert.id !== id));
  }

  clear() {
    this.alertsSignal.set([]);
  }
}
