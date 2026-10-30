import type { CreateUnitCommand, UnitOfMeasure } from '../../domain/entities/UnitOfMeasure';
import type { UnitRepository } from '../../domain/repositories/UnitRepository';
import { ApiClient } from '../http/ApiClient';

export class ApiUnitRepository implements UnitRepository {
  private readonly apiClient = new ApiClient();

  async getAll(): Promise<UnitOfMeasure[]> {
    const data = await this.apiClient.get<UnitApiDto[]>('/api/v1/units');
    return data.map(ApiUnitRepository.toDomain);
  }

  async create(unit: CreateUnitCommand): Promise<UnitOfMeasure> {
    await this.apiClient.post<void>('/api/v1/units', unit);
    const all = await this.getAll();
    return exactlyOneByCode(all, unit.code, 'unidad');
  }

  private static toDomain(dto: UnitApiDto): UnitOfMeasure { return { ...dto }; }
}

interface UnitApiDto {
  id: string;
  code: string;
  name: string;
  symbol: string;
  dimension: string;
  active: boolean;
}

function exactlyOneByCode(items: UnitOfMeasure[], code: string, entity: string): UnitOfMeasure {
  const matches = items.filter(item => item.code === code);
  if (matches.length !== 1) {
    throw new Error(`La ${entity} fue creada, pero la recarga devolvió ${matches.length} coincidencias para el código exacto enviado. Actualiza antes de volver a intentar.`);
  }
  return matches[0];
}
