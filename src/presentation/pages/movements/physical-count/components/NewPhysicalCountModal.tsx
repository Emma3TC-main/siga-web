import type { Location } from '../../../../../domain/entities/Location';
import { useEffect, useState } from 'react';
import { Button, Modal, Select, Textarea } from '../../../../components/ui';

export function NewPhysicalCountModal({
  open, onClose, onSubmit, loading, error, locations,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (locationId: string, notes?: string) => void;
  loading: boolean;
  error: string | null;
  locations: Location[];
}) {
  const [locationId, setLocationId] = useState('');
  const [notes, setNotes] = useState('');
  useEffect(() => { if (!open) { setLocationId(''); setNotes(''); } }, [open]);

  return (
    <Modal open={open} onClose={onClose} title="Nuevo conteo físico" size="xl"
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button variant="primary" onClick={() => onSubmit(locationId, notes.trim() || undefined)} loading={loading} disabled={!locationId}>Crear conteo</Button></>}>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">El servidor tomará la fotografía vigente del stock de la ubicación. La Web no envía cantidades teóricas.</p>
        {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</div>}
        <Select label="Ubicación" value={locationId} onChange={event => setLocationId(event.target.value)}>
          <option value="">Seleccione una ubicación</option>
          {locations.filter(location => location.status === 'active').map(location => <option key={location.id} value={location.id}>{location.name} · {location.code}</option>)}
        </Select>
        <Textarea label="Notas (opcional)" maxLength={2000} value={notes} onChange={event => setNotes(event.target.value)} />
      </div>
    </Modal>
  );
}
