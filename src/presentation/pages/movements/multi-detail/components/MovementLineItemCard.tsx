import { useLocations } from '../../../../hooks/useLocations';
import { useProducts } from '../../../../hooks/useProducts';
import { useStock } from '../../../../hooks/useStock';
import { useUnits } from '../../../../hooks/useUnits';
import { Badge, Input, Select, TrashIcon, formatCurrency, formatNumber } from '../../../../components/ui';
import type { MovementType } from '../../../../../domain/entities/Movement';
import type { DraftLine } from '../hooks/useMultiDetailForm';

export interface MovementLineItemCardProps {
  line: DraftLine;
  index: number;
  error: string;
  canRemove: boolean;
  requiresStock: boolean;
  effectiveType: MovementType;
  currentAverageCost: (productId: string) => number;
  availableStock: (line: DraftLine) => number;
  onRemove: () => void;
  onUpdate: (patch: Partial<DraftLine>) => void;
}

export function MovementLineItemCard({
  line, index, error, canRemove, requiresStock, effectiveType, currentAverageCost, availableStock, onRemove, onUpdate,
}: MovementLineItemCardProps) {
  const { products } = useProducts();
  const { locations } = useLocations();
  const { units } = useUnits();
  const { stock: allStock } = useStock();
  const product = products.find(item => item.id === line.productId);

  return (
    <section className={`p-4 rounded-xl border ${error ? 'border-amber-200 bg-amber-50/20' : 'border-emerald-200 bg-emerald-50/20'}`}>
      <div className="flex justify-between items-center mb-3">
        <strong className="text-sm text-[#093C5D]">Ítem {index + 1}</strong>
        {canRemove && (
          <button aria-label={`Eliminar ítem ${index + 1}`} className="p-1.5 rounded text-red-500 hover:bg-red-50" onClick={onRemove}>
            <TrashIcon size={15} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-5">
          <Select label="Producto *" value={line.productId} onChange={event => {
            const selectedProduct = products.find(item => item.id === event.target.value);
            onUpdate({ productId: event.target.value, unitId: selectedProduct?.unitId ?? '', batch: '', serial: '', expiryDate: '', fromLocationId: '', toLocationId: '' });
          }}>
            <option value="">Seleccione…</option>
            {products.filter(item => item.type !== 'maquinaria' && item.status === 'active').map(item => (
              <option key={item.id} value={item.id}>{item.sku} — {item.name}</option>
            ))}
          </Select>
        </div>
        <div className="lg:col-span-2">
          <Input label="Cantidad *" type="number" min="0.01" step="0.01" value={line.quantity} onChange={event => onUpdate({ quantity: event.target.value })} />
        </div>
        <div className="lg:col-span-2">
          <Select label="Unidad *" value={line.unitId} onChange={event => onUpdate({ unitId: event.target.value })}>
            {units.map(unit => <option key={unit.id} value={unit.id}>{unit.code}</option>)}
          </Select>
        </div>
        <div className="lg:col-span-3">
          <div className="text-xs uppercase font-semibold text-gray-600 mb-1">Valor estimado</div>
          <div className="siga-input bg-gray-50">{formatCurrency(Number(line.quantity || 0) * currentAverageCost(line.productId))}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
        {requiresStock && (
          <Select label="Ubicación origen *" value={line.fromLocationId} onChange={event => onUpdate({ fromLocationId: event.target.value })}>
            <option value="">Seleccione…</option>
            {allStock.filter(stock => stock.productId === line.productId && stock.quantity > 0).map(stock => (
              <option key={`${stock.locationId}-${stock.batch ?? ''}-${stock.serial ?? ''}`} value={stock.locationId}>
                {locations.find(location => location.id === stock.locationId)?.name} · {formatNumber(stock.quantity)} disp.
              </option>
            ))}
          </Select>
        )}
        {(effectiveType === 'transferencia' || effectiveType === 'ajuste_positivo') && (
          <Select label="Ubicación destino *" value={line.toLocationId} onChange={event => onUpdate({ toLocationId: event.target.value })}>
            <option value="">Seleccione…</option>
            {locations.filter(location => location.status === 'active' && location.id !== line.fromLocationId).map(location => (
              <option key={location.id} value={location.id}>{location.code} — {location.name}</option>
            ))}
          </Select>
        )}
        {product?.requiresBatch && <Input label="Lote / colada *" value={line.batch} onChange={event => onUpdate({ batch: event.target.value })} />}
        {product?.requiresSerial && <Input label="Serie *" value={line.serial} onChange={event => onUpdate({ serial: event.target.value })} />}
        {product?.requiresExpiry && effectiveType === 'ajuste_positivo' && <Input label="Vencimiento *" type="date" value={line.expiryDate} onChange={event => onUpdate({ expiryDate: event.target.value })} />}
      </div>

      {line.productId && (
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <span>Stock origen: <strong>{formatNumber(availableStock(line))}</strong></span>
          {product?.sensitiveMovement && <Badge variant="warning">Producto sensible</Badge>}
          {error ? <span className="text-red-600 font-medium">{error}</span> : <span className="text-emerald-600 font-medium">✓ Línea válida</span>}
        </div>
      )}
    </section>
  );
}
