import type { UnitOfMeasure } from '../../domain/entities/UnitOfMeasure';
import type { UnitRepository } from '../../domain/repositories/UnitRepository';
import { ValidationError } from '../../domain/errors';
import { validateUnitIdentity } from '../../domain/rules/catalogRules';

export interface CreateUnitInput {
  code: string;
  name: string;
  group: string;
  /** Si se omite, la unidad se registra como unidad base. */
  baseUnitId?: string;
  /** Factor respecto a la unidad base; solo aplica si se indica `baseUnitId`. */
  conversionFactor?: number;
}

export class CreateUnit {
  constructor(private readonly repository: UnitRepository) {}

  async execute(input: CreateUnitInput): Promise<UnitOfMeasure> {
    const errors = validateUnitIdentity(input);
    if (Object.keys(errors).length > 0) throw new ValidationError('Datos de unidad inválidos.', errors);

    const isDerived = Boolean(input.baseUnitId);
    return this.repository.create({
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      group: input.group,
      isBase: !isDerived,
      baseUnitId: input.baseUnitId || undefined,
      conversionFactor: isDerived ? input.conversionFactor || 1 : undefined,
    });
  }
}
