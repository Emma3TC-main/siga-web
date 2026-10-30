import type { AuditEvent, NewAuditEvent } from '../../domain/entities/AuditEvent';
import type { AuditPage, AuditQueryFilters, AuditRepository } from '../../domain/repositories/AuditRepository';
import { DEMO_AUDIT } from '../../data/demo/audit';

const DEMO_CLIENT_IP = '192.168.1.10';

export class DemoAuditRepository implements AuditRepository {
  private events: AuditEvent[] = [...DEMO_AUDIT];

  async getAll(): Promise<AuditEvent[]> {
    return [...this.events];
  }

  async search(filters?: AuditQueryFilters): Promise<AuditPage> {
    let filtered = [...this.events];
    if (filters?.aggregateType) {
      filtered = filtered.filter(e => e.module === filters.aggregateType || e.aggregateType === filters.aggregateType);
    }
    const page = filters?.page ?? 0;
    const size = filters?.size ?? 20;
    const start = page * size;
    const content = filtered.slice(start, start + size);
    return {
      content,
      page,
      size,
      totalElements: filtered.length,
    };
  }

  async add(event: NewAuditEvent): Promise<AuditEvent> {
    const now = new Date();
    const created: AuditEvent = {
      ...event,
      id: `AUD-${now.getTime()}`,
      date: now.toLocaleDateString('es-PE'),
      time: now.toLocaleTimeString('es-PE'),
      ip: DEMO_CLIENT_IP,
    };
    this.events = [created, ...this.events];
    return created;
  }
}
