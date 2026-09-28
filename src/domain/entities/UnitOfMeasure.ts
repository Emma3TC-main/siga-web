export interface UnitOfMeasure {
  id: string;
  code: string;
  name: string;
  group: string;
  isBase: boolean;
  baseUnitId?: string;
  conversionFactor?: number;
}

/** `id` lo asigna la fuente de datos. */
export type NewUnitOfMeasure = Omit<UnitOfMeasure, 'id'>;
