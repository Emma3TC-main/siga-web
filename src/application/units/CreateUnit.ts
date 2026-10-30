import type { CreateUnitCommand, UnitOfMeasure } from '../../domain/entities/UnitOfMeasure';
import type { UnitRepository } from '../../domain/repositories/UnitRepository';
import { ValidationError } from '../../domain/errors';
import { validateUnitIdentity } from '../../domain/rules/catalogRules';

export interface CreateUnitInput {
  code: string;
  name: string;
  symbol: string;
  dimension: string;
}

export class CreateUnit {
  constructor(private readonly repository: UnitRepository) {}

  async execute(input: CreateUnitInput): Promise<UnitOfMeasure> {
    const errors = validateUnitIdentity(input);
    if (Object.keys(errors).length > 0) throw new ValidationError('Datos de unidad inválidos.', errors);

    const command: CreateUnitCommand = {
      code: input.code.trim(),
      name: input.name.trim(),
      symbol: input.symbol.trim(),
      dimension: input.dimension.trim(),
    };
    return this.repository.create(command);
  }
}
