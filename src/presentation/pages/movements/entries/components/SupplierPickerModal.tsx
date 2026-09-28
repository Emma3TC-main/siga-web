import { CheckIcon, Modal, SearchIcon } from '../../../../components/ui';
import type { Supplier } from '../../../../../domain/entities/Supplier';

export interface SupplierPickerModalProps {
  open: boolean;
  onClose: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  suppliers: readonly Supplier[];
  selectedId: string;
  onSelect: (id: string) => void;
  onClear: () => void;
}

export function SupplierPickerModal({ open, onClose, search, onSearchChange, suppliers, selectedId, onSelect, onClear }: SupplierPickerModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Seleccionar proveedor" size="md">
      <div className="space-y-3">
        <div className="relative">
          <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, RUC o código…"
            autoFocus
            className="siga-input pl-8 text-sm"
          />
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {suppliers.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">Sin resultados para "{search}"</p>
          )}
          {suppliers.map(s => (
            <button key={s.id} type="button"
              onClick={() => onSelect(s.id)}
              className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${s.id === selectedId ? 'border-[#3B7597] bg-[#3B7597]/8' : 'border-gray-200 hover:border-[#6FD1D7] hover:bg-gray-50'}`}>
              <div className="w-8 h-8 rounded-lg bg-[#093C5D]/8 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-[#3B7597]">
                {s.code.replace('PROV-', '')}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm text-[#093C5D] truncate">{s.name}</div>
                {s.commercialName && <div className="text-xs text-gray-400 truncate">{s.commercialName}</div>}
                <div className="text-xs text-gray-400 font-mono mt-0.5">RUC {s.ruc} · {s.code}</div>
              </div>
              {s.id === selectedId && <CheckIcon size={16} className="flex-shrink-0 text-[#3B7597] mt-1" />}
            </button>
          ))}
        </div>
        {selectedId && (
          <button type="button" onClick={onClear}
            className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors py-1">
            Quitar selección
          </button>
        )}
      </div>
    </Modal>
  );
}
