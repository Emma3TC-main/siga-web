import { type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes, type SelectHTMLAttributes, useState, useEffect, useRef, useId } from 'react';
import { useApp } from '../../state/AppContext';

// ─── BUTTON ───────────────────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[#093C5D] text-white hover:bg-[#0a4f7a] border-[#093C5D] hover:border-[#0a4f7a]',
  secondary: 'bg-[#3B7597] text-white hover:bg-[#2d5c75] border-[#3B7597] hover:border-[#2d5c75]',
  accent: 'bg-[#6FD1D7] text-[#093C5D] hover:bg-[#5bc0c6] border-[#6FD1D7]',
  success: 'bg-[#5DF8D8] text-[#093C5D] hover:bg-[#4de5c6] border-[#5DF8D8]',
  danger: 'bg-red-600 text-white hover:bg-red-700 border-red-600',
  ghost: 'bg-transparent text-[#3B7597] hover:bg-[#093C5D]/5 border-transparent',
  outline: 'bg-transparent text-[#093C5D] hover:bg-[#093C5D]/5 border-[#DDE3EA] hover:border-[#3B7597]',
};
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 h-7 gap-1.5',
  md: 'text-sm px-4 py-2 h-9 gap-2',
  lg: 'text-base px-5 py-2.5 h-11 gap-2',
};

export function Button({ variant = 'primary', size = 'md', loading, icon, iconRight, children, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium rounded-[6px] border transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {loading ? <Spinner size={size === 'sm' ? 12 : 16} /> : icon}
      {children}
      {iconRight && !loading && iconRight}
    </button>
  );
}

// ─── TABLE ACTION BUTTON ──────────────────────────────────────────────────────
// Botón "ghost" estándar para columnas de acciones de tabla (Fase 8, Bloque 1).
// Unifica tamaño, padding, hover, foco y tooltip que antes variaban por módulo.
type TableActionVariant = 'default' | 'success' | 'danger' | 'warning';

const tableActionVariantStyles: Record<TableActionVariant, string> = {
  default: 'text-[#3B7597] hover:bg-[#6FD1D7]/20 hover:text-[#093C5D]',
  success: 'text-emerald-600 hover:bg-emerald-50',
  danger: 'text-red-500 hover:bg-red-50',
  warning: 'text-amber-600 hover:bg-amber-50',
};

interface TableActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: TableActionVariant;
  disabled?: boolean;
}

export function TableActionButton({ icon, label, onClick, variant = 'default', disabled }: TableActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`p-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FD1D7] disabled:opacity-40 disabled:cursor-not-allowed ${tableActionVariantStyles[variant]}`}
    >
      {icon}
    </button>
  );
}

// ─── SPINNER ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
type BadgeVariant = 'normal' | 'warning' | 'error' | 'success' | 'info' | 'muted' | 'primary';

const badgeStyles: Record<BadgeVariant, string> = {
  normal: 'bg-[#5DF8D8]/20 text-[#047857] border-[#5DF8D8]/40',
  success: 'bg-[#5DF8D8]/20 text-[#047857] border-[#5DF8D8]/40',
  info: 'bg-[#6FD1D7]/20 text-[#0e7490] border-[#6FD1D7]/40',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  muted: 'bg-gray-100 text-gray-600 border-gray-200',
  primary: 'bg-[#093C5D]/10 text-[#093C5D] border-[#093C5D]/20',
};

export function Badge({ variant = 'muted', children, dot }: { variant?: BadgeVariant; children: ReactNode; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${badgeStyles[variant]}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

// ─── INPUT ────────────────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

export function Input({ label, error, hint, icon, className = '', ...props }: InputProps) {
  const generatedId = useId();
  const inputId = props.id ?? generatedId;
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={inputId} className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input id={inputId} aria-invalid={Boolean(error)} className={`siga-input ${icon ? 'pl-9' : ''} ${error ? 'border-red-400 focus:border-red-500' : ''} ${className}`} {...props} />
      </div>
      {error && <span className="text-xs text-red-600 flex items-center gap-1"><AlertIcon size={12} />{error}</span>}
      {hint && !error && <span className="text-xs text-gray-400">{hint}</span>}
    </div>
  );
}

// ─── SELECT ───────────────────────────────────────────────────────────────────
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export function Select({ label, error, children, className = '', ...props }: SelectProps) {
  const generatedId = useId();
  const selectId = props.id ?? generatedId;
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={selectId} className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>}
      <select id={selectId} aria-invalid={Boolean(error)} className={`siga-select ${error ? 'border-red-400' : ''} ${className}`} {...props}>
        {children}
      </select>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

// ─── TEXTAREA ─────────────────────────────────────────────────────────────────
export function Textarea({ label, error, className = '', ...props }: { label?: string; error?: string; className?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const generatedId = useId();
  const textareaId = props.id ?? generatedId;
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={textareaId} className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>}
      <textarea id={textareaId} aria-invalid={Boolean(error)} className={`siga-input resize-none ${error ? 'border-red-400' : ''} ${className}`} rows={3} {...props} />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  footer?: ReactNode;
}

const modalSizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-[94vw] lg:max-w-[80vw]' };

export function Modal({ open, onClose, title, children, size = 'md', footer }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#0D1B2A]/50 backdrop-blur-sm" />
      <div className={`relative w-full ${modalSizes[size]} bg-white rounded-xl shadow-2xl modal-content flex flex-col max-h-[90vh]`} onClick={e => e.stopPropagation()}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-[#093C5D]">{title}</h2>
            <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <XIcon size={18} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

// ─── DETAIL VIEW (Fase 7, Bloque 3 — "nueva filosofía" de modales de detalle) ──
// Patrón introducido en AuthorizationDetailModal.tsx (Fase 7, Bloque 1) y ahora
// extraído aquí porque se repite en todos los modales de detalle del sistema:
// encabezado con badges de estado, secciones con título uppercase pequeño, y
// grids de "tarjetas" bg-gray-50 rounded-lg. No reemplaza Modal, se usa dentro.
export function DetailHeader({ eyebrow, title, badges }: { eyebrow?: ReactNode; title: ReactNode; badges?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 p-4 bg-[#093C5D]/3 rounded-lg">
      <div>
        {eyebrow && <div className="font-mono text-xs text-[#3B7597] mb-1">{eyebrow}</div>}
        <div className="font-bold text-[#093C5D] text-base">{title}</div>
      </div>
      {badges && <div className="flex gap-1.5 flex-shrink-0">{badges}</div>}
    </div>
  );
}

export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{title}</h3>
      {children}
    </div>
  );
}

export function DetailField({ label, value, className = '' }: { label: string; value: ReactNode; className?: string }) {
  return (
    <div className={`p-3 bg-gray-50 rounded-lg ${className}`}>
      <div className="text-xs text-gray-400">{label}</div>
      <div className="font-semibold text-[#093C5D]">{value}</div>
    </div>
  );
}

// ─── CONFIRM DIALOG ───────────────────────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirmar', variant = 'primary', loading }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: ReactNode; confirmLabel?: string; variant?: ButtonVariant; loading?: boolean }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={<><Button variant="outline" onClick={onClose}>Cancelar</Button><Button variant={variant} onClick={onConfirm} loading={loading}>{confirmLabel}</Button></>}>
      <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
    </Modal>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
const toastStyles = {
  success: { bg: 'bg-white border-l-4 border-[#5DF8D8]', icon: '✓', iconColor: 'text-emerald-600' },
  error: { bg: 'bg-white border-l-4 border-red-500', icon: '✕', iconColor: 'text-red-600' },
  warning: { bg: 'bg-white border-l-4 border-amber-400', icon: '⚠', iconColor: 'text-amber-600' },
  info: { bg: 'bg-white border-l-4 border-[#6FD1D7]', icon: 'i', iconColor: 'text-[#3B7597]' },
};

export function ToastContainer() {
  const { state, showToast: _ } = useApp();
  const dispatch = useApp();
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {state.toasts.map(toast => {
        const style = toastStyles[toast.type];
        return (
          <div key={toast.id} className={`${style.bg} rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[280px] max-w-sm pointer-events-auto toast-enter`}>
            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${style.iconColor} bg-current/10`}>{style.icon}</span>
            <p className="text-sm text-gray-700 flex-1 leading-snug">{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
}

// ─── SKELETON ─────────────────────────────────────────────────────────────────
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="p-4 space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── KPI CARD ─────────────────────────────────────────────────────────────────
export function KpiCard({ title, value, unit, icon, trend, trendLabel, variant = 'default', onClick, badge }: {
  title: string; value: string | number; unit?: string; icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral'; trendLabel?: string;
  variant?: 'default' | 'warning' | 'error' | 'success' | 'info';
  onClick?: () => void; badge?: ReactNode;
}) {
  const variantMap = {
    default: 'text-[#093C5D]',
    warning: 'text-amber-600',
    error: 'text-red-600',
    success: 'text-emerald-600',
    info: 'text-[#3B7597]',
  };
  const iconBg = {
    default: 'bg-[#093C5D]/10 text-[#3B7597]',
    warning: 'bg-amber-50 text-amber-600',
    error: 'bg-red-50 text-red-600',
    success: 'bg-[#5DF8D8]/20 text-emerald-600',
    info: 'bg-[#6FD1D7]/20 text-[#3B7597]',
  };
  return (
    <div className={`siga-card p-5 ${onClick ? 'cursor-pointer hover:border-[#3B7597] hover:shadow-md transition-all' : ''}`} onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${iconBg[variant]}`}>{icon}</div>
        {badge}
      </div>
      <div className={`text-2xl font-bold font-display mb-0.5 ${variantMap[variant]}`}>{value}{unit && <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>}</div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</div>
      {trendLabel && (
        <div className={`text-xs mt-2 flex items-center gap-1 ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-gray-400'}`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendLabel}
        </div>
      )}
    </div>
  );
}

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────
export function PageHeader({ title, description, breadcrumbs, actions, children }: { title: string; description?: string; breadcrumbs?: { label: string; onClick?: () => void }[]; actions?: ReactNode; children?: ReactNode }) {
  return (
    <div className="page-header">
      {breadcrumbs && (
        <nav className="flex items-center gap-1 text-xs text-gray-400 mb-2">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span>/</span>}
              {crumb.onClick ? <button onClick={crumb.onClick} className="hover:text-[#3B7597] transition-colors">{crumb.label}</button> : <span className="text-gray-600">{crumb.label}</span>}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-display text-[#093C5D]">{title}</h1>
          {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
          {children}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action, compact }: { icon: ReactNode; title: string; description?: string; action?: ReactNode; compact?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center px-8 text-center ${compact ? 'py-6' : 'py-16'}`}>
      <div className="text-gray-300 mb-4">{icon}</div>
      <h3 className="text-base font-semibold text-gray-600 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-400 mb-4 max-w-xs">{description}</p>}
      {action}
    </div>
  );
}

// ─── STATUS BADGE (inventory states) ─────────────────────────────────────────
export function InventoryStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    normal: { label: 'Normal', variant: 'normal' },
    bajo_stock: { label: 'Bajo stock', variant: 'warning' },
    sin_stock: { label: 'Sin stock', variant: 'error' },
    proximo_vencer: { label: 'Próx. vencer', variant: 'warning' },
    vencido: { label: 'Vencido', variant: 'error' },
    cuarentena: { label: 'Cuarentena', variant: 'muted' },
  };
  const s = map[status] ?? { label: status, variant: 'muted' as BadgeVariant };
  return <Badge variant={s.variant} dot>{s.label}</Badge>;
}

export function MachineryStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    operativo: { label: 'Operativo', variant: 'success' },
    mantenimiento: { label: 'En mantenimiento', variant: 'warning' },
    inoperativo: { label: 'Inoperativo', variant: 'error' },
    transito: { label: 'En tránsito', variant: 'info' },
    fuera_servicio: { label: 'Fuera de servicio', variant: 'muted' },
  };
  const s = map[status] ?? { label: status, variant: 'muted' as BadgeVariant };
  return <Badge variant={s.variant} dot>{s.label}</Badge>;
}

export function MovementStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    confirmado: { label: 'Confirmado', variant: 'success' },
    pendiente_autorizacion: { label: 'Pendiente autorización', variant: 'warning' },
    autorizado: { label: 'Autorizado', variant: 'info' },
    rechazado: { label: 'Rechazado', variant: 'error' },
    borrador: { label: 'Borrador', variant: 'muted' },
  };
  const s = map[status] ?? { label: status, variant: 'muted' as BadgeVariant };
  return <Badge variant={s.variant} dot>{s.label}</Badge>;
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const icon = (path: string | ReactNode, size = 20) => ({ size, className }: { size?: number; className?: string }) => (
  <svg width={size ?? 20} height={size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {typeof path === 'string' ? <path d={path} /> : path}
  </svg>
);

export const HomeIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
export const PackageIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
export const ArrowDownIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>;
export const ArrowUpIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>;
export const ArrowsIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>;
export const AdjustIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M5.34 17.66l-1.41 1.41M20 12h2M2 12h2M17.66 18.66l1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2"/></svg>;
export const ClipboardIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>;
export const FolderIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
export const MapPinIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
export const TruckIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
export const EyeIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
export const CheckIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>;
export const XIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
export const SearchIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
export const FilterIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
export const PlusIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
export const EditIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
export const TrashIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
export const BellIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
export const UsersIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
export const ShieldIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
export const BarChartIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
export const ActivityIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
export const LinkIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
export const ServerIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>;
export const UserIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
export const LogOutIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
export const ChevronDownIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"/></svg>;
export const ChevronRightIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"/></svg>;
export const MenuIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
export const AlertIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
export const DownloadIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
export const RefreshIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>;
export const UploadIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
export const FileIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
export const SettingsIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M5.34 17.66l-1.41 1.41M20 12h2M2 12h2M17.66 18.66l1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2"/></svg>;
export const QrIcon = ({ size = 20, className }: { size?: number; className?: string }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="8" height="8"/><rect x="14" y="2" width="8" height="8"/><rect x="2" y="14" width="8" height="8"/><rect x="6" y="6" width="2" height="2" fill="currentColor" stroke="none"/><rect x="18" y="6" width="2" height="2" fill="currentColor" stroke="none"/><rect x="6" y="18" width="2" height="2" fill="currentColor" stroke="none"/><path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" fill="currentColor" stroke="none"/></svg>;

// ─── DRAWER ───────────────────────────────────────────────────────────────────
export function Drawer({ open, onClose, title, children, side = 'right' }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; side?: 'left' | 'right' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      {side === 'left' && <div className="relative w-80 bg-white h-full shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        {title && <div className="flex items-center justify-between px-5 py-4 border-b"><h2 className="font-semibold text-[#093C5D]">{title}</h2><button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon size={18} /></button></div>}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>}
      {side === 'right' && <div className="ml-auto relative w-80 max-w-[90vw] bg-white h-full shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        {title && <div className="flex items-center justify-between px-5 py-4 border-b"><h2 className="font-semibold text-[#093C5D]">{title}</h2><button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon size={18} /></button></div>}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>}
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }: { tabs: { id: string; label: string; count?: number }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="flex border-b border-gray-200 overflow-x-auto">
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)}
          className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${active === tab.id ? 'border-[#093C5D] text-[#093C5D]' : 'border-transparent text-gray-500 hover:text-[#3B7597] hover:border-[#3B7597]/50'}`}>
          {tab.label}
          {tab.count !== undefined && <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${active === tab.id ? 'bg-[#093C5D]/10 text-[#093C5D]' : 'bg-gray-100 text-gray-500'}`}>{tab.count}</span>}
        </button>
      ))}
    </div>
  );
}

// ─── STEP WIZARD ──────────────────────────────────────────────────────────────
export function StepWizard({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${i < current ? 'bg-[#5DF8D8] border-[#5DF8D8] text-[#093C5D]' : i === current ? 'bg-[#093C5D] border-[#093C5D] text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
              {i < current ? <CheckIcon size={14} /> : i + 1}
            </div>
            <span className={`text-xs mt-1 font-medium text-center whitespace-nowrap ${i === current ? 'text-[#093C5D]' : i < current ? 'text-emerald-600' : 'text-gray-400'}`}>{step}</span>
          </div>
          {i < steps.length - 1 && <div className={`h-0.5 flex-1 mx-2 mt-[-14px] ${i < current ? 'bg-[#5DF8D8]' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );
}

// ─── FORMAT HELPERS ───────────────────────────────────────────────────────────
export function formatCurrency(val: number): string {
  return `S/ ${val.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatNumber(val: number): string {
  return val.toLocaleString('es-PE', { maximumFractionDigits: 2 });
}
