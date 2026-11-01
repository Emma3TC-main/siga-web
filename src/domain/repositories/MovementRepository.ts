import type { Movement } from '../entities/Movement';

export type MovementHistoryType = 'ENTRY' | 'EXIT' | 'TRANSFER' | 'ADJUST_POSITIVE' | 'ADJUST_NEGATIVE';
export type MovementHistoryStatus = 'DRAFT' | 'PENDING_AUTHORIZATION' | 'AUTHORIZED' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';

export interface MovementHistoryFilters {
  movementCode?: string;
  movementType?: MovementHistoryType;
  status?: MovementHistoryStatus;
  productId?: string;
  lotId?: string;
  assetId?: string;
  sourceLocationId?: string;
  destinationLocationId?: string;
  locationId?: string;
  registeredByUserId?: string;
  requestedByUserId?: string;
  from?: string;
  to?: string;
  sensitive?: boolean;
  referenceDocNumber?: string;
}

export interface MovementHistoryQuery extends MovementHistoryFilters {
  page?: number;
  size?: number;
}

export interface MovementHistoryPage {
  content: Movement[];
  page: number;
  size: number;
  totalElements: number;
}

export interface MovementRepository {
  getAll(): Promise<Movement[]>;
  search(query?: MovementHistoryQuery): Promise<MovementHistoryPage>;
  getById(id: string): Promise<Movement | null>;
  /** El movimiento nuevo queda primero (orden más reciente → más antiguo). */
  add(movement: Movement): Promise<Movement>;
  /** Reintenta el envío de un movimiento que ya fue creado. */
  submit(id: string): Promise<Movement>;
  update(movement: Movement): Promise<Movement>;
  readonly isAuthoritative?: boolean;
}
