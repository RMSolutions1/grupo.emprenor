import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useProveedorAuth } from './ProveedorAuthContext'

export function ProveedorPublicGuard() {
  const { user, isProvider, isApproved, loading, configured } = useProveedorAuth()
  const location = useLocation()

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

  if (user && isProvider && isApproved) {
    return <Navigate to="/proveedor" replace />
  }

  if (
    user &&
    isProvider &&
    !isApproved &&
    location.pathname !== '/proveedor/pendiente' &&
    location.pathname !== '/proveedor/completar-registro'
  ) {
    return <Navigate to="/proveedor/pendiente" replace />
  }

  return <Outlet />
}

export default function ProveedorGuard() {
  const location = useLocation()
  const { user, isProvider, isApproved, needsOrg, loading, configured } = useProveedorAuth()

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
        <p className="text-sm font-body text-foreground-500">Cargando portal…</p>
      </div>
    )
  }

  if (!user || !isProvider) {
    return <Navigate to="/proveedor/login" replace state={{ from: location.pathname }} />
  }

  if (needsOrg) {
    return <Navigate to="/proveedor/completar-registro" replace />
  }

  if (!isApproved) {
    return <Navigate to="/proveedor/pendiente" replace />
  }

  return <Outlet />
}
