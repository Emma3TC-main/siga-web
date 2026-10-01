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
    <div className="flex-1">

  {/* Table — desktop */}
  <div className="hidden md:block max-h-[600px] overflow-auto">

    <table className="w-full min-w-[1250px] border-collapse">

      <thead className="bg-gray-50 border-y border-gray-200 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  SKU
                </th>

                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Producto
                </th>

                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Categoría
                </th>

                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Tipo
                </th>

                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Stock total
                </th>

                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Unidad
                </th>

                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Mínimo
                </th>

                <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Estado
                </th>

                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Lote/Venc.
                </th>

                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  C. promedio
                </th>

                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Valorización
                </th>

                <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Acciones
                </th>
              </tr>
            </thead>


            <tbody className="divide-y divide-gray-100 bg-white">

              {rows.map(row => (

                <tr
                  key={row.id}
                  onClick={() => onSelectProduct(row.id)}
                  className="cursor-pointer hover:bg-[#3B7597]/[0.04] transition-colors"
                >

                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-medium text-[#3B7597]">
                      {row.sku}
                    </span>
                  </td>


                  <td className="px-4 py-3">

                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-lg bg-[#093C5D]/5 flex items-center justify-center flex-shrink-0">
                        <PackageIcon
                          size={15}
                          className="text-[#3B7597]"
                        />
                      </div>

                      <div
                        className="font-semibold text-xs text-[#093C5D] max-w-[180px] truncate"
                      >
                        {row.name}
                      </div>

                    </div>

                  </td>


                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500 max-w-[120px] truncate block">
                      {row.cat?.name ?? '—'}
                    </span>
                  </td>


                  <td className="px-4 py-3">
                    <Badge variant="primary">
                      {TYPE_LABEL[row.type] ?? row.type}
                    </Badge>
                  </td>


                  <td className="px-4 py-3 text-right">

                    <span className="text-sm font-bold text-[#093C5D] tabular-nums">
                      {formatNumber(row.totalQty)}
                    </span>

                  </td>


                  <td className="px-4 py-3">

                    <span className="text-xs text-gray-500 font-mono">
                      {row.unit?.code ?? '—'}
                    </span>

                  </td>


                  <td className="px-4 py-3 text-right">

                    <span className="text-xs text-gray-500 tabular-nums">
                      {row.minStock}
                    </span>

                  </td>


                  <td className="px-4 py-3 text-center">

                    <InventoryStatusBadge
                      status={row.status}
                    />

                  </td>


                  <td className="px-4 py-3">

                    {row.nearestExpiry?.batch ? (

                      <span className="font-mono text-xs text-gray-500">
                        {row.nearestExpiry.batch.slice(-8)}
                      </span>

                    ) : (
                      <span className="text-xs text-gray-400">
                        —
                      </span>
                    )}

                    {row.nearestExpiry?.expiryDate && (

                      <div className="text-[10px] font-medium text-orange-500 mt-0.5">
                        {row.nearestExpiry.expiryDate}
                      </div>

                    )}

                  </td>


                  <td className="px-4 py-3 text-right">

                    <span className="text-xs font-mono text-gray-600 tabular-nums">
                      {formatCurrency(row.avgCost)}
                    </span>

                  </td>


                  <td className="px-4 py-3 text-right">

                    <span className="text-xs font-semibold text-[#093C5D] tabular-nums">
                      {formatCurrency(row.valuation)}
                    </span>

                  </td>


                  <td
                    className="px-4 py-3 text-center"
                    onClick={e => e.stopPropagation()}
                  >

                    <div className="flex gap-1 justify-center">

                      <TableActionButton
                        icon={<EyeIcon size={14} />}
                        label="Ver detalle"
                        onClick={() => onSelectProduct(row.id)}
                      />

                      <TableActionButton
                        icon={<ArrowDownIcon size={14} />}
                        label="Ir a entradas"
                        variant="success"
                        onClick={onGoEntries}
                      />

                      <TableActionButton
                        icon={<ArrowUpIcon size={14} />}
                        label="Ir a salidas"
                        variant="danger"
                        onClick={onGoExits}
                      />

                      <TableActionButton
                        icon={<ArrowsIcon size={14} />}
                        label="Ir a transferencias"
                        onClick={onGoTransfers}
                      />

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

      </div>


      {/* Mobile card list */}
      <div className="md:hidden p-4 space-y-3">

        {rows.map(row => (

          <div
            key={row.id}
            onClick={() => onSelectProduct(row.id)}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-left cursor-pointer hover:shadow-md hover:border-[#3B7597]/30 transition-all"
            role="button"
            tabIndex={0}
          >

            <div className="flex items-start justify-between gap-3">

              <div className="flex gap-3 min-w-0">

                <div className="w-10 h-10 rounded-xl bg-[#093C5D]/5 flex items-center justify-center flex-shrink-0">

                  <PackageIcon
                    size={16}
                    className="text-[#3B7597]"
                  />

                </div>


                <div className="min-w-0">

                  <div className="font-mono text-[10px] text-[#3B7597]">
                    {row.sku}
                  </div>

                  <div className="font-semibold text-sm text-[#093C5D] mt-0.5 truncate">
                    {row.name}
                  </div>

                  <div className="text-xs text-gray-400 truncate mt-0.5">
                    {row.cat?.name ?? '—'}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-2">

                    <Badge variant="primary">
                      {TYPE_LABEL[row.type] ?? row.type}
                    </Badge>

                    <InventoryStatusBadge
                      status={row.status}
                    />

                  </div>

                </div>

              </div>


              <div className="text-right flex-shrink-0">

                <div className="text-sm font-bold text-[#093C5D]">

                  {formatNumber(row.totalQty)}

                  <span className="text-[10px] text-gray-400 font-mono ml-1">
                    {row.unit?.code ?? ''}
                  </span>

                </div>

                <div className="text-[10px] text-gray-400 mt-0.5">
                  Mín. {row.minStock}
                </div>

                <div className="text-[10px] font-medium text-[#3B7597] mt-1">
                  {formatCurrency(row.valuation)}
                </div>

              </div>

            </div>


            <div
              className="flex gap-1 justify-end mt-3 pt-3 border-t border-gray-100"
              onClick={e => e.stopPropagation()}
            >

              <TableActionButton
                icon={<EyeIcon size={14} />}
                label="Ver detalle"
                onClick={() => onSelectProduct(row.id)}
              />

              <TableActionButton
                icon={<ArrowDownIcon size={14} />}
                label="Ir a entradas"
                variant="success"
                onClick={onGoEntries}
              />

              <TableActionButton
                icon={<ArrowUpIcon size={14} />}
                label="Ir a salidas"
                variant="danger"
                onClick={onGoExits}
              />

              <TableActionButton
                icon={<ArrowsIcon size={14} />}
                label="Ir a transferencias"
                onClick={onGoTransfers}
              />

            </div>

          </div>

        ))}

      </div>


      {rows.length === 0 && (

        <div className="py-8">

          <EmptyState
            icon={<PackageIcon size={48} />}
            title="No hay productos que coincidan"
            description="Ajuste los filtros de búsqueda para ver resultados"
          />

        </div>

      )}

    </div>


    {totalPages > 1 && (

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between px-6 py-3 border-t border-gray-200 bg-gray-50/60">

        <span className="text-xs text-gray-500">

          Mostrando {(page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, totalCount)} de {totalCount}

        </span>


        <div className="flex gap-1 flex-wrap">

          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            ← Anterior
          </Button>


          {Array
            .from(
              { length: Math.min(totalPages, 5) },
              (_, i) => i + 1
            )
            .map(p => (

              <Button
                key={p}
                variant={p === page ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onPageChange(p)}
              >
                {p}
              </Button>

            ))}


          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Siguiente →
          </Button>

        </div>

      </div>

    )}

  </>
);  
}
