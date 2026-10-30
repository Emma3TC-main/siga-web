import type { PhysicalCount } from '../../domain/entities/PhysicalCount';

export const DEMO_PHYSICAL_COUNTS: PhysicalCount[] = [
  {
    id: '00000000-0000-0000-0000-000000000901',
    locationId: 'loc7',
    status: 'COMPLETED', version: 3, notes: 'Conteo de demostración', createdByUserId: 'u2',
    startedAt: '2025-08-13T14:00:00Z', completedAt: '2025-08-13T22:00:00Z', completedByUserId: 'u2',
    cancelledAt: null, cancelledByUserId: null, cancellationReason: null,
    createdAt: '2025-08-13T14:00:00Z', updatedAt: '2025-08-13T22:00:00Z',
    lines: [
      { id: 'demo-line-1', productId: 'p36', lotId: null, assetId: null, systemQuantity: 7, countedQuantity: 7, difference: 0, notes: null, countedByUserId: 'u2', countedAt: '2025-08-13T21:00:00Z' },
      { id: 'demo-line-2', productId: 'p46', lotId: null, assetId: null, systemQuantity: 30, countedQuantity: 35, difference: 5, notes: null, countedByUserId: 'u2', countedAt: '2025-08-13T21:10:00Z' },
      { id: 'demo-line-3', productId: 'p55', lotId: null, assetId: null, systemQuantity: 6, countedQuantity: 5, difference: -1, notes: null, countedByUserId: 'u2', countedAt: '2025-08-13T21:20:00Z' },
    ],
  },
];
