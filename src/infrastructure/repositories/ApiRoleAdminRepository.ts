import type {
  AdminPermission,
  AdminRole,
  CreateAdminRoleCommand,
} from '../../domain/entities/AdminRole';
import type { RoleAdminRepository } from '../../domain/repositories/RoleAdminRepository';
import { ApiClient } from '../http/ApiClient';

interface RoleResponse {
  id: string;
  code: string;
  name: string;
  active: boolean;
  permissionIds?: string[];
}

interface PermissionResponse {
  id: string;
  code: string;
  description: string;
}

const mapRole = (response: RoleResponse): AdminRole => ({
  id: response.id,
  code: response.code,
  name: response.name,
  active: response.active,
  permissionIds: response.permissionIds ?? [],
});

const mapPermission = (response: PermissionResponse): AdminPermission => ({
  id: response.id,
  code: response.code,
  description: response.description,
});

export class ApiRoleAdminRepository implements RoleAdminRepository {
  private readonly client = new ApiClient();

  async listRoles(): Promise<AdminRole[]> {
    const response = await this.client.get<RoleResponse[]>('/api/v1/roles');
    return response.map(mapRole);
  }

  async listPermissions(): Promise<AdminPermission[]> {
    const response = await this.client.get<PermissionResponse[]>('/api/v1/permissions');
    return response.map(mapPermission);
  }

  async createRole(command: CreateAdminRoleCommand): Promise<AdminRole> {
    return mapRole(await this.client.post<RoleResponse>('/api/v1/roles', command));
  }

  async replaceRolePermissions(roleId: string, permissionIds: string[]): Promise<AdminRole> {
    return mapRole(await this.client.put<RoleResponse>(
      `/api/v1/roles/${encodeURIComponent(roleId)}/permissions`,
      { permissionIds },
    ));
  }
}
