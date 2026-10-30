import { Location } from '../../domain/entities/Location';
import { LocationRepository } from '../../domain/repositories/LocationRepository';
import { ApiClient } from '../http/ApiClient';

interface BackendLocationResponse {
  id: string;
  code: string;
  name: string;
  locationType: string;
  parentId: string | null;
  active: boolean;
  version: number;
}

export class ApiLocationRepository implements LocationRepository {
  private static readonly PATH = '/api/v1/locations';
  private apiClient = new ApiClient();

  async getAll(): Promise<Location[]> {
    const data = await this.apiClient.get<BackendLocationResponse[]>(ApiLocationRepository.PATH);
    return data.map((dto) => this.mapToDomain(dto));
  }

  private mapToDomain(dto: BackendLocationResponse): Location {
    const typeMap: Record<string, Location['type']> = {
      ALMACEN: 'almacen',
      PATIO: 'patio',
      ZONA: 'zona',
      PASILLO: 'pasillo',
      RACK: 'rack',
      NIVEL: 'nivel',
      POSICION: 'posicion',
      TALLER: 'taller',
      RECEPCION: 'recepcion',
      CUARENTENA: 'cuarentena',
      DESPACHO: 'despacho'
    };

    const type = typeMap[dto.locationType];
    if (!type) {
      throw new Error(`UNSUPPORTED_LOCATION_TYPE: Tipo de ubicación canónico no reconocido: '${dto.locationType}'.`);
    }

    return {
      id: dto.id,
      code: dto.code,
      name: dto.name,
      type,
      parentId: dto.parentId || undefined,
      status: dto.active ? 'active' : 'inactive',
    };
  }
}
