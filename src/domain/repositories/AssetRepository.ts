import type {
  Asset, AssetAdmin, AssetAdminPage, AssetAvailability, AssetManualStatus,
  AssetOperationalStatus, TechnicalSnapshot,
} from '../entities/Asset';

export interface AssetQuery {
  productId: string;
  availability: AssetAvailability;
  locationId?: string;
  lotId?: string;
}

export interface AssetAdminQuery {
  productId?: string;
  operationalStatus?: AssetOperationalStatus;
  availability?: AssetAvailability;
  locationId?: string;
  lotId?: string;
  page: number;
  size: number;
}

export interface AssetCreateCommand {
  productId: string;
  assetCode: string;
  serialNumber: string;
  brand: string | null;
  model: string | null;
  technicalSnapshot: TechnicalSnapshot;
}

export interface AssetUpdateCommand {
  brand: string | null;
  model: string | null;
  technicalSnapshot: TechnicalSnapshot;
  expectedVersion: number;
}

export interface AssetRepository {
  getAssets(query: AssetQuery): Promise<Asset[]>;
  listAdminAssets(query: AssetAdminQuery): Promise<AssetAdminPage>;
  getAsset(id: string): Promise<AssetAdmin>;
  registerAsset(command: AssetCreateCommand): Promise<AssetAdmin>;
  updateAsset(id: string, command: AssetUpdateCommand): Promise<AssetAdmin>;
  changeAssetStatus(id: string, targetStatus: AssetManualStatus, expectedVersion: number): Promise<AssetAdmin>;
}
