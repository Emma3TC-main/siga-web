import type { Category } from '../../domain/entities/Category';

export const DEMO_CATEGORIES: Category[] = [
  { id: 'cat1', code: 'ACEROS', name: 'Aceros y Aleaciones Estructurales', categoryType: 'MATERIAL', active: true },
  { id: 'cat2', code: 'ANTIABRASIVOS', name: 'Materiales Antiabrasivos y de Desgaste', categoryType: 'MATERIAL', active: true },
  { id: 'cat3', code: 'SOLDADURA', name: 'Materiales de Soldadura y Corte', categoryType: 'MATERIAL', active: true },
  { id: 'cat4', code: 'FIJACION', name: 'Elementos de Fijación de Alta Resistencia', categoryType: 'MATERIAL', active: true },
  { id: 'cat5', code: 'POLIMEROS', name: 'Polímeros y Cauchos Industriales', categoryType: 'MATERIAL', active: true },
  { id: 'cat6', code: 'LUBRICANTES', name: 'Lubricantes e Hidráulicos', categoryType: 'INSUMO', active: true },
  { id: 'cat7', code: 'ABRASIVOS', name: 'Abrasivos y Consumibles', categoryType: 'INSUMO', active: true },
  { id: 'cat8', code: 'GASES', name: 'Gases Industriales', categoryType: 'INSUMO', active: true },
  { id: 'cat9', code: 'QUIMICOS', name: 'Químicos y Solventes', categoryType: 'INSUMO', active: true },
  { id: 'cat10', code: 'RODAMIENTOS', name: 'Rodamientos y Transmisión', categoryType: 'REPUESTO', active: true },
  { id: 'cat11', code: 'HIDRAULICA', name: 'Hidráulica y Neumática', categoryType: 'REPUESTO', active: true },
  { id: 'cat12', code: 'ELECTRICO', name: 'Eléctrico y Electrónico', categoryType: 'REPUESTO', active: true },
  { id: 'cat13', code: 'SELLADO', name: 'Sellado y Juntas', categoryType: 'REPUESTO', active: true },
  { id: 'cat14', code: 'TIERRAS', name: 'Movimiento de Tierras', categoryType: 'MAQUINARIA', active: true },
  { id: 'cat15', code: 'CARGA', name: 'Carga y Transporte', categoryType: 'MAQUINARIA', active: true },
  { id: 'cat16', code: 'PERFORACION', name: 'Perforación y Extracción', categoryType: 'MAQUINARIA', active: true },
];
