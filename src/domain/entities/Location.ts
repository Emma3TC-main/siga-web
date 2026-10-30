export interface Location {
  id: string;
  name: string;
  code: string;
  type: 'almacen' | 'patio' | 'zona' | 'pasillo' | 'rack' | 'nivel' | 'posicion' | 'taller' | 'recepcion' | 'cuarentena' | 'despacho';
  parentId?: string;
  status: 'active' | 'inactive';
}
