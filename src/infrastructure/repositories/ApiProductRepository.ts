import type {
  CreateProductCommand,
  Product,
  ProductListQuery,
  ProductPage,
  ProductTechnicalAttributes,
  ProductType,
  ProductUnitConversion,
  UpdateProductCommand,
} from '../../domain/entities/Product';
import { NotFoundError } from '../../domain/errors';
import type { ProductRepository } from '../../domain/repositories/ProductRepository';
import { ApiClient } from '../http/ApiClient';

interface ProductConversionDto {
  fromUnitId: string;
  toUnitId: string;
  factor: number;
  active: boolean;
}

interface ProductResponseDto {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  productType: ProductType;
  storageUnitId: string;
  baseUnitId: string;
  minStock: number;
  requiresLot: boolean;
  requiresHeatNumber: boolean;
  requiresExpiry: boolean;
  requiresSerial: boolean;
  technicalAttributes: ProductTechnicalAttributes;
  conversions: ProductConversionDto[];
  active: boolean;
  version: number;
}

interface ProductPageDto {
  content: ProductResponseDto[];
  page: number;
  size: number;
  totalElements: number;
}

interface ProductWriteDto {
  sku: string;
  name: string;
  categoryId: string;
  productType: ProductType;
  storageUnitId: string;
  baseUnitId: string;
  minStock: number;
  requiresLot: boolean;
  requiresHeatNumber: boolean;
  requiresExpiry: boolean;
  requiresSerial: boolean;
  technicalAttributes: ProductTechnicalAttributes;
  conversions: ProductConversionDto[];
}

interface ProductUpdateDto extends ProductWriteDto {
  active: boolean;
  expectedVersion: number;
}

export class ApiProductRepository implements ProductRepository {
  private readonly apiClient = new ApiClient();

  async list(query: ProductListQuery): Promise<ProductPage> {
    const params = new URLSearchParams({ page: String(query.page), size: String(query.size), sort: query.sort });
    if (query.q?.trim()) params.set('q', query.q.trim());
    if (query.active !== undefined) params.set('active', String(query.active));
    if (query.categoryId) params.set('categoryId', query.categoryId);
    if (query.productType) params.set('productType', query.productType);
    const data = await this.apiClient.get<ProductPageDto>(`/api/v1/products?${params.toString()}`);
    return { content: data.content.map(ApiProductRepository.toDomain), page: data.page, size: data.size, totalElements: data.totalElements };
  }

  async getById(id: string): Promise<Product | null> {
    try {
      return ApiProductRepository.toDomain(
        await this.apiClient.get<ProductResponseDto>(`/api/v1/products/${encodeURIComponent(id)}`),
      );
    } catch (error: unknown) {
      if (error instanceof NotFoundError) return null;
      throw error;
    }
  }

  async create(command: CreateProductCommand): Promise<Product> {
    return ApiProductRepository.toDomain(
      await this.apiClient.post<ProductResponseDto>('/api/v1/products', this.writeDto(command)),
    );
  }

  async update(id: string, command: UpdateProductCommand): Promise<Product> {
    const body: ProductUpdateDto = {
      ...this.writeDto(command),
      active: command.active,
      expectedVersion: command.expectedVersion,
    };
    return ApiProductRepository.toDomain(
      await this.apiClient.put<ProductResponseDto>(`/api/v1/products/${encodeURIComponent(id)}`, body),
    );
  }

  private writeDto(command: CreateProductCommand): ProductWriteDto {
    return {
      sku: command.sku,
      name: command.name,
      categoryId: command.categoryId,
      productType: command.productType,
      storageUnitId: command.storageUnitId,
      baseUnitId: command.baseUnitId,
      minStock: command.minStock,
      requiresLot: command.requiresLot,
      requiresHeatNumber: command.requiresHeatNumber,
      requiresExpiry: command.requiresExpiry,
      requiresSerial: command.requiresSerial,
      technicalAttributes: structuredClone(command.technicalAttributes),
      conversions: command.conversions.map(ApiProductRepository.conversionDto),
    };
  }

  private static conversionDto(conversion: ProductUnitConversion): ProductConversionDto { return { ...conversion }; }

  private static toDomain(dto: ProductResponseDto): Product {
    return {
      ...dto,
      technicalAttributes: structuredClone(dto.technicalAttributes),
      conversions: dto.conversions.map(conversion => ({ ...conversion })),
    };
  }
}
