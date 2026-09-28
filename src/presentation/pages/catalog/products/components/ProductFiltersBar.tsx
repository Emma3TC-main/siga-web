import { SearchIcon } from '../../../../components/ui';
import type { Category } from '../../../../../domain/entities/Category';
import { TYPE_LABELS } from '../constants';

export interface ProductFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
  filterCat: string;
  onFilterCatChange: (value: string) => void;
  categories: Category[];
}

export function ProductFiltersBar({ search, onSearchChange, filterType, onFilterTypeChange, filterCat, onFilterCatChange, categories }: ProductFiltersBarProps) {
  return (
    <div className="flex gap-3 px-6 py-3 border-b border-gray-200 bg-white flex-wrap">
      <div className="relative flex-1 min-w-48">
        <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => onSearchChange(e.target.value)} placeholder="Buscar por nombre o SKU..." className="siga-input pl-8 h-8 text-xs" />
      </div>
      <select value={filterType} onChange={e => onFilterTypeChange(e.target.value)} className="siga-select w-36 h-8 text-xs">
        <option value="">Todos los tipos</option>
        {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <select value={filterCat} onChange={e => onFilterCatChange(e.target.value)} className="siga-select w-44 h-8 text-xs">
        <option value="">Todas las categorías</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
    </div>
  );
}
