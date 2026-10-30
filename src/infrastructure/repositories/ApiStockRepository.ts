import type { StockEntry } from '../../domain/entities/Stock';
import type { StockRepository } from '../../domain/repositories/StockRepository';
import { ApiClient } from '../http/ApiClient';

export class ApiStockRepository implements StockRepository {
  private apiClient = new ApiClient();

  async getAll(): Promise<StockEntry[]> {
    // Backend implementa paginación, pero el port actual espera una lista.
    // Hacemos una solicitud con un tamaño grande temporalmente para adaptar
    // al contrato Web sin rediseñar el caso de uso por ahora.
    const data = await this.apiClient.get<any>('/api/v1/inventory?page=0&size=100');
    return data.content.map((item: any) => this.mapToDomain(item));
  }

  async save(_stock: StockEntry[]): Promise<void> {
    throw new Error('POST /api/v1/inventory integration no permitida en este slice.');
  }

  private mapToDomain(dto: any): StockEntry {
    return {
      productId: dto.productId,
      locationId: dto.locationId,
      quantity: dto.quantity,
      batch: dto.lotId || undefined,
      serial: dto.assetId || undefined,
      avgCost: dto.avgCostPen || 0,
    };
  }
}
