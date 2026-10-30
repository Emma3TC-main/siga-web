export interface Lot {
  source: 'canonical' | 'demo';
  id: string;
  productId: string;
  lotNumber: string | null;
  heatNumber?: string;
  manufacturedAt?: string;
  receivedAt?: string;
  expiresAt?: string;
  status: string;
  locationId?: string;
  availableQuantity: number;
}

export const LOT_STATUSES = ['ACTIVE', 'QUARANTINED', 'EXPIRED', 'DEPLETED', 'BLOCKED'] as const;
export type LotStatus = typeof LOT_STATUSES[number];
export type LotManualStatus = 'ACTIVE' | 'QUARANTINED' | 'BLOCKED';

export interface LotLocationQuantity {
  locationId: string;
  quantity: number;
}

export interface LotAdmin {
  id: string;
  productId: string;
  lotNumber: string | null;
  heatNumber: string | null;
  manufacturedAt: string | null;
  receivedAt: string | null;
  expiresAt: string | null;
  status: LotStatus;
  expired: boolean;
  totalQuantity: number;
  locations: LotLocationQuantity[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface LotAdminPage {
  content: LotAdmin[];
  page: number;
  size: number;
  totalElements: number;
}
