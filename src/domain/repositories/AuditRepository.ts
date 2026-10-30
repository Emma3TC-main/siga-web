import type { AuditEvent, NewAuditEvent } from '../entities/AuditEvent';

export interface AuditPage {
  content: AuditEvent[];
  page: number;
  size: number;
  totalElements: number;
}

export interface AuditQueryFilters {
  actorId?: string;
  aggregateType?: string;
  aggregateId?: string;
  correlationId?: string;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}

export interface AuditRepository {
  getAll(): Promise<AuditEvent[]>;
  search(filters?: AuditQueryFilters): Promise<AuditPage>;
  /** La fuente de datos asigna id, fecha, hora e IP, como haría un backend. El evento nuevo queda primero. */
  add(event: NewAuditEvent): Promise<AuditEvent>;
}
