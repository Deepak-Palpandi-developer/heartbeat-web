import { inject, Injectable } from '@angular/core';
import { CustomHttpService } from '../../../core/services/custom-http.service';
import { API_ROUTES } from '../../../shared/const/api-routes.const';
import { LoginRequest, LoginResponseModel } from '../models/login.model';
import { LOCAL_CACHE_KEYS } from '../../../shared/const/app.local.cache.const';
import { Router } from '@angular/router';
import { UserSignalService } from '../../../shared/signals/user-signal.service';
import { WorkspacePermissionModel } from '../../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly customHttp = inject(CustomHttpService);
  private readonly router = inject(Router);
  private readonly userSignal = inject(UserSignalService);

  login(request: LoginRequest) {
    this.customHttp.post<LoginResponseModel>(API_ROUTES.LOGIN, request).subscribe((res) => {
      if (res.success) {
        localStorage.setItem(
          LOCAL_CACHE_KEYS.AUTH.IS_REMEBER_ME,
          request?.rememberMe ? 'true' : 'false'
        );

        const storage = request?.rememberMe ? localStorage : sessionStorage;

        storage.setItem(LOCAL_CACHE_KEYS.AUTH.TOKEN, res.data.token);
        storage.setItem(LOCAL_CACHE_KEYS.AUTH.REFRESH_TOKEN, res.data.refreshToken);
        storage.setItem(LOCAL_CACHE_KEYS.AUTH.SESSION_TOKEN, res.data.sessionToken);
        storage.setItem(LOCAL_CACHE_KEYS.USER.USER_ID, res.data.user.id.toString());

        this.userSignal.insertUser(res.data.user);
        this.userSignal.insertUserPreferences(res.data.userPreference, 'set');

        let permissions: Record<string, WorkspacePermissionModel> = {};

        res.data.workspacePermission.forEach((perm) => {
          if (!permissions[perm.workspaceId]) {
            permissions[perm.workspaceId] = perm;
          }
        });

        this.userSignal.setUserPermissions(permissions, 'set');

        if (res.data.user.landingPage) this.router.navigate(['/heartbeat']);
      }
    });
  }
}
