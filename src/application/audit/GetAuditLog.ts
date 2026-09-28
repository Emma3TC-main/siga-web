import type { AuditEvent } from '../../domain/entities/AuditEvent';
import type { AuditRepository } from '../../domain/repositories/AuditRepository';

export class GetAuditLog {
  constructor(private readonly repository: AuditRepository) {}

  execute(): Promise<AuditEvent[]> {
    return this.repository.getAll();
  }
}
