import type {
  AddUnexpectedPhysicalCountLineInput,
  CancelPhysicalCountInput,
  CapturePhysicalCountLineInput,
  ClosePhysicalCountInput,
  CreatePhysicalCountInput,
  PhysicalCount,
  PhysicalCountLine,
  PhysicalCountPage,
  PhysicalCountStatus,
} from '../../domain/entities/PhysicalCount';
import type { PhysicalCountRepository } from '../../domain/repositories/PhysicalCountRepository';
import { ApiClient } from '../http/ApiClient';

interface PhysicalCountLineDto {
  id: string;
  productId: string;
  lotId: string | null;
  assetId: string | null;
  systemQuantity: number;
  countedQuantity: number | null;
  differenceQuantity: number | null;
  notes: string | null;
  countedByUserId: string | null;
  countedAt: string | null;
}

interface PhysicalCountDto {
  id: string;
  locationId: string;
  status: PhysicalCountStatus;
  version: number;
  notes: string | null;
  createdByUserId: string;
  startedAt: string | null;
  completedAt: string | null;
  completedByUserId: string | null;
  cancelledAt: string | null;
  cancelledByUserId: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
  lines: PhysicalCountLineDto[];
}

interface PhysicalCountPageDto {
  content: PhysicalCountDto[];
  page: number;
  size: number;
  totalElements: number;
}

const idempotencyHeaders = (key: string): HeadersInit => ({ 'Idempotency-Key': key });

export class ApiPhysicalCountRepository implements PhysicalCountRepository {
  private static readonly PATH = '/api/v1/counts';
  private readonly client = new ApiClient();

  async listCounts(page: number, size: number): Promise<PhysicalCountPage> {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    const dto = await this.client.get<PhysicalCountPageDto>(`${ApiPhysicalCountRepository.PATH}?${params}`);
    return { ...dto, content: dto.content.map(mapCount) };
  }

  async createCount(input: CreatePhysicalCountInput, key: string): Promise<PhysicalCount> {
    return mapCount(await this.client.post<PhysicalCountDto>(ApiPhysicalCountRepository.PATH, {
      locationId: input.locationId,
      notes: input.notes?.trim() || null,
    }, { headers: idempotencyHeaders(key) }));
  }

  async getCount(id: string): Promise<PhysicalCount> {
    return mapCount(await this.client.get<PhysicalCountDto>(`${ApiPhysicalCountRepository.PATH}/${id}`));
  }

  async captureLine(input: CapturePhysicalCountLineInput): Promise<PhysicalCount> {
    return mapCount(await this.client.put<PhysicalCountDto>(
      `${ApiPhysicalCountRepository.PATH}/${input.countId}/lines/${input.lineId}`,
      { expectedVersion: input.expectedVersion, countedQuantity: input.countedQuantity, notes: input.notes?.trim() || null },
    ));
  }

  async addUnexpectedLine(input: AddUnexpectedPhysicalCountLineInput, key: string): Promise<PhysicalCount> {
    return mapCount(await this.client.post<PhysicalCountDto>(`${ApiPhysicalCountRepository.PATH}/${input.countId}/lines`, {
      expectedVersion: input.expectedVersion,
      productId: input.productId,
      lotId: input.lotId || null,
      assetId: input.assetId || null,
      countedQuantity: input.countedQuantity,
      notes: input.notes?.trim() || null,
    }, { headers: idempotencyHeaders(key) }));
  }

  async closeCount(input: ClosePhysicalCountInput, key: string): Promise<PhysicalCount> {
    return mapCount(await this.client.post<PhysicalCountDto>(`${ApiPhysicalCountRepository.PATH}/${input.countId}/close`, {
      expectedVersion: input.expectedVersion,
    }, { headers: idempotencyHeaders(key) }));
  }

  async cancelCount(input: CancelPhysicalCountInput, key: string): Promise<PhysicalCount> {
    return mapCount(await this.client.post<PhysicalCountDto>(`${ApiPhysicalCountRepository.PATH}/${input.countId}/cancel`, {
      expectedVersion: input.expectedVersion,
      reason: input.reason.trim(),
    }, { headers: idempotencyHeaders(key) }));
  }
}

function mapLine(dto: PhysicalCountLineDto): PhysicalCountLine {
  return {
    id: dto.id,
    productId: dto.productId,
    lotId: dto.lotId,
    assetId: dto.assetId,
    systemQuantity: dto.systemQuantity,
    countedQuantity: dto.countedQuantity,
    difference: dto.differenceQuantity,
    notes: dto.notes,
    countedByUserId: dto.countedByUserId,
    countedAt: dto.countedAt,
  };
}

function mapCount(dto: PhysicalCountDto): PhysicalCount {
  return {
    id: dto.id,
    locationId: dto.locationId,
    status: dto.status,
    version: dto.version,
    notes: dto.notes,
    createdByUserId: dto.createdByUserId,
    startedAt: dto.startedAt,
    completedAt: dto.completedAt,
    completedByUserId: dto.completedByUserId,
    cancelledAt: dto.cancelledAt,
    cancelledByUserId: dto.cancelledByUserId,
    cancellationReason: dto.cancellationReason,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    lines: dto.lines.map(mapLine),
  };
}
