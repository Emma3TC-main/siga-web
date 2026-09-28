import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { getBreadcrumbs } from '../../navigation/routeRegistry';
import { Button, PageHeader } from '../../components/ui';

const PARAMS: { section: string; items: { key: string; label: string; value: string; type: string; hint?: string; options?: string[] }[] }[] = [
  { section: 'Inventario', items: [
    { key: 'stock_min_alert_days', label: 'Días de anticipación alerta stock mínimo', value: '7', type: 'number', hint: 'Días antes de llegar al stock mínimo para generar alerta' },
    { key: 'expiry_alert_days', label: 'Días de anticipación alerta vencimiento', value: '30', type: 'number', hint: 'Días antes del vencimiento para generar alerta' },
    { key: 'cost_method', label: 'Método de costeo', value: 'ponderado', type: 'select', options: ['ponderado'], hint: 'Promedio ponderado obligatorio según la especificación técnica' },
    { key: 'negative_stock', label: 'Permitir stock negativo', value: 'false', type: 'select', options: ['false'], hint: 'Regla de dominio: el stock nunca puede quedar en negativo' },
  ]},
  { section: 'Movimientos', items: [
    { key: 'sensitive_threshold', label: 'Umbral de movimiento sensible (S/)', value: '5000', type: 'number', hint: 'Movimientos por encima de este monto requieren autorización' },
    { key: 'auto_auth_timeout', label: 'Horas para caducidad de autorización', value: '72', type: 'number', hint: 'Horas antes de que una autorización pendiente expire' },
    { key: 'require_evidence', label: 'Exigir evidencia en ajustes negativos', value: 'true', type: 'select', options: ['true', 'false'] },
  ]},
  { section: 'Sistema', items: [
    { key: 'company_name', label: 'Nombre de la empresa', value: 'MegaMinera SAC', type: 'text' },
    { key: 'ruc', label: 'RUC', value: '20512345678', type: 'text' },
    { key: 'currency', label: 'Moneda', value: 'PEN', type: 'select', options: ['PEN', 'USD', 'EUR'] },
    { key: 'timezone', label: 'Zona horaria', value: 'America/Lima', type: 'select', options: ['America/Lima', 'America/Bogota', 'America/Santiago'] },
    { key: 'session_timeout', label: 'Timeout de sesión (minutos)', value: '60', type: 'number' },
  ]},
];

export default function Parameters() {
  const { navigate, showToast } = useApp();
  const [params, setParams] = useState(() => {
    const map: Record<string, string> = {};
    PARAMS.forEach(s => s.items.forEach(i => { map[i.key] = i.value; }));
    return map;
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    showToast('success', 'Parámetros del sistema guardados correctamente.');
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Parámetros del Sistema" description="Configuración global del comportamiento de SIGA"
        breadcrumbs={getBreadcrumbs('parameters', navigate)}
        actions={<Button variant="primary" size="sm" onClick={handleSave}>{saved ? '✓ Guardado' : 'Guardar cambios'}</Button>}
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {PARAMS.map(section => (
          <div key={section.section} className="siga-card p-5">
            <h3 className="font-bold text-[#093C5D] font-display mb-4 pb-3 border-b border-gray-100">{section.section}</h3>
            <div className="space-y-4">
              {section.items.map(item => (
                <div key={item.key} className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="block text-sm font-medium text-gray-700">{item.label}</label>
                      <code className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded sm:hidden">{item.key}</code>
                    </div>
                    {item.hint && <p className="text-xs text-gray-400 mb-2 mt-0.5">{item.hint}</p>}
                    {item.type === 'select' ? (
                      <select value={params[item.key]} onChange={e => setParams(p => ({ ...p, [item.key]: e.target.value }))} className="siga-select w-full sm:w-64">
                        {item.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={item.type} value={params[item.key]} onChange={e => setParams(p => ({ ...p, [item.key]: e.target.value }))}
                        className="siga-input w-full sm:w-64" />
                    )}
                  </div>
                  <div className="hidden sm:block pt-6 flex-shrink-0">
                    <code className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{item.key}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
