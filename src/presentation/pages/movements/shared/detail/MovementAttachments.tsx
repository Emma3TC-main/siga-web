import { Badge, Button, DetailSection, EmptyState, FileIcon } from '../../../../components/ui';
import type { Evidence } from '../../../../../domain/entities/Evidence';
import { formatBytes } from './movementDetailData';

export interface MovementAttachmentsProps {
  evidences: Evidence[];
  loading: boolean;
  error: unknown;
  onDownload: (id: string) => void;
}

export function MovementAttachments({ evidences, loading, error, onDownload }: MovementAttachmentsProps) {
  if (loading) return <div className="text-sm text-gray-500">Cargando evidencias…</div>;
  if (error) return <div className="text-sm text-red-700">No se pudieron cargar las evidencias del movimiento.</div>;
  if (evidences.length === 0) {
    return <EmptyState icon={<FileIcon size={40} />} title="Sin adjuntos" description="Este movimiento no tiene evidencias asociadas." />;
  }
  return (
    <div className="space-y-4">
      <DetailSection title={`Evidencias (${evidences.length})`}>
        <ul className="siga-card divide-y divide-gray-100">
          {evidences.map(evidence => (
            <li key={evidence.id} className="flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-[#3B7597]/10 flex items-center justify-center flex-shrink-0"><FileIcon size={16} className="text-[#3B7597]" /></div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-[#093C5D] break-words">{evidence.originalFilename}</div>
                <div className="text-xs text-gray-500">{formatBytes(evidence.sizeBytes)} · <span className="font-mono">{evidence.uploadedAt}</span></div>
              </div>
              <Badge variant="muted">{evidence.contentType.split('/')[1].toUpperCase()}</Badge>
              <Button variant="outline" onClick={() => onDownload(evidence.id)}>Descargar</Button>
            </li>
          ))}
        </ul>
      </DetailSection>
    </div>
  );
}
