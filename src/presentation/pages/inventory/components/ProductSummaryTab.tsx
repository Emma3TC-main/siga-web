import type { Product } from '../../../../domain/entities/Product';
import { DetailField } from '../../../components/ui';

interface ProductSummaryTabProps {
  detail: Product;
}

export function ProductSummaryTab({ detail }: ProductSummaryTabProps) {
return (
  <div className="space-y-4">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

      <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
        <DetailField
          label="Descripción"
          value={detail.description ?? 'Sin descripción'}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
        <DetailField
          label="Información técnica"
          value={detail.technicalInfo ?? 'Sin información técnica'}
        />
      </div>

    </div>


    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

      {[
        {
          label: 'Estrategia despacho',
          val: detail.dispatchStrategy
        },
        {
          label: 'Req. vencimiento',
          val: detail.requiresExpiry ? 'Sí' : 'No'
        },
        {
          label: 'Req. colada',
          val: detail.requiresColada ? 'Sí' : 'No'
        },
        {
          label: 'Mov. sensible',
          val: detail.sensitiveMovement ? 'Sí' : 'No'
        },

      ].map((f, i) => (

        <div
          key={i}
          className="rounded-xl border border-[#093C5D]/10 bg-[#093C5D]/[0.03] px-3 py-3 text-center hover:bg-[#093C5D]/[0.05] transition-colors"
        >

          <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
            {f.label}
          </div>

          <div className="text-xs font-semibold text-[#093C5D] mt-1">
            {f.val}
          </div>

        </div>

      ))}

    </div>

  </div>
);
}
