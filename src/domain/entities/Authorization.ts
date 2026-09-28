import type { MovementLine } from './Movement';

export interface Authorization {
  id: string;
  movementId: string;
  type: string;
  productId: string;
  quantity: number;
  fromLocationId?: string;
  toLocationId?: string;
  requesterId: string;
  registeredBy: string;
  costCenterId?: string;
  motive?: string;
  documentType?: string;
  evidenceIds?: string[];
  status: 'pendiente' | 'aprobado' | 'rechazado';
  sensitiveLevel: number;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  rejectionReason?: string;
  lines?: MovementLine[];
}
