import { Navigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'

export default function AdminGuard() {
  const { user, loading, configured, isStaff } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-100">
        <p className="text-sm font-body text-foreground-500">Cargando panel…</p>
      </div>
    )
  }

  if (!configured) {
    return <Navigate to="/admin/login" replace />
  }

  if (!user || !isStaff) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
