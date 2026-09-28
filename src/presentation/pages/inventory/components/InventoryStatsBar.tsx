interface InventoryStatsBarProps {
  sinStock: number;
  bajoStock: number;
  proximoVencer: number;
  filterStatus: string;
  onFilterStatus: (status: string) => void;
}

export function InventoryStatsBar({ sinStock, bajoStock, proximoVencer, filterStatus, onFilterStatus }: InventoryStatsBarProps) {
  return (
    <div className="flex gap-3 px-6 py-3 border-b border-gray-200 bg-white">
      {sinStock > 0 && (
        <button onClick={() => onFilterStatus('sin_stock')} className="flex items-center gap-1.5 text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors">
          <span className="w-2 h-2 rounded-full bg-red-500" />{sinStock} sin stock
        </button>
      )}
      {bajoStock > 0 && (
        <button onClick={() => onFilterStatus('bajo_stock')} className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors">
          <span className="w-2 h-2 rounded-full bg-amber-500" />{bajoStock} bajo mínimo
        </button>
      )}
      {proximoVencer > 0 && (
        <button onClick={() => onFilterStatus('proximo_vencer')} className="flex items-center gap-1.5 text-xs text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-colors">
          <span className="w-2 h-2 rounded-full bg-orange-500" />{proximoVencer} próx. vencer
        </button>
      )}
      {filterStatus && (
        <button onClick={() => onFilterStatus('')} className="text-xs text-gray-500 hover:text-gray-700 underline">Limpiar filtro</button>
      )}
    </div>
  );
}
