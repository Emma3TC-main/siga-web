import type { CostCenter } from '../../domain/entities/CostCenter';

export const DEMO_COST_CENTERS: CostCenter[] = [
  { id: 'cc1', code: 'CC-OPE', name: 'Operaciones Mina', type: 'area', status: 'active' },
  { id: 'cc2', code: 'CC-MAN', name: 'Mantenimiento Mecánico', type: 'taller', status: 'active' },
  { id: 'cc3', code: 'CC-ELE', name: 'Mantenimiento Eléctrico', type: 'taller', status: 'active' },
  { id: 'cc4', code: 'CC-MIN', name: 'Minería - Cuadrilla A', type: 'cuadrilla', status: 'active' },
  { id: 'cc5', code: 'CC-TRA', name: 'Transporte Interno', type: 'area', status: 'active' },
  { id: 'cc6', code: 'CC-ADM', name: 'Administración', type: 'area', status: 'active' },
  { id: 'cc7', code: 'CC-SEG', name: 'Seguridad Industrial', type: 'area', status: 'active' },
  { id: 'cc8', code: 'CC-PRO', name: 'Procesamiento', type: 'area', status: 'active' },
];
