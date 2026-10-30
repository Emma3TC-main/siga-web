import type { AdminRole } from '../../domain/entities/AdminRole';
import type {
  AdminUser,
  AdminUserPage,
  CreateAdminUserCommand,
  UpdateAdminUserCommand,
} from '../../domain/entities/AdminUser';
import type { UserAdminRepository } from '../../domain/repositories/UserAdminRepository';
import { ApiClient } from '../http/ApiClient';

interface UserResponse {
  id: string;
  username: string;
  email: string;
  active: boolean;
  mfaEnabled: boolean;
  roleIds?: string[];
}

interface UserPageResponse {
  content?: UserResponse[];
  page?: number;
  size?: number;
  totalElements?: number;
}

interface RoleResponse {
  id: string;
  code: string;
  name: string;
  active: boolean;
  permissionIds?: string[];
}

const mapUser = (response: UserResponse): AdminUser => ({
  id: response.id,
  username: response.username,
  email: response.email,
  active: response.active,
  mfaEnabled: response.mfaEnabled,
  roleIds: response.roleIds ?? [],
});

const mapRole = (response: RoleResponse): AdminRole => ({
  id: response.id,
  code: response.code,
  name: response.name,
  active: response.active,
  permissionIds: response.permissionIds ?? [],
});

export class ApiUserAdminRepository implements UserAdminRepository {
  private readonly client = new ApiClient();

  async listUsers(page: number, size: number): Promise<AdminUserPage> {
    const response = await this.client.get<UserPageResponse>(
      `/api/v1/users?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`,
    );
    return {
      content: (response.content ?? []).map(mapUser),
      page: response.page ?? page,
      size: response.size ?? size,
      totalElements: response.totalElements ?? 0,
    };
  }

  async getUser(id: string): Promise<AdminUser> {
    return mapUser(await this.client.get<UserResponse>(`/api/v1/users/${encodeURIComponent(id)}`));
  }

  async listRoles(): Promise<AdminRole[]> {
    const response = await this.client.get<RoleResponse[]>('/api/v1/roles');
    return response.map(mapRole);
  }

  async createUser(command: CreateAdminUserCommand): Promise<AdminUser> {
    const body = command.roleIds === undefined ? {
      username: command.username,
      email: command.email,
      password: command.password,
    } : command;
    return mapUser(await this.client.post<UserResponse>('/api/v1/users', body));
  }

  async updateUser(id: string, command: UpdateAdminUserCommand): Promise<AdminUser> {
    return mapUser(await this.client.patch<UserResponse>(`/api/v1/users/${encodeURIComponent(id)}`, command));
  }

  async replaceUserRoles(id: string, roleIds: string[]): Promise<AdminUser> {
    return mapUser(await this.client.put<UserResponse>(`/api/v1/users/${encodeURIComponent(id)}/roles`, { roleIds }));
  }
}
