export type ProductType = 'MATERIAL' | 'INSUMO' | 'REPUESTO' | 'MAQUINARIA';
export type ProductStatus = 'normal' | 'bajo_stock' | 'sin_stock' | 'proximo_vencer' | 'vencido' | 'cuarentena';
export type MachineryStatus = 'operativo' | 'mantenimiento' | 'inoperativo' | 'transito' | 'fuera_servicio';
export type DispatchStrategy = 'FIFO' | 'FEFO' | 'manual';

export interface ProductUnitConversion {
  fromUnitId: string;
  toUnitId: string;
  factor: number;
  active: boolean;
}

export type ProductTechnicalAttributes = Record<string, unknown>;

/** Modelo canónico de Catalog. Los campos requeridos reflejan ProductResponse. */
export interface Product {
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
  conversions: ProductUnitConversion[];
  active: boolean;
  version: number;

  /** Metadatos exclusivos del repositorio DEMO; el adapter REMOTE nunca los fabrica. */
  type?: 'material' | 'insumo' | 'repuesto' | 'maquinaria';
  status?: 'active' | 'inactive';
  unitId?: string;
  requiresBatch?: boolean;
  requiresColada?: boolean;
  technicalInfo?: string;
  description?: string;
  reorderPoint?: number;
  dispatchStrategy?: DispatchStrategy;
  avgCost?: number;
  sensitiveMovement?: boolean;
  observations?: string;
  image?: string;
  vin?: string;
  assetCode?: string;
  brand?: string;
  model?: string;
  hourMeter?: number;
  machineryStatus?: MachineryStatus;
}

export type CreateProductCommand = Pick<
  Product,
  | 'sku' | 'name' | 'categoryId' | 'productType' | 'storageUnitId' | 'baseUnitId' | 'minStock'
  | 'requiresLot' | 'requiresHeatNumber' | 'requiresExpiry' | 'requiresSerial'
  | 'technicalAttributes' | 'conversions'
>;

export interface UpdateProductCommand extends CreateProductCommand {
  active: boolean;
  expectedVersion: number;
}

export type ProductSort = 'sku,asc' | 'sku,desc' | 'name,asc' | 'name,desc';

export interface ProductListQuery {
  page: number;
  size: number;
  sort: ProductSort;
  q?: string;
  active?: boolean;
  categoryId?: string;
  productType?: ProductType;
}

export interface ProductPage {
  content: Product[];
  page: number;
  size: number;
  totalElements: number;
}
