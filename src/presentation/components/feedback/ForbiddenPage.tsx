import { useApp } from '../../state/AppContext';
import { Button, ShieldIcon } from '../ui';

export default function ForbiddenPage({ moduleName }: { moduleName: string }) {
  const { navigate, state } = useApp();
  const correlationId = `SIGA-403-${state.currentUser?.id ?? 'ANON'}-${moduleName.toUpperCase()}`;
  return <div className="min-h-full flex items-center justify-center p-6"><div className="siga-card max-w-md w-full p-8 text-center"><div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center"><ShieldIcon size={28} /></div><div className="text-xs font-bold text-amber-600 mt-4">403 · ACCESO DENEGADO</div><h1 className="text-xl font-bold text-[#093C5D] mt-1">No tiene permiso para este módulo</h1><p className="text-sm text-gray-500 mt-2">El rol <strong>{state.currentUser?.role}</strong> no incluye acceso a {moduleName}. No se realizaron cambios.</p><code className="block mt-4 p-2 rounded bg-gray-100 text-xs text-gray-600">correlationId: {correlationId}</code><Button className="mt-5" onClick={() => navigate('/dashboard')}>Volver al inicio</Button></div></div>;
}
