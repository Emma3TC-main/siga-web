import { Button, DownloadIcon } from '../../../components/ui';
import type { ReportDefinition } from '../constants';

interface PlaceholderReportViewProps {
  report: ReportDefinition | undefined;
}

export function PlaceholderReportView({ report }: PlaceholderReportViewProps) {
  return (
    <div className="flex flex-col items-center py-16 text-gray-400">
      <span className="text-4xl mb-3">{report?.icon}</span>
      <div className="font-semibold text-gray-600">{report?.name}</div>
      <div className="text-sm mt-1">Generando datos del reporte con los filtros seleccionados...</div>
      <Button variant="primary" size="sm" className="mt-4" icon={<DownloadIcon size={14} />}>Exportar datos</Button>
    </div>
  );
}
