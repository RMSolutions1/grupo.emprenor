import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminModules, isSupabaseConfigured, supabase } from '../lib/supabase'
import { fetchContactSubmissions } from '../lib/cms'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAdminReady } from './hooks/useAdminReady'
import { AdminCard, AdminBadge } from './components/AdminUI'

type Counts = { projects: number; blog: number; licitaciones: number; unread: number }

export default function AdminDashboard() {
  usePageMeta({ title: 'Dashboard — Admin', description: 'Panel de administración EMPRENOR GROUP' })
  const { ready } = useAdminReady()
  const [counts, setCounts] = useState<Counts>({ projects: 0, blog: 0, licitaciones: 0, unread: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ready || !supabase) {
      setLoading(!ready)
      return
    }

    async function load() {
      setLoading(true)
      const [p, b, l, submissions] = await Promise.all([
        supabase!.from('projects').select('id', { count: 'exact', head: true }),
        supabase!.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase!.from('licitaciones').select('id', { count: 'exact', head: true }),
        fetchContactSubmissions(),
      ])
      setCounts({
        projects: p.count ?? 0,
        blog: b.count ?? 0,
        licitaciones: l.count ?? 0,
        unread: submissions.filter((s) => !s.read).length,
      })
      setLoading(false)
    }
    load()
  }, [ready])

  const stats = [
    { label: 'Proyectos', value: counts.projects, icon: 'ri-building-2-line', to: '/admin/proyectos', color: 'text-blue-600 bg-blue-50' },
    { label: 'Artículos', value: counts.blog, icon: 'ri-article-line', to: '/admin/blog', color: 'text-violet-600 bg-violet-50' },
    { label: 'Licitaciones', value: counts.licitaciones, icon: 'ri-file-list-3-line', to: '/admin/licitaciones', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Consultas nuevas', value: counts.unread, icon: 'ri-mail-unread-line', to: '/admin/consultas', color: 'text-accent-600 bg-accent-50' },
  ]

  return (
    <div className="min-h-full">
      <header className="bg-background-50 border-b border-background-200 px-6 md:px-10 py-8">
        <h1 className="font-heading text-3xl font-bold text-foreground-950">Dashboard</h1>
        <p className="text-sm font-body text-foreground-500 mt-2">Bienvenido al centro de control de EMPRENOR GROUP.</p>
        <div className={`inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full text-xs font-body ${isSupabaseConfigured ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
          <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-green-500' : 'bg-amber-500'}`} />
          {isSupabaseConfigured ? 'Supabase conectado' : 'Supabase no configurado'}
        </div>
      </header>

      <div className="p-6 md:p-10 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Link key={s.label} to={s.to} className="group">
              <AdminCard className="p-5 hover:border-accent-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.color}`}>
                    <i className={`${s.icon} text-xl`} />
                  </div>
                  <i className="ri-arrow-right-up-line text-foreground-300 group-hover:text-accent-500 transition-colors" />
                </div>
                <p className="font-heading text-3xl font-bold text-foreground-950 mt-4">{loading ? '…' : s.value}</p>
                <p className="text-sm font-body text-foreground-500 mt-1">{s.label}</p>
              </AdminCard>
            </Link>
          ))}
        </div>

        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground-950 mb-4">Módulos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminModules.map((mod) => (
              <Link
                key={mod.id}
                to={mod.path}
                className="group p-5 rounded-xl border border-background-200 bg-background-50 hover:border-accent-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent-100/70 group-hover:bg-accent-500 transition-colors">
                    <i className={`${mod.icon} text-lg text-accent-500 group-hover:text-white transition-colors`} />
                  </div>
                  <AdminBadge tone="success">Activo</AdminBadge>
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground-950 group-hover:text-accent-600 transition-colors">{mod.title}</h3>
                <p className="text-sm font-body text-foreground-500 mt-1 leading-relaxed">{mod.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
