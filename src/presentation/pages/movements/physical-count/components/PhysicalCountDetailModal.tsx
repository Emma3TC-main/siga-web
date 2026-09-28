import type { PhysicalCount } from '../../../../../domain/entities/PhysicalCount';
import type { Product } from '../../../../../domain/entities/Product';
import type { UnitOfMeasure } from '../../../../../domain/entities/UnitOfMeasure';
import type { Location } from '../../../../../domain/entities/Location';
import type { User } from '../../../../../domain/entities/User';
import { Badge, Modal, DetailHeader, DetailSection, DetailField, formatNumber } from '../../../../components/ui';
import { calcIra } from '../utils/countStats';

function statusBadge(status: PhysicalCount['status']) {
  if (status === 'completado') return { variant: 'success' as const, label: 'Completado' };
  if (status === 'en_progreso') return { variant: 'warning' as const, label: 'En progreso' };
  return { variant: 'info' as const, label: 'Borrador' };
}

export function PhysicalCountDetailModal({ detail, products, units, locations, users, onClose }: {
  detail: PhysicalCount | null;
  products: Product[];
  units: UnitOfMeasure[];
  locations: Location[];
  users: User[];
  onClose: () => void;
}) {
  const location = detail ? locations.find(l => l.id === detail.locationId) : undefined;
  const supervisor = detail ? users.find(u => u.id === detail.createdBy) : undefined;
  const ira = detail ? calcIra(detail.items) : 0;
  const status = detail ? statusBadge(detail.status) : null;
  const exactItems = detail ? detail.items.filter(i => i.difference === 0).length : 0;
  const diffItems = detail ? detail.items.filter(i => i.difference !== 0).length : 0;

  return (
    <Modal open={!!detail} onClose={onClose} title={detail ? `Conteo ${detail.id}` : 'Detalle de conteo'} size="xl">
      {detail && status && (
        <div className="space-y-5">
          <DetailHeader
            eyebrow={detail.id}
            title={detail.name}
            badges={<>
              <Badge variant={ira >= 95 ? 'success' : 'warning'}>IRA {ira}%</Badge>
              <Badge variant={status.variant} dot>{status.label}</Badge>
            </>}
          />

          <DetailSection title="Información general">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <DetailField label="Ubicación" value={location?.name ?? 'Todas las ubicaciones'} />
              <DetailField label="Supervisor" value={supervisor ? `${supervisor.name} ${supervisor.lastName}` : '—'} />
              <DetailField label="Fecha de creación" value={detail.createdAt} />
              <DetailField label="Fecha de finalización" value={detail.completedAt ?? '—'} />
            </div>
          </DetailSection>

          <DetailSection title="Resultados">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#093C5D]">{detail.items.length}</div>
                <div className="text-xs text-gray-400">Ítems contados</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">{exactItems}</div>
                <div className="text-xs text-gray-400">Exactos</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">{diffItems}</div>
                <div className="text-xs text-gray-400">Con diferencia</div>
              </div>
            </div>
          </DetailSection>

          <DetailSection title={`Ítems del conteo (${detail.items.length})`}>
            <div className="overflow-x-auto">
              <table className="siga-table">
                <thead><tr><th>Producto</th><th className="text-right">Teórico</th><th className="text-right">Contado</th><th className="text-right">Diferencia</th><th>Resultado</th></tr></thead>
                <tbody>
                  {detail.items.map((item, i) => {
                    const prod = products.find(p => p.id === item.productId);
                    const unit = prod ? units.find(u => u.id === prod.unitId) : null;
                    const diff = item.difference;
                    return (
                      <tr key={i}>
                        <td><div className="font-medium text-sm">{prod?.name ?? item.productId}</div><div className="font-mono text-xs text-gray-400">{prod?.sku}</div></td>
                        <td className="text-right">{formatNumber(item.theoreticalQty)} {unit?.code}</td>
                        <td className="text-right font-semibold">{formatNumber(item.physicalQty)} {unit?.code}</td>
                        <td className={`text-right font-bold ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          {diff > 0 ? '+' : ''}{formatNumber(diff)}
                        </td>
                        <td>
                          {diff === 0 ? <Badge variant="success" dot>Exacto</Badge> :
                            diff > 0 ? <Badge variant="warning" dot>Sobrante</Badge> :
                              <Badge variant="error" dot>Faltante</Badge>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </DetailSection>
        </div>
      )}
    </Modal>
  );
}
