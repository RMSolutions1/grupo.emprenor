import { Navigate, Outlet } from 'react-router-dom'
import { useProveedorAuth } from './ProveedorAuthContext'

/** Requiere sesión proveedor (sin exigir aprobación). */
export default function ProveedorSessionGuard() {
  const { user, isProvider, loading, configured } = useProveedorAuth()

  if (!configured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-50 px-6">
        <p className="text-sm font-body text-foreground-600">Portal de proveedores no configurado.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-50">
        <p className="text-sm font-body text-foreground-500">Cargando…</p>
      </div>
    )
  }

  if (!user || !isProvider) {
    return <Navigate to="/proveedor/login" replace />
  }

  return <Outlet />
}
