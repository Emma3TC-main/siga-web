import type {
  Supplier,
  SupplierDraft,
  SupplierListQuery,
  SupplierPage,
  UpdateSupplierCommand,
} from '../../domain/entities/Supplier';
import type { SupplierRepository } from '../../domain/repositories/SupplierRepository';
import { DEMO_SUPPLIERS } from '../../data/demo/suppliers';
import { simulateLatency } from './simulateLatency';

const WRITE_LATENCY_MS = 450;

export class DemoSupplierRepository implements SupplierRepository {
  private suppliers: Supplier[] = structuredClone(DEMO_SUPPLIERS);

  async list(query: SupplierListQuery): Promise<SupplierPage> {
    let values = this.suppliers.filter(supplier => {
      const search = query.q?.trim().toLocaleLowerCase('es-PE');
      const matchesSearch = !search || [supplier.code, supplier.taxId, supplier.businessName, supplier.tradeName ?? '']
        .some(value => value.toLocaleLowerCase('es-PE').includes(search));
      return matchesSearch && (query.active === undefined || supplier.active === query.active);
    });
    const [field, direction] = query.sort.split(',') as ['code' | 'businessName', 'asc' | 'desc'];
    values = [...values].sort((left, right) => {
      const compared = left[field].localeCompare(right[field], 'es-PE');
      return compared === 0 ? left.id.localeCompare(right.id) : direction === 'asc' ? compared : -compared;
    });
    const start = query.page * query.size;
    return {
      content: structuredClone(values.slice(start, start + query.size)),
      page: query.page,
      size: query.size,
      totalElements: values.length,
    };
  }

  async getById(id: string): Promise<Supplier | null> {
    return structuredClone(this.suppliers.find(supplier => supplier.id === id) ?? null);
  }

  async create(command: SupplierDraft): Promise<Supplier> {
    await simulateLatency(WRITE_LATENCY_MS);
    const supplier: Supplier = {
      ...command,
      id: crypto.randomUUID(),
      tradeName: command.tradeName || null,
      contactName: command.contactName || null,
      phone: command.phone || null,
      email: command.email || null,
      address: command.address || null,
      active: true,
      version: 0,
    };
    this.suppliers = [...this.suppliers, supplier];
    return structuredClone(supplier);
  }

  async update(id: string, command: UpdateSupplierCommand): Promise<Supplier> {
    await simulateLatency(WRITE_LATENCY_MS);
    const current = this.suppliers.find(supplier => supplier.id === id);
    if (!current) throw new Error('SUPPLIER_NOT_FOUND');
    if (current.version !== command.expectedVersion) throw new Error('VERSION_CONFLICT');
    const updated: Supplier = {
      id,
      code: command.code,
      taxId: command.taxId,
      businessName: command.businessName,
      tradeName: command.tradeName || null,
      contactName: command.contactName || null,
      phone: command.phone || null,
      email: command.email || null,
      address: command.address || null,
      active: command.active,
      version: current.version + 1,
    };
    this.suppliers = this.suppliers.map(supplier => supplier.id === id ? updated : supplier);
    return structuredClone(updated);
  }
}
