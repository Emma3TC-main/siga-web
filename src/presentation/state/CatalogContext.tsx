import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CatalogUseCases } from '../../application/catalog/CatalogUseCases';
import type { CreateProductInput } from '../../application/products/CreateProduct';
import type { CreateCategoryInput } from '../../application/categories/CreateCategory';
import type { CreateUnitInput } from '../../application/units/CreateUnit';
import type { Category } from '../../domain/entities/Category';
import type { CostCenter } from '../../domain/entities/CostCenter';
import type { Location } from '../../domain/entities/Location';
import type { Product, ProductListQuery, ProductPage } from '../../domain/entities/Product';
import type { Responsible } from '../../domain/entities/Responsible';
import type { Supplier, SupplierDraft, SupplierListQuery, SupplierPage } from '../../domain/entities/Supplier';
import type { UnitOfMeasure } from '../../domain/entities/UnitOfMeasure';
import { getErrorMessage } from '../../shared/errors/getErrorMessage';

const INITIAL_PRODUCT_QUERY: ProductListQuery = { page: 0, size: 20, sort: 'sku,asc' };
const OPERATIONAL_PRODUCT_QUERY: ProductListQuery = { page: 0, size: 100, sort: 'sku,asc' };
const INITIAL_SUPPLIER_QUERY: SupplierListQuery = { page: 0, size: 20, sort: 'code,asc' };
const EMPTY_PRODUCT_PAGE: ProductPage = { content: [], page: 0, size: 20, totalElements: 0 };
const EMPTY_SUPPLIER_PAGE: SupplierPage = { content: [], page: 0, size: 20, totalElements: 0 };

interface CatalogContextValue {
  products: Product[];
  adminProducts: Product[];
  productPage: Omit<ProductPage, 'content'>;
  productLoading: boolean;
  productError: unknown;
  categories: Category[];
  units: UnitOfMeasure[];
  suppliers: Supplier[];
  adminSuppliers: Supplier[];
  supplierPage: Omit<SupplierPage, 'content'>;
  supplierLoading: boolean;
  supplierError: unknown;
  locations: Location[];
  costCenters: CostCenter[];
  responsibles: Responsible[];
  loading: boolean;
  error: string | null;
  loadProducts: (query: ProductListQuery) => Promise<ProductPage>;
  getProduct: (id: string) => Promise<Product>;
  createProduct: (input: CreateProductInput) => Promise<Product>;
  updateProduct: (current: Product, input: CreateProductInput) => Promise<Product>;
  setProductStatus: (current: Product, active: boolean) => Promise<Product>;
  createCategory: (input: CreateCategoryInput) => Promise<Category>;
  createUnit: (input: CreateUnitInput) => Promise<UnitOfMeasure>;
  loadSuppliers: (query: SupplierListQuery) => Promise<SupplierPage>;
  getSupplier: (id: string) => Promise<Supplier>;
  createSupplier: (draft: SupplierDraft) => Promise<Supplier>;
  updateSupplier: (current: Supplier, draft: SupplierDraft) => Promise<Supplier>;
  setSupplierStatus: (current: Supplier, active: boolean) => Promise<Supplier>;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);
const replaceById = <T extends { id: string }>(items: T[], updated: T): T[] => items.map(item => item.id === updated.id ? updated : item);

export function CatalogProvider({ useCases, children }: { useCases: CatalogUseCases; children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productResult, setProductResult] = useState<ProductPage>(EMPTY_PRODUCT_PAGE);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState<unknown>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<UnitOfMeasure[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierResult, setSupplierResult] = useState<SupplierPage>(EMPTY_SUPPLIER_PAGE);
  const [supplierLoading, setSupplierLoading] = useState(true);
  const [supplierError, setSupplierError] = useState<unknown>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [responsibles, setResponsibles] = useState<Responsible[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      useCases.getProducts.execute(OPERATIONAL_PRODUCT_QUERY), useCases.getProducts.execute(INITIAL_PRODUCT_QUERY),
      useCases.getCategories.execute(), useCases.getUnits.execute(),
      useCases.getSuppliers.execute(INITIAL_SUPPLIER_QUERY), useCases.getLocations.execute(),
      useCases.getCostCenters.execute(), useCases.getResponsibles.execute(),
    ]).then(([operationalProducts, loadedProducts, loadedCategories, loadedUnits, loadedSuppliers, loadedLocations, loadedCostCenters, loadedResponsibles]) => {
      if (cancelled) return;
      setProducts(operationalProducts.content); setProductResult(loadedProducts); setProductError(null);
      setCategories(loadedCategories); setUnits(loadedUnits);
      setSuppliers(loadedSuppliers.content); setSupplierResult(loadedSuppliers); setSupplierError(null);
      setLocations(loadedLocations); setCostCenters(loadedCostCenters); setResponsibles(loadedResponsibles); setError(null);
    }).catch((cause: unknown) => {
      if (!cancelled) { setError(getErrorMessage(cause)); setProductError(cause); setSupplierError(cause); }
    }).finally(() => {
      if (!cancelled) { setLoading(false); setProductLoading(false); setSupplierLoading(false); }
    });
    return () => { cancelled = true; };
  }, [useCases]);

  const loadProducts = useCallback(async (query: ProductListQuery) => {
    setProductLoading(true); setProductError(null);
    try { const result = await useCases.getProducts.execute(query); setProductResult(result); return result; }
    catch (cause) { setProductError(cause); throw cause; }
    finally { setProductLoading(false); }
  }, [useCases]);
  const getProduct = useCallback((id: string) => useCases.getProduct.execute(id), [useCases]);
  const createProduct = useCallback((input: CreateProductInput) => useCases.createProduct.execute(input), [useCases]);
  const updateProduct = useCallback(async (current: Product, input: CreateProductInput) => {
    const updated = await useCases.updateProduct.execute(current, input);
    setProducts(previous => replaceById(previous, updated)); setProductResult(previous => ({ ...previous, content: replaceById(previous.content, updated) }));
    return updated;
  }, [useCases]);
  const setProductStatus = useCallback(async (current: Product, active: boolean) => {
    const updated = await useCases.setProductStatus.execute(current, active);
    setProducts(previous => replaceById(previous, updated)); setProductResult(previous => ({ ...previous, content: replaceById(previous.content, updated) }));
    return updated;
  }, [useCases]);
  const createCategory = useCallback(async (input: CreateCategoryInput) => { const created = await useCases.createCategory.execute(input); setCategories(previous => [...previous, created]); return created; }, [useCases]);
  const createUnit = useCallback(async (input: CreateUnitInput) => { const created = await useCases.createUnit.execute(input); setUnits(previous => [...previous, created]); return created; }, [useCases]);
  const loadSuppliers = useCallback(async (query: SupplierListQuery) => {
    setSupplierLoading(true); setSupplierError(null);
    try { const result = await useCases.getSuppliers.execute(query); setSupplierResult(result); return result; }
    catch (cause) { setSupplierError(cause); throw cause; }
    finally { setSupplierLoading(false); }
  }, [useCases]);
  const getSupplier = useCallback((id: string) => useCases.getSupplier.execute(id), [useCases]);
  const createSupplier = useCallback((draft: SupplierDraft) => useCases.createSupplier.execute(draft), [useCases]);
  const updateSupplier = useCallback(async (current: Supplier, draft: SupplierDraft) => { const updated = await useCases.updateSupplier.execute(current, draft); setSuppliers(previous => replaceById(previous, updated)); setSupplierResult(previous => ({ ...previous, content: replaceById(previous.content, updated) })); return updated; }, [useCases]);
  const setSupplierStatus = useCallback(async (current: Supplier, active: boolean) => { const updated = await useCases.setSupplierStatus.execute(current, active); setSuppliers(previous => replaceById(previous, updated)); setSupplierResult(previous => ({ ...previous, content: replaceById(previous.content, updated) })); return updated; }, [useCases]);

  const productPage = useMemo(() => ({ page: productResult.page, size: productResult.size, totalElements: productResult.totalElements }), [productResult]);
  const supplierPage = useMemo(() => ({ page: supplierResult.page, size: supplierResult.size, totalElements: supplierResult.totalElements }), [supplierResult]);
  const value = useMemo<CatalogContextValue>(() => ({
    products, adminProducts: productResult.content, productPage, productLoading, productError,
    categories, units, suppliers, adminSuppliers: supplierResult.content, supplierPage, supplierLoading, supplierError,
    locations, costCenters, responsibles, loading, error, loadProducts, getProduct, createProduct, updateProduct,
    setProductStatus, createCategory, createUnit, loadSuppliers, getSupplier, createSupplier, updateSupplier, setSupplierStatus,
  }), [products, productResult.content, productPage, productLoading, productError, categories, units, suppliers, supplierResult.content, supplierPage, supplierLoading, supplierError, locations, costCenters, responsibles, loading, error, loadProducts, getProduct, createProduct, updateProduct, setProductStatus, createCategory, createUnit, loadSuppliers, getSupplier, createSupplier, updateSupplier, setSupplierStatus]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextValue {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog must be used within CatalogProvider');
  return context;
}
