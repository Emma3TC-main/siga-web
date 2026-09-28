import { Badge, DetailSection, EmptyState, FileIcon } from '../../../../components/ui';
import type { Evidence } from '../../../../../types';
import { formatBytes } from './movementDetailData';

export interface MovementAttachmentsProps {
  evidences: Evidence[];
  /** Evidencias declaradas en el movimiento que no tienen archivo asociado en el sistema. */
  unlinkedCount: number;
  userName: (id?: string) => string | undefined;
}

export function MovementAttachments({ evidences, unlinkedCount, userName }: MovementAttachmentsProps) {
  if (evidences.length === 0 && unlinkedCount === 0) {
    return <EmptyState icon={<FileIcon size={40} />} title="Sin adjuntos" description="Este movimiento no tiene evidencias asociadas." />;
  }
  return (
    <div className="space-y-4">
      {evidences.length > 0 && (
        <DetailSection title={`Evidencias (${evidences.length})`}>
          <ul className="siga-card divide-y divide-gray-100">
            {evidences.map(evidence => (
              <li key={evidence.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-lg bg-[#3B7597]/10 flex items-center justify-center flex-shrink-0"><FileIcon size={16} className="text-[#3B7597]" /></div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-[#093C5D] break-words">
                    {evidence.url ? <a href={evidence.url} target="_blank" rel="noreferrer" className="hover:underline">{evidence.name}</a> : evidence.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatBytes(evidence.size)} · <span className="font-mono">{evidence.uploadedAt}</span>{userName(evidence.uploadedBy) && ` · ${userName(evidence.uploadedBy)}`}
                  </div>
                </div>
                <Badge variant="muted">{evidence.type.toUpperCase()}</Badge>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}
      {unlinkedCount > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
          {unlinkedCount} evidencia(s) registrada(s) en el movimiento sin archivo disponible para consulta.
        </div>
      )}
    </div>
  );
}
