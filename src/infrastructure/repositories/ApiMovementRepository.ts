import { ApiClient } from '../http/ApiClient';
import type { Movement, MovementLine, MovementType, MovementStatus } from '../../domain/entities/Movement';
import type { MovementHistoryPage, MovementHistoryQuery, MovementRepository } from '../../domain/repositories/MovementRepository';
import type { UnitRepository } from '../../domain/repositories/UnitRepository';
import { MovementEvidenceRequiredError, NotFoundError } from '../../domain/errors';
import { ApiError } from '../http/ApiClient';

interface BackendMovementResponse {
  id: string;
  movementCode: string;
  movementType: string;
  status: string;
  registeredByUserId: string;
  requestedByUserId: string | null;
  costCenterCode: string | null;
  costCenterNameSnapshot: string | null;
  referenceDocType: string | null;
  referenceDocNumber: string | null;
  reason: string | null;
  supplierId?: string | null;
  supplierNameSnapshot?: string | null;
  supplierTaxIdSnapshot?: string | null;
  sensitive: boolean;
  sensitivityReason?: string | null;
  details: BackendMovementDetailResponse[];
  createdAt: string;
  submittedAt: string | null;
  confirmedAt: string | null;
}

interface BackendMovementDetailResponse {
  id: string;
  lineNumber: number;
  productId: string;
  enteredQuantity: number;
  unitCode: string;
  conversionFactor: number;
  stockQuantity: number;
  originLocationId: string | null;
  destinationLocationId: string | null;
  lotId: string | null;
  assetId: string | null;
  originalCurrency: string | null;
  originalUnitCost: number | null;
  exchangeRate: number | null;
  exchangeRateDate: string | null;
  exchangeRateSource: string | null;
  baseUnitCostPen?: number | null;
  appliedAvgCostPen?: number | null;
  totalCostPen?: number | null;
}

interface BackendMovementHistoryItem {
  id: string;
  movementCode: string;
  movementType: string;
  status: string;
  sensitive: boolean;
  registeredByUserId: string;
  requestedByUserId: string | null;
  costCenterCode: string | null;
  costCenterNameSnapshot: string | null;
  referenceDocType: string | null;
  referenceDocNumber: string | null;
  reason: string | null;
  createdAt: string;
  submittedAt: string | null;
  confirmedAt: string | null;
}

interface BackendMovementPage {
  content: BackendMovementHistoryItem[];
  page: number;
  size: number;
  totalElements: number;
}

export class ApiMovementRepository implements MovementRepository {
  private static readonly PATH = '/api/v1/movements';
  private apiClient = new ApiClient();
  readonly isAuthoritative = true;

  constructor(private readonly units: UnitRepository) {}

  async getAll(): Promise<Movement[]> {
    return (await this.search()).content;
  }

  async search(query: MovementHistoryQuery = {}): Promise<MovementHistoryPage> {
    const params = new URLSearchParams();
    params.set('page', String(query.page ?? 0));
    params.set('size', String(Math.min(query.size ?? 20, 100)));
    const filters: (keyof Omit<MovementHistoryQuery, 'page' | 'size'>)[] = [
      'movementCode', 'movementType', 'status', 'productId', 'lotId', 'assetId',
      'sourceLocationId', 'destinationLocationId', 'locationId', 'registeredByUserId',
      'requestedByUserId', 'from', 'to', 'sensitive', 'referenceDocNumber',
    ];
    for (const key of filters) {
      const value = query[key];
      if (value !== undefined && value !== '') params.set(key, String(value));
    }
    const data = await this.apiClient.get<BackendMovementPage>(`${ApiMovementRepository.PATH}?${params.toString()}`);
    return {
      content: data.content.map(dto => this.mapHistoryItem(dto)),
      page: data.page,
      size: data.size,
      totalElements: data.totalElements,
    };
  }

  async getById(id: string): Promise<Movement | null> {
    try {
      const data = await this.apiClient.get<BackendMovementResponse>(`${ApiMovementRepository.PATH}/${id}`);
      return this.mapToDomain(data);
    } catch (error: unknown) {
      if (error instanceof NotFoundError) return null;
      throw error;
    }
  }

  async add(movement: Movement): Promise<Movement> {
    const createReq = await this.mapToCreateRequest(movement);
    let currentDto = await this.apiClient.post<BackendMovementResponse>(`${ApiMovementRepository.PATH}`, createReq);

    if (movement.status === 'borrador') {
      return this.mapToDomain(currentDto);
    }

    try {
      currentDto = await this.submitDto(currentDto.id);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409 && error.data?.code === 'EVIDENCE_REQUIRED') {
        throw new MovementEvidenceRequiredError(this.mapToDomain(currentDto));
      }
      throw error;
    }

    if (currentDto.status === 'DRAFT') {
      const idempotencyKey = crypto.randomUUID();
      currentDto = await this.apiClient.post<BackendMovementResponse>(
        `${ApiMovementRepository.PATH}/${currentDto.id}/confirm`,
        {},
        { headers: { 'Idempotency-Key': idempotencyKey } }
      );
    }

    return this.mapToDomain(currentDto);
  }

  async submit(id: string): Promise<Movement> {
    return this.mapToDomain(await this.submitDto(id));
  }

  async update(movement: Movement): Promise<Movement> {
    // Used by ResolveAuthorization (approve/reject) and ConfirmMovement (step-up confirm)
    if (movement.status === 'rechazado') {
      await this.apiClient.post(`${ApiMovementRepository.PATH}/${movement.id}/reject`, {
        reason: movement.rejectionReason || 'Rechazado desde Web',
      });
      const data = await this.apiClient.get<BackendMovementResponse>(`${ApiMovementRepository.PATH}/${movement.id}`);
      return this.mapToDomain(data);
    }

    if (movement.status === 'autorizado') {
      // Actually backend expects AuthorizeDecision for approval
      await this.apiClient.post(`${ApiMovementRepository.PATH}/${movement.id}/authorize`, {
        reason: 'Autorizado desde Web',
      });
      const data = await this.apiClient.get<BackendMovementResponse>(`${ApiMovementRepository.PATH}/${movement.id}`);
      return this.mapToDomain(data);
    }

    if (movement.status === 'confirmado') {
      const idempotencyKey = crypto.randomUUID();
      const data = await this.apiClient.post<BackendMovementResponse>(
        `${ApiMovementRepository.PATH}/${movement.id}/confirm`,
        {},
        { headers: { 'Idempotency-Key': idempotencyKey } }
      );
      return this.mapToDomain(data);
    }

    if (movement.status === 'cancelado') {
      await this.apiClient.post(`${ApiMovementRepository.PATH}/${movement.id}/cancel`, {});
      const data = await this.apiClient.get<BackendMovementResponse>(`${ApiMovementRepository.PATH}/${movement.id}`);
      return this.mapToDomain(data);
    }

    return movement;
  }

  private requireUUID(id: string | undefined | null, field: string): string | null {
    if (!id) return null;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error(`BLOCKED_BY_CANONICAL_MASTER_DATA: La operación requiere datos maestros canónicos para '${field}' (UUID), pero el valor actual proviene de DEMO (${id}).`);
    }
    return id;
  }

  private submitDto(id: string): Promise<BackendMovementResponse> {
    return this.apiClient.post<BackendMovementResponse>(
      `${ApiMovementRepository.PATH}/${id}/submit`,
      {}
    );
  }

  private requireCanonicalTraceabilityId(
    id: string | undefined,
    source: 'canonical' | 'demo' | undefined,
    kind: 'LOT' | 'ASSET',
  ): string | null {
    if (!id) return null;
    if (source !== 'canonical') {
      throw new Error(
        `BLOCKED_BY_${kind}: La trazabilidad debe seleccionarse desde la fuente canónica; no se enviará un valor manual o DEMO.`
      );
    }
    return this.requireUUID(id, kind === 'LOT' ? 'Lot' : 'Asset');
  }

  private async mapToCreateRequest(movement: Movement): Promise<any> {
    const allUnits = await this.units.getAll();
    const typeMap: Record<MovementType, string> = {
      'entrada': 'ENTRY',
      'salida': 'EXIT',
      'transferencia': 'TRANSFER',
      'ajuste_positivo': 'ADJUST_POSITIVE',
      'ajuste_negativo': 'ADJUST_NEGATIVE',
      'conteo': 'ADJUST_POSITIVE' // Fallback
    };
    return {
      movementType: typeMap[movement.type] || 'ENTRY',
      // No hay fuente canónica de responsables en REMOTE; el campo es opcional y no se propaga desde DEMO.
      requestedByUserId: null,
      // CostCenters sigue sin fuente canónica REMOTE; no persistir códigos provenientes del repositorio DEMO.
      costCenterCode: null,
      costCenterNameSnapshot: null,
      supplierId: this.requireUUID(movement.supplierId, 'Supplier'),
      referenceDocType: movement.documentType || null,
      referenceDocNumber: movement.documentNumber || null,
      reason: movement.motive || null,
      notes: movement.observations || null,
      details: (movement.lines || []).map(line => {
        const lotId = this.requireCanonicalTraceabilityId(line.batch, line.lotSource, 'LOT');
        const assetId = this.requireCanonicalTraceabilityId(line.serial, line.assetSource, 'ASSET');
        const unitId = this.requireUUID(line.unitId, 'Unit');
        const unit = allUnits.find(candidate => candidate.id === unitId);
        const originalUnitCost =
          movement.type === 'entrada' || movement.type === 'ajuste_positivo'
            ? line.unitCost ?? null
            : null;
        if (!unit?.code?.trim()) {
          throw new Error(
            `BLOCKED_BY_CANONICAL_MASTER_DATA: No existe una unidad canónica con id '${line.unitId}' y código válido.`
          );
        }
        return {
          productId: this.requireUUID(line.productId, 'Product') || line.productId,
          enteredQuantity: line.quantity,
          unitCode: unit.code,
          originLocationId: this.requireUUID(line.fromLocationId, 'Origin Location'),
          destinationLocationId: this.requireUUID(line.toLocationId, 'Destination Location'),
          lotId,
          assetId,
          originalCurrency: originalUnitCost === null ? null : 'PEN',
          originalUnitCost,
          exchangeRate: null,
          exchangeRateDate: null,
          exchangeRateSource: null,
        };
      }),
    };
  }

  private mapToDomain(dto: BackendMovementResponse): Movement {
    const typeMap: Record<string, MovementType> = {
      ENTRY: 'entrada',
      EXIT: 'salida',
      TRANSFER: 'transferencia',
      ADJUST_POSITIVE: 'ajuste_positivo',
      ADJUST_NEGATIVE: 'ajuste_negativo',
    };
    const statusMap: Record<string, MovementStatus> = {
      DRAFT: 'borrador',
      PENDING_AUTHORIZATION: 'pendiente_autorizacion',
      AUTHORIZED: 'autorizado',
      CONFIRMED: 'confirmado',
      REJECTED: 'rechazado',
      CANCELLED: 'cancelado',
    };

    const lines: MovementLine[] = dto.details.map(d => ({
      id: d.id,
      productId: d.productId,
      quantity: d.enteredQuantity,
      unitId: d.unitCode,
      unitCode: d.unitCode,
      conversionFactor: d.conversionFactor,
      stockQuantity: d.stockQuantity,
      fromLocationId: d.originLocationId || undefined,
      toLocationId: d.destinationLocationId || undefined,
      batch: d.lotId || undefined,
      serial: d.assetId || undefined,
      lotSource: d.lotId ? 'canonical' : undefined,
      assetSource: d.assetId ? 'canonical' : undefined,
      unitCost: d.originalUnitCost ?? undefined,
      totalCost: d.totalCostPen ?? (d.originalUnitCost === null ? undefined : d.enteredQuantity * d.originalUnitCost),
      baseUnitCostPen: d.baseUnitCostPen ?? undefined,
      appliedAvgCostPen: d.appliedAvgCostPen ?? undefined,
    }));

    return {
      id: dto.id,
      type: typeMap[dto.movementType] || 'entrada',
      status: statusMap[dto.status] || 'borrador',
      productId: lines[0]?.productId || '',
      quantity: lines.reduce((acc, l) => acc + l.quantity, 0),
      unitId: lines[0]?.unitId || '',
      documentNumber: dto.movementCode,
      movementCode: dto.movementCode,
      referenceDocType: dto.referenceDocType || undefined,
      referenceDocNumber: dto.referenceDocNumber || undefined,
      documentType: dto.referenceDocType || undefined,
      motive: dto.reason || undefined,
      costCenterId: dto.costCenterCode || undefined,
      costCenterNameSnapshot: dto.costCenterNameSnapshot || undefined,
      registeredBy: dto.registeredByUserId,
      requesterId: dto.requestedByUserId || undefined,
      createdAt: dto.createdAt,
      submittedAt: dto.submittedAt || undefined,
      confirmedAt: dto.confirmedAt || undefined,
      isSensitive: dto.sensitive,
      supplierId: dto.supplierId || undefined,
      lines,
    };
  }

  private mapHistoryItem(dto: BackendMovementHistoryItem): Movement {
    const typeMap: Record<string, MovementType> = {
      ENTRY: 'entrada', EXIT: 'salida', TRANSFER: 'transferencia',
      ADJUST_POSITIVE: 'ajuste_positivo', ADJUST_NEGATIVE: 'ajuste_negativo',
    };
    const statusMap: Record<string, MovementStatus> = {
      DRAFT: 'borrador', PENDING_AUTHORIZATION: 'pendiente_autorizacion',
      AUTHORIZED: 'autorizado', CONFIRMED: 'confirmado', REJECTED: 'rechazado', CANCELLED: 'cancelado',
    };
    return {
      id: dto.id,
      movementCode: dto.movementCode,
      type: typeMap[dto.movementType] ?? 'entrada',
      status: statusMap[dto.status] ?? 'borrador',
      productId: '', quantity: 0, unitId: '',
      documentNumber: dto.movementCode,
      documentType: dto.referenceDocType || undefined,
      referenceDocType: dto.referenceDocType || undefined,
      referenceDocNumber: dto.referenceDocNumber || undefined,
      motive: dto.reason || undefined,
      registeredBy: dto.registeredByUserId,
      requesterId: dto.requestedByUserId || undefined,
      costCenterId: dto.costCenterCode || undefined,
      costCenterNameSnapshot: dto.costCenterNameSnapshot || undefined,
      createdAt: dto.createdAt,
      submittedAt: dto.submittedAt || undefined,
      confirmedAt: dto.confirmedAt || undefined,
      isSensitive: dto.sensitive,
    };
  }
}
