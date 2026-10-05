import type { Dispatch, SetStateAction } from 'react';
import { useApp } from '../../../../state/AppContext';
import { useSuppliers } from '../../../../hooks/useSuppliers';
import { Input, SearchIcon, Select, Textarea } from '../../../../components/ui';
import type { Supplier } from '../../../../../domain/entities/Supplier';
import type { EntryHeaderData } from '../hooks/useEntryForm';
import { ENTRY_DOC_TYPES } from '../constants';

export interface EntryHeaderStepProps {
  header: EntryHeaderData;
  setHeader: Dispatch<SetStateAction<EntryHeaderData>>;
  isExternalReceipt: boolean;
  onToggleExternalReceipt: (checked: boolean) => void;
  supplierId: string;
  onSelectSupplier: (id: string) => void;
  onOpenSupplierPicker: () => void;
  activeSuppliers: readonly Supplier[];
}

export function EntryHeaderStep({
  header, setHeader, isExternalReceipt, onToggleExternalReceipt,
  supplierId, onSelectSupplier, onOpenSupplierPicker, activeSuppliers,
}: EntryHeaderStepProps) {
  const { state } = useApp();
  const { costCenters, responsibles } = state;
  const { suppliers } = useSuppliers();
  const selectedSupplier = suppliers.find(s => s.id === supplierId);

return (
  <div className="space-y-5">

    <div>
      <h3 className="font-semibold text-[#093C5D]">
        Cabecera del movimiento
      </h3>

      <p className="text-xs text-gray-500 mt-1">
        El documento y el responsable se comparten entre todas las líneas.
      </p>
    </div>


    <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50/60 cursor-pointer hover:bg-gray-100 transition-colors">

      <input
        type="checkbox"
        checked={isExternalReceipt}
        onChange={e => onToggleExternalReceipt(e.target.checked)}
        className="w-4 h-4 mt-0.5 accent-[#3B7597]"
      />

      <div className="min-w-0">

        <div className="text-sm font-semibold text-[#093C5D]">
          Recepción externa
        </div>

        <div className="text-xs text-gray-400 mt-0.5">
          Entrada proveniente de un proveedor externo. Requiere seleccionar proveedor.
        </div>

      </div>

    </label>


    {isExternalReceipt && (

      <div className="rounded-xl border border-[#3B7597]/15 bg-[#3B7597]/[0.03] p-4">

        <div className="hidden md:block">

          <Select
            label="Proveedor *"
            value={supplierId}
            onChange={e => onSelectSupplier(e.target.value)}
          >
            <option value="">
              Seleccione proveedor…
            </option>

            {activeSuppliers.map(s => (

              <option
                key={s.id}
                value={s.id}
              >
                {s.code} — {s.name}
                {s.commercialName ? ` (${s.commercialName})` : ''}
                {' · '}
                RUC {s.ruc}
              </option>

            ))}

          </Select>

        </div>


        <div className="md:hidden">

          <div className="text-xs font-medium text-gray-600 mb-1.5">
            Proveedor *
          </div>

          <button
            type="button"
            onClick={onOpenSupplierPicker}
            className={`
              w-full
              flex items-center justify-between
              gap-3
              p-3
              rounded-xl
              border
              text-left
              transition-all
              ${
                supplierId
                  ? 'border-[#3B7597] bg-white shadow-sm'
                  : 'border-gray-300 bg-white hover:border-[#3B7597]'
              }
            `}
          >

            {selectedSupplier ? (

              <div className="min-w-0">

                <div className="font-semibold text-sm text-[#093C5D] truncate">
                  {selectedSupplier.name}
                </div>

                <div className="text-xs text-gray-400 font-mono mt-0.5">
                  {selectedSupplier.code} · RUC {selectedSupplier.ruc}
                </div>

              </div>

            ) : (

              <span className="text-sm text-gray-400">
                Toque para seleccionar proveedor…
              </span>

            )}

            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
              <SearchIcon
                size={15}
                className="text-gray-400"
              />
            </div>

          </button>

        </div>


        {activeSuppliers.length === 0 && (

          <p className="text-xs text-amber-600 mt-2">
            No hay proveedores activos. Cree uno en Catálogo → Proveedores.
          </p>

        )}

      </div>

    )}


    <div className="rounded-xl border border-gray-200 bg-white p-4">

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <Select
          label="Tipo de documento"
          value={header.documentType}
          onChange={event =>
            setHeader(prev => ({
              ...prev,
              documentType: event.target.value
            }))
          }
        >
          <option value="">
            Seleccione…
          </option>

          {ENTRY_DOC_TYPES.map(type => (
            <option key={type}>
              {type}
            </option>
          ))}

        </Select>


        <Input
          label="Serie"
          value={header.documentSeries}
          onChange={event =>
            setHeader(prev => ({
              ...prev,
              documentSeries: event.target.value
            }))
          }
          placeholder="F001"
        />


        <Input
          label="Número / Referencia *"
          value={header.documentNumber}
          onChange={event =>
            setHeader(prev => ({
              ...prev,
              documentNumber: event.target.value
            }))
          }
          placeholder="000145"
        />

      </div>

    </div>


    <div className="rounded-xl border border-gray-200 bg-white p-4">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Select
          label="Responsable"
          value={header.requesterId}
          onChange={event =>
            setHeader(prev => ({
              ...prev,
              requesterId: event.target.value
            }))
          }
        >

          <option value="">
            Seleccione…
          </option>

          {responsibles.map(item => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.name}
            </option>
          ))}

        </Select>


        <Select
          label="Centro de costo"
          value={header.costCenterId}
          onChange={event =>
            setHeader(prev => ({
              ...prev,
              costCenterId: event.target.value
            }))
          }
        >

          <option value="">
            Seleccione…
          </option>

          {costCenters.map(item => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.code} — {item.name}
            </option>
          ))}

        </Select>

      </div>

    </div>


    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">

      <Input
        label="Motivo"
        value={header.motive}
        onChange={event =>
          setHeader(prev => ({
            ...prev,
            motive: event.target.value
          }))
        }
      />


      <Textarea
        label="Observaciones"
        value={header.observations}
        onChange={event =>
          setHeader(prev => ({
            ...prev,
            observations: event.target.value
          }))
        }
      />

    </div>

  </div>
);
}
