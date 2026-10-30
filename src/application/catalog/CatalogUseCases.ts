import type { GetProducts } from '../products/GetProducts';
import type { CreateProduct } from '../products/CreateProduct';
import type { UpdateProduct } from '../products/UpdateProduct';
import type { GetProduct } from '../products/GetProduct';
import type { SetProductStatus } from '../products/SetProductStatus';
import type { GetCategories } from '../categories/GetCategories';
import type { CreateCategory } from '../categories/CreateCategory';
import type { GetUnits } from '../units/GetUnits';
import type { CreateUnit } from '../units/CreateUnit';
import type { GetCostCenters } from '../administration/GetCostCenters';
import type { GetResponsibles } from '../administration/GetResponsibles';
import type { GetLocations } from '../locations/GetLocations';
import type { GetSuppliers } from '../suppliers/GetSuppliers';
import type { GetSupplier } from '../suppliers/GetSupplier';
import type { CreateSupplier } from '../suppliers/CreateSupplier';
import type { UpdateSupplier } from '../suppliers/UpdateSupplier';
import type { SetSupplierStatus } from '../suppliers/SetSupplierStatus';

/** Casos de uso de datos maestros (catálogo, ubicaciones, centros de costo y responsables) que consume la capa de presentación. */
export interface CatalogUseCases {
  getProducts: GetProducts;
  getProduct: GetProduct;
  createProduct: CreateProduct;
  updateProduct: UpdateProduct;
  setProductStatus: SetProductStatus;
  getCategories: GetCategories;
  createCategory: CreateCategory;
  getUnits: GetUnits;
  createUnit: CreateUnit;
  getLocations: GetLocations;
  getCostCenters: GetCostCenters;
  getResponsibles: GetResponsibles;
  getSuppliers: GetSuppliers;
  getSupplier: GetSupplier;
  createSupplier: CreateSupplier;
  updateSupplier: UpdateSupplier;
  setSupplierStatus: SetSupplierStatus;
}
