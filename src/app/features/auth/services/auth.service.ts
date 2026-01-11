import { inject, Injectable } from '@angular/core';
import { CustomHttpService } from '../../../core/services/custom-http.service';
import { API_ROUTES } from '../../../shared/const/api-routes.const';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly customHttp = inject(CustomHttpService);

  login(request: unknown) {
    this.customHttp.post(API_ROUTES.LOGIN, request).subscribe((data) => {
      console.log(data);
    });
  }
}
