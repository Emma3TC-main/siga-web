import { Badge, Button, DetailField, DetailHeader, DetailSection, Modal } from '../../../../components/ui';
import type { Product } from '../../../../../domain/entities/Product';
import type { Category } from '../../../../../domain/entities/Category';
import type { UnitOfMeasure } from '../../../../../domain/entities/UnitOfMeasure';
import { TYPE_LABELS } from '../constants';

interface Props {
  product: Product | null; open: boolean; category: Category | null; units: UnitOfMeasure[];
  canEdit: boolean; onClose: () => void; onEdit: (id: string) => void; onToggleStatus: (id: string) => void;
}
export function ProductDetailModal({ product, open, category, units, canEdit, onClose, onEdit, onToggleStatus }: Props) {
  const unitLabel = (id: string) => units.find(unit => unit.id === id)?.code ?? id;
  return <Modal open={open} onClose={onClose} title={product ? `Producto — ${product.name}` : 'Producto'} size="xl">
    {product && <div className="space-y-5">
      <DetailHeader eyebrow={product.sku} title={product.name} badges={<><Badge variant={product.active ? 'success' : 'muted'} dot>{product.active ? 'Activo' : 'Inactivo'}</Badge><Badge variant="primary">v{product.version}</Badge></>} />
      <DetailSection title="Información canónica"><div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <DetailField label="Tipo" value={TYPE_LABELS[product.productType]} /><DetailField label="Categoría" value={category?.name ?? product.categoryId} />
        <DetailField label="Unidad almacén" value={unitLabel(product.storageUnitId)} /><DetailField label="Unidad base" value={unitLabel(product.baseUnitId)} />
        <DetailField label="Stock mínimo" value={product.minStock} />
      </div></DetailSection>
      <DetailSection title="Trazabilidad"><div className="flex flex-wrap gap-2">
        <Badge variant={product.requiresLot ? 'info' : 'muted'}>Lote: {product.requiresLot ? 'Sí' : 'No'}</Badge>
        <Badge variant={product.requiresHeatNumber ? 'info' : 'muted'}>Colada: {product.requiresHeatNumber ? 'Sí' : 'No'}</Badge>
        <Badge variant={product.requiresExpiry ? 'info' : 'muted'}>Vencimiento: {product.requiresExpiry ? 'Sí' : 'No'}</Badge>
        <Badge variant={product.requiresSerial ? 'info' : 'muted'}>Serie: {product.requiresSerial ? 'Sí' : 'No'}</Badge>
      </div></DetailSection>
      <DetailSection title="Conversiones"><div className="space-y-2">{product.conversions.length === 0 ? <p className="text-sm text-gray-500">Sin conversiones.</p> : product.conversions.map((conversion, index) => <div key={index} className="rounded-lg bg-gray-50 p-3 text-sm">{unitLabel(conversion.fromUnitId)} → {unitLabel(conversion.toUnitId)} · factor {conversion.factor} · {conversion.active ? 'activa' : 'inactiva'}</div>)}</div></DetailSection>
      <DetailSection title="Atributos técnicos"><pre className="overflow-auto rounded-lg bg-gray-50 p-3 text-xs">{JSON.stringify(product.technicalAttributes, null, 2)}</pre></DetailSection>
      {canEdit && <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => onToggleStatus(product.id)}>{product.active ? 'Desactivar' : 'Activar'}</Button><Button onClick={() => onEdit(product.id)}>Editar</Button></div>}
    </div>}
  </Modal>;
}
