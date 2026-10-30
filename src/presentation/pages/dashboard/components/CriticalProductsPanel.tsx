import type { CriticalProduct } from '../../../../domain/entities/Reporting';
import { Badge, formatNumber } from '../../../components/ui';

export function CriticalProductsPanel({ products }: { products: CriticalProduct[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
        <h3 className="font-semibold text-[#093C5D] text-sm">Productos críticos</h3>
      </div>
      {products.length === 0 ? (
        <div className="p-8 text-center text-sm text-gray-400">Sin productos críticos.</div>
      ) : (
        <div className="divide-y divide-gray-100">
          {products.map(product => (
            <div key={product.productId} className="px-5 py-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#093C5D] truncate">{product.name}</div>
                  <div className="text-[10px] text-gray-400 font-mono">{product.sku}</div>
                </div>
                <Badge variant={product.quantity === 0 ? 'error' : 'warning'}>{formatNumber(product.quantity)} / mín. {formatNumber(product.minStock)}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
