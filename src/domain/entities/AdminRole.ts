export interface AdminRole {
  id: string;
  code: string;
  name: string;
  active: boolean;
  permissionIds: string[];
}

export interface AdminPermission {
  id: string;
  code: string;
  description: string;
}

export interface CreateAdminRoleCommand {
  code: string;
  name: string;
  permissionIds?: string[];
}
