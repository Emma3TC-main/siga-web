import { Button, DownloadIcon } from '../../../components/ui';

interface ReportDetailHeaderProps {
  title: string;
  onBack: () => void;
}

export function ReportDetailHeader({ title, onBack }: ReportDetailHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onBack} className="text-[#3B7597] hover:underline text-sm flex-shrink-0">← Volver</button>
        <h2 className="font-bold text-[#093C5D] font-display truncate">{title}</h2>
      </div>
      <Button variant="outline" size="sm" icon={<DownloadIcon size={14} />} className="flex-shrink-0 self-start sm:self-auto">Exportar CSV</Button>
    </div>
  );
}
