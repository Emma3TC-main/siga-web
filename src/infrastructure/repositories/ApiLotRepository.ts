import type { Lot, LotAdmin, LotAdminPage } from '../../domain/entities/Lot';
import { LOT_STATUSES, type LotStatus } from '../../domain/entities/Lot';
import type {
  LotAdminQuery, LotCreateCommand, LotQuery, LotRepository, LotUpdateCommand,
} from '../../domain/repositories/LotRepository';
import { ApiClient } from '../http/ApiClient';

interface OperationalLotDto {
  id: string;
  productId: string;
  lotNumber: string | null;
  heatNumber: string | null;
  manufacturedAt: string | null;
  receivedAt: string | null;
  expiresAt: string | null;
  status: string;
  locationId: string | null;
  availableQuantity: number;
}

interface PageDto<T> { content: T[]; page: number; size: number; totalElements: number; }

export class ApiLotRepository implements LotRepository {
  private static readonly PATH = '/api/v1/lots';
  private readonly apiClient = new ApiClient();

  async getLots(query: LotQuery): Promise<Lot[]> {
    const params = new URLSearchParams({ productId: query.productId, page: '0', size: '100' });
    if (query.locationId) params.set('locationId', query.locationId);
    if (query.availableOnly !== undefined) params.set('availableOnly', String(query.availableOnly));
    const page = await this.apiClient.get<PageDto<OperationalLotDto>>(`${ApiLotRepository.PATH}?${params}`);
    return page.content.map(dto => ({
      source: 'canonical', id: dto.id, productId: dto.productId, lotNumber: dto.lotNumber,
      heatNumber: dto.heatNumber ?? undefined, manufacturedAt: dto.manufacturedAt ?? undefined,
      receivedAt: dto.receivedAt ?? undefined, expiresAt: dto.expiresAt ?? undefined,
      status: dto.status, locationId: dto.locationId ?? undefined, availableQuantity: dto.availableQuantity,
    }));
  }

  async listAdminLots(query: LotAdminQuery): Promise<LotAdminPage> {
    const params = new URLSearchParams({ page: String(query.page), size: String(query.size) });
    if (query.productId) params.set('productId', query.productId);
    if (query.status) params.set('status', query.status);
    if (query.expired !== undefined) params.set('expired', String(query.expired));
    if (query.locationId) params.set('locationId', query.locationId);
    const page = await this.apiClient.get<PageDto<LotAdmin>>(`/api/v1/admin/lots?${params}`);
    return { ...page, content: page.content.map(ApiLotRepository.validateAdmin) };
  }

  async getLot(id: string): Promise<LotAdmin> {
    return ApiLotRepository.validateAdmin(await this.apiClient.get<LotAdmin>(this.path(id)));
  }

  async createLot(command: LotCreateCommand): Promise<LotAdmin> {
    return ApiLotRepository.validateAdmin(await this.apiClient.post<LotAdmin>(ApiLotRepository.PATH, command));
  }

  async updateLot(id: string, command: LotUpdateCommand): Promise<LotAdmin> {
    return ApiLotRepository.validateAdmin(await this.apiClient.put<LotAdmin>(this.path(id), command));
  }

  async changeLotStatus(id: string, targetStatus: 'ACTIVE' | 'QUARANTINED' | 'BLOCKED', expectedVersion: number) {
    return ApiLotRepository.validateAdmin(await this.apiClient.post<LotAdmin>(`${this.path(id)}/status`, {
      targetStatus, expectedVersion,
    }));
  }

  private path(id: string) { return `${ApiLotRepository.PATH}/${encodeURIComponent(id)}`; }

  private static validateAdmin(dto: LotAdmin): LotAdmin {
    if (!LOT_STATUSES.includes(dto.status as LotStatus)) throw new Error(`UNSUPPORTED_LOT_STATUS: ${dto.status}`);
    return { ...dto, status: dto.status as LotStatus };
  }
}
