import { useMemo, useState } from 'react';
import { useApp } from '../../state/AppContext';
import { useUnits } from '../../hooks/useUnits';
import { useProducts } from '../../hooks/useProducts';
import { getErrorMessage } from '../../../shared/errors/getErrorMessage';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { Badge, Button, EmptyState, Input, Modal, PageHeader, PlusIcon, SearchIcon, Select } from '../../components/ui';

export default function Units() {
  const { state, navigate, showToast } = useApp();
  const { units, createUnit } = useUnits();
  const { products } = useProducts();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', group: 'Cantidad', baseUnitId: '', conversionFactor: '1' });
  const canEdit = state.currentUser?.role === 'admin';
  const filtered = useMemo(() => units.filter(item => `${item.code} ${item.name} ${item.group}`.toLowerCase().includes(query.toLowerCase())), [units, query]);

  async function handleSave() {
    if (!form.code.trim() || !form.name.trim()) return;
    try {
      await createUnit({
        code: form.code, name: form.name, group: form.group,
        baseUnitId: form.baseUnitId || undefined, conversionFactor: Number(form.conversionFactor) || 1,
      });
      setForm({ code: '', name: '', group: 'Cantidad', baseUnitId: '', conversionFactor: '1' });
      setOpen(false);
      showToast('success', 'Unidad de medida creada correctamente.');
    } catch (error) {
      showToast('error', getErrorMessage(error));
    }
  }

  return <div className="flex flex-col h-full">
    <PageHeader title="Unidades de medida" description={`${units.length} unidades configuradas`}
      breadcrumbs={getBreadcrumbs('units', navigate)}
      actions={canEdit ? <Button size="sm" icon={<PlusIcon size={14} />} onClick={() => setOpen(true)}>Nueva unidad</Button> : undefined}
    />
    <div className="p-4 sm:p-6 flex-1 overflow-auto space-y-4">
      <div className="max-w-md"><Input aria-label="Buscar unidades" icon={<SearchIcon size={15} />} placeholder="Buscar código, nombre o grupo…" value={query} onChange={event => setQuery(event.target.value)} /></div>
      {filtered.length === 0 ? <EmptyState icon={<span className="text-4xl">⚖</span>} title="No se encontraron unidades" /> : <div className="siga-card overflow-auto">
        <table className="siga-table"><thead><tr><th>Código</th><th>Nombre</th><th>Grupo</th><th>Tipo</th><th>Conversión a base</th><th className="text-right">Productos</th></tr></thead>
          <tbody>{filtered.map(item => <tr key={item.id}><td className="font-mono font-semibold text-[#3B7597]">{item.code}</td><td className="font-medium">{item.name}</td><td>{item.group}</td><td><Badge variant={item.isBase ? 'success' : 'info'}>{item.isBase ? 'Base' : 'Derivada'}</Badge></td><td>{item.isBase ? '1 (base)' : `${item.conversionFactor ?? 1} ${units.find(base => base.id === item.baseUnitId)?.code ?? ''}`}</td><td className="text-right tabular-nums">{products.filter(product => product.unitId === item.id).length}</td></tr>)}</tbody>
        </table>
      </div>}
    </div>
    <Modal open={open} onClose={() => setOpen(false)} title="Nueva unidad de medida" size="sm" footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={handleSave} disabled={!form.code.trim() || !form.name.trim()}>Guardar</Button></>}>
      <div className="space-y-4"><div className="grid grid-cols-2 gap-3"><Input label="Código" value={form.code} onChange={event => setForm(prev => ({ ...prev, code: event.target.value }))} placeholder="UND" /><Input label="Nombre" value={form.name} onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))} /></div>
        <Input label="Grupo" value={form.group} onChange={event => setForm(prev => ({ ...prev, group: event.target.value }))} />
        <Select label="Unidad base (opcional)" value={form.baseUnitId} onChange={event => setForm(prev => ({ ...prev, baseUnitId: event.target.value }))}><option value="">Esta será unidad base</option>{units.filter(item => item.isBase).map(item => <option key={item.id} value={item.id}>{item.code} — {item.name}</option>)}</Select>
        {form.baseUnitId && <Input label="Factor de conversión" type="number" min="0.0001" step="0.0001" value={form.conversionFactor} onChange={event => setForm(prev => ({ ...prev, conversionFactor: event.target.value }))} />}
      </div>
    </Modal>
  </div>;
}
