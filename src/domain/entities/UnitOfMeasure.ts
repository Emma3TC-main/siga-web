export interface UnitOfMeasure {
  id: string;
  code: string;
  name: string;
  symbol: string;
  dimension: string;
  active: boolean;
}

export type CreateUnitCommand = Pick<UnitOfMeasure, 'code' | 'name' | 'symbol' | 'dimension'>;
