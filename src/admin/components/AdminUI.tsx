import type { ReactNode } from 'react'

export { AdminImageField } from './AdminImageField'

export function AdminPage({ title, description, actions, children }: {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="min-h-full">
      <header className="bg-white border-b border-background-200 px-4 md:px-8 py-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground-950">{title}</h1>
          {description && <p className="text-sm font-body text-foreground-500 mt-1 max-w-2xl">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </header>
      <div className="p-4 md:p-8 max-w-[1400px]">{children}</div>
    </div>
  )
}

export function AdminCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-background-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export function AdminButton({ children, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }) {
  const styles = {
    primary: 'bg-accent-500 hover:bg-accent-600 text-white',
    secondary: 'bg-primary-500 hover:bg-primary-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-background-200 text-foreground-700 border border-background-300',
  }
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center gap-2 px-4 h-10 rounded-lg text-sm font-body font-medium transition-colors disabled:opacity-50 ${styles[variant]} ${props.className ?? ''}`}
    >
      {children}
    </button>
  )
}

export function AdminInput({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-body font-medium text-foreground-600 mb-1">{label}</span>}
      <input
        {...props}
        className={`w-full h-10 px-3 rounded-lg border border-background-300 bg-white text-foreground-950 placeholder:text-foreground-400 text-sm font-body focus:outline-none focus:border-accent-500 ${props.className ?? ''}`}
      />
    </label>
  )
}

export function AdminTextarea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-body font-medium text-foreground-600 mb-1">{label}</span>}
      <textarea
        {...props}
        className={`w-full px-3 py-2 rounded-lg border border-background-300 bg-white text-foreground-950 placeholder:text-foreground-400 text-sm font-body focus:outline-none focus:border-accent-500 resize-y min-h-[80px] ${props.className ?? ''}`}
      />
    </label>
  )
}

export function AdminSelect({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-body font-medium text-foreground-600 mb-1">{label}</span>}
      <select
        {...props}
        className={`w-full h-10 px-3 rounded-lg border border-background-300 bg-white text-foreground-950 placeholder:text-foreground-400 text-sm font-body focus:outline-none focus:border-accent-500 ${props.className ?? ''}`}
      >
        {children}
      </select>
    </label>
  )
}

export function AdminBadge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'accent' }) {
  const tones = {
    neutral: 'bg-background-200 text-foreground-600',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    accent: 'bg-accent-100 text-accent-700',
  }
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-body font-medium ${tones[tone]}`}>{children}</span>
}

export function AdminAlert({ children, tone = 'info', className = '' }: { children: ReactNode; tone?: 'info' | 'success' | 'error' | 'warning'; className?: string }) {
  const tones = {
    info: 'border-blue-200 bg-blue-50 text-blue-900',
    success: 'border-green-200 bg-green-50 text-green-900',
    error: 'border-red-200 bg-red-50 text-red-900',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
  }
  return <p className={`text-sm font-body px-4 py-3 rounded-lg border ${tones[tone]} ${className}`}>{children}</p>
}

export function AdminTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm font-body text-foreground-800">
        <thead>
          <tr className="border-b border-background-200 text-left">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-medium text-foreground-500 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-background-200">{children}</tbody>
      </table>
    </div>
  )
}

export function AdminModal({ open, title, onClose, children, wide }: { open: boolean; title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className={`w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto rounded-xl bg-background-50 shadow-xl border border-background-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-background-200">
          <h2 className="font-heading text-xl font-semibold text-foreground-950">{title}</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background-200 text-foreground-500" aria-label="Cerrar">
            <i className="ri-close-line text-lg" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function AdminEmpty({ message }: { message: string }) {
  return <p className="p-8 text-center text-sm font-body text-foreground-500">{message}</p>
}

export function AdminLoading() {
  return (
    <div className="p-12 flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-body text-foreground-500">Cargando datos…</p>
    </div>
  )
}

export function AdminCheckbox({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm font-body text-foreground-700 cursor-pointer">
      <input type="checkbox" {...props} className="rounded border-background-400 text-accent-500 focus:ring-accent-500" />
      {label}
    </label>
  )
}
