import { useLocations } from '../../../../hooks/useLocations';
import { useProducts } from '../../../../hooks/useProducts';
import { useStock } from '../../../../hooks/useStock';
import { useUnits } from '../../../../hooks/useUnits';
import { Input, Select, TrashIcon, formatCurrency, formatNumber } from '../../../../components/ui';
import type { DraftLine } from '../hooks/useEntryForm';
import { useTraceabilityOptions } from '../../hooks/useTraceabilityOptions';
import { movementUnitContract } from '../../../../../domain/rules/movementRules';

export interface EntryLineItemCardProps {
  line: DraftLine;
  index: number;
  isValid: boolean;
  traceabilityBlockReason: string | null;
  canRemove: boolean;
  onRemove: () => void;
  onSelectProduct: (productId: string) => void;
  onUpdate: (patch: Partial<DraftLine>) => void;
}

export function EntryLineItemCard({ line, index, isValid, traceabilityBlockReason, canRemove, onRemove, onSelectProduct, onUpdate }: EntryLineItemCardProps) {
  const { products } = useProducts();
  const { locations, loading: locationsLoading, error: locationsError } = useLocations();
  const { units } = useUnits();
  const { stock } = useStock();
  const product = products.find(item => item.id === line.productId);
  const unitContract = product ? movementUnitContract(product) : null;
  const compatibleUnits = units.filter(item => unitContract?.validUnitIds.has(item.id));
  const baseUnit = compatibleUnits.find(item => item.id === unitContract?.baseUnitId);
  const alternateUnits = compatibleUnits.filter(item => item.id !== unitContract?.baseUnitId);
  const unitError = product && compatibleUnits.length === 0
    ? 'No hay unidades de medida configuradas para este producto.'
    : product && line.unitId && !unitContract?.validUnitIds.has(line.unitId)
      ? 'Selecciona una unidad compatible con el producto.'
      : undefined;
  const unitHint = product && compatibleUnits.length > 0
    ? `Unidad base: ${baseUnit?.code ?? 'no disponible'}${alternateUnits.length > 0 ? ` · También disponible: ${alternateUnits.map(item => item.code).join(', ')}` : ''}`
    : undefined;
  const requiresLot = Boolean(product?.requiresBatch || product?.requiresColada || product?.requiresExpiry);

  const { lots, assets, loadingLots, loadingAssets, lotsError, assetsError } = useTraceabilityOptions({
    productId: line.productId,
    locationId: line.locationId,
    isOutbound: false,
    requiresLot,
    requiresAsset: Boolean(product?.requiresSerial)
  });

return (
  <section
    className={`
      rounded-xl border p-4
      transition-colors
      ${
        isValid
          ? 'border-gray-200 bg-white'
          : 'border-amber-200 bg-amber-50/30'
      }
    `}
  >

    <div className="flex items-center justify-between mb-4">

      <div className="flex items-center gap-2">

        <div
          className={`
            w-8 h-8 rounded-lg
            flex items-center justify-center
            text-xs font-bold
            ${
              isValid
                ? 'bg-[#093C5D]/10 text-[#093C5D]'
                : 'bg-amber-100 text-amber-700'
            }
          `}
        >
          {index + 1}
        </div>

        <div className="font-semibold text-sm text-[#093C5D]">
          Ítem {index + 1}
        </div>

      </div>


      {canRemove && (

        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
          aria-label={`Eliminar ítem ${index + 1}`}
          onClick={onRemove}
        >
          <TrashIcon size={15} />
        </button>

      )}

    </div>


    <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-4">

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

        <div className="md:col-span-5">
          <Select
            label="Producto *"
            value={line.productId}
            onChange={event =>
              onSelectProduct(event.target.value)
            }
          >
            <option value="">
              Seleccione…
            </option>

            {products
              .filter(
                item =>
                  item.type !== 'maquinaria' &&
                  item.status === 'active'
              )
              .map(item => (

                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.sku} — {item.name}
                </option>

              ))}

          </Select>
        </div>


        <div className="md:col-span-2">

          <Input
            label="Cantidad *"
            type="number"
            min="0.01"
            step="0.01"
            value={line.quantity}
            onChange={event =>
              onUpdate({
                quantity: event.target.value
              })
            }
          />

        </div>


        <div className="md:col-span-2">

          <Select
            label="Unidad *"
            value={line.unitId}
            disabled={!product || compatibleUnits.length === 0}
            error={unitError}
            hint={unitHint}
            onChange={event =>
              onUpdate({
                unitId: event.target.value
              })
            }
          >

            <option value="">Seleccione…</option>

            {compatibleUnits.map(item => (

              <option
                key={item.id}
                value={item.id}
              >
                {item.code}
              </option>

            ))}

          </Select>

        </div>


        <div className="md:col-span-3">

          <Input
            label="Costo unitario"
            type="number"
            min="0"
            step="0.01"
            value={line.unitCost}
            onChange={event =>
              onUpdate({
                unitCost: event.target.value
              })
            }
          />

        </div>

      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">

        <Select
          label="Ubicación destino *"
          value={line.locationId}
          disabled={locationsLoading || Boolean(locationsError) || locations.length === 0}
          error={locationsError ?? (!locationsLoading && locations.length === 0 ? 'No hay ubicaciones activas disponibles.' : undefined)}
          onChange={event =>
            onUpdate({
              locationId: event.target.value
            })
          }
        >

          <option value="">
            {locationsLoading ? 'Cargando ubicaciones…' : 'Seleccione…'}
          </option>

          {locations
            .filter(item => item.status === 'active')
            .map(item => (

              <option
                key={item.id}
                value={item.id}
              >
                {item.code} — {item.name}
              </option>

            ))}

        </Select>


        {requiresLot && (
          <Select
            label="Lote / Colada *"
            value={line.batch}
            disabled={loadingLots || Boolean(lotsError) || lots.length === 0}
            error={lotsError ?? (!loadingLots && lots.length === 0 ? 'No hay trazabilidad preexistente disponible' : undefined)}
            onChange={event => {
              const selectedLot = lots.find(l => l.id === event.target.value);
              onUpdate({
                batch: event.target.value,
                lotSource: selectedLot?.source,
                expiryDate: selectedLot?.expiresAt?.split('T')[0] || ''
              });
            }}
          >
            <option value="">{loadingLots ? 'Cargando lotes...' : 'Seleccione...'}</option>
            {lots.map(lot => (
              <option key={lot.id} value={lot.id}>
                {lot.lotNumber ?? 'Sin número'}
              </option>
            ))}
          </Select>
        )}


        {product?.requiresSerial && (
          <Select
            label="Serie *"
            value={line.serial}
            disabled={loadingAssets || Boolean(assetsError) || assets.length === 0 || Number(line.quantity) !== 1}
            error={
              Number(line.quantity) !== 1
                ? 'La cantidad debe ser 1'
                : assetsError ?? (!loadingAssets && assets.length === 0 ? 'No hay trazabilidad preexistente disponible' : undefined)
            }
            onChange={event => {
              const selectedAsset = assets.find(asset => asset.id === event.target.value);
              onUpdate({
                serial: event.target.value,
                assetSource: selectedAsset?.source,
              });
            }}
          >
            <option value="">{loadingAssets ? 'Cargando series...' : 'Seleccione...'}</option>
            {assets.map(asset => (
              <option key={asset.id} value={asset.id}>
                {asset.serialNumber}
              </option>
            ))}
          </Select>
        )}


        {product?.requiresExpiry && (
          <Input
            label="Vencimiento *"
            type="date"
            value={line.expiryDate}
            readOnly={requiresLot}
            onChange={event =>
              onUpdate({
                expiryDate: event.target.value
              })
            }
          />
        )}

      </div>

      {traceabilityBlockReason && (
        <div className="mt-3 text-xs font-medium text-red-600">{traceabilityBlockReason}</div>
      )}

    </div>


    {product && (

      <div className="mt-3 flex flex-wrap items-center gap-2">

        <div className="px-3 py-2 rounded-lg bg-[#093C5D]/5 text-xs text-gray-600">

          Stock actual:{' '}

          <strong className="text-[#093C5D]">
            {formatNumber(
              stock
                .filter(
                  entry => entry.productId === product.id
                )
                .reduce(
                  (total, entry) =>
                    total + entry.quantity,
                  0
                )
            )}{' '}
            {
              units.find(
                item => item.id === product.unitId
              )?.code
            }
          </strong>

        </div>


        <div className="px-3 py-2 rounded-lg bg-[#6FD1D7]/10 text-xs text-gray-600">

          Subtotal:{' '}

          <strong className="text-[#093C5D]">
            {formatCurrency(
              Number(line.quantity || 0) *
              (
                Number(line.unitCost) ||
                (product.avgCost ?? 0)
              )
            )}
          </strong>

        </div>


        {product.sensitiveMovement && (

          <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 font-medium">
            Requiere autorización
          </div>

        )}

      </div>

    )}

  </section>
);
}
