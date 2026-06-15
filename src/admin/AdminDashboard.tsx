import { usePageMeta } from '../hooks/usePageMeta'
import { useAdminAuth } from './AdminAuthContext'
import { useDashboardStats } from './hooks/useDashboardStats'
import {
  WelcomeBanner,
  StatCard,
  QuickActions,
  RecentSubmissions,
  ContentOverview,
  ModuleGrid,
  SystemStatus,
} from './components/DashboardWidgets'

export default function AdminDashboard() {
  usePageMeta({ title: 'Dashboard — Admin', description: 'Panel de administración EMPRENOR GROUP' })
  const { user } = useAdminAuth()
  const { loading, stats, recentSubmissions, refresh } = useDashboardStats()

  const displayName = user?.email?.split('@')[0] ?? 'Administrador'

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1400px]">
      <WelcomeBanner name={displayName} unread={stats.unread} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Proyectos" value={stats.projects} sub={`${stats.projectsPublished} publicados`} icon="ri-building-2-line" to="/admin/proyectos" accent="bg-blue-50 text-blue-600" loading={loading} />
        <StatCard label="Artículos" value={stats.blog} sub={`${stats.blogPublished} publicados`} icon="ri-article-line" to="/admin/blog" accent="bg-violet-50 text-violet-600" loading={loading} />
        <StatCard label="Licitaciones" value={stats.licitaciones} sub={`${stats.licitacionesPublished} publicadas`} icon="ri-file-list-3-line" to="/admin/licitaciones" accent="bg-emerald-50 text-emerald-600" loading={loading} />
        <StatCard label="Consultas nuevas" value={stats.unread} sub={`${stats.submissions} en total`} icon="ri-mail-unread-line" to="/admin/consultas" accent="bg-accent-50 text-accent-600" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentSubmissions items={recentSubmissions} loading={loading} />
          <QuickActions />
        </div>
        <div className="space-y-6">
          <ContentOverview stats={stats} loading={loading} />
          <SystemStatus stats={stats} />
        </div>
      </div>

      <ModuleGrid />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="text-xs font-body text-foreground-400 hover:text-accent-600 flex items-center gap-1 transition-colors disabled:opacity-50"
        >
          <i className={`ri-refresh-line ${loading ? 'animate-spin' : ''}`} />
          Actualizar datos del dashboard
        </button>
      </div>
    </div>
  )
}
