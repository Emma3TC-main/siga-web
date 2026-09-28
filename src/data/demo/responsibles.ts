import type { Responsible } from '../../domain/entities/Responsible';

export const DEMO_RESPONSIBLES: Responsible[] = [
  { id: 'res1', name: 'Ing. Luis Carrillo', type: 'persona', costCenterId: 'cc2', status: 'active' },
  { id: 'res2', name: 'Taller Mecánico Norte', type: 'taller', costCenterId: 'cc2', status: 'active' },
  { id: 'res3', name: 'Cuadrilla Mina A', type: 'cuadrilla', costCenterId: 'cc4', status: 'active' },
  { id: 'res4', name: 'Área de Operaciones', type: 'area', costCenterId: 'cc1', status: 'active' },
  { id: 'res5', name: 'Ing. Pedro Huanca', type: 'persona', costCenterId: 'cc3', status: 'active' },
  { id: 'res6', name: 'Transporte Pesado', type: 'area', costCenterId: 'cc5', status: 'active' },
];
