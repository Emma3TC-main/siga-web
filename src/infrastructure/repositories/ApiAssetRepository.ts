import type { Asset, AssetAdmin, AssetAdminPage, AssetManualStatus, AssetOperationalStatus } from '../../domain/entities/Asset';
import { ASSET_OPERATIONAL_STATUSES } from '../../domain/entities/Asset';
import type {
  AssetAdminQuery, AssetCreateCommand, AssetQuery, AssetRepository, AssetUpdateCommand,
} from '../../domain/repositories/AssetRepository';
import { ApiClient } from '../http/ApiClient';

interface OperationalAssetDto {
  id: string; productId: string; assetCode: string; serialNumber: string;
  operationalStatus: string; brand: string | null; model: string | null;
  locationId: string | null; lotId: string | null; available: boolean;
}
interface PageDto<T> { content: T[]; page: number; size: number; totalElements: number; }

export class ApiAssetRepository implements AssetRepository {
  private static readonly PATH = '/api/v1/assets';
  private readonly apiClient = new ApiClient();

  async getAssets(query: AssetQuery): Promise<Asset[]> {
    const params = new URLSearchParams({
      productId: query.productId, availability: query.availability, page: '0', size: '100',
    });
    if (query.locationId) params.set('locationId', query.locationId);
    if (query.lotId) params.set('lotId', query.lotId);
    const page = await this.apiClient.get<PageDto<OperationalAssetDto>>(`${ApiAssetRepository.PATH}?${params}`);
    return page.content.map(dto => ({
      source: 'canonical', id: dto.id, productId: dto.productId, assetCode: dto.assetCode,
      serialNumber: dto.serialNumber, operationalStatus: dto.operationalStatus,
      brand: dto.brand ?? undefined, model: dto.model ?? undefined,
      locationId: dto.locationId ?? undefined, lotId: dto.lotId ?? undefined, available: dto.available,
    }));
  }

  async listAdminAssets(query: AssetAdminQuery): Promise<AssetAdminPage> {
    const params = new URLSearchParams({ page: String(query.page), size: String(query.size) });
    if (query.productId) params.set('productId', query.productId);
    if (query.operationalStatus) params.set('operationalStatus', query.operationalStatus);
    if (query.availability) params.set('availability', query.availability);
    if (query.locationId) params.set('locationId', query.locationId);
    if (query.lotId) params.set('lotId', query.lotId);
    const page = await this.apiClient.get<PageDto<AssetAdmin>>(`/api/v1/admin/assets?${params}`);
    return { ...page, content: page.content.map(ApiAssetRepository.validateAdmin) };
  }

  async getAsset(id: string): Promise<AssetAdmin> {
    return ApiAssetRepository.validateAdmin(await this.apiClient.get<AssetAdmin>(this.path(id)));
  }

  async registerAsset(command: AssetCreateCommand): Promise<AssetAdmin> {
    return ApiAssetRepository.validateAdmin(await this.apiClient.post<AssetAdmin>(ApiAssetRepository.PATH, command));
  }

  async updateAsset(id: string, command: AssetUpdateCommand): Promise<AssetAdmin> {
    return ApiAssetRepository.validateAdmin(await this.apiClient.put<AssetAdmin>(this.path(id), command));
  }

  async changeAssetStatus(id: string, targetStatus: AssetManualStatus, expectedVersion: number) {
    return ApiAssetRepository.validateAdmin(await this.apiClient.post<AssetAdmin>(`${this.path(id)}/status`, {
      targetStatus, expectedVersion,
    }));
  }

  private path(id: string) { return `${ApiAssetRepository.PATH}/${encodeURIComponent(id)}`; }

  private static validateAdmin(dto: AssetAdmin): AssetAdmin {
    if (!ASSET_OPERATIONAL_STATUSES.includes(dto.operationalStatus as AssetOperationalStatus)) {
      throw new Error(`UNSUPPORTED_ASSET_STATUS: ${dto.operationalStatus}`);
    }
    return { ...dto, operationalStatus: dto.operationalStatus as AssetOperationalStatus };
  }
}
