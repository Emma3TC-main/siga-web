import type { Dispatch, SetStateAction } from 'react';
import { useApp } from '../../../../state/AppContext';
import { Input, Select, Textarea } from '../../../../components/ui';
import type { MultiDetailHeaderData } from '../hooks/useMultiDetailForm';
import { ADJUSTMENT_MOTIVES, MULTI_DETAIL_DOCUMENTS, type MovementMode } from '../constants';

export interface MovementHeaderStepProps {
  mode: MovementMode;
  header: MultiDetailHeaderData;
  setHeader: Dispatch<SetStateAction<MultiDetailHeaderData>>;
}

export function MovementHeaderStep({ mode, header, setHeader }: MovementHeaderStepProps) {
  const { state } = useApp();
  const { costCenters, responsibles } = state;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-[#093C5D]">Cabecera del movimiento</h3>
        <p className="text-xs text-gray-500 mt-1">Estos datos se aplican a todas las líneas del movimiento.</p>
      </div>

      {mode === 'adjustment' && (
        <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-lg">
          {['ajuste_negativo', 'ajuste_positivo'].map(type => (
            <button
              key={type}
              onClick={() => setHeader(previous => ({ ...previous, adjustmentType: type }))}
              className={`py-2 rounded-md text-sm font-semibold ${header.adjustmentType === type ? type === 'ajuste_negativo' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white' : 'text-gray-500'}`}
            >
              {type === 'ajuste_negativo' ? '− Ajuste negativo' : '+ Ajuste positivo'}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select label="Documento *" value={header.documentType} onChange={event => setHeader(previous => ({ ...previous, documentType: event.target.value }))}>
          <option value="">Seleccione…</option>
          {MULTI_DETAIL_DOCUMENTS.map(document => <option key={document}>{document}</option>)}
        </Select>
        <Input label="Número / referencia *" value={header.documentNumber} onChange={event => setHeader(previous => ({ ...previous, documentNumber: event.target.value }))} placeholder="OT-001-00045" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select label="Responsable" value={header.requesterId} onChange={event => setHeader(previous => ({ ...previous, requesterId: event.target.value }))}>
          <option value="">Seleccione…</option>
          {responsibles.map(responsible => <option key={responsible.id} value={responsible.id}>{responsible.name}</option>)}
        </Select>
        <Select label="Centro de costo" value={header.costCenterId} onChange={event => setHeader(previous => ({ ...previous, costCenterId: event.target.value }))}>
          <option value="">Seleccione…</option>
          {costCenters.map(center => <option key={center.id} value={center.id}>{center.code} — {center.name}</option>)}
        </Select>
      </div>

      {mode === 'adjustment' ? (
        <Select label="Motivo *" value={header.motive} onChange={event => setHeader(previous => ({ ...previous, motive: event.target.value }))}>
          <option value="">Seleccione…</option>
          {ADJUSTMENT_MOTIVES.map(motive => <option key={motive}>{motive}</option>)}
        </Select>
      ) : (
        <Input label="Motivo *" value={header.motive} onChange={event => setHeader(previous => ({ ...previous, motive: event.target.value }))} />
      )}

      <Textarea label="Observaciones" value={header.observations} onChange={event => setHeader(previous => ({ ...previous, observations: event.target.value }))} />
    </div>
  );
}
