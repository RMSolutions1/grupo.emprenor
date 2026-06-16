import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAdminAuth } from './AdminAuthContext'
import { adminModules } from '../lib/supabase'
import { fetchContactSubmissions } from '../lib/cms'
import AdminTopBar from './components/AdminTopBar'

const navGroups = [
  {
    label: 'Principal',
    items: [{ id: 'dashboard', title: 'Dashboard', icon: 'ri-dashboard-line', path: '/admin', end: true }],
  },
  {
    label: 'Contenido',
    items: adminModules.filter((m) => ['messages', 'projects', 'services', 'blog', 'licitaciones'].includes(m.id)),
  },
  {
    label: 'Sitio web',
    items: adminModules.filter((m) => ['pages', 'home', 'empresa', 'contact', 'media'].includes(m.id)),
  },
]

export default function AdminLayout() {
  const { user, signOut } = useAdminAuth()
  const location = useLocation()
  const [unread, setUnread] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isDashboard = location.pathname === '/admin'

  useEffect(() => {
    fetchContactSubmissions().then((items) => setUnread(items.filter((i) => !i.read).length))
  }, [location.pathname])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex">
      {sidebarOpen && (
        <button type="button" className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú" />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] shrink-0 bg-primary-500 text-white flex flex-col shadow-2xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center shadow-lg">
              <span className="font-heading text-lg font-bold">E</span>
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold tracking-tight leading-none">EMPRENOR</h1>
              <p className="text-[10px] font-body uppercase tracking-[0.15em] text-white/40 mt-1">Content Manager</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-2 text-[10px] font-body uppercase tracking-wider text-white/35">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((mod) => (
                  <NavLink
                    key={mod.path}
                    to={mod.path}
                    end={'end' in mod ? mod.end : false}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-all ${isActive ? 'bg-white text-primary-600 shadow-md font-medium' : 'text-white/70 hover:bg-white/10 hover:text-white'}`
                    }
                  >
                    <i className={`${mod.icon} text-lg w-5 text-center ${'end' in mod ? '' : ''}`} />
                    <span className="flex-1">{mod.title}</span>
                    {mod.id === 'messages' && unread > 0 && (
                      <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">{unread}</span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-2">
            <div className="w-9 h-9 rounded-full bg-accent-500/40 flex items-center justify-center shrink-0">
              <i className="ri-shield-user-line text-accent-200" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-body text-white truncate">{user?.email}</p>
              <p className="text-[10px] font-body text-white/40">Administrador</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="w-full px-3 py-2.5 text-sm font-body text-white/75 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-left flex items-center gap-2"
          >
            <i className="ri-logout-box-r-line" /> Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-background-200">
          <button type="button" onClick={() => setSidebarOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-background-100" aria-label="Abrir menú">
            <i className="ri-menu-line text-xl text-foreground-700" />
          </button>
          <span className="font-heading font-semibold text-foreground-950">EMPRENOR CMS</span>
        </div>

        {!isDashboard && <AdminTopBar />}

        <main className="flex-1 overflow-y-auto min-w-0 text-foreground-950">
          {isDashboard ? (
            <>
              <AdminTopBar />
              <Outlet />
            </>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  )
}
