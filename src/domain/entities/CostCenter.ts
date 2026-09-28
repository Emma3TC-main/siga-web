export interface CostCenter {
  id: string;
  code: string;
  name: string;
  type: 'area' | 'taller' | 'cuadrilla' | 'proyecto';
  status: 'active' | 'inactive';
}
