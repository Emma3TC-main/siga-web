interface InventoryStatsBarProps {
  sinStock: number;
  bajoStock: number;
  proximoVencer: number;
  filterStatus: string;
  onFilterStatus: (status: string) => void;
}

export function InventoryStatsBar({ sinStock, bajoStock, proximoVencer, filterStatus, onFilterStatus }: InventoryStatsBarProps) {
  return (
  <div className="px-6 py-3 border-b border-gray-200 bg-white">

    <div className="flex flex-wrap items-center gap-2.5">

      {sinStock > 0 && (
        <button
          onClick={() => onFilterStatus('sin_stock')}
          className={`
            flex items-center gap-2
            text-xs font-medium
            px-3 py-2
            rounded-lg
            border
            transition-all
            ${
              filterStatus === 'sin_stock'
                ? 'bg-red-100 border-red-300 text-red-700 shadow-sm'
                : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
            }
          `}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
          {sinStock} sin stock
        </button>
      )}


      {bajoStock > 0 && (
        <button
          onClick={() => onFilterStatus('bajo_stock')}
          className={`
            flex items-center gap-2
            text-xs font-medium
            px-3 py-2
            rounded-lg
            border
            transition-all
            ${
              filterStatus === 'bajo_stock'
                ? 'bg-amber-100 border-amber-300 text-amber-700 shadow-sm'
                : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
            }
          `}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
          {bajoStock} bajo mínimo
        </button>
      )}


      {proximoVencer > 0 && (
        <button
          onClick={() => onFilterStatus('proximo_vencer')}
          className={`
            flex items-center gap-2
            text-xs font-medium
            px-3 py-2
            rounded-lg
            border
            transition-all
            ${
              filterStatus === 'proximo_vencer'
                ? 'bg-orange-100 border-orange-300 text-orange-700 shadow-sm'
                : 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
            }
          `}
        >
          <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
          {proximoVencer} próx. vencer
        </button>
      )}


      {filterStatus && (
        <button
          onClick={() => onFilterStatus('')}
          className="
            ml-auto
            text-xs font-medium
            text-gray-500
            px-3 py-2
            rounded-lg
            hover:bg-gray-100
            hover:text-gray-700
            transition-colors
          "
        >
          Limpiar filtro
        </button>
      )}

    </div>

  </div>
);
}
