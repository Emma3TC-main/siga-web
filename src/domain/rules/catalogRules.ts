import type { CreateCategoryCommand } from '../entities/Category';
import type { CreateProductCommand } from '../entities/Product';
import type { CreateUnitCommand } from '../entities/UnitOfMeasure';

export function validateProduct(product: CreateProductCommand): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!product.name.trim()) errs.name = 'Nombre requerido.';
  else if ([...product.name].length > 200) errs.name = 'Máximo 200 caracteres.';
  if (!product.sku.trim()) errs.sku = 'SKU requerido.';
  else if ([...product.sku].length > 80) errs.sku = 'Máximo 80 caracteres.';
  if (!product.categoryId) errs.categoryId = 'Categoría requerida.';
  if (!product.storageUnitId) errs.storageUnitId = 'Unidad de almacenamiento requerida.';
  if (!product.baseUnitId) errs.baseUnitId = 'Unidad base requerida.';
  if (!Number.isFinite(product.minStock) || product.minStock < 0) errs.minStock = 'Debe ser un número mayor o igual a cero.';
  const pairs = new Set<string>();
  product.conversions.forEach((conversion, index) => {
    const key = `${conversion.fromUnitId}:${conversion.toUnitId}`;
    if (!conversion.fromUnitId || !conversion.toUnitId) errs[`conversions.${index}`] = 'Seleccione ambas unidades.';
    else if (conversion.fromUnitId === conversion.toUnitId) errs[`conversions.${index}`] = 'Las unidades deben ser distintas.';
    else if (!Number.isFinite(conversion.factor) || conversion.factor <= 0) errs[`conversions.${index}`] = 'El factor debe ser mayor que cero.';
    else if (pairs.has(key)) errs[`conversions.${index}`] = 'La conversión está duplicada.';
    pairs.add(key);
  });
  return errs;
}

export function validateCategoryCreate(category: CreateCategoryCommand): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!category.code.trim()) errs.code = 'Código requerido.';
  else if ([...category.code].length > 50) errs.code = 'Máximo 50 caracteres.';
  if (!category.name.trim()) errs.name = 'Nombre requerido.';
  else if ([...category.name].length > 120) errs.name = 'Máximo 120 caracteres.';
  return errs;
}

export function validateUnitIdentity(unit: CreateUnitCommand): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!unit.code.trim()) errs.code = 'Código requerido.';
  else if ([...unit.code].length > 20) errs.code = 'Máximo 20 caracteres.';
  if (!unit.name.trim()) errs.name = 'Nombre requerido.';
  else if ([...unit.name].length > 80) errs.name = 'Máximo 80 caracteres.';
  if (!unit.symbol.trim()) errs.symbol = 'Símbolo requerido.';
  else if ([...unit.symbol].length > 20) errs.symbol = 'Máximo 20 caracteres.';
  if (!unit.dimension.trim()) errs.dimension = 'Dimensión requerida.';
  else if ([...unit.dimension].length > 40) errs.dimension = 'Máximo 40 caracteres.';
  return errs;
}
