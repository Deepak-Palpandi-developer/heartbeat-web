import { ErrorHandler, Injectable, inject } from '@angular/core';
import { AlertService } from './alert.service';
import { CustomTranslateService } from './custom-translate.service';

interface GlobalError {
  component?: string;
  line?: number;
  message: string;
  details?: any;
}

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  private alertService = inject(AlertService);
  private translate = inject(CustomTranslateService);
  handleError(error: any): void {
    // Try to extract component and line info if available
    let component: string | undefined;
    let line: number | undefined;
    let message = 'Unknown error';
    let details: any = error;

    if (error && error.ngDebugContext) {
      component = error.ngDebugContext.component?.constructor?.name;
      // Try to get line from stack trace if available
      if (error.stack) {
        const match = error.stack.match(/:(\d+):\d+\)?$/m);
        if (match) {
          line = parseInt(match[1], 10);
        }
      }
    }

    if (error instanceof Error) {
      message = error.message;
      details = error.stack;
    } else if (typeof error === 'string') {
      message = error;
    }

    const globalError: GlobalError = {
      component,
      line,
      message,
      details,
    };

    // Log to console (could also send to server or show UI notification)
    console.error('Global Error:', globalError);
    // Show user-friendly alert
    this.alertService.show({
      variant: 'error',
      title: 'alert.unexpectedError.title',
      message,
      translateKey: 'alert.unexpectedError.title',
    });
  }
}
