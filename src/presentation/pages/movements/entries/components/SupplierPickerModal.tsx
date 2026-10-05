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
  <Modal
    open={open}
    onClose={onClose}
    title="Seleccionar proveedor"
    size="md"
  >
    <div className="space-y-4">

      <div className="relative">

        <SearchIcon
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre, RUC o código…"
          autoFocus
          className="
            w-full
            h-10
            pl-9 pr-3
            rounded-lg
            border border-gray-200
            bg-gray-50/60
            text-sm text-gray-700
            placeholder:text-gray-400
            outline-none
            focus:bg-white
            focus:border-[#3B7597]
            focus:ring-2 focus:ring-[#3B7597]/10
            transition-all
          "
        />

      </div>


      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">

        {suppliers.length === 0 && (

          <div className="py-8 text-center">

            <div className="text-sm text-gray-400">
              Sin resultados para "{search}"
            </div>

          </div>

        )}


        {suppliers.map(s => (

          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            className={`
              w-full
              flex items-start gap-3
              p-3.5
              rounded-xl
              border
              text-left
              transition-all
              ${
                s.id === selectedId
                  ? 'border-[#3B7597] bg-[#3B7597]/[0.06] shadow-sm'
                  : 'border-gray-200 bg-white hover:border-[#6FD1D7] hover:bg-gray-50/70'
              }
            `}
          >

            <div
              className={`
                w-9 h-9
                rounded-lg
                flex items-center justify-center
                flex-shrink-0
                mt-0.5
                text-xs font-bold
                ${
                  s.id === selectedId
                    ? 'bg-[#3B7597]/10 text-[#3B7597]'
                    : 'bg-[#093C5D]/[0.06] text-[#3B7597]'
                }
              `}
            >
              {s.code.replace('PROV-', '')}
            </div>


            <div className="min-w-0 flex-1">

              <div className="font-semibold text-sm text-[#093C5D] truncate">
                {s.name}
              </div>

              {s.commercialName && (

                <div className="text-xs text-gray-400 truncate mt-0.5">
                  {s.commercialName}
                </div>

              )}

              <div className="text-xs text-gray-400 font-mono mt-1">
                RUC {s.ruc} · {s.code}
              </div>

            </div>


            {s.id === selectedId && (

              <div className="w-7 h-7 rounded-full bg-[#3B7597]/10 flex items-center justify-center flex-shrink-0 mt-1">

                <CheckIcon
                  size={14}
                  className="text-[#3B7597]"
                />

              </div>

            )}

          </button>

        ))}

      </div>


      {selectedId && (

        <div className="pt-2 border-t border-gray-100">

          <button
            type="button"
            onClick={onClear}
            className="w-full text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg py-2 transition-colors"
          >
            Quitar selección
          </button>

        </div>

      )}

    </div>
  </Modal>
);
}
