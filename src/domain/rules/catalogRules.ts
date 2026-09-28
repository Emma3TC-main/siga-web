import type { Category } from '../entities/Category';
import type { Product } from '../entities/Product';
import type { UnitOfMeasure } from '../entities/UnitOfMeasure';

export function validateProductIdentity(product: Pick<Product, 'name' | 'sku'>): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!product.name.trim()) errs.name = 'Nombre requerido.';
  if (!product.sku.trim()) errs.sku = 'SKU requerido.';
  return errs;
}

export function validateCategoryName(category: Pick<Category, 'name'>): Record<string, string> {
  return category.name.trim() ? {} : { name: 'Nombre requerido.' };
}

export function validateUnitIdentity(unit: Pick<UnitOfMeasure, 'code' | 'name'>): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!unit.code.trim()) errs.code = 'Código requerido.';
  if (!unit.name.trim()) errs.name = 'Nombre requerido.';
  return errs;
}
