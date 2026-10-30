import type { Asset, AssetAdmin, AssetManualStatus } from '../../domain/entities/Asset';
import type {
  AssetAdminQuery, AssetCreateCommand, AssetQuery, AssetRepository, AssetUpdateCommand,
} from '../../domain/repositories/AssetRepository';

export class DemoAssetRepository implements AssetRepository {
  private assets: AssetAdmin[] = [{
    id: 'asset-demo-1', productId: 'prod-004', assetCode: 'ASSET-DEMO-1', serialNumber: 'SN-DEMO-1',
    brand: 'SIGA Demo', model: 'MD-1', operationalStatus: 'OPERATIVO', technicalSnapshot: { potencia: '100 kW' },
    currentLocationId: null, currentLotId: null, available: false, version: 0,
    createdAt: '2026-01-12T12:00:00Z', updatedAt: '2026-01-12T12:00:00Z',
  }];

  async getAssets(query: AssetQuery): Promise<Asset[]> {
    return this.assets.filter(asset => asset.productId === query.productId && asset.operationalStatus === 'OPERATIVO')
      .filter(asset => query.availability === (asset.available ? 'IN_STOCK' : 'UNASSIGNED')).map(asset => ({
        source: 'demo', id: asset.id, productId: asset.productId, assetCode: asset.assetCode,
        serialNumber: asset.serialNumber, operationalStatus: asset.operationalStatus,
        brand: asset.brand ?? undefined, model: asset.model ?? undefined,
        locationId: asset.currentLocationId ?? undefined, lotId: asset.currentLotId ?? undefined,
        available: asset.available,
      }));
  }

  async listAdminAssets(query: AssetAdminQuery) {
    const filtered = this.assets.filter(asset => (!query.productId || asset.productId === query.productId)
      && (!query.operationalStatus || asset.operationalStatus === query.operationalStatus)
      && (!query.availability || query.availability === (asset.available ? 'IN_STOCK' : 'UNASSIGNED'))
      && (!query.locationId || asset.currentLocationId === query.locationId)
      && (!query.lotId || asset.currentLotId === query.lotId));
    return { content: filtered.slice(query.page * query.size, (query.page + 1) * query.size), page: query.page,
      size: query.size, totalElements: filtered.length };
  }

  async getAsset(id: string) { return this.require(id); }

  async registerAsset(command: AssetCreateCommand) {
    const now = new Date().toISOString();
    const asset: AssetAdmin = { ...command, id: crypto.randomUUID(), operationalStatus: 'OPERATIVO',
      currentLocationId: null, currentLotId: null, available: false, version: 0, createdAt: now, updatedAt: now };
    this.assets = [asset, ...this.assets];
    return asset;
  }

  async updateAsset(id: string, command: AssetUpdateCommand) {
    const current = this.require(id);
    const updated = { ...current, brand: command.brand, model: command.model,
      technicalSnapshot: command.technicalSnapshot, version: current.version + 1, updatedAt: new Date().toISOString() };
    this.replace(updated);
    return updated;
  }

  async changeAssetStatus(id: string, targetStatus: AssetManualStatus) {
    const current = this.require(id);
    const updated = { ...current, operationalStatus: targetStatus, version: current.version + 1,
      updatedAt: new Date().toISOString() };
    this.replace(updated);
    return updated;
  }

  private require(id: string) {
    const asset = this.assets.find(item => item.id === id);
    if (!asset) throw new Error('ASSET_NOT_FOUND');
    return asset;
  }
  private replace(asset: AssetAdmin) { this.assets = this.assets.map(item => item.id === asset.id ? asset : item); }
}
