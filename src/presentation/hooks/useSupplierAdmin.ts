import { useCatalog } from '../state/CatalogContext';

export function useSupplierAdmin() {
  const {
    adminSuppliers, supplierPage, supplierLoading, supplierError, loadSuppliers, getSupplier,
    createSupplier, updateSupplier, setSupplierStatus,
  } = useCatalog();
  return {
    suppliers: adminSuppliers,
    supplierPage,
    loading: supplierLoading,
    error: supplierError,
    loadSuppliers,
    getSupplier,
    createSupplier,
    updateSupplier,
    setSupplierStatus,
  };
}
