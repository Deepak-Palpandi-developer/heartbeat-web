import { computed, Injectable, signal } from '@angular/core';
import { UserModel, UserPreferenceModel, WorkspacePermissionModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserSignalService {
  private _user = signal<UserModel | null>(null);
  private _userPreferences = signal<UserPreferenceModel | null>(null);
  private _userPremissions = signal<Record<string, WorkspacePermissionModel>>({});

  user = computed(() => this._user());
  userPreferences = computed(() => this._userPreferences());
  userPermissions = computed(() => this._userPremissions());

  insertUser(user: UserModel | null, mode: string = 'set'): void {
    if (mode === 'set') {
      this._user.set(user);
    } else if (mode === 'update') {
      this._user.update((currentUser) => ({ ...currentUser, ...user } as UserModel));
    } else if (mode === 'clear') {
      this._user.set(null);
    }
  }

  insertUserPreferences(preferences: UserPreferenceModel | null, mode: string = 'set'): void {
    if (mode === 'set') {
      this._userPreferences.set(preferences);
    } else if (mode === 'update') {
      this._userPreferences.update(
        (currentPreferences) => ({ ...currentPreferences, ...preferences } as UserPreferenceModel)
      );
    } else if (mode === 'clear') {
      this._userPreferences.set(null);
    }
  }

  setUserPermissions(
    permissions: Record<string, WorkspacePermissionModel>,
    mode: string = 'set'
  ): void {
    if (mode === 'set') {
      this._userPremissions.set(permissions);
    } else if (mode === 'update') {
      this._userPremissions.update((currentPermissions) => ({
        ...currentPermissions,
        ...permissions,
      }));
    } else if (mode === 'clear') {
      this._userPremissions.set({});
    }
  }
}
