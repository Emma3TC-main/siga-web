import type { NewSupplier, Supplier } from '../../domain/entities/Supplier';
import type { SupplierRepository } from '../../domain/repositories/SupplierRepository';
import { DEMO_SUPPLIERS } from '../../data/demo/suppliers';
import { simulateLatency } from './simulateLatency';

const WRITE_LATENCY_MS = 450;

export class DemoSupplierRepository implements SupplierRepository {
  private suppliers: Supplier[] = [...DEMO_SUPPLIERS];

  async getAll(): Promise<Supplier[]> {
    return [...this.suppliers];
  }

  async getById(id: string): Promise<Supplier | null> {
    return this.suppliers.find(supplier => supplier.id === id) ?? null;
  }

  async create(input: NewSupplier): Promise<Supplier> {
    await simulateLatency(WRITE_LATENCY_MS);
    const supplier: Supplier = { ...input, id: `sup${Date.now()}`, createdAt: new Date().toLocaleDateString('es-PE') };
    this.suppliers = [...this.suppliers, supplier];
    return supplier;
  }

  async update(supplier: Supplier): Promise<Supplier> {
    await simulateLatency(WRITE_LATENCY_MS);
    this.suppliers = this.suppliers.map(item => (item.id === supplier.id ? supplier : item));
    return supplier;
  }
}
