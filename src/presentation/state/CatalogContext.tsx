import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CatalogUseCases } from '../../application/catalog/CatalogUseCases';
import type { CreateProductInput } from '../../application/products/CreateProduct';
import type { CreateCategoryInput } from '../../application/categories/CreateCategory';
import type { CreateUnitInput } from '../../application/units/CreateUnit';
import type { Category } from '../../domain/entities/Category';
import type { CostCenter } from '../../domain/entities/CostCenter';
import type { Location } from '../../domain/entities/Location';
import type { Product, ProductChanges } from '../../domain/entities/Product';
import type { Responsible } from '../../domain/entities/Responsible';
import type { Supplier, SupplierDraft } from '../../domain/entities/Supplier';
import type { UnitOfMeasure } from '../../domain/entities/UnitOfMeasure';
import { getErrorMessage } from '../../shared/errors/getErrorMessage';

interface CatalogContextValue {
  products: Product[];
  categories: Category[];
  units: UnitOfMeasure[];
  suppliers: Supplier[];
  locations: Location[];
  costCenters: CostCenter[];
  responsibles: Responsible[];
  /** `true` hasta completar la carga inicial del catálogo. */
  loading: boolean;
  /** Mensaje de la última carga fallida; `null` si todo cargó bien. */
  error: string | null;
  createProduct: (input: CreateProductInput) => Promise<Product>;
  updateProduct: (id: string, changes: ProductChanges) => Promise<Product>;
  createCategory: (input: CreateCategoryInput) => Promise<Category>;
  createUnit: (input: CreateUnitInput) => Promise<UnitOfMeasure>;
  createSupplier: (draft: SupplierDraft) => Promise<Supplier>;
  updateSupplier: (id: string, draft: SupplierDraft) => Promise<Supplier>;
  setSupplierStatus: (id: string, status: Supplier['status']) => Promise<Supplier>;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

const replaceById = <T extends { id: string }>(items: T[], updated: T): T[] =>
  items.map(item => (item.id === updated.id ? updated : item));

/**
 * Estado compartido de datos maestros (productos, categorías, unidades, proveedores, ubicaciones, centros de costo, responsables).
 * Recibe los casos de uso por props: no conoce si los datos vienen de demo o de una API.
 */
export function CatalogProvider({ useCases, children }: { useCases: CatalogUseCases; children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<UnitOfMeasure[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [responsibles, setResponsibles] = useState<Responsible[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      useCases.getProducts.execute(),
      useCases.getCategories.execute(),
      useCases.getUnits.execute(),
      useCases.getSuppliers.execute(),
      useCases.getLocations.execute(),
      useCases.getCostCenters.execute(),
      useCases.getResponsibles.execute(),
    ])
      .then(([loadedProducts, loadedCategories, loadedUnits, loadedSuppliers, loadedLocations, loadedCostCenters, loadedResponsibles]) => {
        if (cancelled) return;
        setProducts(loadedProducts);
        setCategories(loadedCategories);
        setUnits(loadedUnits);
        setSuppliers(loadedSuppliers);
        setLocations(loadedLocations);
        setCostCenters(loadedCostCenters);
        setResponsibles(loadedResponsibles);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(getErrorMessage(cause));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [useCases]);

  const createProduct = useCallback(async (input: CreateProductInput) => {
    const created = await useCases.createProduct.execute(input);
    setProducts(prev => [...prev, created]);
    return created;
  }, [useCases]);

  const updateProduct = useCallback(async (id: string, changes: ProductChanges) => {
    const updated = await useCases.updateProduct.execute(id, changes);
    setProducts(prev => replaceById(prev, updated));
    return updated;
  }, [useCases]);

  const createCategory = useCallback(async (input: CreateCategoryInput) => {
    const created = await useCases.createCategory.execute(input);
    setCategories(prev => [...prev, created]);
    return created;
  }, [useCases]);

  const createUnit = useCallback(async (input: CreateUnitInput) => {
    const created = await useCases.createUnit.execute(input);
    setUnits(prev => [...prev, created]);
    return created;
  }, [useCases]);

  const createSupplier = useCallback(async (draft: SupplierDraft) => {
    const created = await useCases.createSupplier.execute(draft);
    setSuppliers(prev => [...prev, created]);
    return created;
  }, [useCases]);

  const updateSupplier = useCallback(async (id: string, draft: SupplierDraft) => {
    const updated = await useCases.updateSupplier.execute(id, draft);
    setSuppliers(prev => replaceById(prev, updated));
    return updated;
  }, [useCases]);

  const setSupplierStatus = useCallback(async (id: string, status: Supplier['status']) => {
    const updated = await useCases.setSupplierStatus.execute(id, status);
    setSuppliers(prev => replaceById(prev, updated));
    return updated;
  }, [useCases]);

  const value = useMemo<CatalogContextValue>(() => ({
    products, categories, units, suppliers, locations, costCenters, responsibles, loading, error,
    createProduct, updateProduct, createCategory, createUnit, createSupplier, updateSupplier, setSupplierStatus,
  }), [products, categories, units, suppliers, locations, costCenters, responsibles, loading, error,
    createProduct, updateProduct, createCategory, createUnit, createSupplier, updateSupplier, setSupplierStatus]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
