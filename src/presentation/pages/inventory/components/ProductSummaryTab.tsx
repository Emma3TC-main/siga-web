import type { Product } from '../../../../domain/entities/Product';
import { DetailField } from '../../../components/ui';

interface ProductSummaryTabProps {
  detail: Product;
}

export function ProductSummaryTab({ detail }: ProductSummaryTabProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <DetailField label="Descripción" value={detail.description ?? 'Sin descripción'} />
        <DetailField label="Información técnica" value={detail.technicalInfo ?? 'Sin información técnica'} />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Estrategia despacho', val: detail.dispatchStrategy },
          { label: 'Req. vencimiento', val: detail.requiresExpiry ? 'Sí' : 'No' },
          { label: 'Req. colada', val: detail.requiresColada ? 'Sí' : 'No' },
          { label: 'Mov. sensible', val: detail.sensitiveMovement ? 'Sí' : 'No' },
        ].map((f, i) => (
          <div key={i} className="p-2 bg-[#093C5D]/3 rounded text-center">
            <div className="text-[10px] text-gray-400">{f.label}</div>
            <div className="text-xs font-semibold text-[#093C5D] mt-0.5">{f.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
