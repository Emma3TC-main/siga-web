import type { AssetManualStatus } from '../../domain/entities/Asset';
import type { LotManualStatus } from '../../domain/entities/Lot';
import type {
  AssetAdminQuery, AssetCreateCommand, AssetRepository, AssetUpdateCommand,
} from '../../domain/repositories/AssetRepository';
import type {
  LotAdminQuery, LotCreateCommand, LotRepository, LotUpdateCommand,
} from '../../domain/repositories/LotRepository';

export class LotAdminUseCases {
  constructor(private readonly repository: LotRepository) {}
  list(query: LotAdminQuery) { return this.repository.listAdminLots(query); }
  get(id: string) { return this.repository.getLot(id); }
  create(command: LotCreateCommand) { return this.repository.createLot(command); }
  update(id: string, command: LotUpdateCommand) { return this.repository.updateLot(id, command); }
  changeStatus(id: string, targetStatus: LotManualStatus, expectedVersion: number) {
    return this.repository.changeLotStatus(id, targetStatus, expectedVersion);
  }
}

export class AssetAdminUseCases {
  constructor(private readonly repository: AssetRepository) {}
  list(query: AssetAdminQuery) { return this.repository.listAdminAssets(query); }
  get(id: string) { return this.repository.getAsset(id); }
  register(command: AssetCreateCommand) { return this.repository.registerAsset(command); }
  update(id: string, command: AssetUpdateCommand) { return this.repository.updateAsset(id, command); }
  changeStatus(id: string, targetStatus: AssetManualStatus, expectedVersion: number) {
    return this.repository.changeAssetStatus(id, targetStatus, expectedVersion);
  }
}
