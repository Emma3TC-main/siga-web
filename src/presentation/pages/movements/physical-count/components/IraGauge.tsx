export function IraGauge({ ira }: { ira: number }) {
  return (
    <div className="siga-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-[#093C5D]">Indicador IRA (Inventory Record Accuracy)</h3>
          <p className="text-xs text-gray-500 mt-0.5">Porcentaje de registros con stock real = stock teórico</p>
        </div>
        <div className="text-4xl font-bold text-[#093C5D] font-display">{ira}%</div>
      </div>
      <div className="relative h-5 bg-gray-100 rounded-full overflow-hidden">
        <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
          style={{ width: `${ira}%`, background: ira >= 95 ? '#5DF8D8' : ira >= 85 ? '#6FD1D7' : '#D97706' }} />
        <div className="absolute left-[95%] top-0 h-full w-px bg-red-400 opacity-60" />
      </div>
      <div className="flex justify-between mt-1.5 text-xs text-gray-400">
        <span>0%</span><span className="text-red-400">Meta mínima: 95%</span><span>100%</span>
      </div>
    </div>
  );
}
