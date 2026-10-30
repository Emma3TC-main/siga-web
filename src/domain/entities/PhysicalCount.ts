export type PhysicalCountStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface PhysicalCountLine {
  id: string;
  productId: string;
  lotId: string | null;
  assetId: string | null;
  systemQuantity: number;
  countedQuantity: number | null;
  difference: number | null;
  notes: string | null;
  countedByUserId: string | null;
  countedAt: string | null;
}

export interface PhysicalCount {
  id: string;
  locationId: string;
  status: PhysicalCountStatus;
  version: number;
  notes: string | null;
  createdByUserId: string;
  startedAt: string | null;
  completedAt: string | null;
  completedByUserId: string | null;
  cancelledAt: string | null;
  cancelledByUserId: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
  lines: PhysicalCountLine[];
}

export interface PhysicalCountPage {
  content: PhysicalCount[];
  page: number;
  size: number;
  totalElements: number;
}

export interface CreatePhysicalCountInput {
  locationId: string;
  notes?: string;
}

export interface CapturePhysicalCountLineInput {
  countId: string;
  lineId: string;
  expectedVersion: number;
  countedQuantity: number;
  notes?: string;
}

export interface AddUnexpectedPhysicalCountLineInput {
  countId: string;
  expectedVersion: number;
  productId: string;
  lotId?: string;
  assetId?: string;
  countedQuantity: number;
  notes?: string;
}

export interface ClosePhysicalCountInput {
  countId: string;
  expectedVersion: number;
}

export interface CancelPhysicalCountInput extends ClosePhysicalCountInput {
  reason: string;
}

export type AdjustmentCandidate = 'ADJUST_POSITIVE' | 'ADJUST_NEGATIVE' | null;

export function adjustmentCandidate(line: PhysicalCountLine): AdjustmentCandidate {
  if (line.difference === null || line.difference === 0) return null;
  return line.difference > 0 ? 'ADJUST_POSITIVE' : 'ADJUST_NEGATIVE';
}
