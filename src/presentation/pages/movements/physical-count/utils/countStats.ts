import type { PhysicalCount, PhysicalCountLine } from '../../../../../domain/entities/PhysicalCount';

/** Porcentaje de ítems con difference === 0, redondeado a 1 decimal. */
export function calcIra(lines: PhysicalCountLine[]): number {
  const captured = lines.filter(line => line.countedQuantity !== null);
  if (captured.length === 0) return 0;
  const exact = captured.filter(line => line.difference === 0).length;
  return Math.round((exact / captured.length) * 1000) / 10;
}

export interface AggregatedCountStats {
  countedTotal: number;
  exactTotal: number;
  withDiff: number;
  ira: number;
}

/** Agrega los ítems de todos los conteos para las tarjetas KPI y la barra IRA global. */
export function aggregateCountStats(counts: PhysicalCount[]): AggregatedCountStats {
  const countedTotal = counts.reduce((sum, c) => sum + c.lines.filter(line => line.countedQuantity !== null).length, 0);
  const exactTotal = counts.reduce((sum, c) => sum + c.lines.filter(line => line.difference === 0).length, 0);
  const withDiff = counts.reduce((sum, c) => sum + c.lines.filter(line => line.difference !== null && line.difference !== 0).length, 0);
  const ira = countedTotal > 0 ? Math.round((exactTotal / countedTotal) * 1000) / 10 : 0;
  return { countedTotal, exactTotal, withDiff, ira };
}
