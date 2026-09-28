import { Badge, EditIcon, EmptyState, EyeIcon, PackageIcon, TableActionButton, formatCurrency, formatNumber } from '../../../../components/ui';
import type { Product } from '../../../../../domain/entities/Product';
import type { Category } from '../../../../../domain/entities/Category';
import type { UnitOfMeasure } from '../../../../../domain/entities/UnitOfMeasure';
import { TYPE_LABELS } from '../constants';

export interface ProductsTableProps {
  products: Product[];
  categories: Category[];
  units: UnitOfMeasure[];
  canEdit: boolean;
  getStock: (productId: string) => number;
  onView: (productId: string) => void;
  onEdit: (productId: string) => void;
}

export function ProductsTable({ products, categories, units, canEdit, getStock, onView, onEdit }: ProductsTableProps) {
  return (
    <div className="flex-1 overflow-auto">
      {/* Table — desktop */}
      <div className="hidden md:block">
        <table className="siga-table">
          <thead><tr><th>SKU</th><th>Producto</th><th>Tipo</th><th>Categoría</th><th>Unidad</th><th className="text-right">Stock</th><th className="text-right">Costo prom.</th><th className="text-right">Valoriz.</th><th className="text-center">Acciones</th></tr></thead>
          <tbody>
            {products.map(p => {
              const qty = getStock(p.id);
              const cat = categories.find(c => c.id === p.categoryId);
              const unit = units.find(u => u.id === p.unitId);
              return (
                <tr key={p.id}>
                  <td className="font-mono text-xs text-[#3B7597]">{p.sku}</td>
                  <td>
                    <div className="font-medium text-sm max-w-[220px] truncate">{p.name}</div>
                    {p.sensitiveMovement && <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Mov. sensible</span>}
                  </td>
                  <td><Badge variant="primary">{TYPE_LABELS[p.type]}</Badge></td>
                  <td className="text-xs text-gray-600 max-w-[140px] truncate">{cat?.name ?? '—'}</td>
                  <td className="text-xs font-mono">{unit?.code ?? '—'}</td>
                  <td className="text-right font-semibold text-[#093C5D] tabular-nums">{formatNumber(qty)}</td>
                  <td className="text-right text-sm tabular-nums">{formatCurrency(p.avgCost)}</td>
                  <td className="text-right font-semibold text-[#3B7597] tabular-nums">{formatCurrency(qty * p.avgCost)}</td>
                  <td className="text-center">
                    <div className="flex gap-1 justify-center">
                      <TableActionButton icon={<EyeIcon size={14} />} label="Ver detalle" onClick={() => onView(p.id)} />
                      {canEdit && <TableActionButton icon={<EditIcon size={14} />} label="Editar" onClick={() => onEdit(p.id)} />}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list — mirrors the pattern already used in SuppliersTable */}
      <div className="md:hidden p-4 space-y-3">
        {products.map(p => {
          const qty = getStock(p.id);
          const cat = categories.find(c => c.id === p.categoryId);
          return (
            <button key={p.id} onClick={() => onView(p.id)} className="siga-card w-full p-4 text-left">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-mono text-xs text-[#3B7597]">{p.sku}</div>
                  <div className="font-semibold text-sm text-[#093C5D] mt-0.5 truncate">{p.name}</div>
                  <div className="text-xs text-gray-400 truncate">{cat?.name ?? '—'}</div>
                  {p.sensitiveMovement && <span className="inline-block mt-1 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Mov. sensible</span>}
                </div>
                <div className="text-right flex-shrink-0">
                  <Badge variant="primary">{TYPE_LABELS[p.type]}</Badge>
                  <div className="text-sm font-semibold text-[#093C5D] mt-2">{formatNumber(qty)}</div>
                  <div className="text-[10px] text-gray-400">{formatCurrency(qty * p.avgCost)}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {products.length === 0 && <EmptyState icon={<PackageIcon size={48} />} title="No hay productos" description="Ajuste los filtros o cree un nuevo producto" />}
    </div>
  );
}
