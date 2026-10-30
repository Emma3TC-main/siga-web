import type { Lot, LotAdmin, LotManualStatus } from '../../domain/entities/Lot';
import type {
  LotAdminQuery, LotCreateCommand, LotQuery, LotRepository, LotUpdateCommand,
} from '../../domain/repositories/LotRepository';

export class DemoLotRepository implements LotRepository {
  private lots: LotAdmin[] = [{
    id: 'lot-demo-1', productId: 'prod-001', lotNumber: 'LOTE-DEMO-1', heatNumber: 'HEAT-DEMO-1',
    manufacturedAt: '2026-01-10', receivedAt: '2026-01-12', expiresAt: '2027-01-10', status: 'ACTIVE',
    expired: false, totalQuantity: 100, locations: [{ locationId: 'loc-1', quantity: 100 }], version: 0,
    createdAt: '2026-01-12T12:00:00Z', updatedAt: '2026-01-12T12:00:00Z',
  }];

  async getLots(query: LotQuery): Promise<Lot[]> {
    return this.lots.filter(lot => lot.productId === query.productId && lot.status === 'ACTIVE').map(lot => ({
      source: 'demo', id: lot.id, productId: lot.productId, lotNumber: lot.lotNumber,
      heatNumber: lot.heatNumber ?? undefined, manufacturedAt: lot.manufacturedAt ?? undefined,
      receivedAt: lot.receivedAt ?? undefined, expiresAt: lot.expiresAt ?? undefined,
      status: lot.status, availableQuantity: lot.totalQuantity, locationId: query.locationId,
    }));
  }

  async listAdminLots(query: LotAdminQuery) {
    const filtered = this.lots.filter(lot => (!query.productId || lot.productId === query.productId)
      && (!query.status || lot.status === query.status)
      && (query.expired === undefined || lot.expired === query.expired)
      && (!query.locationId || lot.locations.some(location => location.locationId === query.locationId)));
    return { content: filtered.slice(query.page * query.size, (query.page + 1) * query.size), page: query.page,
      size: query.size, totalElements: filtered.length };
  }

  async getLot(id: string) { return this.require(id); }

  async createLot(command: LotCreateCommand) {
    const now = new Date().toISOString();
    const lot: LotAdmin = { ...command, id: crypto.randomUUID(), status: 'ACTIVE', expired: false,
      totalQuantity: 0, locations: [], version: 0, createdAt: now, updatedAt: now };
    this.lots = [lot, ...this.lots];
    return lot;
  }

  async updateLot(id: string, command: LotUpdateCommand) {
    const current = this.require(id);
    const updated = { ...current, manufacturedAt: command.manufacturedAt, receivedAt: command.receivedAt,
      expiresAt: command.expiresAt, version: current.version + 1, updatedAt: new Date().toISOString() };
    this.replace(updated);
    return updated;
  }

  async changeLotStatus(id: string, targetStatus: LotManualStatus) {
    const current = this.require(id);
    const updated = { ...current, status: targetStatus, version: current.version + 1,
      updatedAt: new Date().toISOString() };
    this.replace(updated);
    return updated;
  }

  private require(id: string) {
    const lot = this.lots.find(item => item.id === id);
    if (!lot) throw new Error('LOT_NOT_FOUND');
    return lot;
  }
  private replace(lot: LotAdmin) { this.lots = this.lots.map(item => item.id === lot.id ? lot : item); }
}
