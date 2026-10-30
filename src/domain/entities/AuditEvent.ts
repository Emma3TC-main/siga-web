export interface AuditEvent {
  id: string;
  date: string;
  time: string;
  userId: string;
  action: string;
  module: string;
  object: string;
  result: string;
  ip: string;
  description: string;
  details?: Record<string, unknown>;
  eventType?: string;
  actorId?: string | null;
  aggregateType?: string | null;
  aggregateId?: string | null;
  correlationId?: string | null;
  occurredAt?: string;
}

/** Datos que aporta quien registra el evento. `id`, fecha, hora e IP los asigna la fuente de datos. */
export type NewAuditEvent = Omit<AuditEvent, 'id' | 'date' | 'time' | 'ip'>;
