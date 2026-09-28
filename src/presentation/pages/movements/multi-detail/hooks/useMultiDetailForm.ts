import { useMemo, useState } from 'react';
import { useApp } from '../../../../state/AppContext';
import { useMovements } from '../../../../hooks/useMovements';
import { useStock } from '../../../../hooks/useStock';
import { useProducts } from '../../../../hooks/useProducts';
import { nextMovementId } from '../../../../../domain/rules/movementRules';
import { getErrorMessage } from '../../../../../shared/errors/getErrorMessage';
import { formatNumber } from '../../../../components/ui';
import type { Movement, MovementLine, MovementType } from '../../../../../domain/entities/Movement';
import { MODE_CONFIG, type MovementMode } from '../constants';

export type DraftLine = {
  id: string;
  productId: string;
  quantity: string;
  unitId: string;
  fromLocationId: string;
  toLocationId: string;
  batch: string;
  serial: string;
  expiryDate: string;
};

const makeLine = (): DraftLine => ({
  id: `line-${Date.now()}-${Math.random()}`,
  productId: '', quantity: '', unitId: '', fromLocationId: '', toLocationId: '', batch: '', serial: '', expiryDate: '',
});

export interface MultiDetailHeaderData {
  adjustmentType: string;
  documentType: string;
  documentNumber: string;
  requesterId: string;
  costCenterId: string;
  motive: string;
  observations: string;
}

const emptyHeader = (mode: MovementMode): MultiDetailHeaderData => ({
  adjustmentType: 'ajuste_negativo',
  documentType: mode === 'adjustment' ? 'Acta' : '',
  documentNumber: '',
  requesterId: '',
  costCenterId: '',
  motive: '',
  observations: '',
});

/**
 * Centraliza todo el estado y la lógica del formulario multidetalle compartido por Salidas,
 * Transferencias y Ajustes (cabecera, líneas, evidencia y envío). La página (MultiDetailMovement,
 * usada por Exits/Transfers/Adjustments) queda como compositor puro: solo arma la UI a partir de
 * lo que este hook expone.
 */
export function useMultiDetailForm(mode: MovementMode) {
  const { state, showToast } = useApp();
  const { currentUser } = state;
  const { movements: allMovements, registerMovement } = useMovements();
  const { stock: allStock } = useStock();
  const { products } = useProducts();

  const config = MODE_CONFIG[mode];

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [evidenceAdded, setEvidenceAdded] = useState(false);
  const [success, setSuccess] = useState<Movement | null>(null);
  const [selected, setSelected] = useState<Movement | null>(null);
  const [header, setHeader] = useState<MultiDetailHeaderData>(emptyHeader(mode));
  const [lines, setLines] = useState<DraftLine[]>([makeLine()]);

  const movements = allMovements.filter(movement => config.types.includes(movement.type));
  const effectiveType: MovementType = mode === 'adjustment' ? header.adjustmentType as MovementType : mode === 'exit' ? 'salida' : 'transferencia';
  const requiresStock = effectiveType === 'salida' || effectiveType === 'transferencia' || effectiveType === 'ajuste_negativo';
  const requiresEvidence = effectiveType === 'ajuste_negativo';

  function currentAverageCost(productId: string) {
    const entries = allStock.filter(stock => stock.productId === productId && stock.quantity > 0);
    const quantity = entries.reduce((total, stock) => total + stock.quantity, 0);
    return quantity > 0 ? entries.reduce((total, stock) => total + stock.quantity * stock.avgCost, 0) / quantity : products.find(product => product.id === productId)?.avgCost ?? 0;
  }

  const totalCost = useMemo(() => lines.reduce((total, line) => total + Number(line.quantity || 0) * currentAverageCost(line.productId), 0), [lines, products, allStock]);
  const sensitive = mode === 'adjustment' || totalCost >= 5000 || lines.some(line => products.find(product => product.id === line.productId)?.sensitiveMovement);

  function reset() {
    setHeader(emptyHeader(mode));
    setLines([makeLine()]);
    setEvidenceAdded(false);
    setStep(0);
  }

  function openForm() {
    setOpen(true);
  }

  function closeForm() {
    setOpen(false);
    reset();
  }

  function addLine() {
    setLines(previous => [...previous, makeLine()]);
  }

  function removeLine(id: string) {
    setLines(previous => previous.filter(item => item.id !== id));
  }

  function updateLine(id: string, patch: Partial<DraftLine>) {
    setLines(previous => previous.map(line => line.id === id ? { ...line, ...patch } : line));
  }

  function availableStock(line: DraftLine) {
    return allStock.filter(stock => stock.productId === line.productId && stock.locationId === line.fromLocationId).reduce((total, stock) => total + stock.quantity, 0);
  }

  function lineError(line: DraftLine) {
    const product = products.find(item => item.id === line.productId);
    if (!product) return 'Seleccione un producto.';
    if (Number(line.quantity) <= 0) return 'Ingrese una cantidad mayor que cero.';
    if (!line.unitId) return 'Seleccione la unidad.';
    if (requiresStock && !line.fromLocationId) return 'Seleccione la ubicación de origen.';
    if (!requiresStock && !line.toLocationId) return 'Seleccione la ubicación del ajuste positivo.';
    if (effectiveType === 'transferencia' && !line.toLocationId) return 'Seleccione la ubicación de destino.';
    if (effectiveType === 'transferencia' && line.fromLocationId === line.toLocationId) return 'Origen y destino no pueden coincidir.';
    if (product.requiresBatch && !line.batch.trim()) return 'El lote o colada es obligatorio.';
    if (product.requiresSerial && !line.serial.trim()) return 'El número de serie es obligatorio.';
    if (product.requiresExpiry && effectiveType === 'ajuste_positivo' && !line.expiryDate) return 'La fecha de vencimiento es obligatoria.';
    if (requiresStock) {
      const requested = lines.filter(item => item.productId === line.productId && item.fromLocationId === line.fromLocationId).reduce((total, item) => total + Number(item.quantity || 0), 0);
      const available = availableStock(line);
      if (requested > available) return `409 CONFLICT · Disponible ${formatNumber(available)}, solicitado ${formatNumber(requested)} en estas líneas.`;
    }
    return '';
  }

  function canContinue() {
    if (step === 0) return Boolean(header.documentType && header.documentNumber.trim() && header.motive.trim());
    if (step === 1) return lines.length > 0 && lines.every(line => !lineError(line));
    if (step === 2) return !requiresEvidence || evidenceAdded;
    return true;
  }

  function buildMovement(status: Movement['status']): Movement {
    const detail: MovementLine[] = lines.map((line, index) => {
      return {
        id: `${index + 1}`,
        productId: line.productId,
        quantity: Number(line.quantity),
        unitId: line.unitId,
        fromLocationId: requiresStock ? line.fromLocationId : undefined,
        toLocationId: effectiveType === 'transferencia' || effectiveType === 'ajuste_positivo' ? line.toLocationId : undefined,
        batch: line.batch || undefined,
        serial: line.serial || undefined,
        expiryDate: line.expiryDate || undefined,
        unitCost: currentAverageCost(line.productId),
        totalCost: Number(line.quantity) * currentAverageCost(line.productId),
      };
    });
    const first = detail[0];
    return {
      id: nextMovementId(allMovements.length, new Date().getFullYear()),
      type: effectiveType,
      status,
      productId: first.productId,
      quantity: detail.reduce((total, line) => total + line.quantity, 0),
      unitId: first.unitId,
      fromLocationId: first.fromLocationId,
      toLocationId: first.toLocationId,
      unitCost: first.unitCost,
      totalCost: detail.reduce((total, line) => total + (line.totalCost ?? 0), 0),
      documentType: header.documentType,
      documentNumber: header.documentNumber,
      requesterId: header.requesterId || undefined,
      costCenterId: header.costCenterId || undefined,
      motive: header.motive,
      observations: header.observations || undefined,
      evidenceIds: evidenceAdded ? [`evidence-${Date.now()}`] : undefined,
      registeredBy: currentUser?.id ?? 'u1',
      createdAt: new Date().toLocaleString('es-PE'),
      confirmedAt: status === 'confirmado' ? new Date().toLocaleString('es-PE') : undefined,
      sensitiveLevel: sensitive ? mode === 'adjustment' ? 3 : 2 : undefined,
      isSensitive: sensitive,
      lines: detail,
      version: 1,
    };
  }

  async function submit(asDraft = false) {
    if (!asDraft && (!canContinue() || !state.networkOnline)) return;
    if (!lines[0]?.productId) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 550));
    const status: Movement['status'] = asDraft ? 'borrador' : sensitive ? 'pendiente_autorizacion' : 'confirmado';
    const movement = buildMovement(status);
    try {
      await registerMovement(movement);
    } catch (error) {
      showToast('error', getErrorMessage(error));
      setLoading(false);
      return;
    }
    setLoading(false);
    setOpen(false);
    reset();
    if (asDraft) showToast('info', `Borrador ${movement.id} guardado sin afectar inventario.`);
    else setSuccess(movement);
  }

  return {
    config,
    movements,
    networkOnline: state.networkOnline,
    open, openForm, closeForm,
    step, setStep,
    loading,
    evidenceAdded, setEvidenceAdded,
    success, setSuccess,
    selected, setSelected,
    header, setHeader,
    lines, addLine, removeLine, updateLine,
    availableStock, lineError, currentAverageCost,
    requiresStock, requiresEvidence, effectiveType,
    totalCost, sensitive,
    canContinue,
    submit,
  };
}

export type MultiDetailForm = ReturnType<typeof useMultiDetailForm>;
