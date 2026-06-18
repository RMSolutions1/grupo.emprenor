import { supabase } from './supabase'

function mailApiBase(): string {
  const env = import.meta.env.VITE_MAIL_API_URL as string | undefined
  if (env) return env.replace(/\/$/, '')
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'https://grupo.emprenor.com'
    }
  }
  return ''
}

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

  const base = mailApiBase()
  const url = `${base}/api/admin/reply`

  try {
    const res = await fetch(url, {
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
  if (import.meta.env.VITE_MAIL_API_URL) return true
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host.includes('emprenor.com') || host === 'localhost'
}
