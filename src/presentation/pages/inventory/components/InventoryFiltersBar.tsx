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
  <div className="px-6 py-4 border-b border-gray-200 bg-white">

    <div className="flex flex-col lg:flex-row gap-3">

      <div className="relative flex-1 min-w-48">

        <SearchIcon
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre o SKU…"
          className="
            w-full h-9 pl-9 pr-3
            rounded-lg
            border border-gray-200
            bg-gray-50/60
            text-xs text-gray-700
            placeholder:text-gray-400
            outline-none
            focus:bg-white
            focus:border-[#3B7597]
            focus:ring-2 focus:ring-[#3B7597]/10
            transition-all
          "
        />

      </div>


      <div className="flex flex-wrap gap-3">

        <select
          value={filterType}
          onChange={e => onFilterTypeChange(e.target.value)}
          className="
            h-9 w-40
            px-3
            rounded-lg
            border border-gray-200
            bg-gray-50/60
            text-xs text-gray-600
            outline-none
            cursor-pointer
            focus:bg-white
            focus:border-[#3B7597]
            focus:ring-2 focus:ring-[#3B7597]/10
            transition-all
          "
        >
          <option value="">Todos los tipos</option>
          <option value="material">Material</option>
          <option value="insumo">Insumo</option>
          <option value="repuesto">Repuesto</option>
        </select>


        <select
          value={filterStatus}
          onChange={e => onFilterStatusChange(e.target.value)}
          className="
            h-9 w-44
            px-3
            rounded-lg
            border border-gray-200
            bg-gray-50/60
            text-xs text-gray-600
            outline-none
            cursor-pointer
            focus:bg-white
            focus:border-[#3B7597]
            focus:ring-2 focus:ring-[#3B7597]/10
            transition-all
          "
        >
          <option value="">Todos los estados</option>
          <option value="normal">Normal</option>
          <option value="bajo_stock">Bajo stock</option>
          <option value="sin_stock">Sin stock</option>
          <option value="proximo_vencer">Próx. vencer</option>
          <option value="vencido">Vencido</option>
        </select>


        <select
          value={filterCategory}
          onChange={e => onFilterCategoryChange(e.target.value)}
          className="
            h-9 w-52
            px-3
            rounded-lg
            border border-gray-200
            bg-gray-50/60
            text-xs text-gray-600
            outline-none
            cursor-pointer
            focus:bg-white
            focus:border-[#3B7597]
            focus:ring-2 focus:ring-[#3B7597]/10
            transition-all
          "
        >
          <option value="">Todas las categorías</option>

          {categories.map(c => (
            <option
              key={c.id}
              value={c.id}
            >
              {c.name}
            </option>
          ))}

        </select>

      </div>

    </div>

  </div>
);
}
