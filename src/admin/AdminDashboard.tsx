import { Link } from 'react-router-dom'
import { adminModules, isSupabaseConfigured } from '../lib/supabase'
import { usePageMeta } from '../hooks/usePageMeta'

export default function AdminDashboard() {
  usePageMeta({ title: 'Dashboard — Admin', description: 'Panel de administración EMPRENOR GROUP' })

  return (
    <div className="p-8 md:p-10 max-w-5xl">
      <h1 className="font-heading text-3xl font-bold text-foreground-950 mb-2">Dashboard</h1>
      <p className="text-sm font-body text-foreground-500 mb-8">
        Administre el contenido del sitio web desde un solo lugar.
      </p>

      <div className={`p-4 rounded-lg border mb-8 ${isSupabaseConfigured ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
        <p className="text-sm font-body font-medium text-foreground-800">
          {isSupabaseConfigured ? '✓ Supabase conectado' : '⚠ Supabase pendiente de configuración'}
        </p>
        <p className="text-xs font-body text-foreground-600 mt-1">
          {isSupabaseConfigured
            ? 'Los módulos del editor se irán habilitando en las próximas actualizaciones.'
            : 'Configure .env con las credenciales de Supabase para activar login y almacenamiento.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminModules.map((mod) => (
          <Link
            key={mod.id}
            to={mod.path}
            className="group p-5 rounded-xl border border-background-200 bg-background-50 hover:border-accent-300 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent-100/70">
                <i className={`${mod.icon} text-lg text-accent-500`} />
              </div>
              <span className="text-xs font-body px-2 py-0.5 rounded-full bg-background-200 text-foreground-500">
                {mod.status === 'ready' ? 'Activo' : 'Próximamente'}
              </span>
            </div>
            <h2 className="font-heading text-lg font-semibold text-foreground-950 group-hover:text-accent-600 transition-colors">{mod.title}</h2>
            <p className="text-sm font-body text-foreground-500 mt-1 leading-relaxed">{mod.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
