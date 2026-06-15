import { Link, useLocation } from 'react-router-dom'
import { isSupabaseConfigured } from '../../lib/supabase'
import { useAdminAuth } from '../AdminAuthContext'
import { AdminButton } from './AdminUI'

const routeLabels: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/consultas': 'Consultas',
  '/admin/proyectos': 'Proyectos',
  '/admin/servicios': 'Servicios',
  '/admin/blog': 'Blog',
  '/admin/licitaciones': 'Licitaciones',
  '/admin/empresa': 'Empresa',
  '/admin/inicio': 'Inicio',
  '/admin/contacto': 'Contacto',
  '/admin/medios': 'Medios',
}

export default function AdminTopBar({ onRefresh, refreshing }: { onRefresh?: () => void; refreshing?: boolean }) {
  const { pathname } = useLocation()
  const { user } = useAdminAuth()
  const pageTitle = routeLabels[pathname] ?? 'Panel'

  const now = new Date()
  const dateStr = now.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-background-200 px-4 md:px-8 h-16 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[10px] font-body uppercase tracking-wider text-foreground-400 hidden sm:block">Panel CMS</p>
        <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground-950 truncate">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <span className="hidden lg:inline text-xs font-body text-foreground-400 capitalize">{dateStr}</span>

        <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-body font-medium ${isSupabaseConfigured ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          {isSupabaseConfigured ? 'En línea' : 'Sin DB'}
        </span>

        {onRefresh && (
          <AdminButton variant="ghost" onClick={onRefresh} disabled={refreshing} className="!h-9 !px-3">
            <i className={`ri-refresh-line ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Actualizar</span>
          </AdminButton>
        )}

        <Link
          to="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-body text-foreground-600 hover:bg-background-100 border border-background-200 transition-colors"
        >
          <i className="ri-external-link-line" />
          <span className="hidden md:inline">Ver sitio</span>
        </Link>

        <div className="hidden md:flex items-center gap-2 pl-2 border-l border-background-200">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
            <i className="ri-user-line text-white text-sm" />
          </div>
          <div className="max-w-[140px]">
            <p className="text-xs font-body font-medium text-foreground-800 truncate">{user?.email?.split('@')[0]}</p>
            <p className="text-[10px] font-body text-foreground-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}
