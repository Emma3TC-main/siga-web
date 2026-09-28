import type { AuditEvent } from '../entities/AuditEvent';

export interface AuditFilters {
  search: string;
  module: string;
  result: string;
}

/** Módulos que aparecen en el registro, sin repetir y en orden de aparición. */
export function getAuditModules(events: readonly AuditEvent[]): string[] {
  return [...new Set(events.map(event => event.module))];
}

export function filterAuditEvents(events: readonly AuditEvent[], filters: AuditFilters): AuditEvent[] {
  const query = filters.search.toLowerCase();
  return events.filter(event => {
    if (query
      && !event.action.toLowerCase().includes(query)
      && !event.module.toLowerCase().includes(query)
      && !event.description.toLowerCase().includes(query)
      && !event.object.toLowerCase().includes(query)) return false;
    if (filters.module && event.module !== filters.module) return false;
    if (filters.result && event.result !== filters.result) return false;
    return true;
  });
}
