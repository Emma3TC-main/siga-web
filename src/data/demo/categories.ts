import type { Category } from '../../domain/entities/Category';

export const DEMO_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Aceros y Aleaciones Estructurales', type: 'material', description: 'Materiales metálicos estructurales de alta resistencia' },
  { id: 'cat2', name: 'Materiales Antiabrasivos y de Desgaste', type: 'material', description: 'Materiales resistentes a la abrasión y desgaste' },
  { id: 'cat3', name: 'Materiales de Soldadura y Corte', type: 'material', description: 'Insumos para procesos de soldadura y corte industrial' },
  { id: 'cat4', name: 'Elementos de Fijación de Alta Resistencia', type: 'material', description: 'Pernos, tuercas y elementos de fijación industrial' },
  { id: 'cat5', name: 'Polímeros y Cauchos Industriales', type: 'material', description: 'Materiales poliméricos y elastoméricos industriales' },
  { id: 'cat6', name: 'Lubricantes e Hidráulicos', type: 'insumo', description: 'Aceites, grasas y fluidos industriales' },
  { id: 'cat7', name: 'Abrasivos y Consumibles', type: 'insumo', description: 'Discos, muelas y consumibles de taller' },
  { id: 'cat8', name: 'Gases Industriales', type: 'insumo', description: 'Gases comprimidos y criogénicos' },
  { id: 'cat9', name: 'Químicos y Solventes', type: 'insumo', description: 'Limpiadores, desengrasantes y productos químicos' },
  { id: 'cat10', name: 'Rodamientos y Transmisión', type: 'repuesto', description: 'Rodamientos, cojinetes y componentes de transmisión' },
  { id: 'cat11', name: 'Hidráulica y Neumática', type: 'repuesto', description: 'Bombas, cilindros, válvulas y accesorios hidráulicos' },
  { id: 'cat12', name: 'Eléctrico y Electrónico', type: 'repuesto', description: 'Componentes eléctricos y electrónicos industriales' },
  { id: 'cat13', name: 'Sellado y Juntas', type: 'repuesto', description: 'Sellos mecánicos, juntas y empaques' },
  { id: 'cat14', name: 'Movimiento de Tierras', type: 'maquinaria', description: 'Excavadoras, bulldozers y equipos de movimiento de tierras' },
  { id: 'cat15', name: 'Carga y Transporte', type: 'maquinaria', description: 'Cargadores frontales, camiones y equipos de transporte' },
  { id: 'cat16', name: 'Perforación y Extracción', type: 'maquinaria', description: 'Perforadoras, jumbos y equipos de extracción' },
];
