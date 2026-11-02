import type { MovementLine, MovementStatus } from './Movement';

export interface Authorization {
  id: string;
  movementId: string;
  movementCode?: string;
  movementStatus?: MovementStatus;
  type: string;
  /** Solo está disponible después de cargar el detalle del movimiento. */
  productId?: string;
  /** Solo está disponible después de cargar el detalle del movimiento. */
  quantity?: number;
  fromLocationId?: string;
  toLocationId?: string;
  requesterId?: string;
  registeredBy: string;
  costCenterId?: string;
  motive?: string;
  documentType?: string;
  evidenceIds?: string[];
  status: 'pendiente' | 'aprobado' | 'rechazado';
  sensitiveLevel: number;
  createdAt: string;
  submittedAt?: string;
  confirmedAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  rejectionReason?: string;
  lines?: MovementLine[];
}
