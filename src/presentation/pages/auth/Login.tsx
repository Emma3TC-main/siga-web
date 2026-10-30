import { useState } from 'react';
import { useAuth } from '../../state/AuthContext';
import { Button, Input } from '../../components/ui';
import { EyeIcon } from '../../components/ui';
import industrialBg from '../../../assets/industrial.jpg';
import { ApiError } from '../../../infrastructure/http/ApiClient';
import { getErrorMessage } from '../../../shared/errors/getErrorMessage';

export default function Login() {
  const { phase, enrollment, loginWithPassword, enrollMfa, verifyMfa, resetLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithPassword(email, password);
      setPassword('');
    } catch (cause: unknown) {
      setError(cause instanceof ApiError && cause.status === 401
        ? 'Usuario o contraseña incorrectos.'
        : cause instanceof ApiError && cause.status === 429
          ? 'Demasiados intentos. Espera antes de volver a intentarlo.'
          : getErrorMessage(cause));
    } finally {
      setLoading(false);
    }
  }

  async function handleEnrollment() {
    setError('');
    setLoading(true);
    try {
      await enrollMfa();
    } catch (cause: unknown) {
      if (cause instanceof ApiError && cause.status === 409) {
        setError('MFA ya está configurado. Ingresa el código de tu autenticador.');
      } else if (cause instanceof ApiError && (cause.status === 401 || cause.status === 429)) {
        setError('El desafío MFA venció o dejó de ser válido. Inicia sesión nuevamente.');
      } else {
        setError(getErrorMessage(cause));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setError('Ingresa exactamente 6 dígitos.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await verifyMfa(otp);
      setOtp('');
    } catch (cause: unknown) {
      setOtp('');
      setError(cause instanceof ApiError && cause.status === 429
        ? 'Se agotaron los intentos MFA. Inicia sesión para obtener un desafío nuevo.'
        : cause instanceof ApiError && cause.status === 401
          ? 'Código inválido o desafío vencido. Inicia sesión nuevamente.'
          : getErrorMessage(cause));
    } finally {
      setLoading(false);
    }
  }

  if (phase === 'MFA_CHALLENGE' || phase === 'MFA_ENROLLMENT') {
    return (
      <div className="min-h-full bg-[#093C5D] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-2 bg-[#6FD1D7]" />
          <div className="p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#3B7597] mb-2">Verificación en dos pasos</p>
            <h1 className="text-2xl font-bold text-[#093C5D]">Código de autenticación</h1>
            <p className="text-sm text-gray-500 mt-2">
              Ingresa el código de 6 dígitos generado por tu aplicación autenticadora.
            </p>

            {phase === 'MFA_ENROLLMENT' && enrollment && (
              <div className="mt-5 rounded-lg border border-[#6FD1D7]/60 bg-[#6FD1D7]/10 p-4 space-y-3">
                <p className="text-sm font-semibold text-[#093C5D]">Configura tu autenticador</p>
                <p className="text-xs text-gray-600">Abre este URI con tu aplicación TOTP:</p>
                <code className="block break-all rounded bg-white p-2 text-xs text-[#093C5D]">{enrollment.otpauthUri}</code>
                <p className="text-xs text-gray-600">Si no puedes abrirlo, usa esta clave manual:</p>
                <code className="block break-all rounded bg-white p-2 text-sm font-semibold tracking-wide text-[#093C5D]">{enrollment.secret}</code>
              </div>
            )}

            {error && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <form onSubmit={handleOtp} className="mt-5 space-y-4">
              <Input
                label="Código de 6 dígitos"
                value={otp}
                onChange={event => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                required
              />
              <Button type="submit" className="w-full" loading={loading} disabled={otp.length !== 6}>
                Verificar y continuar
              </Button>
            </form>

            {phase === 'MFA_CHALLENGE' && (
              <Button type="button" variant="outline" className="w-full mt-3" onClick={handleEnrollment} disabled={loading}>
                Configurar MFA
              </Button>
            )}
            <button
              type="button"
              className="w-full mt-5 text-xs text-[#3B7597] hover:underline"
              onClick={() => { setError(''); setOtp(''); resetLogin(); }}
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

return (
  <div
    className="min-h-full relative bg-cover bg-center"
    style={{
      backgroundImage: `url(${industrialBg})`,
    }}
  >
    {/* Capa azul sobre la imagen */}
    <div className="absolute inset-0 bg-[#093C5D]/90"></div>

    {/* Contenido principal */}
    <div className="relative z-10 min-h-full flex">

      {/* Panel izquierdo */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 text-white">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#6FD1D7] flex items-center justify-center shadow-md">
            <span className="text-[#093C5D] font-bold text-lg font-display">
              S
            </span>
          </div>

          <div>
            <div className="font-bold text-xl font-display tracking-wide">
              SIGA
            </div>

            <div className="text-white/50 text-xs font-mono">
              Sistema Integral de Gestión de Almacén
            </div>
          </div>
        </div>

        {/* Información principal */}
        <div className="max-w-lg translate-y-[70px]">

          <div className="w-14 h-1 bg-[#6FD1D7] rounded-full mb-6"></div>

          <h1 className="text-4xl font-bold font-display leading-tight mb-4">
            Gestión eficiente de tu
            <br />

            <span className="text-[#6FD1D7]">
              almacén e inventario
            </span>
          </h1>

          <p className="text-white/65 text-sm leading-relaxed max-w-md">
            Sistema diseñado para facilitar el control de productos,
            movimientos, ubicaciones y existencias dentro del almacén,
            manteniendo un seguimiento organizado de las operaciones.
          </p>

          {/* Características */}
          <div className="mt-8 space-y-4">

            <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="w-9 h-9 rounded-lg bg-[#6FD1D7]/15 flex items-center justify-center text-[#6FD1D7] font-bold text-sm">
                01
              </div>

              <div>
                <div className="text-sm font-semibold">
                  Control de inventario
                </div>

                <div className="text-xs text-white/45">
                  Consulta y seguimiento de las existencias.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="w-9 h-9 rounded-lg bg-[#6FD1D7]/15 flex items-center justify-center text-[#6FD1D7] font-bold text-sm">
                02
              </div>

              <div>
                <div className="text-sm font-semibold">
                  Gestión de ubicaciones
                </div>

                <div className="text-xs text-white/45">
                  Organización de productos dentro del almacén.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="w-9 h-9 rounded-lg bg-[#6FD1D7]/15 flex items-center justify-center text-[#6FD1D7] font-bold text-sm">
                03
              </div>

              <div>
                <div className="text-sm font-semibold">
                  Seguimiento de movimientos
                </div>

                <div className="text-xs text-white/45">
                  Registro de entradas, salidas y operaciones.
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="text-white/30 text-xs translate-y-[90px]">
          © 2026 SIGA — Sistema Integral de Gestión de Almacén
        </div>

      </div>

      {/* Panel derecho */}
      <div className="flex-1 flex items-center justify-center p-6">

        <div className="w-full max-w-md translate-y-[60px]">

          {/* Logo móvil */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-[#6FD1D7] flex items-center justify-center">
              <span className="text-[#093C5D] font-bold text-lg">
                S
              </span>
            </div>

            <div className="text-white">
              <div className="font-bold text-xl">
                SIGA
              </div>

              <div className="text-white/50 text-xs">
                Sistema Integral de Gestión de Almacén
              </div>
            </div>
          </div>

          {/* Tarjeta login */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">

            {/* Barra superior */}
            <div className="h-2 bg-[#6FD1D7]"></div>

            <div className="p-8">

              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#3B7597] mb-2">
                  Bienvenido
                </p>

                <h2 className="text-2xl font-bold text-[#093C5D] font-display">
                  Iniciar sesión
                </h2>

                <p className="text-sm text-gray-400 mt-2">
                  Ingresa tus credenciales para acceder al sistema.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <span className="text-red-500 text-sm flex-shrink-0 mt-0.5">
                    ⚠
                  </span>

                  <span className="text-red-700 text-sm">
                    {error}
                  </span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">

                <Input
                  label="Usuario o correo electrónico"
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="usuario o correo"
                  required
                />

                {/* Contraseña */}
                <div className="flex flex-col gap-1">

                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Contraseña
                  </label>

                  <div className="relative">

                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="siga-input pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#093C5D]"
                    >
                      <EyeIcon size={16} />
                    </button>

                  </div>
                </div>

                {/* Opciones */}
                <div className="flex items-center justify-between">

                  <label className="flex items-center gap-2 cursor-pointer">

                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-[#093C5D]"
                    />

                    <span className="text-xs text-gray-500">
                      Recordarme
                    </span>
                  </label>

                  <button
                    type="button"
                    className="text-xs text-[#3B7597] hover:text-[#093C5D] hover:underline"
                  >
                    ¿Olvidó su contraseña?
                  </button>

                </div>

                {/* Botón */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-12 text-base"
                  loading={loading}
                >
                  {loading
                    ? 'Verificando credenciales...'
                    : 'Ingresar al sistema'}
                </Button>

              </form>

              <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">
                  Acceso exclusivo para usuarios autorizados
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
);
}
