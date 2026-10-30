import { SearchIcon } from '../../../../components/ui';
import type { SupplierSort } from '../../../../../domain/entities/Supplier';

interface SupplierFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterStatus: 'all' | 'active' | 'inactive';
  onFilterStatusChange: (value: 'all' | 'active' | 'inactive') => void;
  sort: SupplierSort;
  onSortChange: (value: SupplierSort) => void;
}

export function SupplierFiltersBar({ search, onSearchChange, filterStatus, onFilterStatusChange, sort, onSortChange }: SupplierFiltersBarProps) {
  return (
    <div className="flex gap-3 px-6 py-3 border-b border-gray-200 bg-white flex-wrap">
      <div className="relative flex-1 min-w-48">
        <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Buscar por código, RUC, razón social o nombre comercial..."
          className="siga-input pl-8 h-8 text-xs"
        />
      </div>
      <select
        value={filterStatus}
        onChange={e => onFilterStatusChange(e.target.value as 'all' | 'active' | 'inactive')}
        className="siga-select w-36 h-8 text-xs"
      >
        <option value="all">Todos los estados</option>
        <option value="active">Activos</option>
        <option value="inactive">Inactivos</option>
      </select>
      <select
        aria-label="Orden de proveedores"
        value={sort}
        onChange={event => onSortChange(event.target.value as SupplierSort)}
        className="siga-select w-48 h-8 text-xs"
      >
        <option value="code,asc">Código A–Z</option>
        <option value="code,desc">Código Z–A</option>
        <option value="businessName,asc">Razón social A–Z</option>
        <option value="businessName,desc">Razón social Z–A</option>
      </select>
    </div>
  );
}
