export interface Supplier {
  id: string;
  code: string;
  ruc: string;
  name: string;
  commercialName?: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

/** Snapshot immutable del proveedor en el momento de una recepción confirmada. */
export interface SupplierSnapshot {
  id: string;
  code: string;
  ruc: string;
  name: string;
}

/** Datos del formulario de proveedor (alta y edición). */
export type SupplierDraft = Omit<Supplier, 'id' | 'createdAt' | 'status'>;

/** `id` y `createdAt` los asigna la fuente de datos. */
export type NewSupplier = Omit<Supplier, 'id' | 'createdAt'>;
