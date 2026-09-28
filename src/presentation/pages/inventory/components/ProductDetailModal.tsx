import type { Product } from '../../../../domain/entities/Product';
import type { StockEntry } from '../../../../domain/entities/Stock';
import type { Movement } from '../../../../domain/entities/Movement';
import type { Category } from '../../../../domain/entities/Category';
import type { UnitOfMeasure } from '../../../../domain/entities/UnitOfMeasure';
import type { Location } from '../../../../domain/entities/Location';
import type { User } from '../../../../domain/entities/User';
import { Badge, Button, Modal, Tabs, DetailHeader, DetailSection, DetailField, formatCurrency, formatNumber, ArrowDownIcon, ArrowUpIcon, ArrowsIcon } from '../../../components/ui';
import { ProductSummaryTab } from './ProductSummaryTab';
import { ProductLocationsTab } from './ProductLocationsTab';
import { ProductBatchesTab } from './ProductBatchesTab';
import { ProductKardexTab } from './ProductKardexTab';

interface ProductDetailModalProps {
  detail: Product | null;
  detailTotalQty: number;
  detailStock: StockEntry[];
  detailMovements: Movement[];
  categories: Category[];
  units: UnitOfMeasure[];
  locations: Location[];
  users: User[];
  detailTab: string;
  onDetailTabChange: (tab: string) => void;
  onClose: () => void;
  onGoEntries: () => void;
  onGoExits: () => void;
  onGoTransfers: () => void;
}

export function ProductDetailModal({
  detail, detailTotalQty, detailStock, detailMovements, categories, units, locations, users,
  detailTab, onDetailTabChange, onClose, onGoEntries, onGoExits, onGoTransfers,
}: ProductDetailModalProps) {
  const unitCode = detail ? units.find(u => u.id === detail.unitId)?.code : undefined;

  return (
    <Modal open={!!detail} onClose={onClose} title={detail ? `${detail.sku} — ${detail.name}` : ''} size="xl">
      {detail && (
        <div className="space-y-5">
          <DetailHeader
            eyebrow={detail.sku}
            title={detail.name}
            badges={<Badge variant={detail.status === 'active' ? 'success' : 'muted'} dot>{detail.status === 'active' ? 'Activo' : 'Inactivo'}</Badge>}
          />

          <DetailSection title="Información general">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <DetailField label="SKU" value={<span className="font-mono">{detail.sku}</span>} />
              <DetailField label="Categoría" value={categories.find(c => c.id === detail.categoryId)?.name ?? '—'} />
              <DetailField label="Estado" value={<Badge variant={detail.status === 'active' ? 'success' : 'muted'} dot>{detail.status === 'active' ? 'Activo' : 'Inactivo'}</Badge>} />
              <DetailField label="Requiere lote" value={detail.requiresBatch ? 'Sí' : 'No'} />
              <DetailField label="Requiere serie" value={detail.requiresSerial ? 'Sí' : 'No'} />
            </div>
          </DetailSection>

          <DetailSection title="Stock y valorización">
            <div className="grid grid-cols-4 gap-3 text-sm">
              <DetailField label="Stock total" value={<span className="text-lg">{formatNumber(detailTotalQty)} <span className="text-xs font-normal text-gray-400">{unitCode}</span></span>} />
              <DetailField label="Stock mínimo" value={`${detail.minStock} ${unitCode ?? ''}`} />
              <DetailField label="Costo promedio" value={formatCurrency(detail.avgCost)} />
              <DetailField label="Valorización" value={formatCurrency(detailTotalQty * detail.avgCost)} />
            </div>
          </DetailSection>

          {/* Tabs */}
          <Tabs
            active={detailTab}
            onChange={onDetailTabChange}
            tabs={[
              { id: 'resumen', label: 'Resumen' },
              { id: 'ubicaciones', label: 'Existencias por ubicación' },
              { id: 'lotes', label: 'Lotes' },
              { id: 'kardex', label: 'Kardex' },
            ]}
          />

          {detailTab === 'resumen' && <ProductSummaryTab detail={detail} />}
          {detailTab === 'ubicaciones' && <ProductLocationsTab detailStock={detailStock} locations={locations} />}
          {detailTab === 'lotes' && <ProductBatchesTab detailStock={detailStock} />}
          {detailTab === 'kardex' && <ProductKardexTab detailMovements={detailMovements} users={users} />}

          <div className="flex gap-2 pt-2">
            <Button variant="secondary" size="sm" icon={<ArrowDownIcon size={14} />} onClick={onGoEntries}>Registrar entrada</Button>
            <Button variant="outline" size="sm" icon={<ArrowUpIcon size={14} />} onClick={onGoExits}>Registrar salida</Button>
            <Button variant="outline" size="sm" icon={<ArrowsIcon size={14} />} onClick={onGoTransfers}>Transferir</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

