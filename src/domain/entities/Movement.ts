import type { SupplierSnapshot } from './Supplier';

export type MovementType = 'entrada' | 'salida' | 'transferencia' | 'ajuste_positivo' | 'ajuste_negativo' | 'conteo';
export type MovementStatus = 'borrador' | 'pendiente_autorizacion' | 'autorizado' | 'rechazado' | 'confirmado';

export interface MovementLine {
  id: string;
  productId: string;
  quantity: number;
  unitId: string;
  fromLocationId?: string;
  toLocationId?: string;
  batch?: string;
  serial?: string;
  expiryDate?: string;
  unitCost?: number;
  totalCost?: number;
}

export interface Movement {
  id: string;
  type: MovementType;
  status: MovementStatus;
  productId: string;
  quantity: number;
  unitId: string;
  fromLocationId?: string;
  toLocationId?: string;
  batch?: string;
  serial?: string;
  expiryDate?: string;
  unitCost?: number;
  totalCost?: number;
  avgCostAfter?: number;
  documentType?: string;
  documentSeries?: string;
  documentNumber?: string;
  motive?: string;
  observations?: string;
  requesterId?: string;
  costCenterId?: string;
  registeredBy: string;
  authorizedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  evidenceIds?: string[];
  createdAt: string;
  confirmedAt?: string;
  sensitiveLevel?: number;
  isSensitive?: boolean;
  /** Detalle multidetalle. Los campos simples se conservan como resumen compatible. */
  lines?: MovementLine[];
  version?: number;
  /** Identificador de correlación para trazabilidad y soporte. Formato: SIGA-{id} */
  correlationId?: string;
  /** Proveedor activo al momento del registro (solo entradas externas). */
  supplierId?: string;
  /** Snapshot del proveedor en el momento de confirmar la recepción (inmutable). */
  supplierSnapshot?: SupplierSnapshot;
  /** Indica que esta entrada proviene de una recepción externa. */
  isExternalReceipt?: boolean;
}
