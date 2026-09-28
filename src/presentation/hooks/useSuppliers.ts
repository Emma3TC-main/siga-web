import { useCatalog } from '../state/CatalogContext';

export function useSuppliers() {
  const { suppliers, loading, error, createSupplier, updateSupplier, setSupplierStatus } = useCatalog();
  return { suppliers, loading, error, createSupplier, updateSupplier, setSupplierStatus };
}
