import { Link } from 'react-router-dom'
import type { ContactSubmission } from '../../lib/cms'
import type { DashboardStats } from '../hooks/useDashboardStats'
import { AdminBadge, AdminCard } from './AdminUI'

const typeLabels: Record<ContactSubmission['type'], string> = {
  contact: 'Consulta',
  callback: 'Callback',
  newsletter: 'Newsletter',
}

export function StatCard({ label, value, sub, icon, to, accent, loading }: {
  label: string
  value: number | string
  sub?: string
  icon: string
  to: string
  accent: string
  loading?: boolean
}) {
  return (
    <Link to={to} className="group block h-full">
      <div className="h-full p-5 rounded-2xl bg-white border border-background-200 shadow-sm hover:shadow-md hover:border-accent-200 transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${accent}`}>
            <i className={`${icon} text-xl`} />
          </div>
          <i className="ri-arrow-right-up-line text-foreground-300 group-hover:text-accent-500 transition-colors text-lg" />
        </div>
        <p className="font-heading text-3xl font-bold text-foreground-950 mt-5 tabular-nums">
          {loading ? <span className="inline-block w-12 h-8 bg-background-200 rounded animate-pulse" /> : value}
        </p>
        <p className="text-sm font-body font-medium text-foreground-700 mt-1">{label}</p>
        {sub && <p className="text-xs font-body text-foreground-400 mt-0.5">{sub}</p>}
      </div>
    </Link>
  )
}

export function WelcomeBanner({ name, unread }: { name: string; unread: number }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 p-6 md:p-8 text-white shadow-lg">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="text-sm font-body text-white/70">{greeting}</p>
          <h1 className="font-heading text-2xl md:text-3xl font-bold mt-1">{name}</h1>
          <p className="text-sm font-body text-white/60 mt-2 max-w-lg">
            Centro de control de EMPRENOR GROUP. Gestioná contenido, consultas y configuración del sitio desde un solo lugar.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/consultas" className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur text-sm font-body transition-colors">
            <i className="ri-inbox-line" />
            {unread > 0 ? `${unread} pendientes en bandeja` : 'Abrir bandeja'}
          </Link>
          <Link to="/admin/proyectos" className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-accent-500 hover:bg-accent-600 text-sm font-body font-medium transition-colors">
            <i className="ri-add-line" />
            Nuevo proyecto
          </Link>
        </div>
      </div>
    </div>
  )
}

export function QuickActions() {
  const actions = [
    { to: '/admin/blog', icon: 'ri-quill-pen-line', label: 'Artículo' },
    { to: '/admin/licitaciones', icon: 'ri-file-add-line', label: 'Licitación' },
    { to: '/admin/servicios', icon: 'ri-tools-line', label: 'Servicio' },
    { to: '/admin/inicio', icon: 'ri-home-gear-line', label: 'Home' },
    { to: '/admin/empresa', icon: 'ri-team-line', label: 'Empresa' },
    { to: '/admin/contacto', icon: 'ri-phone-line', label: 'Contacto' },
    { to: '/admin/paginas', icon: 'ri-file-text-line', label: 'Textos' },
  ]

  return (
    <AdminCard className="p-5 relative">
      <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-4">Acciones rápidas</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {actions.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-background-200 bg-background-50 hover:bg-white hover:border-accent-200 hover:shadow-sm transition-all text-center group min-h-[96px]"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-50 group-hover:bg-accent-100 flex items-center justify-center transition-colors">
              <i className={`${a.icon} text-lg text-primary-600 group-hover:text-accent-600`} />
            </div>
            <span className="text-xs font-body font-medium text-foreground-700">{a.label}</span>
          </Link>
        ))}
      </div>
    </AdminCard>
  )
}

export function RecentSubmissions({ items, loading }: { items: ContactSubmission[]; loading?: boolean }) {
  return (
    <AdminCard className="p-0 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-background-200">
        <h3 className="font-heading text-lg font-semibold text-foreground-950">Consultas recientes</h3>
        <Link to="/admin/consultas" className="text-xs font-body text-accent-600 hover:text-accent-700">Ver todas →</Link>
      </div>
      <div className="flex-1 divide-y divide-background-100">
        {loading ? (
          <p className="p-6 text-sm font-body text-foreground-400">Cargando…</p>
        ) : items.length === 0 ? (
          <div className="p-8 text-center">
            <i className="ri-inbox-line text-3xl text-foreground-300" />
            <p className="text-sm font-body text-foreground-500 mt-3">No hay consultas todavía</p>
            <p className="text-xs font-body text-foreground-400 mt-1">Aparecerán cuando alguien envíe un formulario</p>
          </div>
        ) : (
          items.map((item) => (
            <Link key={item.id} to="/admin/consultas" className="flex items-start gap-3 px-5 py-3.5 hover:bg-background-50 transition-colors">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${item.read ? 'bg-background-200' : 'bg-accent-100'}`}>
                <i className={`${item.type === 'newsletter' ? 'ri-mail-send-line' : item.type === 'callback' ? 'ri-phone-line' : 'ri-message-3-line'} text-sm ${item.read ? 'text-foreground-500' : 'text-accent-600'}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-body font-medium text-foreground-900 truncate">{item.name || item.email || 'Sin nombre'}</p>
                  {!item.read && <AdminBadge tone="warning">Nueva</AdminBadge>}
                </div>
                <p className="text-xs font-body text-foreground-500 mt-0.5">{typeLabels[item.type]} · {new Date(item.created_at).toLocaleDateString('es-AR')}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </AdminCard>
  )
}

export function ContentOverview({ stats, loading }: { stats: DashboardStats; loading?: boolean }) {
  const rows = [
    { label: 'Proyectos publicados', current: stats.projectsPublished, total: stats.projects, color: 'bg-blue-500' },
    { label: 'Artículos publicados', current: stats.blogPublished, total: stats.blog, color: 'bg-violet-500' },
    { label: 'Licitaciones activas', current: stats.licitacionesPublished, total: stats.licitaciones, color: 'bg-emerald-500' },
  ]

  return (
    <AdminCard className="p-5">
      <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-4">Contenido publicado</h3>
      <div className="space-y-5">
        {rows.map((row) => {
          const pct = row.total > 0 ? Math.round((row.current / row.total) * 100) : 0
          return (
            <div key={row.label}>
              <div className="flex justify-between text-sm font-body mb-2">
                <span className="text-foreground-700">{row.label}</span>
                <span className="text-foreground-500 tabular-nums">
                  {loading ? '…' : `${row.current} / ${row.total}`}
                </span>
              </div>
              <div className="h-2 rounded-full bg-background-200 overflow-hidden">
                <div className={`h-full rounded-full ${row.color} transition-all duration-700`} style={{ width: loading ? '0%' : `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
      {stats.siteUpdatedAt && (
        <p className="text-xs font-body text-foreground-400 mt-5 pt-4 border-t border-background-200">
          Última actualización del sitio: {new Date(stats.siteUpdatedAt).toLocaleString('es-AR')}
        </p>
      )}
    </AdminCard>
  )
}

export function ModuleGrid() {
  const modules = [
    { to: '/admin/proyectos', icon: 'ri-building-2-line', title: 'Proyectos', desc: 'Portafolio de obras' },
    { to: '/admin/servicios', icon: 'ri-tools-line', title: 'Servicios', desc: 'Divisiones de negocio' },
    { to: '/admin/blog', icon: 'ri-article-line', title: 'Blog', desc: 'Artículos y novedades' },
    { to: '/admin/licitaciones', icon: 'ri-file-list-3-line', title: 'Licitaciones', desc: 'Llamados vigentes' },
    { to: '/admin/inicio', icon: 'ri-home-4-line', title: 'Inicio', desc: 'Stats y testimonios' },
    { to: '/admin/paginas', icon: 'ri-file-text-line', title: 'Textos del sitio', desc: 'Copy y CTAs por página' },
    { to: '/admin/empresa', icon: 'ri-team-line', title: 'Empresa', desc: 'Equipo e historia' },
    { to: '/admin/contacto', icon: 'ri-phone-line', title: 'Contacto', desc: 'Datos de contacto' },
    { to: '/admin/medios', icon: 'ri-image-line', title: 'Medios', desc: 'Imágenes del sitio' },
  ]

  return (
    <AdminCard className="p-5 relative">
      <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-4">Todos los módulos</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {modules.map((m) => (
          <Link key={m.to} to={m.to} className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-background-200 hover:bg-background-50 transition-colors group min-h-[60px]">
            <div className="w-9 h-9 rounded-lg bg-background-200 group-hover:bg-accent-100 flex items-center justify-center transition-colors shrink-0">
              <i className={`${m.icon} text-accent-600`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-body font-medium text-foreground-900">{m.title}</p>
              <p className="text-xs font-body text-foreground-500 truncate">{m.desc}</p>
            </div>
            <i className="ri-arrow-right-s-line shrink-0 text-foreground-300 group-hover:text-accent-500" />
          </Link>
        ))}
      </div>
    </AdminCard>
  )
}

export function SystemStatus({ stats }: { stats: DashboardStats }) {
  return (
    <AdminCard className="p-5">
      <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-4">Resumen del sistema</h3>
      <ul className="space-y-3">
        {[
          { icon: 'ri-database-2-line', label: 'Base de datos', ok: true, detail: 'Supabase conectado' },
          { icon: 'ri-mail-line', label: 'Formularios web', ok: true, detail: `${stats.submissions} envíos registrados` },
          { icon: 'ri-global-line', label: 'Contenido total', ok: stats.projects + stats.blog > 0, detail: `${stats.projects + stats.blog + stats.licitaciones + stats.services} registros CMS` },
        ].map((item) => (
          <li key={item.label} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.ok ? 'bg-emerald-50' : 'bg-amber-50'}`}>
              <i className={`${item.icon} text-sm ${item.ok ? 'text-emerald-600' : 'text-amber-600'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body font-medium text-foreground-800">{item.label}</p>
              <p className="text-xs font-body text-foreground-500">{item.detail}</p>
            </div>
            <span className={`w-2 h-2 rounded-full ${item.ok ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </li>
        ))}
      </ul>
    </AdminCard>
  )
}
