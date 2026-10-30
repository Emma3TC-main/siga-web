export interface Asset {
  source: 'canonical' | 'demo';
  id: string;
  productId: string;
  assetCode: string;
  serialNumber: string;
  operationalStatus: string;
  brand?: string;
  model?: string;
  locationId?: string;
  lotId?: string;
  available: boolean;
}

export const ASSET_OPERATIONAL_STATUSES = [
  'OPERATIVO', 'EN_MANTENIMIENTO', 'EN_TRANSITO', 'INOPERATIVO', 'FUERA_SERVICIO',
] as const;
export type AssetOperationalStatus = typeof ASSET_OPERATIONAL_STATUSES[number];
export type AssetManualStatus = Exclude<AssetOperationalStatus, 'EN_TRANSITO'>;
export type AssetAvailability = 'UNASSIGNED' | 'IN_STOCK';
export type TechnicalSnapshot = Record<string, unknown>;

export interface AssetAdmin {
  id: string;
  productId: string;
  assetCode: string;
  serialNumber: string;
  brand: string | null;
  model: string | null;
  operationalStatus: AssetOperationalStatus;
  technicalSnapshot: TechnicalSnapshot;
  currentLocationId: string | null;
  currentLotId: string | null;
  available: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface AssetAdminPage {
  content: AssetAdmin[];
  page: number;
  size: number;
  totalElements: number;
}
