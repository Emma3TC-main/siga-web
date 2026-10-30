import type { AdminRole } from '../entities/AdminRole';
import type {
  AdminUser,
  AdminUserPage,
  CreateAdminUserCommand,
  UpdateAdminUserCommand,
} from '../entities/AdminUser';

export interface UserAdminRepository {
  listUsers(page: number, size: number): Promise<AdminUserPage>;
  getUser(id: string): Promise<AdminUser>;
  listRoles(): Promise<AdminRole[]>;
  createUser(command: CreateAdminUserCommand): Promise<AdminUser>;
  updateUser(id: string, command: UpdateAdminUserCommand): Promise<AdminUser>;
  replaceUserRoles(id: string, roleIds: string[]): Promise<AdminUser>;
}
