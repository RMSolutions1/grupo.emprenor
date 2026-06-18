import { createClient } from '@supabase/supabase-js'

type Req = { headers?: Record<string, string | string[] | undefined> }

export async function verifyStaffRequest(req: Req): Promise<{ ok: true; userId: string; email: string } | { ok: false; error: string }> {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  if (!url || !serviceKey) {
    return { ok: false, error: 'Servidor no configurado' }
  }

  const auth = req.headers?.authorization
  const token = typeof auth === 'string' && auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) {
    return { ok: false, error: 'No autorizado' }
  }

  const authClient = createClient(url, anonKey || serviceKey, { auth: { persistSession: false } })
  const { data: userData, error: userError } = await authClient.auth.getUser(token)
  if (userError || !userData.user) {
    return { ok: false, error: 'Sesión inválida' }
  }

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } })
  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .maybeSingle()

  if (!profile || !['admin', 'editor'].includes(profile.role)) {
    return { ok: false, error: 'Sin permisos de staff' }
  }

  return { ok: true, userId: userData.user.id, email: userData.user.email ?? '' }
}
