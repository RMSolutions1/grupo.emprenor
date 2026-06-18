import { Link, useLocation } from 'react-router-dom'
import { isSupabaseConfigured } from '../../lib/supabase'
import { AdminButton } from './AdminUI'
import AdminUserMenu from './AdminUserMenu'
import AdminNotificationBell from './AdminNotificationBell'
import { useAdminNotificationsContext } from '../AdminNotificationsContext'

const routeLabels: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/consultas': 'Bandeja de entrada',
  '/admin/proyectos': 'Proyectos',
  '/admin/servicios': 'Servicios',
  '/admin/blog': 'Blog',
  '/admin/licitaciones': 'Licitaciones',
  '/admin/empresa': 'Empresa',
  '/admin/inicio': 'Inicio',
  '/admin/contacto': 'Contacto',
  '/admin/paginas': 'Textos del sitio',
  '/admin/medios': 'Medios',
}

export default function AdminTopBar({ onRefresh, refreshing }: { onRefresh?: () => void; refreshing?: boolean }) {
  const { pathname } = useLocation()
  const pageTitle = routeLabels[pathname] ?? 'Panel'
  const { counts, items, loading, refresh } = useAdminNotificationsContext()

  const now = new Date()
  const dateStr = now.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-background-200 px-4 md:px-8 h-16 flex items-center justify-between gap-3 shrink-0">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-body uppercase tracking-wider text-foreground-400 hidden sm:block">Panel CMS</p>
        <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground-950 truncate">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="hidden xl:inline text-xs font-body text-foreground-400 capitalize max-w-[220px] truncate">{dateStr}</span>

        <span className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-body font-medium ${isSupabaseConfigured ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          {isSupabaseConfigured ? 'En línea' : 'Sin DB'}
        </span>

        {onRefresh && (
          <AdminButton variant="ghost" onClick={onRefresh} disabled={refreshing} className="!h-9 !px-3">
            <i className={`ri-refresh-line ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden lg:inline">Actualizar</span>
          </AdminButton>
        )}

        <AdminNotificationBell count={counts.total} items={items} loading={loading} onRefresh={refresh} />

        <Link
          to="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-body text-foreground-600 hover:bg-background-100 border border-background-200 transition-colors"
        >
          <i className="ri-external-link-line" />
          <span className="hidden lg:inline">Ver sitio</span>
        </Link>

        <AdminUserMenu />
      </div>
    </header>
  )
}
