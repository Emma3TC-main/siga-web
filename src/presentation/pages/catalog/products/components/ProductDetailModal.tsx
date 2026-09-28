import { Badge, Modal, DetailHeader, DetailSection, DetailField, formatCurrency, formatNumber } from '../../../../components/ui';
import type { Product } from '../../../../../domain/entities/Product';
import type { Category } from '../../../../../domain/entities/Category';
import type { UnitOfMeasure } from '../../../../../domain/entities/UnitOfMeasure';
import { TYPE_LABELS } from '../constants';

export interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  category: Category | null;
  unit: UnitOfMeasure | null;
  stockQuantity: number;
  onClose: () => void;
}

export function ProductDetailModal({ product, open, category, unit, stockQuantity, onClose }: ProductDetailModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={`Producto — ${product?.name}`} size="lg">
      {product && (
        <div className="space-y-5">
          <DetailHeader
            eyebrow={product.sku}
            title={product.name}
            badges={<Badge variant={product.status === 'active' ? 'success' : 'muted'} dot>{product.status === 'active' ? 'Activo' : 'Inactivo'}</Badge>}
          />

          <DetailSection title="Información general">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <DetailField label="SKU" value={product.sku} />
              <DetailField label="Tipo" value={TYPE_LABELS[product.type]} />
              <DetailField label="Categoría" value={category?.name ?? '—'} />
              <DetailField label="Unidad" value={unit?.name ?? '—'} />
              <DetailField label="Costo promedio" value={formatCurrency(product.avgCost)} />
              <DetailField label="Estado" value={product.status === 'active' ? 'Activo' : 'Inactivo'} />
            </div>
          </DetailSection>

          <DetailSection title="Stock">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <DetailField label="Stock total" value={`${formatNumber(stockQuantity)} ${unit?.code ?? ''}`} />
              <DetailField label="Stock mínimo" value={`${product.minStock} ${unit?.code ?? ''}`} />
              <DetailField label="Punto de reorden" value={`${product.reorderPoint ?? 0} ${unit?.code ?? ''}`} />
            </div>
          </DetailSection>

          <div className="flex flex-wrap gap-2">
            {product.sensitiveMovement && <Badge variant="warning">Movimiento sensible</Badge>}
            {product.requiresBatch && <Badge variant="info">Requiere lote</Badge>}
            {product.requiresSerial && <Badge variant="info">Requiere serie</Badge>}
            {product.requiresExpiry && <Badge variant="info">Requiere vencimiento</Badge>}
            {product.requiresColada && <Badge variant="info">Requiere colada</Badge>}
          </div>

          {product.description && (
            <DetailSection title="Descripción">
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">{product.description}</div>
            </DetailSection>
          )}
        </div>
      )}
    </Modal>
  );
}
