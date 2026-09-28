export type ProductType = 'material' | 'insumo' | 'repuesto' | 'maquinaria';
export type ProductStatus = 'normal' | 'bajo_stock' | 'sin_stock' | 'proximo_vencer' | 'vencido' | 'cuarentena';
export type MachineryStatus = 'operativo' | 'mantenimiento' | 'inoperativo' | 'transito' | 'fuera_servicio';
export type DispatchStrategy = 'FIFO' | 'FEFO' | 'manual';

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  categoryId: string;
  type: ProductType;
  status: 'active' | 'inactive';
  unitId: string;
  baseUnitId?: string;
  conversionFactor?: number;
  minStock: number;
  reorderPoint?: number;
  technicalInfo?: string;
  requiresBatch: boolean;
  requiresColada: boolean;
  requiresExpiry: boolean;
  requiresSerial: boolean;
  dispatchStrategy: DispatchStrategy;
  avgCost: number;
  sensitiveMovement: boolean;
  observations?: string;
  image?: string;
  // machinery specific
  vin?: string;
  assetCode?: string;
  brand?: string;
  model?: string;
  hourMeter?: number;
  machineryStatus?: MachineryStatus;
}

/** Datos que aporta quien crea un producto. `id` lo asigna la fuente de datos. */
export type NewProduct = Omit<Product, 'id'>;

/** Campos editables de un producto existente. */
export type ProductChanges = Partial<Omit<Product, 'id'>>;
