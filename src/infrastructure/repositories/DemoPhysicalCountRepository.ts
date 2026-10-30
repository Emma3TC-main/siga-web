import type {
  AddUnexpectedPhysicalCountLineInput,
  CancelPhysicalCountInput,
  CapturePhysicalCountLineInput,
  ClosePhysicalCountInput,
  CreatePhysicalCountInput,
  PhysicalCount,
  PhysicalCountPage,
} from '../../domain/entities/PhysicalCount';
import type { PhysicalCountRepository } from '../../domain/repositories/PhysicalCountRepository';
import { DEMO_PHYSICAL_COUNTS } from '../../data/demo/physicalCounts';

export class DemoPhysicalCountRepository implements PhysicalCountRepository {
  private counts: PhysicalCount[] = structuredClone(DEMO_PHYSICAL_COUNTS);

  async listCounts(page: number, size: number): Promise<PhysicalCountPage> {
    const start = page * size;
    return { content: structuredClone(this.counts.slice(start, start + size)), page, size, totalElements: this.counts.length };
  }

  async getCount(id: string): Promise<PhysicalCount> {
    return structuredClone(this.requireCount(id));
  }

  async createCount(input: CreatePhysicalCountInput, _key: string): Promise<PhysicalCount> {
    const now = new Date().toISOString();
    const count: PhysicalCount = {
      id: crypto.randomUUID(), locationId: input.locationId, status: 'DRAFT', version: 0,
      notes: input.notes?.trim() || null, createdByUserId: 'demo-user', startedAt: null,
      completedAt: null, completedByUserId: null, cancelledAt: null, cancelledByUserId: null,
      cancellationReason: null, createdAt: now, updatedAt: now, lines: [],
    };
    this.counts = [count, ...this.counts];
    return structuredClone(count);
  }

  async captureLine(input: CapturePhysicalCountLineInput): Promise<PhysicalCount> {
    return this.update(input.countId, input.expectedVersion, count => ({
      ...count,
      status: 'IN_PROGRESS',
      startedAt: count.startedAt ?? new Date().toISOString(),
      lines: count.lines.map(line => line.id === input.lineId ? {
        ...line,
        countedQuantity: input.countedQuantity,
        difference: input.countedQuantity - line.systemQuantity,
        notes: input.notes?.trim() || null,
        countedByUserId: 'demo-user',
        countedAt: new Date().toISOString(),
      } : line),
    }));
  }

  async addUnexpectedLine(input: AddUnexpectedPhysicalCountLineInput, _key: string): Promise<PhysicalCount> {
    return this.update(input.countId, input.expectedVersion, count => ({
      ...count,
      status: 'IN_PROGRESS',
      startedAt: count.startedAt ?? new Date().toISOString(),
      lines: [...count.lines, {
        id: crypto.randomUUID(), productId: input.productId, lotId: input.lotId ?? null,
        assetId: input.assetId ?? null, systemQuantity: 0, countedQuantity: input.countedQuantity,
        difference: input.countedQuantity, notes: input.notes?.trim() || null,
        countedByUserId: 'demo-user', countedAt: new Date().toISOString(),
      }],
    }));
  }

  async closeCount(input: ClosePhysicalCountInput, _key: string): Promise<PhysicalCount> {
    return this.update(input.countId, input.expectedVersion, count => ({
      ...count, status: 'COMPLETED', completedAt: new Date().toISOString(), completedByUserId: 'demo-user',
    }));
  }

  async cancelCount(input: CancelPhysicalCountInput, _key: string): Promise<PhysicalCount> {
    return this.update(input.countId, input.expectedVersion, count => ({
      ...count, status: 'CANCELLED', cancellationReason: input.reason,
      cancelledAt: new Date().toISOString(), cancelledByUserId: 'demo-user',
    }));
  }

  private requireCount(id: string): PhysicalCount {
    const count = this.counts.find(candidate => candidate.id === id);
    if (!count) throw new Error('Conteo no encontrado');
    return count;
  }

  private update(id: string, expectedVersion: number, mutate: (count: PhysicalCount) => PhysicalCount): PhysicalCount {
    const current = this.requireCount(id);
    if (current.version !== expectedVersion) throw new Error('VERSION_CONFLICT');
    const updated = { ...mutate(current), version: current.version + 1, updatedAt: new Date().toISOString() };
    this.counts = this.counts.map(count => count.id === id ? updated : count);
    return structuredClone(updated);
  }
}
