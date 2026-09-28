import type { Product } from '../../../../../domain/entities/Product';
import type { Location } from '../../../../../domain/entities/Location';
import type { StockEntry } from '../../../../../domain/entities/Stock';
import { Button, Input, Modal, Select, formatNumber } from '../../../../components/ui';

export interface NewCountItem { productId: string; locationId: string; counted: string }

export function NewPhysicalCountModal({
  open, onClose, onSubmit, loading,
  countName, onCountNameChange,
  locFilter, onLocFilterChange,
  items, onItemCountChange,
  locations, products, stock,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
  countName: string;
  onCountNameChange: (v: string) => void;
  locFilter: string;
  onLocFilterChange: (v: string) => void;
  items: NewCountItem[];
  onItemCountChange: (idx: number, val: string) => void;
  locations: Location[];
  products: Product[];
  stock: StockEntry[];
}) {
  return (
    <Modal open={open} onClose={onClose} title="Nuevo conteo físico" size="xl"
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button variant="primary" onClick={onSubmit} loading={loading}>Guardar conteo</Button></>}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nombre / referencia" value={countName} onChange={e => onCountNameChange(e.target.value)} />
          <Select label="Filtrar por ubicación" value={locFilter} onChange={e => onLocFilterChange(e.target.value)}>
            <option value="">Todas las ubicaciones</option>
            {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </Select>
        </div>
        <div className="text-sm font-semibold text-[#093C5D]">Ingrese las cantidades contadas</div>
        <div className="max-h-72 overflow-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0"><tr><th className="text-left p-3 text-xs">Producto</th><th className="text-right p-3 text-xs">Teórico</th><th className="text-right p-3 text-xs w-32">Contado</th></tr></thead>
            <tbody>
              {items.map((item, i) => {
                const prod = products.find(p => p.id === item.productId);
                const s = stock.find(e => e.productId === item.productId && e.locationId === item.locationId);
                const theoretical = s?.quantity ?? 0;
                const counted = Number(item.counted) || 0;
                const diff = counted - theoretical;
                return (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="p-3"><div className="font-medium">{prod?.name}</div><div className="font-mono text-xs text-gray-400">{prod?.sku}</div></td>
                    <td className="p-3 text-right font-semibold text-[#093C5D]">{formatNumber(theoretical)}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2 justify-end">
                        {diff !== 0 && <span className={`text-xs font-bold ${diff > 0 ? 'text-green-600' : 'text-red-600'}`}>{diff > 0 ? '+' : ''}{diff}</span>}
                        <input type="number" value={item.counted} onChange={e => onItemCountChange(i, e.target.value)}
                          className={`w-24 text-right rounded-lg border px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#3B7597] ${diff !== 0 ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
