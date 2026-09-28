import type { MachineryStatus, Product } from '../entities/Product';

export const MACHINERY_STATUSES: readonly MachineryStatus[] = ['operativo', 'mantenimiento', 'inoperativo', 'transito', 'fuera_servicio'];

export function getMachinery(products: readonly Product[]): Product[] {
  return products.filter(product => product.type === 'maquinaria');
}

export function filterMachineryByStatus(machinery: readonly Product[], status: string): Product[] {
  return status ? machinery.filter(machine => machine.machineryStatus === status) : [...machinery];
}

export function countMachineryByStatus(machinery: readonly Product[]): Record<MachineryStatus, number> {
  const counts: Record<MachineryStatus, number> = { operativo: 0, mantenimiento: 0, inoperativo: 0, transito: 0, fuera_servicio: 0 };
  for (const status of MACHINERY_STATUSES) counts[status] = machinery.filter(machine => machine.machineryStatus === status).length;
  return counts;
}

/** Porcentaje de activos operativos (0 si no hay maquinaria). */
export function machineryAvailability(machinery: readonly Product[]): number {
  if (machinery.length === 0) return 0;
  const operative = machinery.filter(machine => machine.machineryStatus === 'operativo').length;
  return Math.round((operative / machinery.length) * 100);
}
