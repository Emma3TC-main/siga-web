import { SearchIcon } from '../../../../components/ui';
import type { Category } from '../../../../../domain/entities/Category';
import type { ProductSort, ProductType } from '../../../../../domain/entities/Product';
import { TYPE_LABELS } from '../constants';

interface Props {
  search: string; onSearchChange: (value: string) => void;
  productType: '' | ProductType; onProductTypeChange: (value: '' | ProductType) => void;
  categoryId: string; onCategoryChange: (value: string) => void;
  active: 'all' | 'active' | 'inactive'; onActiveChange: (value: 'all' | 'active' | 'inactive') => void;
  sort: ProductSort; onSortChange: (value: ProductSort) => void;
  categories: Category[];
}

export function ProductFiltersBar(props: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 border-b border-gray-200 bg-white px-6 py-3 sm:grid-cols-2 xl:grid-cols-5">
      <div className="relative">
        <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={props.search} onChange={event => props.onSearchChange(event.target.value)} placeholder="Buscar por nombre o SKU…" className="siga-input h-8 pl-8 text-xs" />
      </div>
      <select value={props.productType} onChange={event => props.onProductTypeChange(event.target.value as '' | ProductType)} className="siga-select h-8 text-xs">
        <option value="">Todos los tipos</option>
        {Object.entries(TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
      <select value={props.categoryId} onChange={event => props.onCategoryChange(event.target.value)} className="siga-select h-8 text-xs">
        <option value="">Todas las categorías</option>
        {props.categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
      </select>
      <select value={props.active} onChange={event => props.onActiveChange(event.target.value as Props['active'])} className="siga-select h-8 text-xs">
        <option value="all">Todos los estados</option><option value="active">Activos</option><option value="inactive">Inactivos</option>
      </select>
      <select value={props.sort} onChange={event => props.onSortChange(event.target.value as ProductSort)} className="siga-select h-8 text-xs">
        <option value="sku,asc">SKU ascendente</option><option value="sku,desc">SKU descendente</option>
        <option value="name,asc">Nombre ascendente</option><option value="name,desc">Nombre descendente</option>
      </select>
    </div>
  );
}
