export interface AdminUser {
  id: string;
  username: string;
  email: string;
  active: boolean;
  mfaEnabled: boolean;
  roleIds: string[];
}

export interface AdminUserPage {
  content: AdminUser[];
  page: number;
  size: number;
  totalElements: number;
}

export type { AdminRole } from './AdminRole';

export interface CreateAdminUserCommand {
  username: string;
  email: string;
  password: string;
  roleIds?: string[];
}

export interface UpdateAdminUserCommand {
  email?: string;
  active?: boolean;
}
