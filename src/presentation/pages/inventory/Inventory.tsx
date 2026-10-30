import { useState, useMemo } from 'react';
import { useApp } from '../../state/AppContext';
import { useInventory } from '../../hooks/useInventory';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useUnits } from '../../hooks/useUnits';
import { useLocations } from '../../hooks/useLocations';
import { useUsers } from '../../hooks/useUsers';
import { useOperations } from '../../state/OperationsContext';
import { ApiError } from '../../../infrastructure/http/ApiClient';
import { filterInventoryRows, sumQuantity } from '../../../domain/rules/inventoryRules';
import { getBreadcrumbs, routePath } from '../../navigation/routeRegistry';
import { Button, PageHeader, formatCurrency, DownloadIcon, ArrowDownIcon, Spinner } from '../../components/ui';
import { InventoryStatsBar } from './components/InventoryStatsBar';
import { InventoryFiltersBar } from './components/InventoryFiltersBar';
import { InventoryTable } from './components/InventoryTable';
import { ProductDetailModal } from './components/ProductDetailModal';

const PAGE_SIZE = 15;

export default function Inventory() {
  const { navigate, logout } = useApp();
  const { products } = useProducts();
  const { categories } = useCategories();
  const { units } = useUnits();
  const { locations } = useLocations();
  const { users } = useUsers();
  const { rows: allRows, getStockEntries, getProductMovements } = useInventory();
  const { loading, error } = useOperations();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState('resumen');

  const rows = useMemo(
    () => filterInventoryRows(allRows, { search, type: filterType, status: filterStatus, categoryId: filterCategory }),
    [allRows, search, filterType, filterStatus, filterCategory],
  );

  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const detail = selectedProduct ? products.find(p => p.id === selectedProduct) ?? null : null;
  const detailStock = detail ? getStockEntries(detail.id) : [];
  const detailTotalQty = sumQuantity(detailStock);
  const detailMovements = detail ? getProductMovements(detail.id) : [];

  const stats = {
    sin_stock: rows.filter(r => r.status === 'sin_stock').length,
    bajo_stock: rows.filter(r => r.status === 'bajo_stock').length,
    proximo_vencer: rows.filter(r => r.status === 'proximo_vencer').length,
  };

  function setFilterStatusAndResetPage(status: string) {
    setFilterStatus(status);
    setPage(1);
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-gray-500 gap-4">
        <Spinner size={32} />
        <p>Cargando inventario...</p>
      </div>
    );
  }

  if (error) {
    const isUnauthorized = error instanceof ApiError && error.status === 401;
    const isForbidden = error instanceof ApiError && error.status === 403;
    return (
      <div className="flex flex-col h-full items-center justify-center text-gray-500 gap-4">
        <div className="text-4xl text-red-500">⚠</div>
        <h2 className="text-xl font-bold text-[#093C5D]">
          {isUnauthorized ? 'Sesión expirada o no válida' : isForbidden ? 'Acceso denegado' : 'Error al cargar inventario'}
        </h2>
        <p className="max-w-md text-center">{error.message}</p>
        {isUnauthorized && (
          <Button variant="primary" onClick={() => logout()}>Ir al login</Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Inventario"
        description={`${rows.length} productos · Valor total: ${formatCurrency(rows.reduce((s, r) => s + r.valuation, 0))}`}
        breadcrumbs={getBreadcrumbs('inventory', navigate)}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={<DownloadIcon size={14} />}>Exportar</Button>
            <Button variant="secondary" size="sm" icon={<ArrowDownIcon size={14} />} onClick={() => navigate(routePath('entries'))}>Nueva entrada</Button>
          </div>
        }
      />

      <InventoryStatsBar
        sinStock={stats.sin_stock}
        bajoStock={stats.bajo_stock}
        proximoVencer={stats.proximo_vencer}
        filterStatus={filterStatus}
        onFilterStatus={setFilterStatusAndResetPage}
      />

      <InventoryFiltersBar
        search={search}
        onSearchChange={value => { setSearch(value); setPage(1); }}
        filterType={filterType}
        onFilterTypeChange={value => { setFilterType(value); setPage(1); }}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatusAndResetPage}
        filterCategory={filterCategory}
        onFilterCategoryChange={value => { setFilterCategory(value); setPage(1); }}
        categories={categories}
      />

      <InventoryTable
        rows={paged}
        page={page}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        totalCount={rows.length}
        onSelectProduct={setSelectedProduct}
        onGoEntries={() => navigate(routePath('entries'))}
        onGoExits={() => navigate(routePath('exits'))}
        onGoTransfers={() => navigate(routePath('transfers'))}
        onPageChange={setPage}
      />

      <ProductDetailModal
        detail={detail}
        detailTotalQty={detailTotalQty}
        detailStock={detailStock}
        detailMovements={detailMovements}
        categories={categories}
        units={units}
        locations={locations}
        users={users}
        detailTab={detailTab}
        onDetailTabChange={setDetailTab}
        onClose={() => setSelectedProduct(null)}
        onGoEntries={() => { setSelectedProduct(null); navigate(routePath('entries')); }}
        onGoExits={() => { setSelectedProduct(null); navigate(routePath('exits')); }}
        onGoTransfers={() => { setSelectedProduct(null); navigate(routePath('transfers')); }}
      />
    </div>
  );
}
