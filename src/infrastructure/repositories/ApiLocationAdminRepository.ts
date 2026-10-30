import {
  LOCATION_TYPES,
  type LocationActiveFilter,
  type LocationAdmin,
  type LocationCreateCommand,
  type LocationType,
  type LocationUpdateCommand,
} from '../../domain/entities/LocationAdmin';
import type { LocationAdminRepository } from '../../domain/repositories/LocationAdminRepository';
import { ApiClient } from '../http/ApiClient';

interface LocationResponseDto {
  id: string;
  code: string;
  name: string;
  locationType: string;
  parentId: string | null;
  active: boolean;
  version: number;
}

interface LocationCreateRequestDto {
  code: string;
  name: string;
  locationType: LocationType;
  parentId: string | null;
}

interface LocationUpdateRequestDto {
  name: string;
  locationType: LocationType;
  parentId: string | null;
  expectedVersion: number;
}

interface LocationVersionRequestDto {
  expectedVersion: number;
}

const ACTIVE_QUERY: Record<LocationActiveFilter, string> = {
  all: 'all',
  active: 'true',
  inactive: 'false',
};

export class ApiLocationAdminRepository implements LocationAdminRepository {
  private static readonly PATH = '/api/v1/locations';
  private readonly apiClient = new ApiClient();

  async listLocations(activeFilter: LocationActiveFilter): Promise<LocationAdmin[]> {
    const data = await this.apiClient.get<LocationResponseDto[]>(
      `${ApiLocationAdminRepository.PATH}?active=${ACTIVE_QUERY[activeFilter]}`,
    );
    return data.map(ApiLocationAdminRepository.toDomain);
  }

  async getLocation(id: string): Promise<LocationAdmin> {
    const data = await this.apiClient.get<LocationResponseDto>(this.locationPath(id));
    return ApiLocationAdminRepository.toDomain(data);
  }

  async createLocation(command: LocationCreateCommand): Promise<LocationAdmin> {
    const body: LocationCreateRequestDto = {
      code: command.code.trim(),
      name: command.name.trim(),
      locationType: command.locationType,
      parentId: command.parentId,
    };
    const data = await this.apiClient.post<LocationResponseDto>(ApiLocationAdminRepository.PATH, body);
    return ApiLocationAdminRepository.toDomain(data);
  }

  async updateLocation(id: string, command: LocationUpdateCommand): Promise<LocationAdmin> {
    const body: LocationUpdateRequestDto = {
      name: command.name.trim(),
      locationType: command.locationType,
      parentId: command.parentId,
      expectedVersion: command.expectedVersion,
    };
    const data = await this.apiClient.put<LocationResponseDto>(this.locationPath(id), body);
    return ApiLocationAdminRepository.toDomain(data);
  }

  async deactivateLocation(id: string, expectedVersion: number): Promise<LocationAdmin> {
    return this.lifecycle(id, 'deactivate', { expectedVersion });
  }

  async reactivateLocation(id: string, expectedVersion: number): Promise<LocationAdmin> {
    return this.lifecycle(id, 'reactivate', { expectedVersion });
  }

  private async lifecycle(
    id: string,
    action: 'deactivate' | 'reactivate',
    body: LocationVersionRequestDto,
  ): Promise<LocationAdmin> {
    const data = await this.apiClient.post<LocationResponseDto>(`${this.locationPath(id)}/${action}`, body);
    return ApiLocationAdminRepository.toDomain(data);
  }

  private locationPath(id: string): string {
    return `${ApiLocationAdminRepository.PATH}/${encodeURIComponent(id)}`;
  }

  private static toDomain(dto: LocationResponseDto): LocationAdmin {
    if (!LOCATION_TYPES.includes(dto.locationType as LocationType)) {
      throw new Error(`UNSUPPORTED_LOCATION_TYPE: ${dto.locationType}`);
    }
    return {
      id: dto.id,
      code: dto.code,
      name: dto.name,
      locationType: dto.locationType as LocationType,
      parentId: dto.parentId,
      active: dto.active,
      version: dto.version,
    };
  }
}
