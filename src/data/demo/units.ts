import type { UnitOfMeasure } from '../../domain/entities/UnitOfMeasure';

export const DEMO_UNITS: UnitOfMeasure[] = [
  { id: 'un1', code: 'kg', name: 'Kilogramo', symbol: 'kg', dimension: 'Masa', active: true },
  { id: 'un2', code: 't', name: 'Tonelada', symbol: 't', dimension: 'Masa', active: true },
  { id: 'un3', code: 'm', name: 'Metro', symbol: 'm', dimension: 'Longitud', active: true },
  { id: 'un4', code: 'mm', name: 'Milímetro', symbol: 'mm', dimension: 'Longitud', active: true },
  { id: 'un5', code: 'm2', name: 'Metro cuadrado', symbol: 'm²', dimension: 'Área', active: true },
  { id: 'un6', code: 'L', name: 'Litro', symbol: 'L', dimension: 'Volumen', active: true },
  { id: 'un7', code: 'gal', name: 'Galón', symbol: 'gal', dimension: 'Volumen', active: true },
  { id: 'un8', code: 'und', name: 'Unidad', symbol: 'und', dimension: 'Cantidad', active: true },
  { id: 'un9', code: 'kit', name: 'Juego/Kit', symbol: 'kit', dimension: 'Cantidad', active: true },
  { id: 'un10', code: 'par', name: 'Par', symbol: 'par', dimension: 'Cantidad', active: true },
  { id: 'un11', code: 'plancha', name: 'Plancha', symbol: 'pl', dimension: 'Presentación', active: true },
  { id: 'un12', code: 'barra', name: 'Barra', symbol: 'bar', dimension: 'Presentación', active: true },
  { id: 'un13', code: 'rollo', name: 'Rollo', symbol: 'rollo', dimension: 'Presentación', active: true },
  { id: 'un14', code: 'cilindro', name: 'Cilindro', symbol: 'cil', dimension: 'Presentación', active: true },
  { id: 'un15', code: 'tambor', name: 'Tambor', symbol: 'tambor', dimension: 'Presentación', active: true },
  { id: 'un16', code: 'tubo', name: 'Tubo', symbol: 'tubo', dimension: 'Presentación', active: true },
];
