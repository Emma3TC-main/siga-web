export interface PhysicalCount {
  id: string;
  name: string;
  locationId: string;
  status: 'borrador' | 'en_progreso' | 'completado';
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  items: PhysicalCountItem[];
  ira?: number;
}

export interface PhysicalCountItem {
  productId: string;
  theoreticalQty: number;
  physicalQty: number;
  difference: number;
  batch?: string;
  serial?: string;
}
