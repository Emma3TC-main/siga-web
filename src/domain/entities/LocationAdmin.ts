export const LOCATION_TYPES = [
  'ALMACEN',
  'PATIO',
  'ZONA',
  'PASILLO',
  'RACK',
  'NIVEL',
  'POSICION',
  'TALLER',
  'RECEPCION',
  'CUARENTENA',
  'DESPACHO',
] as const;

export type LocationType = typeof LOCATION_TYPES[number];
export type LocationActiveFilter = 'all' | 'active' | 'inactive';

export interface LocationAdmin {
  id: string;
  code: string;
  name: string;
  locationType: LocationType;
  parentId: string | null;
  active: boolean;
  version: number;
}

export interface LocationCreateCommand {
  code: string;
  name: string;
  locationType: LocationType;
  parentId: string | null;
}

export interface LocationUpdateCommand {
  name: string;
  locationType: LocationType;
  parentId: string | null;
  expectedVersion: number;
}
