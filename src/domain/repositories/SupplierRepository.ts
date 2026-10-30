import type {
  Supplier,
  SupplierDraft,
  SupplierListQuery,
  SupplierPage,
  UpdateSupplierCommand,
} from '../entities/Supplier';

export interface SupplierRepository {
  list(query: SupplierListQuery): Promise<SupplierPage>;
  getById(id: string): Promise<Supplier | null>;
  create(command: SupplierDraft): Promise<Supplier>;
  update(id: string, command: UpdateSupplierCommand): Promise<Supplier>;
}
