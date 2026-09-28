import type { Supplier, SupplierDraft } from '../entities/Supplier';

/** Validación de alta/edición de proveedor. Devuelve un mensaje por campo inválido. */
export function validateSupplierDraft(
  draft: SupplierDraft,
  existing: readonly Supplier[],
  editingId?: string,
): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!draft.code.trim()) errs.code = 'Código requerido.';
  if (!draft.ruc.trim()) errs.ruc = 'RUC requerido.';
  else if (!/^\d{8,15}$/.test(draft.ruc.trim())) errs.ruc = 'RUC debe tener entre 8 y 15 dígitos.';
  if (!draft.name.trim()) errs.name = 'Razón social requerida.';
  if (!draft.contact.trim()) errs.contact = 'Nombre de contacto requerido.';
  if (!draft.phone.trim()) errs.phone = 'Teléfono requerido.';
  if (!draft.email.trim()) errs.email = 'Correo requerido.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) errs.email = 'Formato de correo inválido.';
  if (!draft.address.trim()) errs.address = 'Dirección requerida.';
  // Duplicate checks
  const dup = existing.find(s => s.id !== editingId && s.ruc === draft.ruc.trim());
  if (dup) errs.ruc = `RUC ya registrado (${dup.name}).`;
  const dupCode = existing.find(s => s.id !== editingId && s.code === draft.code.trim());
  if (dupCode) errs.code = `Código ya registrado (${dupCode.name}).`;
  return errs;
}

/** Código sugerido para el siguiente proveedor: PROV-001, PROV-002… */
export function suggestSupplierCode(existing: readonly Supplier[]): string {
  return `PROV-${String(existing.length + 1).padStart(3, '0')}`;
}
