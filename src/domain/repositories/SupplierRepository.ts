import type { NewSupplier, Supplier } from '../entities/Supplier';

export interface SupplierRepository {
  getAll(): Promise<Supplier[]>;
  getById(id: string): Promise<Supplier | null>;
  create(supplier: NewSupplier): Promise<Supplier>;
  update(supplier: Supplier): Promise<Supplier>;
}
