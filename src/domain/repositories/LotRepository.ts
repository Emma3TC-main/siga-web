import type { Lot, LotAdmin, LotAdminPage, LotManualStatus, LotStatus } from '../entities/Lot';

export interface LotQuery {
  productId: string;
  locationId?: string;
  availableOnly?: boolean;
}

export interface LotAdminQuery {
  productId?: string;
  status?: LotStatus;
  expired?: boolean;
  locationId?: string;
  page: number;
  size: number;
}

export interface LotCreateCommand {
  productId: string;
  lotNumber: string | null;
  heatNumber: string | null;
  manufacturedAt: string | null;
  receivedAt: string | null;
  expiresAt: string | null;
}

export interface LotUpdateCommand {
  manufacturedAt: string | null;
  receivedAt: string | null;
  expiresAt: string | null;
  expectedVersion: number;
}

export interface LotRepository {
  getLots(query: LotQuery): Promise<Lot[]>;
  listAdminLots(query: LotAdminQuery): Promise<LotAdminPage>;
  getLot(id: string): Promise<LotAdmin>;
  createLot(command: LotCreateCommand): Promise<LotAdmin>;
  updateLot(id: string, command: LotUpdateCommand): Promise<LotAdmin>;
  changeLotStatus(id: string, targetStatus: LotManualStatus, expectedVersion: number): Promise<LotAdmin>;
}
