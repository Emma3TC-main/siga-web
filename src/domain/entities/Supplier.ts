export interface Supplier {
  id: string;
  code: string;
  taxId: string;
  businessName: string;
  tradeName: string | null;
  contactName: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  active: boolean;
  version: number;
}

/** Snapshot immutable del proveedor en el momento de una recepción confirmada. */
export interface SupplierSnapshot {
  id: string;
  code: string;
  ruc: string;
  name: string;
}

/** Campos editables del formulario. Los opcionales vacíos se envían como null. */
export interface SupplierDraft {
  code: string;
  taxId: string;
  businessName: string;
  tradeName: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
}

export type SupplierSort = 'code,asc' | 'code,desc' | 'businessName,asc' | 'businessName,desc';

export interface SupplierListQuery {
  page: number;
  size: number;
  sort: SupplierSort;
  q?: string;
  active?: boolean;
}

export interface SupplierPage {
  content: Supplier[];
  page: number;
  size: number;
  totalElements: number;
}

export interface UpdateSupplierCommand extends SupplierDraft {
  active: boolean;
  expectedVersion: number;
}
