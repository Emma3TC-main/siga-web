import { Badge, DetailSection, EmptyState, ActivityIcon } from '../../../../components/ui';
import type { AuditEvent } from '../../../../../domain/entities/AuditEvent';
import type { HistoryEntry, HistoryTone, ProgressStep } from './movementDetailData';

const DOT: Record<HistoryTone, string> = {
  neutral: 'bg-gray-400',
  info: 'bg-[#3B7597]',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
};

export interface MovementTimelineProps {
  progress: ProgressStep[];
  history: HistoryEntry[];
  auditEvents: AuditEvent[];
  userName: (id?: string) => string | undefined;
}

export function MovementTimeline({ progress, history, auditEvents, userName }: MovementTimelineProps) {
  return (
    <div className="space-y-5">
      <DetailSection title="Progreso">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          {progress.map(step => (
            <div key={step.label} className={`p-3 rounded-lg border ${step.rejected ? 'border-red-200 bg-red-50 text-red-700' : step.reached ? 'border-[#5DF8D8] bg-[#5DF8D8]/10 text-[#093C5D]' : 'border-gray-200 text-gray-400'}`}>
              <div className="font-semibold">{step.label}</div>
              <div className="mt-1 font-mono">{step.at ?? '—'}</div>
            </div>
          ))}
        </div>
      </DetailSection>

      <DetailSection title="Historial del movimiento">
        <ol className="ml-2 border-l border-gray-200">
          {history.map(entry => (
            <li key={entry.key} className="relative pl-5 pb-5 last:pb-0">
              <span className={`absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white ${DOT[entry.tone]}`} />
              <div className="text-sm font-semibold text-[#093C5D]">{entry.label}</div>
              {(entry.actor || entry.at) && (
                <div className="text-xs text-gray-500">
                  {entry.actor}{entry.actor && entry.at && ' · '}{entry.at && <span className="font-mono">{entry.at}</span>}
                </div>
              )}
              {entry.note && <div className="text-xs text-gray-600 mt-1 whitespace-normal break-words">{entry.note}</div>}
            </li>
          ))}
        </ol>
      </DetailSection>

      <DetailSection title={`Eventos de auditoría (${auditEvents.length})`}>
        {auditEvents.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-lg">
            <EmptyState compact icon={<ActivityIcon size={28} />} title="Sin eventos de auditoría" description="No hay eventos registrados para este movimiento." />
          </div>
        ) : (
          <div className="siga-card overflow-x-auto">
            <table className="siga-table min-w-[640px]">
              <thead><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Descripción</th><th className="text-center">Resultado</th></tr></thead>
              <tbody>
                {auditEvents.map(event => (
                  <tr key={event.id}>
                    <td className="font-mono text-xs whitespace-nowrap">{event.date} {event.time}</td>
                    <td className="text-xs">{userName(event.userId) ?? '—'}</td>
                    <td className="text-xs font-bold text-gray-600">{event.action}</td>
                    <td className="text-xs text-gray-600 max-w-[320px] whitespace-normal break-words">{event.description}</td>
                    <td className="text-center">
                      <Badge variant={event.result === 'success' ? 'success' : event.result === 'warning' ? 'warning' : 'error'} dot>
                        {event.result === 'success' ? 'Éxito' : event.result === 'warning' ? 'Advertencia' : 'Error'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DetailSection>
    </div>
  );
}
