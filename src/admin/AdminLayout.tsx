import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'
import { adminModules } from '../lib/supabase'

export default function AdminLayout() {
  const { user, signOut } = useAdminAuth()

  return (
    <div className="min-h-screen bg-background-100 flex">
      <aside className="w-64 shrink-0 bg-primary-500 text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <p className="text-xs font-body uppercase tracking-wider text-white/50 mb-1">Panel</p>
          <h1 className="font-heading text-xl font-bold">EMPRENOR</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm font-body transition-colors ${isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`
            }
          >
            Dashboard
          </NavLink>
          {adminModules.map((mod) => (
            <NavLink
              key={mod.id}
              to={mod.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-body transition-colors ${isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`
              }
            >
              <i className={`${mod.icon} text-base`} />
              {mod.title}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-xs font-body text-white/50 truncate mb-2">{user?.email}</p>
          <button
            type="button"
            onClick={() => signOut()}
            className="w-full px-3 py-2 text-sm font-body text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors text-left"
          >
            Cerrar sesión
          </button>
          <Link to="/" className="block mt-2 px-3 py-2 text-sm font-body text-accent-300 hover:text-accent-200">
            Ver sitio →
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
