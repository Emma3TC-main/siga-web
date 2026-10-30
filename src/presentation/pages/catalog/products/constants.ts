import type { Product, ProductType, ProductUnitConversion } from '../../../../domain/entities/Product';

export const TYPE_LABELS: Record<ProductType, string> = {
  MATERIAL: 'Material', INSUMO: 'Insumo', REPUESTO: 'Repuesto', MAQUINARIA: 'Maquinaria',
};

export interface ProductFormData {
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
  technicalAttributesText: string;
  conversions: ProductUnitConversion[];
}

export const EMPTY_PRODUCT_FORM: ProductFormData = {
  sku: '', name: '', categoryId: '', productType: 'MATERIAL', storageUnitId: '', baseUnitId: '',
  minStock: 0, requiresLot: false, requiresHeatNumber: false, requiresExpiry: false,
  requiresSerial: false, technicalAttributesText: '{}', conversions: [],
};

export const PRODUCT_FLAGS: { key: 'requiresLot' | 'requiresHeatNumber' | 'requiresExpiry' | 'requiresSerial'; label: string }[] = [
  { key: 'requiresLot', label: 'Requiere lote' },
  { key: 'requiresHeatNumber', label: 'Requiere número de colada' },
  { key: 'requiresExpiry', label: 'Requiere vencimiento' },
  { key: 'requiresSerial', label: 'Requiere serie' },
];

export function formFromProduct(product: Product): ProductFormData {
  return {
    sku: product.sku, name: product.name, categoryId: product.categoryId, productType: product.productType,
    storageUnitId: product.storageUnitId, baseUnitId: product.baseUnitId, minStock: product.minStock,
    requiresLot: product.requiresLot, requiresHeatNumber: product.requiresHeatNumber,
    requiresExpiry: product.requiresExpiry, requiresSerial: product.requiresSerial,
    technicalAttributesText: JSON.stringify(product.technicalAttributes, null, 2),
    conversions: product.conversions.map(conversion => ({ ...conversion })),
  };
}
