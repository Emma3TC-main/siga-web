import { Badge, EditIcon, EmptyState, EyeIcon, PackageIcon, TableActionButton } from '../../../../components/ui';
import type { Product } from '../../../../../domain/entities/Product';
import type { Category } from '../../../../../domain/entities/Category';
import type { UnitOfMeasure } from '../../../../../domain/entities/UnitOfMeasure';
import { TYPE_LABELS } from '../constants';

interface Props {
  products: Product[]; categories: Category[]; units: UnitOfMeasure[]; canEdit: boolean;
  onView: (id: string) => void; onEdit: (id: string) => void; onToggleStatus: (id: string) => void;
}

export function ProductsTable({ products, categories, units, canEdit, onView, onEdit, onToggleStatus }: Props) {
  if (products.length === 0) return <EmptyState icon={<PackageIcon size={48} />} title="No hay productos" description="No existen resultados para los filtros actuales." />;
  return (
    <div className="flex-1 overflow-auto">
      <table className="siga-table">
        <thead><tr><th>SKU</th><th>Producto</th><th>Tipo</th><th>Categoría</th><th>Unidad almacén</th><th>Stock mínimo</th><th>Estado</th><th>Versión</th><th className="text-center">Acciones</th></tr></thead>
        <tbody>{products.map(product => {
          const category = categories.find(item => item.id === product.categoryId);
          const unit = units.find(item => item.id === product.storageUnitId);
          return <tr key={product.id}>
            <td className="font-mono text-xs text-[#3B7597]">{product.sku}</td>
            <td className="font-medium">{product.name}</td>
            <td><Badge variant="primary">{TYPE_LABELS[product.productType]}</Badge></td>
            <td>{category?.name ?? product.categoryId}</td>
            <td>{unit?.code ?? product.storageUnitId}</td>
            <td className="tabular-nums">{product.minStock}</td>
            <td><Badge variant={product.active ? 'success' : 'muted'} dot>{product.active ? 'Activo' : 'Inactivo'}</Badge></td>
            <td className="font-mono text-xs">{product.version}</td>
            <td><div className="flex justify-center gap-1">
              <TableActionButton icon={<EyeIcon size={14} />} label="Ver detalle" onClick={() => onView(product.id)} />
              {canEdit && <TableActionButton icon={<EditIcon size={14} />} label="Editar" onClick={() => onEdit(product.id)} />}
              {canEdit && <button type="button" className="px-2 text-xs text-[#3B7597] hover:underline" onClick={() => onToggleStatus(product.id)}>{product.active ? 'Desactivar' : 'Activar'}</button>}
            </div></td>
          </tr>;
        })}</tbody>
      </table>
    </div>
  );
}
