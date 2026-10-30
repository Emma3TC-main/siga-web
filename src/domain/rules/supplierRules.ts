import type { SupplierDraft } from '../entities/Supplier';

/** Validación UX alineada con los límites publicados por Catalog. */
export function validateSupplierDraft(draft: SupplierDraft): Record<string, string> {
  const errors: Record<string, string> = {};
  const required = (value: string, field: keyof SupplierDraft, label: string, maximum: number) => {
    if (!value.trim()) errors[field] = `${label} requerido.`;
    else if (value.length > maximum) errors[field] = `${label} no puede superar ${maximum} caracteres.`;
  };
  const optional = (value: string, field: keyof SupplierDraft, label: string, maximum: number) => {
    if (value.length > maximum) errors[field] = `${label} no puede superar ${maximum} caracteres.`;
  };

  required(draft.code, 'code', 'Código', 50);
  required(draft.taxId, 'taxId', 'Identificador tributario', 20);
  required(draft.businessName, 'businessName', 'Razón social', 200);
  optional(draft.tradeName, 'tradeName', 'Nombre comercial', 200);
  optional(draft.contactName, 'contactName', 'Contacto', 160);
  optional(draft.phone, 'phone', 'Teléfono', 40);
  optional(draft.email, 'email', 'Correo', 254);
  optional(draft.address, 'address', 'Dirección', 300);
  if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
    errors.email = 'Formato de correo inválido.';
  }
  return errors;
}
