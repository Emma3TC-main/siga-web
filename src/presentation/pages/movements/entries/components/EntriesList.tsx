import { Button, EmptyState, EyeIcon, MovementStatusBadge, PackageIcon, TableActionButton } from '../../../../components/ui';
import type { Movement } from '../../../../../domain/entities/Movement';

export interface EntriesListProps {
  entries: readonly Movement[];
  onView: (id: string) => void;
  onNewEntry: () => void;
}

export function EntriesList({ entries, onView, onNewEntry }: EntriesListProps) {
  return (
  <>
    {/* Desktop: table view */}
    <div className="hidden md:block overflow-x-auto">

      <table className="w-full min-w-[980px] border-collapse">

        <thead className="bg-gray-50 border-y border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              ID
            </th>

            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Código
            </th>

            <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Referencia
            </th>

            <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Centro de costo
            </th>

            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Documento
            </th>

            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Registrado por
            </th>

            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Fecha
            </th>

            <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Estado
            </th>

            <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Acciones
            </th>
          </tr>
        </thead>


        <tbody className="divide-y divide-gray-100 bg-white">

          {entries.map(movement => {

            return (

              <tr
                key={movement.id}
                className="hover:bg-emerald-50/30 transition-colors"
              >

                <td className="px-4 py-3">
                  <span className="font-mono text-xs font-medium text-[#3B7597]">
                    {movement.id}
                  </span>
                </td>


                <td className="px-4 py-3">

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <PackageIcon
                        size={15}
                        className="text-emerald-600"
                      />
                    </div>

                    <div className="min-w-0">

                      <div className="font-semibold text-sm text-[#093C5D] max-w-[220px] truncate">
                        {movement.movementCode ?? movement.documentNumber}
                      </div>

                      <div className="text-xs text-gray-400 max-w-[220px] truncate mt-0.5">
                        Entrada de inventario
                      </div>

                    </div>

                  </div>

                </td>


                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-bold text-[#093C5D] tabular-nums">
                    {movement.referenceDocType ?? '—'} {movement.referenceDocNumber ?? ''}
                  </span>
                </td>


                <td className="px-4 py-3 text-right">

                  <span className="text-xs font-semibold text-gray-700 tabular-nums">
                    {movement.costCenterNameSnapshot ?? movement.costCenterId ?? '—'}
                  </span>

                </td>


                <td className="px-4 py-3">

                  <div className="text-xs font-medium text-gray-700">
                    {movement.motive ?? '—'}
                  </div>

                  <div className="font-mono text-[10px] text-gray-400 mt-0.5">
                    {movement.isSensitive ? 'Sensible' : 'Estándar'}
                  </div>

                </td>


                <td className="px-4 py-3">

                  <span className="text-xs text-gray-600 max-w-[140px] truncate block">
                    {movement.registeredBy}
                  </span>

                </td>


                <td className="px-4 py-3">

                  <span className="text-xs font-mono text-gray-500">
                    {movement.createdAt.split(',')[0]}
                  </span>

                </td>


                <td className="px-4 py-3 text-center">

                  <MovementStatusBadge
                    status={movement.status}
                  />

                </td>


                <td className="px-4 py-3 text-center">

                  <TableActionButton
                    icon={<EyeIcon size={14} />}
                    label={`Ver ${movement.id}`}
                    onClick={() => onView(movement.id)}
                  />

                </td>

              </tr>

            );

          })}

        </tbody>

      </table>

    </div>


    {/* Mobile: card list */}
    <div className="md:hidden p-4 space-y-3">

      {entries.map(movement => {

        return (

          <button
            key={movement.id}
            onClick={() => onView(movement.id)}
            className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-left hover:shadow-md hover:border-emerald-200 transition-all"
          >

            <div className="flex items-start justify-between gap-3">

              <div className="flex gap-3 min-w-0">

                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">

                  <PackageIcon
                    size={16}
                    className="text-emerald-600"
                  />

                </div>


                <div className="min-w-0">

                  <div className="font-mono text-[10px] text-[#3B7597]">
                    {movement.id}
                  </div>

                  <div className="font-semibold text-sm text-[#093C5D] mt-0.5 truncate">
                    {movement.movementCode ?? movement.documentNumber}
                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    {movement.referenceDocType ?? 'Sin referencia'} {movement.referenceDocNumber ?? ''}
                  </div>

                </div>

              </div>


              <MovementStatusBadge
                status={movement.status}
              />

            </div>


            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">

              <span className="text-gray-400 font-mono">
                {movement.createdAt.split(',')[0]}
              </span>

              <strong className="text-[#093C5D]">
                {movement.costCenterNameSnapshot ?? movement.costCenterId ?? 'Sin centro de costo'}
              </strong>

            </div>

          </button>

        );

      })}

    </div>


    {entries.length === 0 && (

      <div className="py-8">

        <EmptyState
          icon={<PackageIcon size={48} />}
          title="No hay entradas registradas"
          description="Registre una entrada con uno o más productos."
          action={
            <Button
              size="sm"
              onClick={onNewEntry}
            >
              Nueva entrada
            </Button>
          }
        />

      </div>

    )}

  </>
);
}
