import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { useUsers } from '../../hooks/useUsers';
import { Button, Input, Spinner } from '../../components/ui';
import { EyeIcon } from '../../components/ui';

// Cuentas demo para pruebas del sistema. No se exponen en la interfaz de Login:
// el usuario debe ingresar sus credenciales manualmente.
const DEMO_ACCOUNTS = [
  { email: 'admin@siga.demo', password: 'admin123', label: 'Administrador', role: 'admin' },
  { email: 'supervisor@siga.demo', password: 'sup123', label: 'Supervisor de Almacén', role: 'supervisor' },
  { email: 'almacen@siga.demo', password: 'alm123', label: 'Encargado de Almacén', role: 'warehouse' },
];

export default function Login() {
  const { login, showToast } = useApp();
  const { users } = useUsers();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const account = DEMO_ACCOUNTS.find(item => item.email === email && item.password === password);
    const user = account ? users.find(item => item.email === account.email) : undefined;
    if (!user) { setError(`401 UNAUTHORIZED · Credenciales incorrectas · correlationId SIGA-LOGIN-${Date.now().toString(36).toUpperCase()}`); setLoading(false); return; }
    if (user.status === 'inactive') { setError(`403 FORBIDDEN · Usuario desactivado · correlationId SIGA-USER-${user.id}`); setLoading(false); return; }
    login(user);
    showToast('success', `Bienvenido al sistema, ${user.name} ${user.lastName}`);
    setLoading(false);
  }

  return (
    <div className="min-h-full flex" style={{ background: 'linear-gradient(135deg, #093C5D 0%, #0a4f7a 35%, #3B7597 100%)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6FD1D7] to-[#5DF8D8] flex items-center justify-center">
            <span className="text-[#093C5D] font-bold text-lg font-display">S</span>
          </div>
          <div>
            <div className="font-bold text-xl font-display tracking-wide">SIGA</div>
            <div className="text-white/50 text-xs font-mono">Sistema Integral de Gestión de Almacén</div>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold font-display leading-tight mb-4">
            Control total de tu<br />
            <span className="text-[#6FD1D7]">inventario industrial</span>
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            Gestión profesional para operaciones mecánicas y mineras. Trazabilidad completa, autorizaciones de movimientos, kardex en tiempo real y reportes avanzados.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { label: 'Trazabilidad', desc: 'Completa y auditada' },
              { label: 'Multi-ubicación', desc: 'Control por rack y posición' },
              { label: 'Lotes y series', desc: 'Tracking granular' },
              { label: 'Autorizaciones', desc: 'Flujo de aprobación' },
            ].map((f, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-[#5DF8D8] font-semibold text-sm">{f.label}</div>
                <div className="text-white/50 text-xs mt-0.5">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-white/30 text-xs">
          © 2025 SIGA — Sector Mecánico / Minero · v1.0.0
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white/5 backdrop-blur-sm lg:bg-transparent">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6FD1D7] to-[#5DF8D8] flex items-center justify-center">
              <span className="text-[#093C5D] font-bold text-lg font-display">S</span>
            </div>
            <div className="text-white">
              <div className="font-bold text-xl font-display">SIGA</div>
              <div className="text-white/50 text-xs">Sistema Integral de Gestión de Almacén</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#093C5D] font-display">Iniciar sesión</h2>
              <p className="text-sm text-gray-400 mt-1">Sector Mecánico · Minero</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <span className="text-red-500 text-sm flex-shrink-0 mt-0.5">⚠</span>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usuario@empresa.com"
                required
              />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="siga-input pr-10"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <EyeIcon size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-[#093C5D]" />
                  <span className="text-xs text-gray-500">Recordarme</span>
                </label>
                <button type="button" className="text-xs text-[#3B7597] hover:text-[#093C5D] hover:underline">¿Olvidó su contraseña?</button>
              </div>

              <Button type="submit" variant="primary" className="w-full h-11 text-base" loading={loading}>
                {loading ? 'Verificando credenciales...' : 'Ingresar al sistema'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
