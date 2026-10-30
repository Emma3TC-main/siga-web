import { useMemo, useState } from 'react';
import { useApp } from '../../../../state/AppContext';
import { useMovements } from '../../../../hooks/useMovements';
import { useProducts } from '../../../../hooks/useProducts';
import { useSuppliers } from '../../../../hooks/useSuppliers';
import { nextMovementId, supportsMovementUnit } from '../../../../../domain/rules/movementRules';
import { getErrorMessage } from '../../../../../shared/errors/getErrorMessage';
import type { Movement, MovementLine } from '../../../../../domain/entities/Movement';
import type { SupplierSnapshot } from '../../../../../domain/entities/Supplier';
import { evidenceUseCases } from '../../../../../app/compositionRoot';

export type DraftLine = {
  id: string;
  productId: string;
  quantity: string;
  unitId: string;
  locationId: string;
  batch: string;
  serial: string;
  lotSource?: 'canonical' | 'demo';
  assetSource?: 'canonical' | 'demo';
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
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidenceKey, setEvidenceKey] = useState<string | null>(null);
  const [pendingEvidenceOwnerId, setPendingEvidenceOwnerId] = useState<string | null>(null);
  const [successMov, setSuccessMov] = useState<Movement | null>(null);
  const [selectedMov, setSelectedMov] = useState<Movement | null>(null);
  const [isExternalReceipt, setIsExternalReceipt] = useState(false);
  const [supplierId, setSupplierId] = useState('');
  const [supplierPickerOpen, setSupplierPickerOpen] = useState(false);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [header, setHeader] = useState(emptyHeader());
  const [lines, setLines] = useState<DraftLine[]>([newLine()]);

  const activeSuppliers = suppliers.filter(s => s.active);
  const filteredPickerSuppliers = useMemo(() => {
    const q = supplierSearch.toLowerCase();
    return activeSuppliers.filter(s => !q || s.businessName.toLowerCase().includes(q) || s.taxId.includes(q) || s.code.toLowerCase().includes(q) || (s.tradeName ?? '').toLowerCase().includes(q));
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
    setEvidenceFile(null);
    setEvidenceKey(null);
    setPendingEvidenceOwnerId(null);
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
    setLines(prev => prev.map(line => {
      if (line.id !== id) return line;
      const updated = { ...line, ...patch };
      if (patch.batch !== undefined && patch.batch !== line.batch) {
        updated.serial = '';
        updated.assetSource = undefined;
      }
      return updated;
    }));
  }

  function selectLineProduct(id: string, productId: string) {
    const selected = products.find(item => item.id === productId);
    const current = lines.find(item => item.id === id);
    const previousUnitInvalid = Boolean(
      selected && current?.unitId && !supportsMovementUnit(selected, current.unitId)
    );
    const selectedDefault = selected?.unitId && supportsMovementUnit(selected, selected.unitId)
      ? selected.unitId
      : '';
    const nextUnitId = previousUnitInvalid
      ? ''
      : current?.unitId && selected && supportsMovementUnit(selected, current.unitId)
        ? current.unitId
        : selectedDefault;
    updateLine(id, {
      productId,
      unitId: nextUnitId,
      unitCost: selected ? String(selected.avgCost) : '',
      batch: '',
      serial: '',
      lotSource: undefined,
      assetSource: undefined,
      expiryDate: '',
    });
    if (previousUnitInvalid) {
      showToast('warning', 'La unidad anterior fue removida porque no es compatible con el producto seleccionado.');
    }
  }

  function isLineValid(line: DraftLine) {
    const product = products.find(item => item.id === line.productId);
    if (!product || !line.locationId || !line.unitId || Number(line.quantity) <= 0) return false;
    if (!supportsMovementUnit(product, line.unitId)) return false;

    const lotIdRequired = product.requiresBatch || product.requiresColada || product.requiresExpiry;
    if (lotIdRequired && !line.batch?.trim()) return false;
    if (product.requiresSerial && (!line.serial?.trim() || Number(line.quantity) !== 1)) return false;
    if (product.requiresExpiry && !line.expiryDate) return false;

    return true;
  }

  function traceabilityBlockReason(line: DraftLine): string | null {
    return null;
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
        lotSource: line.lotSource,
        assetSource: line.assetSource,
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
        const snap: SupplierSnapshot = { id: s.id, code: s.code, ruc: s.taxId, name: s.businessName };
        return snap;
      })(),
    };
  }

  async function handleSubmit(asDraft = false) {
    if (pendingEvidenceOwnerId && evidenceFile && evidenceKey) {
      setLoading(true);
      try {
        await evidenceUseCases.uploadMovement(pendingEvidenceOwnerId, evidenceFile, evidenceKey);
        showToast('success', 'Evidencia cargada correctamente.');
        setLoading(false);
        setShowForm(false);
        resetForm();
      } catch (error) {
        showToast('error', 'No se pudo cargar la evidencia. Puede reintentarlo sin duplicar el movimiento.');
        setLoading(false);
      }
      return;
    }
    const invalidUnit = lines.some(line => {
      const product = products.find(item => item.id === line.productId);
      return !product || !line.unitId || !supportsMovementUnit(product, line.unitId);
    });
    if (invalidUnit) {
      showToast('error', 'Selecciona una unidad compatible para cada producto antes de registrar el movimiento.');
      return;
    }
    const traceabilityBlock = lines.map(traceabilityBlockReason).find(Boolean);
    if (traceabilityBlock) {
      showToast('error', traceabilityBlock);
      return;
    }
    if (!asDraft && (!lines.every(isLineValid) || !state.networkOnline)) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 550));
    const status: Movement['status'] = asDraft ? 'borrador' : 'confirmado';
    const movement = buildMovement(status);
    let finalMovement = movement;
    try {
      const result = await registerMovement(movement);
      if (result && result.outcome === 'registered') {
        finalMovement = result.movement;
        if (evidenceFile) {
          try {
            await evidenceUseCases.uploadMovement(finalMovement.id, evidenceFile, evidenceKey ?? crypto.randomUUID());
          } catch (error) {
            setPendingEvidenceOwnerId(finalMovement.id);
            showToast('error', 'El movimiento se registró, pero no se pudo cargar la evidencia. Puede reintentarlo sin duplicarlo.');
            setLoading(false);
            return;
          }
        }
      }
    } catch (error) {
      showToast('error', getErrorMessage(error));
      setLoading(false);
      return;
    }
    setLoading(false);
    setShowForm(false);
    resetForm();
    if (asDraft) showToast('info', `Borrador ${finalMovement.id} guardado sin afectar el stock.`);
    else setSuccessMov(finalMovement);
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
    evidenceAdded, setEvidenceAdded, evidenceFile,
    setEvidenceFile: (file: File | null) => { setEvidenceFile(file); setEvidenceAdded(Boolean(file)); setEvidenceKey(file ? crypto.randomUUID() : null); },
    pendingEvidenceOwnerId,
    successMov, setSuccessMov,
    selectedMov, setSelectedMov,
    isExternalReceipt, toggleExternalReceipt,
    supplierId, selectSupplier,
    supplierPickerOpen, setSupplierPickerOpen,
    supplierSearch, setSupplierSearch,
    header, setHeader,
    lines, addLine, removeLine, updateLine, selectLineProduct, isLineValid, traceabilityBlockReason,
    canContinue,
    handleSubmit,
  };
}

export type EntryForm = ReturnType<typeof useEntryForm>;
