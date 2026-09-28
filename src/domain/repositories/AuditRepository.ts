import type { AuditEvent, NewAuditEvent } from '../entities/AuditEvent';

export interface AuditRepository {
  getAll(): Promise<AuditEvent[]>;
  /** La fuente de datos asigna id, fecha, hora e IP, como haría un backend. El evento nuevo queda primero. */
  add(event: NewAuditEvent): Promise<AuditEvent>;
}
