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
  <Modal
    open={!!detail}
    onClose={onClose}
    title={detail ? `${detail.sku} — ${detail.name}` : ''}
    size="xl"
  >
    {detail && (

      <div className="space-y-6">

        <div className="bg-gradient-to-r from-[#093C5D]/5 to-transparent rounded-xl p-4 border border-[#093C5D]/10">

          <DetailHeader
            eyebrow={detail.sku}
            title={detail.name}
            badges={
              <Badge
                variant={detail.status === 'active' ? 'success' : 'muted'}
                dot
              >
                {detail.status === 'active' ? 'Activo' : 'Inactivo'}
              </Badge>
            }
          />

        </div>


        <DetailSection title="Información general">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">

            <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-3">
              <DetailField
                label="SKU"
                value={
                  <span className="font-mono text-[#3B7597]">
                    {detail.sku}
                  </span>
                }
              />
            </div>


            <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-3">
              <DetailField
                label="Categoría"
                value={
                  categories.find(
                    c => c.id === detail.categoryId
                  )?.name ?? '—'
                }
              />
            </div>


            <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-3">
              <DetailField
                label="Estado"
                value={
                  <Badge
                    variant={detail.status === 'active' ? 'success' : 'muted'}
                    dot
                  >
                    {detail.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                }
              />
            </div>


            <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-3">
              <DetailField
                label="Requiere lote"
                value={detail.requiresBatch ? 'Sí' : 'No'}
              />
            </div>


            <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-3">
              <DetailField
                label="Requiere serie"
                value={detail.requiresSerial ? 'Sí' : 'No'}
              />
            </div>

          </div>

        </DetailSection>


        <DetailSection title="Stock y valorización">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">

            <div className="rounded-xl border border-[#3B7597]/15 bg-[#3B7597]/5 p-4">

              <DetailField
                label="Stock total"
                value={
                  <span className="text-lg font-bold text-[#093C5D]">

                    {formatNumber(detailTotalQty)}

                    <span className="text-xs font-normal text-gray-400 ml-1">
                      {unitCode}
                    </span>

                  </span>
                }
              />

            </div>


            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">

              <DetailField
                label="Stock mínimo"
                value={`${detail.minStock} ${unitCode ?? ''}`}
              />

            </div>


            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">

              <DetailField
                label="Costo promedio"
                value={formatCurrency(detail.avgCost)}
              />

            </div>


            <div className="rounded-xl border border-[#6FD1D7]/20 bg-[#6FD1D7]/10 p-4">

              <DetailField
                label="Valorización"
                value={
                  <span className="font-semibold text-[#093C5D]">
                    {formatCurrency(
                      detailTotalQty * detail.avgCost
                    )}
                  </span>
                }
              />

            </div>

          </div>

        </DetailSection>


        {/* Tabs */}
        <div className="border-b border-gray-200">

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

        </div>


        <div className="min-h-[180px]">

          {detailTab === 'resumen' && (
            <ProductSummaryTab
              detail={detail}
            />
          )}

          {detailTab === 'ubicaciones' && (
            <ProductLocationsTab
              detailStock={detailStock}
              locations={locations}
            />
          )}

          {detailTab === 'lotes' && (
            <ProductBatchesTab
              detailStock={detailStock}
            />
          )}

          {detailTab === 'kardex' && (
            <ProductKardexTab
              detailMovements={detailMovements}
              users={users}
            />
          )}

        </div>


        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">

          <Button
            variant="secondary"
            size="sm"
            icon={<ArrowDownIcon size={14} />}
            onClick={onGoEntries}
          >
            Registrar entrada
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<ArrowUpIcon size={14} />}
            onClick={onGoExits}
          >
            Registrar salida
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<ArrowsIcon size={14} />}
            onClick={onGoTransfers}
          >
            Transferir
          </Button>

        </div>

      </div>

    )}
  </Modal>
);
}

