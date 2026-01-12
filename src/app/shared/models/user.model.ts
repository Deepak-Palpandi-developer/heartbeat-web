export interface UserModel {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  status: string;
  accountLocked: boolean;
  lockReason: string | null;
  failedLoginAttempts: number | null;
  lastFailedLogin: string | null;
  lastLogin: string | null;
  departmentId: number;
  workspaceId: number;
  landingWorkspace: string;
  landingPage: string;
  canChangeWorkspace: boolean;
  joinedDate: string;
  needPasswordChange: boolean;
  isSystemUser: boolean;
}

export interface UserPreferenceModel {
  id: number;
  userId: number;
  language: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  theme: string;
}

export interface WorkspacePermissionModel {
  id: number;
  userRoleId: number;
  workspaceId: number;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canPrint: boolean;
  canExport: boolean;
  canSchedule: boolean;
  canManageUsers: boolean;
  canManageRoles: boolean;
  canManageSettings: boolean;
  canManageBilling: boolean;
  canManageIntegrations: boolean;
  canViewAuditLogs: boolean;
  canCustomize: boolean;
}
