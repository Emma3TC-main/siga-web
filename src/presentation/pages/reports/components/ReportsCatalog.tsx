import { Button, EyeIcon } from '../../../components/ui';
import { REPORTS, type ReportDefinition } from '../constants';

export function ReportsCatalog({ onSelectReport }: { onSelectReport: (id: ReportDefinition['id']) => void }) {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS.map(report => (
          <div key={report.id} className="siga-card p-5 cursor-pointer hover:border-[#3B7597] hover:shadow-md transition-all" onClick={() => onSelectReport(report.id)}>
            <span className="text-2xl">{report.icon}</span>
            <h3 className="font-semibold text-[#093C5D] text-sm mt-3 mb-1">{report.name}</h3>
            <p className="text-xs text-gray-400 mb-4">{report.description}</p>
            <Button variant="outline" size="sm" icon={<EyeIcon size={12} />} className="w-full">Ver reporte</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
