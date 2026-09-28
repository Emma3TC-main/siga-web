import type { PhysicalCount } from '../../domain/entities/PhysicalCount';

export const DEMO_PHYSICAL_COUNTS: PhysicalCount[] = [
  {
    id: 'CONT-2025-001',
    name: 'Conteo Zona B - Repuestos',
    locationId: 'loc7',
    status: 'completado',
    createdBy: 'u2',
    createdAt: '2025-08-13 09:00',
    completedAt: '2025-08-13 17:00',
    ira: 92.3,
    items: [
      { productId: 'p36', theoreticalQty: 7, physicalQty: 7, difference: 0 },
      { productId: 'p37', theoreticalQty: 9, physicalQty: 9, difference: 0 },
      { productId: 'p39', theoreticalQty: 6, physicalQty: 6, difference: 0 },
      { productId: 'p40', theoreticalQty: 3, physicalQty: 3, difference: 0 },
      { productId: 'p41', theoreticalQty: 15, physicalQty: 15, difference: 0 },
      { productId: 'p42', theoreticalQty: 4, physicalQty: 4, difference: 0 },
      { productId: 'p46', theoreticalQty: 30, physicalQty: 35, difference: 5 },
      { productId: 'p47', theoreticalQty: 4, physicalQty: 4, difference: 0 },
      { productId: 'p55', theoreticalQty: 6, physicalQty: 5, difference: -1 },
    ],
  },
];
