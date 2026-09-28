import type { InventoryRow } from '../../../../domain/rules/inventoryRules';
import {
  Badge, Button, EmptyState, InventoryStatusBadge, TableActionButton, formatCurrency, formatNumber,
  EyeIcon, ArrowDownIcon, ArrowUpIcon, ArrowsIcon, PackageIcon,
} from '../../../components/ui';

const TYPE_LABEL: Record<string, string> = { material: 'Material', insumo: 'Insumo', repuesto: 'Repuesto' };

interface InventoryTableProps {
  rows: InventoryRow[];
  page: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  onSelectProduct: (id: string) => void;
  onGoEntries: () => void;
  onGoExits: () => void;
  onGoTransfers: () => void;
  onPageChange: (page: number) => void;
}

export function InventoryTable({
  rows, page, totalPages, pageSize, totalCount,
  onSelectProduct, onGoEntries, onGoExits, onGoTransfers, onPageChange,
}: InventoryTableProps) {
  return (
    <>
      <div className="flex-1 overflow-auto">
        {/* Table — desktop */}
        <div className="hidden md:block">
          <table className="siga-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Tipo</th>
                <th className="text-right">Stock total</th>
                <th>Unidad</th>
                <th className="text-right">Mínimo</th>
                <th className="text-center">Estado</th>
                <th>Lote/Venc.</th>
                <th className="text-right">C. promedio</th>
                <th className="text-right">Valorización</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} className="cursor-pointer" onClick={() => onSelectProduct(row.id)}>
                  <td><span className="font-mono text-xs text-[#3B7597]">{row.sku}</span></td>
                  <td><div className="font-medium text-gray-800 max-w-[180px] truncate">{row.name}</div></td>
                  <td><span className="text-xs text-gray-500 max-w-[120px] truncate block">{row.cat?.name ?? '—'}</span></td>
                  <td><Badge variant="primary">{TYPE_LABEL[row.type] ?? row.type}</Badge></td>
                  <td className="text-right font-semibold text-[#093C5D] tabular-nums">{formatNumber(row.totalQty)}</td>
                  <td><span className="text-xs text-gray-500 font-mono">{row.unit?.code ?? '—'}</span></td>
                  <td className="text-right text-xs text-gray-500 tabular-nums">{row.minStock}</td>
                  <td className="text-center"><InventoryStatusBadge status={row.status} /></td>
                  <td className="text-xs text-gray-500">
                    {row.nearestExpiry?.batch ? <span className="font-mono">{row.nearestExpiry.batch.slice(-8)}</span> : '—'}
                    {row.nearestExpiry?.expiryDate && <div className="text-[10px] text-orange-500">{row.nearestExpiry.expiryDate}</div>}
                  </td>
                  <td className="text-right text-xs font-mono tabular-nums">{formatCurrency(row.avgCost)}</td>
                  <td className="text-right text-xs font-semibold text-[#093C5D] tabular-nums">{formatCurrency(row.valuation)}</td>
                  <td className="text-center" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1 justify-center">
                      <TableActionButton icon={<EyeIcon size={14} />} label="Ver detalle" onClick={() => onSelectProduct(row.id)} />
                      <TableActionButton icon={<ArrowDownIcon size={14} />} label="Ir a entradas" variant="success" onClick={onGoEntries} />
                      <TableActionButton icon={<ArrowUpIcon size={14} />} label="Ir a salidas" variant="danger" onClick={onGoExits} />
                      <TableActionButton icon={<ArrowsIcon size={14} />} label="Ir a transferencias" onClick={onGoTransfers} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card list — mirrors the pattern already used in ProductsTable/SuppliersTable */}
        <div className="md:hidden p-4 space-y-3">
          {rows.map(row => (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
            <div key={row.id} onClick={() => onSelectProduct(row.id)} className="siga-card w-full p-4 text-left cursor-pointer" role="button" tabIndex={0}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-mono text-xs text-[#3B7597]">{row.sku}</div>
                  <div className="font-semibold text-sm text-[#093C5D] mt-0.5 truncate">{row.name}</div>
                  <div className="text-xs text-gray-400 truncate">{row.cat?.name ?? '—'}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="primary">{TYPE_LABEL[row.type] ?? row.type}</Badge>
                    <InventoryStatusBadge status={row.status} />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-semibold text-[#093C5D]">{formatNumber(row.totalQty)} <span className="text-[10px] text-gray-400 font-mono">{row.unit?.code ?? ''}</span></div>
                  <div className="text-[10px] text-gray-400">Mín. {row.minStock}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{formatCurrency(row.valuation)}</div>
                </div>
              </div>
              <div className="flex gap-1 justify-end mt-2 pt-2 border-t border-gray-100" onClick={e => e.stopPropagation()}>
                <TableActionButton icon={<EyeIcon size={14} />} label="Ver detalle" onClick={() => onSelectProduct(row.id)} />
                <TableActionButton icon={<ArrowDownIcon size={14} />} label="Ir a entradas" variant="success" onClick={onGoEntries} />
                <TableActionButton icon={<ArrowUpIcon size={14} />} label="Ir a salidas" variant="danger" onClick={onGoExits} />
                <TableActionButton icon={<ArrowsIcon size={14} />} label="Ir a transferencias" onClick={onGoTransfers} />
              </div>
            </div>
          ))}
        </div>

        {rows.length === 0 && (
          <EmptyState icon={<PackageIcon size={48} />} title="No hay productos que coincidan" description="Ajuste los filtros de búsqueda para ver resultados" />
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-white">
          <span className="text-xs text-gray-500">Mostrando {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)} de {totalCount}</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => onPageChange(page - 1)}>← Anterior</Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
              <Button key={p} variant={p === page ? 'primary' : 'outline'} size="sm" onClick={() => onPageChange(p)}>{p}</Button>
            ))}
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Siguiente →</Button>
          </div>
        </div>
      )}
    </>
  );
}
