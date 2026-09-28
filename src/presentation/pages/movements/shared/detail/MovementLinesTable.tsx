import { DetailSection, formatCurrency, formatNumber } from '../../../../components/ui';
import type { MovementLine } from '../../../../../domain/entities/Movement';
import type { Product } from '../../../../../domain/entities/Product';
import type { Location } from '../../../../../domain/entities/Location';
import type { UnitOfMeasure } from '../../../../../domain/entities/UnitOfMeasure';
import { lineValue } from './movementDetailData';

export interface MovementLinesTableProps {
  lines: MovementLine[];
  products: Product[];
  locations: Location[];
  units: UnitOfMeasure[];
}

/**
 * Tabla completa de líneas. Las columnas opcionales (costos, lote/serie, vencimiento,
 * origen, destino) solo aparecen si al menos una línea tiene ese dato, para no mostrar
 * columnas vacías en tipos de movimiento donde no aplican.
 */
export function MovementLinesTable({ lines, products, locations, units }: MovementLinesTableProps) {
  const has = {
    cost: lines.some(line => line.unitCost !== undefined || line.totalCost !== undefined),
    batch: lines.some(line => line.batch || line.serial),
    expiry: lines.some(line => line.expiryDate),
    from: lines.some(line => line.fromLocationId),
    to: lines.some(line => line.toLocationId),
  };
  const total = lines.reduce((sum, line) => sum + lineValue(line), 0);
  const locationName = (id?: string) => locations.find(location => location.id === id)?.name ?? '—';

  return (
    <div className="space-y-4">
      <DetailSection title={`Líneas del movimiento (${lines.length})`}>
        <div className="siga-card overflow-x-auto">
          <table className="siga-table min-w-[860px]">
            <thead>
              <tr>
                <th>#</th>
                <th>SKU</th>
                <th>Producto</th>
                <th>Unidad</th>
                <th className="text-right">Cantidad</th>
                {has.cost && <th className="text-right">Costo unit.</th>}
                {has.cost && <th className="text-right">Total</th>}
                {has.batch && <th>Lote / Serie</th>}
                {has.expiry && <th>Vencimiento</th>}
                {has.from && <th>Origen</th>}
                {has.to && <th>Destino</th>}
              </tr>
            </thead>
            <tbody>
              {lines.map((line, index) => {
                const product = products.find(item => item.id === line.productId);
                return (
                  <tr key={line.id}>
                    <td className="text-xs text-gray-400 tabular-nums">{index + 1}</td>
                    <td className="font-mono text-xs text-[#3B7597] whitespace-nowrap">{product?.sku ?? '—'}</td>
                    <td className="max-w-[300px]">
                      <div className="font-medium text-sm whitespace-normal break-words">{product?.name ?? '—'}</div>
                      {product?.description && <div className="text-xs text-gray-500 whitespace-normal break-words mt-0.5">{product.description}</div>}
                    </td>
                    <td className="font-mono text-xs text-gray-500">{units.find(unit => unit.id === line.unitId)?.code ?? '—'}</td>
                    <td className="text-right font-semibold text-[#093C5D] tabular-nums">{formatNumber(line.quantity)}</td>
                    {has.cost && <td className="text-right text-sm tabular-nums">{line.unitCost !== undefined ? formatCurrency(line.unitCost) : '—'}</td>}
                    {has.cost && <td className="text-right font-semibold tabular-nums">{formatCurrency(lineValue(line))}</td>}
                    {has.batch && (
                      <td className="text-xs font-mono">
                        {line.batch && <div>{line.batch}</div>}
                        {line.serial && <div className="text-gray-500">{line.serial}</div>}
                        {!line.batch && !line.serial && '—'}
                      </td>
                    )}
                    {has.expiry && <td className="text-xs font-mono">{line.expiryDate ?? '—'}</td>}
                    {has.from && <td className="text-xs max-w-[180px] whitespace-normal break-words">{locationName(line.fromLocationId)}</td>}
                    {has.to && <td className="text-xs max-w-[180px] whitespace-normal break-words">{locationName(line.toLocationId)}</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DetailSection>

      {has.cost && (
        <div className="flex justify-end">
          <dl className="w-full sm:w-72 text-sm">
            <div className="flex justify-between py-1 text-gray-500">
              <dt>Ítems</dt>
              <dd className="tabular-nums">{lines.length}</dd>
            </div>
            <div className="flex justify-between items-baseline pt-2 mt-1 border-t border-gray-200">
              <dt className="font-semibold text-[#093C5D]">Total del movimiento</dt>
              <dd className="text-base font-bold text-[#093C5D] tabular-nums">{formatCurrency(total)}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
