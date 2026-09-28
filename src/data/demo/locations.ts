import type { Location } from '../../domain/entities/Location';

export const DEMO_LOCATIONS: Location[] = [
  { id: 'loc1', name: 'Almacén Principal', code: 'ALM-01', type: 'almacen', level: 0, status: 'active', capacity: 10000 },
  { id: 'loc2', name: 'Zona A - Materiales', code: 'ALM-01-ZA', type: 'almacen', parentId: 'loc1', level: 1, zone: 'A', status: 'active', capacity: 3000 },
  { id: 'loc3', name: 'Pasillo A1', code: 'ALM-01-ZA-P1', type: 'almacen', parentId: 'loc2', level: 2, zone: 'A', aisle: 'A1', status: 'active' },
  { id: 'loc4', name: 'Rack A-01', code: 'ALM-01-ZA-P1-R01', type: 'almacen', parentId: 'loc3', level: 3, rack: 'A-01', status: 'active', capacity: 500 },
  { id: 'loc5', name: 'Rack A-02', code: 'ALM-01-ZA-P1-R02', type: 'almacen', parentId: 'loc3', level: 3, rack: 'A-02', status: 'active', capacity: 500 },
  { id: 'loc6', name: 'Rack A-03', code: 'ALM-01-ZA-P1-R03', type: 'almacen', parentId: 'loc3', level: 3, rack: 'A-03', status: 'active', capacity: 500 },
  { id: 'loc7', name: 'Zona B - Repuestos', code: 'ALM-01-ZB', type: 'almacen', parentId: 'loc1', level: 1, zone: 'B', status: 'active', capacity: 2000 },
  { id: 'loc8', name: 'Rack B-01', code: 'ALM-01-ZB-R01', type: 'almacen', parentId: 'loc7', level: 2, rack: 'B-01', status: 'active', capacity: 300 },
  { id: 'loc9', name: 'Rack B-02', code: 'ALM-01-ZB-R02', type: 'almacen', parentId: 'loc7', level: 2, rack: 'B-02', status: 'active', capacity: 300 },
  { id: 'loc10', name: 'Zona C - Insumos', code: 'ALM-01-ZC', type: 'almacen', parentId: 'loc1', level: 1, zone: 'C', status: 'active', capacity: 2000 },
  { id: 'loc11', name: 'Rack C-01', code: 'ALM-01-ZC-R01', type: 'almacen', parentId: 'loc10', level: 2, rack: 'C-01', status: 'active', capacity: 400 },
  { id: 'loc12', name: 'Almacén Secundario', code: 'ALM-02', type: 'almacen', level: 0, status: 'active', capacity: 5000 },
  { id: 'loc13', name: 'Patio de Maquinaria', code: 'PAT-01', type: 'patio', level: 0, status: 'active', capacity: 50 },
  { id: 'loc14', name: 'Zona Maquinaria Pesada', code: 'PAT-01-ZMP', type: 'patio', parentId: 'loc13', level: 1, zone: 'MP', status: 'active' },
  { id: 'loc15', name: 'Taller de Mantenimiento', code: 'TAL-01', type: 'taller', level: 0, status: 'active', capacity: 200 },
  { id: 'loc16', name: 'Zona de Recepción', code: 'REC-01', type: 'recepcion', level: 0, status: 'active', capacity: 500 },
  { id: 'loc17', name: 'Zona de Cuarentena', code: 'CUA-01', type: 'cuarentena', level: 0, status: 'active', capacity: 300 },
  { id: 'loc18', name: 'Zona de Despacho', code: 'DES-01', type: 'despacho', level: 0, status: 'active', capacity: 400 },
];
