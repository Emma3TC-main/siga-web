import type { Authorization } from '../../../../domain/entities/Authorization';
import type { Movement, MovementLine } from '../../../../domain/entities/Movement';
import type { Product } from '../../../../domain/entities/Product';
import type { Location } from '../../../../domain/entities/Location';
import type { CostCenter } from '../../../../domain/entities/CostCenter';
import type { Responsible } from '../../../../domain/entities/Responsible';
import type { UnitOfMeasure } from '../../../../domain/entities/UnitOfMeasure';
import type { User } from '../../../../domain/entities/User';

export interface AuthorizationSensitivity {
  label: string;
  variant: 'error' | 'warning' | 'info';
}

export function getSensitivityLabel(level: number): AuthorizationSensitivity {
  if (level >= 3) return { label: 'Crítico', variant: 'error' };
  if (level >= 2) return { label: 'Elevado', variant: 'warning' };
  return { label: 'Estándar', variant: 'info' };
}

export interface ResolvedAuthorizationLine {
  line: MovementLine;
  product?: Product;
  unit?: UnitOfMeasure;
}

export interface ResolvedAuthorization {
  auth: Authorization;
  product?: Product;
  unit?: UnitOfMeasure;
  fromLocation?: Location;
  toLocation?: Location;
  requester?: Responsible;
  registeredBy?: User;
  resolvedBy?: User;
  costCenter?: CostCenter;
  movement?: Movement;
  sensitivity: AuthorizationSensitivity;
  /** Líneas del movimiento (multidetalle) con su producto/unidad ya resueltos. */
  lines?: ResolvedAuthorizationLine[];
}

export interface AuthorizationLookupSources {
  products: readonly Product[];
  units: readonly UnitOfMeasure[];
  locations: readonly Location[];
  responsibles: readonly Responsible[];
  users: readonly User[];
  costCenters: readonly CostCenter[];
  movements: readonly Movement[];
}

/**
 * Resuelve todas las entidades relacionadas a una autorización (producto, unidad, ubicaciones,
 * responsable, usuarios, centro de costo y movimiento asociado). Es una función pura (no un hook)
 * para poder invocarse dentro de un `.map()` de la lista, y se reutiliza tanto en la tarjeta como
 * en el modal de detalle para no duplicar la lógica de lookup.
 */
export function resolveAuthorization(auth: Authorization, sources: AuthorizationLookupSources): ResolvedAuthorization {
  const { products, units, locations, responsibles, users, costCenters, movements } = sources;
  const product = products.find(p => p.id === auth.productId);

  return {
    auth,
    product,
    unit: units.find(u => u.id === product?.unitId),
    fromLocation: locations.find(l => l.id === auth.fromLocationId),
    toLocation: locations.find(l => l.id === auth.toLocationId),
    requester: responsibles.find(r => r.id === auth.requesterId),
    registeredBy: users.find(u => u.id === auth.registeredBy),
    resolvedBy: users.find(u => u.id === auth.resolvedBy),
    costCenter: costCenters.find(c => c.id === auth.costCenterId),
    movement: movements.find(m => m.id === auth.movementId),
    sensitivity: getSensitivityLabel(auth.sensitiveLevel),
    lines: auth.lines?.map(line => ({
      line,
      product: products.find(p => p.id === line.productId),
      unit: units.find(u => u.id === line.unitId),
    })),
  };
}
