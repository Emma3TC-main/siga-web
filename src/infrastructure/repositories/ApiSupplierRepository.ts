import type {
  Supplier,
  SupplierDraft,
  SupplierListQuery,
  SupplierPage,
  UpdateSupplierCommand,
} from '../../domain/entities/Supplier';
import { NotFoundError } from '../../domain/errors';
import type { SupplierRepository } from '../../domain/repositories/SupplierRepository';
import { ApiClient } from '../http/ApiClient';

interface SupplierResponseDto {
  id: string;
  code: string;
  taxId: string;
  businessName: string;
  tradeName: string | null;
  contactName: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  active: boolean;
  version: number;
}

interface SupplierPageDto {
  content: SupplierResponseDto[];
  page: number;
  size: number;
  totalElements: number;
}

interface SupplierWriteDto {
  code: string;
  taxId: string;
  businessName: string;
  tradeName: string | null;
  contactName: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
}

interface SupplierUpdateDto extends SupplierWriteDto {
  active: boolean;
  expectedVersion: number;
}

export class ApiSupplierRepository implements SupplierRepository {
  private readonly apiClient = new ApiClient();

  async list(query: SupplierListQuery): Promise<SupplierPage> {
    const params = new URLSearchParams({
      page: String(query.page),
      size: String(query.size),
      sort: query.sort,
    });
    if (query.q?.trim()) params.set('q', query.q.trim());
    if (query.active !== undefined) params.set('active', String(query.active));

    const data = await this.apiClient.get<SupplierPageDto>(`/api/v1/suppliers?${params.toString()}`);
    return {
      content: data.content.map(ApiSupplierRepository.toDomain),
      page: data.page,
      size: data.size,
      totalElements: data.totalElements,
    };
  }

  async getById(id: string): Promise<Supplier | null> {
    try {
      const data = await this.apiClient.get<SupplierResponseDto>(`/api/v1/suppliers/${encodeURIComponent(id)}`);
      return ApiSupplierRepository.toDomain(data);
    } catch (error: unknown) {
      if (error instanceof NotFoundError) return null;
      throw error;
    }
  }

  async create(command: SupplierDraft): Promise<Supplier> {
    const data = await this.apiClient.post<SupplierResponseDto>('/api/v1/suppliers', this.writeDto(command));
    return ApiSupplierRepository.toDomain(data);
  }

  async update(id: string, command: UpdateSupplierCommand): Promise<Supplier> {
    const body: SupplierUpdateDto = {
      ...this.writeDto(command),
      active: command.active,
      expectedVersion: command.expectedVersion,
    };
    const data = await this.apiClient.put<SupplierResponseDto>(
      `/api/v1/suppliers/${encodeURIComponent(id)}`,
      body,
    );
    return ApiSupplierRepository.toDomain(data);
  }

  private writeDto(command: SupplierDraft): SupplierWriteDto {
    const optional = (value: string): string | null => value.trim() || null;
    return {
      code: command.code.trim(),
      taxId: command.taxId.trim(),
      businessName: command.businessName.trim(),
      tradeName: optional(command.tradeName),
      contactName: optional(command.contactName),
      phone: optional(command.phone),
      email: optional(command.email),
      address: optional(command.address),
    };
  }

  private static toDomain(dto: SupplierResponseDto): Supplier {
    return {
      id: dto.id,
      code: dto.code,
      taxId: dto.taxId,
      businessName: dto.businessName,
      tradeName: dto.tradeName,
      contactName: dto.contactName,
      phone: dto.phone,
      email: dto.email,
      address: dto.address,
      active: dto.active,
      version: dto.version,
    };
  }
}
