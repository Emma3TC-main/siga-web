/** Error base de las reglas de negocio. No depende de ninguna tecnología. */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** Datos que incumplen una regla. `fields` permite mostrar el mensaje junto a cada campo. */
export class ValidationError extends DomainError {
  constructor(message: string, readonly fields: Record<string, string> = {}) {
    super(message);
  }
}

/** La entidad solicitada no existe. */
export class NotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super(`${entity} ${id} no encontrado.`);
  }
}
