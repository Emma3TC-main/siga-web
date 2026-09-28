export interface Location {
  id: string;
  name: string;
  code: string;
  type: 'almacen' | 'patio' | 'taller' | 'recepcion' | 'cuarentena' | 'despacho';
  parentId?: string;
  level: number;
  zone?: string;
  aisle?: string;
  rack?: string;
  shelf?: string;
  position?: string;
  capacity?: number;
  status: 'active' | 'inactive';
}
