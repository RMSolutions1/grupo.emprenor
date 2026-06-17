import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../AdminAuthContext'

export function adminUserInitials(email?: string | null) {
  if (!email) return 'AD'
  const local = email.split('@')[0] ?? ''
  const parts = local.split(/[._-]/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return local.slice(0, 2).toUpperCase() || 'AD'
}

export function AdminUserAvatar({ email, size = 'md' }: { email?: string | null; size?: 'sm' | 'md' }) {
  const dims = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-9 h-9 text-sm'
  return (
    <div className={`${dims} rounded-full bg-accent-500 flex items-center justify-center shrink-0 font-body font-semibold text-white`}>
      {adminUserInitials(email)}
    </div>
  )
}

export default function AdminUserMenu({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const { user, signOut } = useAdminAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  const isDark = variant === 'dark'
  const triggerClass = isDark
    ? 'hover:bg-white/10 text-white'
    : 'hover:bg-background-100 text-foreground-800 border border-background-200'

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 h-9 pl-1 pr-2 rounded-lg transition-colors ${triggerClass}`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <AdminUserAvatar email={user?.email} size="sm" />
        <div className="hidden sm:block max-w-[120px] text-left">
          <p className={`text-xs font-body font-medium truncate ${isDark ? 'text-white' : 'text-foreground-800'}`}>
            {user?.email?.split('@')[0] ?? 'Admin'}
          </p>
          <p className={`text-[10px] font-body truncate ${isDark ? 'text-white/50' : 'text-foreground-400'}`}>Administrador</p>
        </div>
        <i className={`ri-arrow-down-s-line text-sm ${isDark ? 'text-white/60' : 'text-foreground-400'}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-xl border border-background-200 bg-white shadow-xl py-1 z-50"
        >
          <div className="px-3 py-2 border-b border-background-100">
            <p className="text-xs font-body font-medium text-foreground-900 truncate">{user?.email}</p>
            <p className="text-[10px] font-body text-foreground-400">Administrador</p>
          </div>
          <Link
            to="/admin/paginas"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-sm font-body text-foreground-700 hover:bg-background-50"
          >
            <i className="ri-settings-3-line text-foreground-500" />
            Configuración
          </Link>
          <Link
            to="/admin/contacto"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-sm font-body text-foreground-700 hover:bg-background-50"
          >
            <i className="ri-phone-line text-foreground-500" />
            Datos de contacto
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-body text-red-600 hover:bg-red-50 text-left"
          >
            <i className="ri-logout-box-line" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
