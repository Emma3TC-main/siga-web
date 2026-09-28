import type { UnitOfMeasure } from '../../domain/entities/UnitOfMeasure';

export const DEMO_UNITS: UnitOfMeasure[] = [
  { id: 'un1', code: 'kg', name: 'Kilogramo', group: 'Masa', isBase: true },
  { id: 'un2', code: 't', name: 'Tonelada', group: 'Masa', isBase: false, baseUnitId: 'un1', conversionFactor: 1000 },
  { id: 'un3', code: 'm', name: 'Metro', group: 'Longitud', isBase: true },
  { id: 'un4', code: 'mm', name: 'Milímetro', group: 'Longitud', isBase: false, baseUnitId: 'un3', conversionFactor: 0.001 },
  { id: 'un5', code: 'm²', name: 'Metro cuadrado', group: 'Área', isBase: true },
  { id: 'un6', code: 'L', name: 'Litro', group: 'Volumen', isBase: true },
  { id: 'un7', code: 'gal', name: 'Galón', group: 'Volumen', isBase: false, baseUnitId: 'un6', conversionFactor: 3.785 },
  { id: 'un8', code: 'und', name: 'Unidad', group: 'Logística', isBase: true },
  { id: 'un9', code: 'kit', name: 'Juego/Kit', group: 'Logística', isBase: true },
  { id: 'un10', code: 'par', name: 'Par', group: 'Logística', isBase: true },
  { id: 'un11', code: 'plancha', name: 'Plancha', group: 'Comercial', isBase: true },
  { id: 'un12', code: 'barra', name: 'Barra', group: 'Comercial', isBase: true },
  { id: 'un13', code: 'rollo', name: 'Rollo', group: 'Comercial', isBase: false, baseUnitId: 'un3', conversionFactor: 500 },
  { id: 'un14', code: 'cilindro', name: 'Cilindro', group: 'Comercial', isBase: true },
  { id: 'un15', code: 'tambor', name: 'Tambor', group: 'Comercial', isBase: false, baseUnitId: 'un6', conversionFactor: 200 },
  { id: 'un16', code: 'tubo', name: 'Tubo', group: 'Comercial', isBase: true },
];
