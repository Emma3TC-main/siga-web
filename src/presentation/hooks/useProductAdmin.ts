import { useCatalog } from '../state/CatalogContext';

export function useProductAdmin() {
  const {
    adminProducts: products, productPage, productLoading: loading, productError: error,
    loadProducts, getProduct, createProduct, updateProduct, setProductStatus,
  } = useCatalog();
  return { products, productPage, loading, error, loadProducts, getProduct, createProduct, updateProduct, setProductStatus };
}
