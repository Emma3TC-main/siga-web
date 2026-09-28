export interface AuditEvent {
  id: string;
  date: string;
  time: string;
  userId: string;
  action: string;
  module: string;
  object: string;
  result: 'success' | 'warning' | 'error';
  ip: string;
  description: string;
  details?: Record<string, unknown>;
}

/** Datos que aporta quien registra el evento. `id`, fecha, hora e IP los asigna la fuente de datos. */
export type NewAuditEvent = Omit<AuditEvent, 'id' | 'date' | 'time' | 'ip'>;
