import { useMemo, useState } from 'react';
import { useApp } from '../../../../state/AppContext';
import { useMovements } from '../../../../hooks/useMovements';
import { useProducts } from '../../../../hooks/useProducts';
import { useSuppliers } from '../../../../hooks/useSuppliers';
import { nextMovementId } from '../../../../../domain/rules/movementRules';
import { getErrorMessage } from '../../../../../shared/errors/getErrorMessage';
import type { Movement, MovementLine } from '../../../../../domain/entities/Movement';
import type { SupplierSnapshot } from '../../../../../domain/entities/Supplier';

export type DraftLine = {
  id: string;
  productId: string;
  quantity: string;
  unitId: string;
  locationId: string;
  batch: string;
  serial: string;
  expiryDate: string;
  unitCost: string;
};

const newLine = (): DraftLine => ({
  id: `line-${Date.now()}-${Math.random()}`,
  productId: '', quantity: '', unitId: '', locationId: '', batch: '', serial: '', expiryDate: '', unitCost: '',
});

export interface EntryHeaderData {
  documentType: string;
  documentSeries: string;
  documentNumber: string;
  motive: string;
  observations: string;
  requesterId: string;
  costCenterId: string;
}

const emptyHeader = (): EntryHeaderData => ({ documentType: '', documentSeries: '', documentNumber: '', motive: '', observations: '', requesterId: '', costCenterId: '' });

/**
 * Centraliza todo el estado y la lógica del formulario multidetalle de entradas (cabecera, líneas,
 * proveedor externo, evidencia y envío). La página queda como compositor: solo arma la UI a partir
 * de lo que este hook expone.
 */
export function useEntryForm() {
  const { state, showToast } = useApp();
  const { currentUser } = state;
  const { movements, registerMovement } = useMovements();
  const { products } = useProducts();
  const { suppliers } = useSuppliers();

  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [evidenceAdded, setEvidenceAdded] = useState(false);
  const [successMov, setSuccessMov] = useState<Movement | null>(null);
  const [selectedMov, setSelectedMov] = useState<Movement | null>(null);
  const [isExternalReceipt, setIsExternalReceipt] = useState(false);
  const [supplierId, setSupplierId] = useState('');
  const [supplierPickerOpen, setSupplierPickerOpen] = useState(false);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [header, setHeader] = useState(emptyHeader());
  const [lines, setLines] = useState<DraftLine[]>([newLine()]);

  const activeSuppliers = suppliers.filter(s => s.status === 'active');
  const filteredPickerSuppliers = useMemo(() => {
    const q = supplierSearch.toLowerCase();
    return activeSuppliers.filter(s => !q || s.name.toLowerCase().includes(q) || s.ruc.includes(q) || s.code.toLowerCase().includes(q) || (s.commercialName ?? '').toLowerCase().includes(q));
  }, [activeSuppliers, supplierSearch]);

  const entries = movements.filter(movement => movement.type === 'entrada');
  const totalCost = useMemo(() => lines.reduce((total, line) => {
    const product = products.find(item => item.id === line.productId);
    return total + Number(line.quantity || 0) * (Number(line.unitCost) || product?.avgCost || 0);
  }, 0), [lines, products]);
  const hasSensitiveLine = lines.some(line => products.find(product => product.id === line.productId)?.sensitiveMovement);

  function resetForm() {
    setHeader(emptyHeader());
    setLines([newLine()]);
    setEvidenceAdded(false);
    setIsExternalReceipt(false);
    setSupplierId('');
    setSupplierSearch('');
    setStep(0);
  }

  function openForm() {
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    resetForm();
  }

  function addLine() {
    setLines(prev => [...prev, newLine()]);
  }

  function removeLine(id: string) {
    setLines(prev => prev.filter(item => item.id !== id));
  }

  function updateLine(id: string, patch: Partial<DraftLine>) {
    setLines(prev => prev.map(line => line.id === id ? { ...line, ...patch } : line));
  }

  function selectLineProduct(id: string, productId: string) {
    const selected = products.find(item => item.id === productId);
    updateLine(id, { productId, unitId: selected?.unitId ?? '', unitCost: selected ? String(selected.avgCost) : '', batch: '', serial: '', expiryDate: '' });
  }

  function isLineValid(line: DraftLine) {
    const product = products.find(item => item.id === line.productId);
    if (!product || !line.locationId || !line.unitId || Number(line.quantity) <= 0) return false;
    if (product.requiresBatch && !line.batch.trim()) return false;
    if (product.requiresSerial && !line.serial.trim()) return false;
    if (product.requiresExpiry && !line.expiryDate) return false;
    return true;
  }

  function canContinue() {
    if (step === 0) {
      const baseOk = Boolean(header.documentType && header.documentNumber.trim());
      return baseOk && (!isExternalReceipt || Boolean(supplierId));
    }
    if (step === 1) return lines.length > 0 && lines.every(isLineValid);
    return true;
  }

  function selectSupplier(id: string) {
    setSupplierId(id);
    setSupplierPickerOpen(false);
    setSupplierSearch('');
  }

  function toggleExternalReceipt(checked: boolean) {
    setIsExternalReceipt(checked);
    if (!checked) setSupplierId('');
  }

  function buildMovement(status: Movement['status']): Movement {
    const detail: MovementLine[] = lines.map((line, index) => {
      const product = products.find(item => item.id === line.productId);
      const unitCost = Number(line.unitCost) || product?.avgCost || 0;
      const quantity = Number(line.quantity);
      return {
        id: `${index + 1}`,
        productId: line.productId,
        quantity,
        unitId: line.unitId,
        toLocationId: line.locationId,
        batch: line.batch || undefined,
        serial: line.serial || undefined,
        expiryDate: line.expiryDate || undefined,
        unitCost,
        totalCost: quantity * unitCost,
      };
    });
    const first = detail[0];
    return {
      id: nextMovementId(movements.length, new Date().getFullYear()),
      type: 'entrada', status,
      productId: first.productId,
      quantity: detail.reduce((total, line) => total + line.quantity, 0),
      unitId: first.unitId,
      toLocationId: first.toLocationId,
      unitCost: first.unitCost,
      totalCost: detail.reduce((total, line) => total + (line.totalCost ?? 0), 0),
      documentType: header.documentType,
      documentSeries: header.documentSeries || undefined,
      documentNumber: header.documentNumber,
      motive: header.motive || undefined,
      observations: header.observations || undefined,
      requesterId: header.requesterId || undefined,
      costCenterId: header.costCenterId || undefined,
      registeredBy: currentUser?.id ?? 'u1',
      createdAt: new Date().toLocaleString('es-PE'),
      confirmedAt: status === 'confirmado' ? new Date().toLocaleString('es-PE') : undefined,
      isSensitive: hasSensitiveLine,
      sensitiveLevel: hasSensitiveLine ? 2 : undefined,
      lines: detail,
      version: 1,
      isExternalReceipt: isExternalReceipt || undefined,
      supplierId: isExternalReceipt && supplierId ? supplierId : undefined,
      supplierSnapshot: (() => {
        if (!isExternalReceipt || !supplierId) return undefined;
        const s = suppliers.find(sup => sup.id === supplierId);
        if (!s) return undefined;
        const snap: SupplierSnapshot = { id: s.id, code: s.code, ruc: s.ruc, name: s.name };
        return snap;
      })(),
    };
  }

  async function handleSubmit(asDraft = false) {
    if (!asDraft && (!lines.every(isLineValid) || !state.networkOnline)) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 550));
    const status: Movement['status'] = asDraft ? 'borrador' : hasSensitiveLine ? 'pendiente_autorizacion' : 'confirmado';
    const movement = buildMovement(status);
    try {
      await registerMovement(movement);
    } catch (error) {
      showToast('error', getErrorMessage(error));
      setLoading(false);
      return;
    }
    setLoading(false);
    setShowForm(false);
    resetForm();
    if (asDraft) showToast('info', `Borrador ${movement.id} guardado sin afectar el stock.`);
    else setSuccessMov(movement);
  }

  return {
    // datos de referencia locales al formulario
    entries,
    activeSuppliers,
    filteredPickerSuppliers,
    totalCost,
    hasSensitiveLine,
    networkOnline: state.networkOnline,
    // estado del wizard
    showForm, openForm, closeForm,
    step, setStep,
    loading,
    evidenceAdded, setEvidenceAdded,
    successMov, setSuccessMov,
    selectedMov, setSelectedMov,
    isExternalReceipt, toggleExternalReceipt,
    supplierId, selectSupplier,
    supplierPickerOpen, setSupplierPickerOpen,
    supplierSearch, setSupplierSearch,
    header, setHeader,
    lines, addLine, removeLine, updateLine, selectLineProduct, isLineValid,
    canContinue,
    handleSubmit,
  };
}

export type EntryForm = ReturnType<typeof useEntryForm>;
