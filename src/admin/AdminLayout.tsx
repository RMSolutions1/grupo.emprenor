import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAdminAuth } from './AdminAuthContext'
import { adminModules } from '../lib/supabase'
import { fetchContactSubmissions } from '../lib/cms'

export default function AdminLayout() {
  const { user, signOut } = useAdminAuth()
  const location = useLocation()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    fetchContactSubmissions().then((items) => setUnread(items.filter((i) => !i.read).length))
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-background-100 flex">
      <aside className="w-72 shrink-0 bg-primary-500 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-white/10">
          <p className="text-[10px] font-body uppercase tracking-[0.2em] text-white/40 mb-2">CMS</p>
          <h1 className="font-heading text-2xl font-bold tracking-tight">EMPRENOR</h1>
          <p className="text-xs font-body text-white/50 mt-1">Panel de administración</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all ${isActive ? 'bg-white/15 text-white shadow-sm' : 'text-white/65 hover:bg-white/10 hover:text-white'}`
            }
          >
            <i className="ri-dashboard-line text-lg w-5 text-center" />
            Dashboard
          </NavLink>
          {adminModules.map((mod) => (
            <NavLink
              key={mod.id}
              to={mod.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all ${isActive ? 'bg-white/15 text-white shadow-sm' : 'text-white/65 hover:bg-white/10 hover:text-white'}`
              }
            >
              <i className={`${mod.icon} text-lg w-5 text-center`} />
              <span className="flex-1">{mod.title}</span>
              {mod.id === 'messages' && unread > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold">{unread}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 bg-primary-600/30">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-accent-500/30 flex items-center justify-center">
              <i className="ri-user-line text-accent-200" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-body text-white/90 truncate">{user?.email}</p>
              <p className="text-[10px] font-body text-white/40">Administrador</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="w-full px-3 py-2 text-sm font-body text-white/75 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-left flex items-center gap-2"
          >
            <i className="ri-logout-box-r-line" /> Cerrar sesión
          </button>
          <Link to="/" className="flex items-center gap-2 mt-1 px-3 py-2 text-sm font-body text-accent-300 hover:text-accent-200 rounded-lg hover:bg-white/5 transition-colors">
            <i className="ri-external-link-line" /> Ver sitio
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto min-w-0 text-foreground-950">
        <Outlet />
      </main>
    </div>
  )
}
