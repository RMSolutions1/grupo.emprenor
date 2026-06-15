import { useAdminAuth } from '../AdminAuthContext'

/** Espera a que la sesión de Supabase esté lista antes de cargar datos del admin. */
export function useAdminReady() {
  const { user, session, loading } = useAdminAuth()
  return { ready: !loading && Boolean(user && session), user, session, loading }
}
