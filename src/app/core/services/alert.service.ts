import { Injectable, signal, inject } from '@angular/core';
import { CustomTranslateService } from './custom-translate.service';

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
  private translate = inject(CustomTranslateService);

  show(alert: Omit<Alert, 'id'> & { translateKey?: string; translateParams?: any }) {
    const id = crypto.randomUUID();
    let translatedAlert = { ...alert, id };
    if (alert.translateKey) {
      // If a translation key is provided, use it for message/title
      const translation = this.translate.translate(alert.translateKey, alert.translateParams);
      if (typeof translation === 'string') {
        translatedAlert.message = translation;
      } else if (typeof translation === 'object') {
        Object.assign(translatedAlert, translation);
      }
    }
    // Default: translate title/message if they match known keys
    if (translatedAlert.title && translatedAlert.title.startsWith('alert.')) {
      const titleTranslation = this.translate.translate(translatedAlert.title);
      translatedAlert.title =
        typeof titleTranslation === 'string' ? titleTranslation : translatedAlert.title;
    }
    if (translatedAlert.message && translatedAlert.message.startsWith('alert.')) {
      const messageTranslation = this.translate.translate(
        translatedAlert.message,
        alert.translateParams
      );
      translatedAlert.message =
        typeof messageTranslation === 'string' ? messageTranslation : translatedAlert.message;
    }
    if (translatedAlert.linkText && translatedAlert.linkText.startsWith('ui.')) {
      const linkTextTranslation = this.translate.translate(translatedAlert.linkText);
      translatedAlert.linkText =
        typeof linkTextTranslation === 'string' ? linkTextTranslation : translatedAlert.linkText;
    }
    this.alertsSignal.update((alerts) => [...alerts, translatedAlert]);
    return id;
  }

  dismiss(id: string) {
    this.alertsSignal.update((alerts) => alerts.filter((alert) => alert.id !== id));
  }

  clear() {
    this.alertsSignal.set([]);
  }
}
