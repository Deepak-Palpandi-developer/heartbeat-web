import { inject, Injectable } from '@angular/core';
import { CustomHttpService } from '../../../core/services/custom-http.service';
import { API_ROUTES } from '../../../shared/const/api-routes.const';
import { LoginRequest, LoginResponseModel } from '../models/login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly customHttp = inject(CustomHttpService);

  login(request: LoginRequest) {
    this.customHttp.post<LoginResponseModel>(API_ROUTES.LOGIN, request).subscribe((res) => {
      if (res.success) {
        console.log(res.data);

        localStorage.setItem('remember', request?.rememberMe ? 'true' : 'false');

        const storage = request?.rememberMe ? localStorage : sessionStorage;

        storage.setItem('token', res.data.token);
        storage.setItem('refresh_token', res.data.refreshToken);
        storage.setItem('session_token', res.data.sessionToken);
        storage.setItem('user_id', res.data.user.id.toString());
      }
    });
  }
}
