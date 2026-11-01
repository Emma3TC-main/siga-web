import type { StockEntry } from '../../domain/entities/Stock';
import type { StockRepository } from '../../domain/repositories/StockRepository';
import { ApiClient } from '../http/ApiClient';
import { collectStockPages } from './stockPagination';

interface StockItemDto {
  id: string;
  productId: string;
  locationId: string;
  lotId: string | null;
  assetId: string | null;
  quantity: number;
  avgCostPen: number;
}

interface InventoryPageDto {
  content: StockItemDto[];
  page: number;
  size: number;
  totalElements: number;
}

const STOCK_PAGE_SIZE = 100;

export class ApiStockRepository implements StockRepository {
  constructor(private readonly apiClient = new ApiClient()) {}

  async getAll(): Promise<StockEntry[]> {
    const items = await collectStockPages(page => this.apiClient.get<InventoryPageDto>(
      `/api/v1/inventory?page=${page}&size=${STOCK_PAGE_SIZE}`,
    ));
    return items.map(item => this.mapToDomain(item));
  }

  async save(_stock: StockEntry[]): Promise<void> {
    throw new Error('POST /api/v1/inventory integration no permitida en este slice.');
  }

  private mapToDomain(dto: StockItemDto): StockEntry {
    return {
      id: dto.id,
      productId: dto.productId,
      locationId: dto.locationId,
      quantity: dto.quantity,
      batch: dto.lotId ?? undefined,
      serial: dto.assetId ?? undefined,
      avgCost: dto.avgCostPen,
    };
  }
}
