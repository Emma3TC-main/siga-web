import type { Supplier } from '../../../../../domain/entities/Supplier';
import { Badge, Button, EmptyState, SearchIcon, EyeIcon, EditIcon, CheckIcon, XIcon, TableActionButton } from '../../../../components/ui';

interface SuppliersTableProps {
  suppliers: Supplier[];
  search: string;
  canCreate: boolean;
  canEdit: boolean;
  onOpenNew: () => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleStatusRequest: (id: string) => void;
}

export function SuppliersTable({ suppliers, search, canCreate, canEdit, onOpenNew, onView, onEdit, onToggleStatusRequest }: SuppliersTableProps) {
  return (
    <div className="flex-1 overflow-auto">
      {/* Table — desktop */}
      <div className="hidden md:block">
        <table className="siga-table min-w-[960px]">
          <thead>
            <tr>
              <th>Código</th>
              <th>RUC</th>
              <th>Razón social</th>
              <th>Nombre comercial</th>
              <th>Contacto</th>
              <th>Correo</th>
              <th className="text-center">Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(s => (
              <tr key={s.id}>
                <td className="font-mono text-xs text-[#3B7597]">{s.code}</td>
                <td className="font-mono text-xs">{s.ruc}</td>
                <td>
                  <div className="font-medium text-sm max-w-[200px] truncate">{s.name}</div>
                </td>
                <td className="text-xs text-gray-500 max-w-[160px] truncate">{s.commercialName || '—'}</td>
                <td className="text-xs max-w-[140px] truncate">
                  <div className="truncate">{s.contact}</div>
                  <div className="text-gray-400">{s.phone}</div>
                </td>
                <td className="text-xs text-gray-500 max-w-[180px] truncate">{s.email}</td>
                <td className="text-center">
                  <Badge variant={s.status === 'active' ? 'success' : 'muted'}>
                    {s.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>
                <td className="text-center">
                  <div className="flex gap-1 justify-center">
                    <TableActionButton icon={<EyeIcon size={14} />} label="Ver detalle" onClick={() => onView(s.id)} />
                    {canEdit && <TableActionButton icon={<EditIcon size={14} />} label="Editar" onClick={() => onEdit(s.id)} />}
                    {canEdit && (
                      <TableActionButton
                        icon={s.status === 'active' ? <XIcon size={14} /> : <CheckIcon size={14} />}
                        label={s.status === 'active' ? 'Desactivar' : 'Activar'}
                        variant={s.status === 'active' ? 'warning' : 'success'}
                        onClick={() => onToggleStatusRequest(s.id)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden p-4 space-y-3">
        {suppliers.map(s => (
          <button key={s.id} onClick={() => onView(s.id)} className="siga-card w-full p-4 text-left">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-mono text-xs text-[#3B7597]">{s.code}</div>
                <div className="font-semibold text-sm text-[#093C5D] mt-0.5 truncate">{s.name}</div>
                <div className="text-xs text-gray-400 truncate">RUC: {s.ruc} · {s.contact}</div>
              </div>
              <Badge variant={s.status === 'active' ? 'success' : 'muted'}>
                {s.status === 'active' ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          </button>
        ))}
      </div>

      {suppliers.length === 0 && (
        <EmptyState
          icon={<SearchIcon size={48} />}
          title={search ? 'No encontramos proveedores con esos criterios.' : 'No hay proveedores registrados.'}
          description={search ? 'Pruebe con otro término de búsqueda.' : 'Cree el primer proveedor para comenzar.'}
          action={canCreate && !search ? <Button size="sm" onClick={onOpenNew}>Nuevo proveedor</Button> : undefined}
        />
      )}
    </div>
  );
}
