import {
  UserModel,
  UserPreferenceModel,
  WorkspacePermissionModel,
} from '../../../shared/models/user.model';

export interface LoginResponseModel {
  token: string;
  refreshToken: string;
  sessionToken: string;
  message: string;
  expiresAt: string;
  user: UserModel;
  userPreference: UserPreferenceModel;
  workspacePermission: WorkspacePermissionModel[];
}

export interface LoginRequest {
  userEmail: string;
  password: string;
  rememberMe?: boolean;
}
