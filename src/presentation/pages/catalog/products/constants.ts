import type { ProductType } from '../../../../domain/entities/Product';

export const TYPE_LABELS: Record<ProductType, string> = {
  material: 'Material', insumo: 'Insumo', repuesto: 'Repuesto', maquinaria: 'Maquinaria',
};

export interface ProductFormData {
  name: string;
  sku: string;
  type: ProductType;
  categoryId: string;
  unitId: string;
  description: string;
  minStock: number;
  reorderPoint: number;
  avgCost: number;
  sensitiveMovement: boolean;
  requiresBatch: boolean;
  requiresSerial: boolean;
  requiresExpiry: boolean;
  requiresColada: boolean;
}

export const EMPTY_PRODUCT_FORM: ProductFormData = {
  name: '', sku: '', type: 'material', categoryId: '', unitId: '', description: '',
  minStock: 0, reorderPoint: 0, avgCost: 0,
  sensitiveMovement: false, requiresBatch: false, requiresSerial: false, requiresExpiry: false, requiresColada: false,
};

export const PRODUCT_FLAGS: { key: keyof ProductFormData; label: string }[] = [
  { key: 'sensitiveMovement', label: 'Movimiento sensible (requiere autorización)' },
  { key: 'requiresBatch', label: 'Requiere número de lote' },
  { key: 'requiresSerial', label: 'Requiere número de serie' },
  { key: 'requiresExpiry', label: 'Requiere fecha de vencimiento' },
  { key: 'requiresColada', label: 'Requiere número de colada' },
];
