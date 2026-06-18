import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { useProveedorAuth } from './ProveedorAuthContext'

const nav = [
  { to: '/proveedor', label: 'Inicio', icon: 'ri-dashboard-line', end: true },
  { to: '/proveedor/licitaciones', label: 'Licitaciones', icon: 'ri-file-list-3-line' },
  { to: '/proveedor/mis-ofertas', label: 'Mis ofertas', icon: 'ri-send-plane-line' },
]

export default function ProveedorLayout() {
  const { organizacion, signOut } = useProveedorAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/proveedor/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex flex-col">
      <header className="bg-primary-500 text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo variant="light" size="sm" />
            <div className="hidden sm:block border-l border-white/20 pl-4">
              <p className="text-xs font-body uppercase tracking-wider text-white/50">Portal Proveedores</p>
              <p className="text-sm font-body font-medium truncate max-w-[200px]">{organizacion?.razon_social}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-sm font-body text-white/80 hover:text-white flex items-center gap-1.5"
          >
            <i className="ri-logout-box-r-line" />
            Salir
          </button>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <aside className="hidden md:block w-56 shrink-0 p-4">
          <nav className="space-y-1 sticky top-4">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-body transition-colors ${
                    isActive ? 'bg-white text-primary-600 shadow-sm font-medium' : 'text-foreground-600 hover:bg-white/80'
                  }`
                }
              >
                <i className={`${item.icon} text-lg`} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
