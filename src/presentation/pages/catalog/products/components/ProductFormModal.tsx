import { Button, Input, Modal, Select, Textarea } from '../../../../components/ui';
import type { Category } from '../../../../../domain/entities/Category';
import type { UnitOfMeasure } from '../../../../../domain/entities/UnitOfMeasure';
import type { ProductType } from '../../../../../domain/entities/Product';
import { PRODUCT_FLAGS, TYPE_LABELS, type ProductFormData } from '../constants';

interface Props {
  open: boolean; editMode: boolean; form: ProductFormData; categories: Category[]; units: UnitOfMeasure[];
  errors: Record<string, string>; loading: boolean; onClose: () => void;
  onFieldChange: (patch: Partial<ProductFormData>) => void; onSave: () => void;
}

export function ProductFormModal({ open, editMode, form, categories, units, errors, loading, onClose, onFieldChange, onSave }: Props) {
  const updateConversion = (index: number, patch: Partial<ProductFormData['conversions'][number]>) =>
    onFieldChange({ conversions: form.conversions.map((conversion, current) => current === index ? { ...conversion, ...patch } : conversion) });
  return (
    <Modal open={open} onClose={onClose} title={editMode ? 'Editar producto' : 'Nuevo producto'} size="xl"
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={onSave} loading={loading}>{editMode ? 'Guardar reemplazo' : 'Crear producto'}</Button></>}>
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Nombre" value={form.name} error={errors.name} onChange={event => onFieldChange({ name: event.target.value })} />
          <Input label="SKU" value={form.sku} error={errors.sku} onChange={event => onFieldChange({ sku: event.target.value })} />
          <Select label="Tipo" value={form.productType} onChange={event => onFieldChange({ productType: event.target.value as ProductType })}>
            {Object.entries(TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
          <Select label="Categoría" value={form.categoryId} error={errors.categoryId} onChange={event => onFieldChange({ categoryId: event.target.value })}>
            <option value="">Seleccionar…</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
          </Select>
          <Select label="Unidad de almacenamiento" value={form.storageUnitId} error={errors.storageUnitId} onChange={event => onFieldChange({ storageUnitId: event.target.value })}>
            <option value="">Seleccionar…</option>{units.map(unit => <option key={unit.id} value={unit.id}>{unit.name} ({unit.code})</option>)}
          </Select>
          <Select label="Unidad base" value={form.baseUnitId} error={errors.baseUnitId} onChange={event => onFieldChange({ baseUnitId: event.target.value })}>
            <option value="">Seleccionar…</option>{units.map(unit => <option key={unit.id} value={unit.id}>{unit.name} ({unit.code})</option>)}
          </Select>
          <Input label="Stock mínimo" type="number" min="0" step="any" value={form.minStock} error={errors.minStock} onChange={event => onFieldChange({ minStock: Number(event.target.value) })} />
        </div>
        <div className="flex flex-wrap gap-4 rounded-lg bg-gray-50 p-3">
          {PRODUCT_FLAGS.map(({ key, label }) => <label key={key} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form[key]} onChange={event => onFieldChange({ [key]: event.target.checked })} />{label}
          </label>)}
        </div>
        <Textarea label="Atributos técnicos (JSON)" rows={5} value={form.technicalAttributesText} error={errors.technicalAttributes} onChange={event => onFieldChange({ technicalAttributesText: event.target.value })} />
        <div>
          <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-semibold text-[#093C5D]">Conversiones (conjunto completo)</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => onFieldChange({ conversions: [...form.conversions, { fromUnitId: form.storageUnitId, toUnitId: form.baseUnitId, factor: 1, active: true }] })}>Agregar conversión</Button>
          </div>
          <div className="space-y-2">{form.conversions.map((conversion, index) => <div key={index} className="grid grid-cols-1 gap-2 rounded-lg border p-3 md:grid-cols-[1fr_1fr_1fr_auto_auto]">
            <select className="siga-select" value={conversion.fromUnitId} onChange={event => updateConversion(index, { fromUnitId: event.target.value })}><option value="">Desde…</option>{units.map(unit => <option key={unit.id} value={unit.id}>{unit.code}</option>)}</select>
            <select className="siga-select" value={conversion.toUnitId} onChange={event => updateConversion(index, { toUnitId: event.target.value })}><option value="">Hacia…</option>{units.map(unit => <option key={unit.id} value={unit.id}>{unit.code}</option>)}</select>
            <input className="siga-input" type="number" min="0" step="any" value={conversion.factor} onChange={event => updateConversion(index, { factor: Number(event.target.value) })} />
            <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={conversion.active} onChange={event => updateConversion(index, { active: event.target.checked })} />Activa</label>
            <Button type="button" variant="outline" size="sm" onClick={() => onFieldChange({ conversions: form.conversions.filter((_, current) => current !== index) })}>Quitar</Button>
            {errors[`conversions.${index}`] && <span className="text-xs text-red-600 md:col-span-5">{errors[`conversions.${index}`]}</span>}
          </div>)}</div>
        </div>
      </div>
    </Modal>
  );
}
