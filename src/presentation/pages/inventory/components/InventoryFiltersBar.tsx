import type { Category } from '../../../../domain/entities/Category';
import { SearchIcon } from '../../../components/ui';

interface InventoryFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  filterCategory: string;
  onFilterCategoryChange: (value: string) => void;
  categories: Category[];
}

export function InventoryFiltersBar({
  search, onSearchChange, filterType, onFilterTypeChange,
  filterStatus, onFilterStatusChange, filterCategory, onFilterCategoryChange, categories,
}: InventoryFiltersBarProps) {
  return (
    <div className="flex gap-3 px-6 py-3 border-b border-gray-200 bg-white flex-wrap">
      <div className="relative flex-1 min-w-48">
        <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => onSearchChange(e.target.value)} placeholder="Buscar por nombre o SKU…" className="siga-input pl-8 h-8 text-xs" />
      </div>
      <select value={filterType} onChange={e => onFilterTypeChange(e.target.value)} className="siga-select w-36 h-8 text-xs">
        <option value="">Todos los tipos</option>
        <option value="material">Material</option>
        <option value="insumo">Insumo</option>
        <option value="repuesto">Repuesto</option>
      </select>
      <select value={filterStatus} onChange={e => onFilterStatusChange(e.target.value)} className="siga-select w-40 h-8 text-xs">
        <option value="">Todos los estados</option>
        <option value="normal">Normal</option>
        <option value="bajo_stock">Bajo stock</option>
        <option value="sin_stock">Sin stock</option>
        <option value="proximo_vencer">Próx. vencer</option>
        <option value="vencido">Vencido</option>
      </select>
      <select value={filterCategory} onChange={e => onFilterCategoryChange(e.target.value)} className="siga-select w-48 h-8 text-xs">
        <option value="">Todas las categorías</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
    </div>
  );
}
