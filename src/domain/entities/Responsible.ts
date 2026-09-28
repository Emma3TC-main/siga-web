export interface Responsible {
  id: string;
  name: string;
  type: 'persona' | 'area' | 'taller' | 'cuadrilla';
  costCenterId?: string;
  status: 'active' | 'inactive';
}

export interface Evidence {
  id: string;
  name: string;
  type: 'pdf' | 'jpg' | 'jpeg' | 'png';
  size: number;
  url?: string;
  uploadedBy: string;
  uploadedAt: string;
  movementId?: string;
  productId?: string;
}
