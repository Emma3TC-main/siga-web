import { useEffect, useMemo, useState } from 'react';
import type {
  AddUnexpectedPhysicalCountLineInput,
  CancelPhysicalCountInput,
  CapturePhysicalCountLineInput,
  ClosePhysicalCountInput,
  PhysicalCount,
  PhysicalCountLine,
} from '../../../../../domain/entities/PhysicalCount';
import { adjustmentCandidate } from '../../../../../domain/entities/PhysicalCount';
import type { Product } from '../../../../../domain/entities/Product';
import type { UnitOfMeasure } from '../../../../../domain/entities/UnitOfMeasure';
import type { Location } from '../../../../../domain/entities/Location';
import { useTraceabilityOptions } from '../../hooks/useTraceabilityOptions';
import { Badge, Button, DetailField, DetailHeader, DetailSection, Input, Modal, Select, Textarea, formatNumber } from '../../../../components/ui';
import { calcIra } from '../utils/countStats';

type MutationResult = Promise<PhysicalCount | null>;

interface Props {
  detail: PhysicalCount | null;
  products: Product[];
  units: UnitOfMeasure[];
  locations: Location[];
  loading: boolean;
  commandError: string | null;
  onCapture: (input: CapturePhysicalCountLineInput) => MutationResult;
  onAddUnexpected: (input: AddUnexpectedPhysicalCountLineInput) => MutationResult;
  onCloseCount: (input: ClosePhysicalCountInput) => MutationResult;
  onCancelCount: (input: CancelPhysicalCountInput) => MutationResult;
  onClose: () => void;
}

function statusBadge(status: PhysicalCount['status']) {
  if (status === 'COMPLETED') return { variant: 'success' as const, label: 'Completado' };
  if (status === 'CANCELLED') return { variant: 'error' as const, label: 'Cancelado' };
  if (status === 'IN_PROGRESS') return { variant: 'warning' as const, label: 'En progreso' };
  return { variant: 'info' as const, label: 'Borrador' };
}

export function PhysicalCountDetailModal(props: Props) {
  const { detail, products, units, locations, loading, commandError, onCapture, onAddUnexpected, onCloseCount, onCancelCount, onClose } = props;
  const [values, setValues] = useState<Record<string, string>>({});
  const [lineNotes, setLineNotes] = useState<Record<string, string>>({});
  const [cancelReason, setCancelReason] = useState('');
  const [addingUnexpected, setAddingUnexpected] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!detail) return;
    setValues(Object.fromEntries(detail.lines.map(line => [line.id, line.countedQuantity === null ? '' : String(line.countedQuantity)])));
    setLineNotes(Object.fromEntries(detail.lines.map(line => [line.id, line.notes ?? ''])));
    setCancelReason('');
    setLocalError(null);
  }, [detail?.id, detail?.version]);

  if (!detail) return <Modal open={false} onClose={onClose}><></></Modal>;
  const current = detail;

  const location = locations.find(candidate => candidate.id === detail.locationId);
  const ira = calcIra(detail.lines);
  const status = statusBadge(detail.status);
  const editable = detail.status === 'DRAFT' || detail.status === 'IN_PROGRESS';
  const incomplete = detail.lines.some(line => line.countedQuantity === null);
  const exact = detail.lines.filter(line => line.difference === 0).length;
  const withDifference = detail.lines.filter(line => line.difference !== null && line.difference !== 0).length;

  async function capture(line: PhysicalCountLine) {
    const raw = values[line.id];
    const quantity = Number(raw);
    if (raw === '' || !Number.isFinite(quantity) || quantity < 0) {
      setLocalError('La cantidad contada debe ser un número mayor o igual a cero.');
      return;
    }
    if (line.assetId && quantity !== 0 && quantity !== 1) {
      setLocalError('Una línea con activo solo admite cantidad contada 0 o 1.');
      return;
    }
    setLocalError(null);
    await onCapture({ countId: current.id, lineId: line.id, expectedVersion: current.version, countedQuantity: quantity, notes: lineNotes[line.id]?.trim() || undefined });
  }

  async function closeCount() {
    if (incomplete) { setLocalError('Debe capturar todas las líneas antes de cerrar el conteo.'); return; }
    setLocalError(null);
    await onCloseCount({ countId: current.id, expectedVersion: current.version });
  }

  async function cancelCount() {
    if (!cancelReason.trim()) { setLocalError('Ingrese el motivo de cancelación.'); return; }
    setLocalError(null);
    await onCancelCount({ countId: current.id, expectedVersion: current.version, reason: cancelReason.trim() });
  }

  return (
    <Modal open onClose={onClose} title={`Conteo ${shortId(detail.id)}`} size="full">
      <div className="space-y-5">
        <DetailHeader eyebrow={detail.id} title={location?.name ?? detail.locationId} badges={<><Badge variant={status.variant} dot>{status.label}</Badge><Badge variant="muted">v{detail.version}</Badge></>} />

        {(localError || commandError) && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{localError ?? commandError}</div>}

        <DetailSection title="Información general">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
            <DetailField label="Ubicación" value={location?.name ?? detail.locationId} />
            <DetailField label="Creado por" value={<span title={detail.createdByUserId}>{shortId(detail.createdByUserId)}</span>} />
            <DetailField label="Creado" value={formatDate(detail.createdAt)} />
            <DetailField label="Actualizado" value={formatDate(detail.updatedAt)} />
          </div>
          {detail.notes && <p className="mt-2 text-sm text-gray-600">{detail.notes}</p>}
          {detail.cancellationReason && <p className="mt-2 text-sm text-red-700">Motivo: {detail.cancellationReason}</p>}
        </DetailSection>

        <DetailSection title="Resultados">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <Metric value={detail.lines.length} label="Líneas" />
            <Metric value={`${ira}%`} label="IRA capturado" />
            <Metric value={exact} label="Exactas" tone="text-emerald-600" />
            <Metric value={withDifference} label="Con diferencia" tone="text-amber-600" />
          </div>
          {detail.lines.length === 0 && detail.status === 'DRAFT' && (
            <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">La fotografía de esta ubicación está vacía. Puede verificarse y cerrarse sin crear líneas de valor cero.</div>
          )}
        </DetailSection>

        <DetailSection title={`Líneas del conteo (${detail.lines.length})`}>
          <div className="overflow-x-auto border border-gray-100 rounded-lg">
            <table className="siga-table min-w-[900px]">
              <thead><tr><th>Producto / dimensión</th><th className="text-right">Sistema</th><th className="text-right">Contado</th><th className="text-right">Diferencia</th><th>Notas</th>{editable && <th>Acción</th>}</tr></thead>
              <tbody>
                {detail.lines.map(line => {
                  const product = products.find(candidate => candidate.id === line.productId);
                  const unit = product ? units.find(candidate => candidate.id === product.unitId) : undefined;
                  return (
                    <tr key={line.id}>
                      <td>
                        <div className="font-medium text-sm">{product?.name ?? shortId(line.productId)}</div>
                        <div className="text-xs text-gray-400">{line.lotId ? `Lote ${shortId(line.lotId)}` : 'Sin lote'} · {line.assetId ? `Activo ${shortId(line.assetId)}` : 'Sin activo'}</div>
                      </td>
                      <td className="text-right">{formatNumber(line.systemQuantity)} {unit?.code}</td>
                      <td className="text-right">
                        {editable ? <input type="number" min="0" step="any" value={values[line.id] ?? ''} onChange={event => setValues(current => ({ ...current, [line.id]: event.target.value }))} className="siga-input w-28 text-right" /> : `${line.countedQuantity === null ? '—' : formatNumber(line.countedQuantity)} ${unit?.code ?? ''}`}
                      </td>
                      <td className={`text-right font-semibold ${differenceTone(line.difference)}`}>{formatDifference(line.difference)}</td>
                      <td>{editable ? <input value={lineNotes[line.id] ?? ''} maxLength={2000} onChange={event => setLineNotes(current => ({ ...current, [line.id]: event.target.value }))} className="siga-input min-w-40" /> : line.notes ?? '—'}</td>
                      {editable && <td><Button size="sm" variant="outline" loading={loading} onClick={() => void capture(line)}>Guardar</Button></td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </DetailSection>

        {editable && (
          <DetailSection title="Acciones">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => setAddingUnexpected(value => !value)}>Agregar dimensión no esperada</Button>
                <Button variant="success" size="sm" loading={loading} disabled={incomplete} onClick={() => void closeCount()}>Cerrar conteo</Button>
              </div>
              {incomplete && <p className="text-xs text-amber-700">Faltan {detail.lines.filter(line => line.countedQuantity === null).length} líneas por capturar.</p>}
              {addingUnexpected && <UnexpectedLineForm detail={detail} products={products} loading={loading} onSubmit={onAddUnexpected} onDone={() => setAddingUnexpected(false)} />}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 items-end border-t border-gray-100 pt-3">
                <Textarea label="Motivo de cancelación" maxLength={255} value={cancelReason} onChange={event => setCancelReason(event.target.value)} />
                <Button variant="danger" size="sm" loading={loading} onClick={() => void cancelCount()}>Cancelar conteo</Button>
              </div>
            </div>
          </DetailSection>
        )}

        {detail.status === 'COMPLETED' && (
          <DetailSection title="Candidatos de ajuste">
            <p className="text-sm text-gray-600 mb-2">El conteo no modifica stock ni crea movimientos. Las diferencias solo identifican candidatos para el flujo controlado de ajustes.</p>
            <div className="flex flex-wrap gap-2">
              {detail.lines.filter(line => adjustmentCandidate(line)).map(line => <Badge key={line.id} variant={line.difference! > 0 ? 'warning' : 'error'}>{shortId(line.productId)} · {adjustmentCandidate(line)}</Badge>)}
              {!detail.lines.some(line => adjustmentCandidate(line)) && <Badge variant="success">Sin ajustes candidatos</Badge>}
            </div>
          </DetailSection>
        )}
      </div>
    </Modal>
  );
}

function UnexpectedLineForm({ detail, products, loading, onSubmit, onDone }: {
  detail: PhysicalCount;
  products: Product[];
  loading: boolean;
  onSubmit: (input: AddUnexpectedPhysicalCountLineInput) => MutationResult;
  onDone: () => void;
}) {
  const [productId, setProductId] = useState('');
  const [lotId, setLotId] = useState('');
  const [assetId, setAssetId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const product = products.find(candidate => candidate.id === productId);
  const requiresLot = Boolean(product?.requiresBatch || product?.requiresColada || product?.requiresExpiry);
  const requiresAsset = Boolean(product?.requiresSerial);
  const traceability = useTraceabilityOptions({ productId, isOutbound: false, requiresLot, requiresAsset, selectedLotId: lotId || undefined });

  useEffect(() => { setLotId(''); setAssetId(''); }, [productId]);
  const duplicate = useMemo(() => detail.lines.some(line => line.productId === productId && (line.lotId ?? '') === lotId && (line.assetId ?? '') === assetId), [assetId, detail.lines, lotId, productId]);

  async function submit() {
    const countedQuantity = Number(quantity);
    if (!productId || quantity === '' || !Number.isFinite(countedQuantity) || countedQuantity < 0) { setError('Seleccione un producto e ingrese una cantidad válida.'); return; }
    if (requiresLot && !lotId) { setError('Seleccione un lote canónico.'); return; }
    if (requiresAsset && !assetId) { setError('Seleccione un activo canónico.'); return; }
    if (requiresAsset && countedQuantity !== 0 && countedQuantity !== 1) { setError('Un activo solo admite cantidad 0 o 1.'); return; }
    if (duplicate) { setError('La dimensión seleccionada ya existe en el conteo.'); return; }
    setError(null);
    const result = await onSubmit({ countId: detail.id, expectedVersion: detail.version, productId, lotId: lotId || undefined, assetId: assetId || undefined, countedQuantity, notes: notes.trim() || undefined });
    if (result) onDone();
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Select label="Producto" value={productId} onChange={event => setProductId(event.target.value)}>
          <option value="">Seleccione un producto</option>
          {products.filter(candidate => candidate.status === 'active').map(candidate => <option key={candidate.id} value={candidate.id}>{candidate.sku} · {candidate.name}</option>)}
        </Select>
        <Input label="Cantidad contada" type="number" min="0" step="any" value={quantity} onChange={event => setQuantity(event.target.value)} />
        {requiresLot && <Select label="Lote canónico" value={lotId} onChange={event => setLotId(event.target.value)} disabled={traceability.loadingLots}><option value="">Seleccione un lote</option>{traceability.lots.map(lot => <option key={lot.id} value={lot.id}>{lot.lotNumber ?? 'Sin número'}</option>)}</Select>}
        {requiresAsset && <Select label="Activo canónico" value={assetId} onChange={event => setAssetId(event.target.value)} disabled={traceability.loadingAssets}><option value="">Seleccione un activo</option>{traceability.assets.map(asset => <option key={asset.id} value={asset.id}>{asset.assetCode} · {asset.serialNumber}</option>)}</Select>}
      </div>
      <Textarea label="Notas (opcional)" maxLength={2000} value={notes} onChange={event => setNotes(event.target.value)} />
      {(error || traceability.lotsError || traceability.assetsError) && <p className="text-xs text-red-600">{error ?? traceability.lotsError ?? traceability.assetsError}</p>}
      <div className="flex justify-end gap-2"><Button variant="outline" size="sm" onClick={onDone}>Descartar</Button><Button size="sm" loading={loading} onClick={() => void submit()}>Agregar línea</Button></div>
    </div>
  );
}

function Metric({ value, label, tone = 'text-[#093C5D]' }: { value: string | number; label: string; tone?: string }) {
  return <div className="p-3 bg-gray-50 rounded-lg"><div className={`text-2xl font-bold ${tone}`}>{value}</div><div className="text-xs text-gray-400">{label}</div></div>;
}

function shortId(value: string) { return value.length > 16 ? `${value.slice(0, 8)}…${value.slice(-4)}` : value; }
function formatDate(value: string | null) { return value ? new Date(value).toLocaleString('es-PE') : '—'; }
function differenceTone(value: number | null) { return value === null || value === 0 ? 'text-gray-400' : value > 0 ? 'text-emerald-600' : 'text-red-600'; }
function formatDifference(value: number | null) { return value === null ? '—' : `${value > 0 ? '+' : ''}${formatNumber(value)}`; }
