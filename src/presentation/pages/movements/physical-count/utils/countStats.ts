import type { PhysicalCount, PhysicalCountItem } from '../../../../../domain/entities/PhysicalCount';

/** Porcentaje de ítems con difference === 0, redondeado a 1 decimal. */
export function calcIra(items: PhysicalCountItem[]): number {
  if (items.length === 0) return 0;
  const exact = items.filter(i => i.difference === 0).length;
  return Math.round((exact / items.length) * 1000) / 10;
}

export interface AggregatedCountStats {
  countedTotal: number;
  exactTotal: number;
  withDiff: number;
  ira: number;
}

/** Agrega los ítems de todos los conteos para las tarjetas KPI y la barra IRA global. */
export function aggregateCountStats(counts: PhysicalCount[]): AggregatedCountStats {
  const countedTotal = counts.reduce((sum, c) => sum + c.items.length, 0);
  const exactTotal = counts.reduce((sum, c) => sum + c.items.filter(i => i.difference === 0).length, 0);
  const withDiff = counts.reduce((sum, c) => sum + c.items.filter(i => i.difference !== 0).length, 0);
  const ira = countedTotal > 0 ? Math.round((exactTotal / countedTotal) * 1000) / 10 : 0;
  return { countedTotal, exactTotal, withDiff, ira };
}
