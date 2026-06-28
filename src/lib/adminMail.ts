import { supabase } from './supabase'
import { apiUrl } from './apiOrigin'

export type ReplyPayload = {
  kind: 'contact' | 'licitacion'
  id: string
  message: string
  subject?: string
  publishAnswer?: boolean
}

export async function sendStaffReply(payload: ReplyPayload): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) {
    return { ok: false, error: 'Supabase no configurado' }
  }

  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token
  if (!token) {
    return { ok: false, error: 'Sesión expirada. Inicie sesión nuevamente.' }
  }

  try {
    const res = await fetch(apiUrl('/api/reply'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    const data = (await res.json().catch(() => ({}))) as { error?: string; ok?: boolean }
    if (!res.ok) {
      return { ok: false, error: data.error ?? `Error ${res.status}` }
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'No se pudo conectar con el servidor de email' }
  }
}

export function isMailApiLikelyAvailable(): boolean {
  return true
}
