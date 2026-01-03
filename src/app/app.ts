import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderService } from './core/services/loader.service';
import { LoaderComponent } from './shared/components/loader.component';

@Component({
  selector: 'heart-beat-root',
  imports: [RouterOutlet, LoaderComponent],
  template: `<heart-beat-loader /><router-outlet />`,
})
export class App {
  private loderService = inject(LoaderService);

  ngOnInit() {
    this.loderService.show();
  }
}
