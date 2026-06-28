import { supabase, isSupabaseConfigured } from './supabase'

export type ContactFormData = {
  name: string
  email: string
  phone?: string
  organization?: string
  area?: string
  message: string
  _hp?: string
}

export type CallbackFormData = {
  name: string
  phone: string
  schedule?: string
  _hp?: string
}

type ApiPayload = {
  type: 'contact' | 'callback' | 'newsletter'
  name?: string
  email?: string
  phone?: string
  organization?: string
  area?: string
  message?: string
  schedule?: string
  _hp?: string
}

export function isHoneypotTriggered(hp?: string): boolean {
  return Boolean(hp?.trim())
}

function friendlyError(message: string): string {
  if (message.includes('row-level security')) {
    return 'El formulario no está habilitado en el servidor. Contacte al administrador.'
  }
  if (message.includes('Demasiados envíos')) {
    return 'Demasiados envíos. Intente más tarde.'
  }
  return message
}

async function submitViaApi(payload: ApiPayload): Promise<{ ok: boolean; error?: string; unavailable?: boolean }> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.status === 404) return { ok: false, unavailable: true }
    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) {
      return { ok: false, unavailable: true }
    }
    const data = (await res.json().catch(() => null)) as { error?: string; ok?: boolean } | null
    if (!data) return { ok: false, unavailable: true }
    if (res.ok && data.ok) return { ok: true }
    return { ok: false, error: data.error ?? 'No se pudo enviar' }
  } catch {
    return { ok: false, unavailable: true }
  }
}

async function submitViaSupabase(payload: ApiPayload): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: 'Servicio no disponible' }
  }

  const { error: rpcError } = await supabase.rpc('submit_contact_submission', {
    p_type: payload.type,
    p_name: payload.name ?? null,
    p_email: payload.email ?? null,
    p_phone: payload.phone ?? null,
    p_organization: payload.organization ?? null,
    p_area: payload.area ?? null,
    p_message: payload.message ?? null,
    p_honeypot: payload._hp ?? null,
  })

  if (!rpcError) return { ok: true }
  return { ok: false, error: friendlyError(rpcError.message) }
}

async function submit(payload: ApiPayload): Promise<{ ok: boolean; error?: string }> {
  if (isHoneypotTriggered(payload._hp)) {
    return { ok: true }
  }

  const api = await submitViaApi(payload)
  if (api.ok) return { ok: true }
  if (api.error && !api.unavailable) return { ok: false, error: api.error }

  return submitViaSupabase(payload)
}

export async function submitContact(data: ContactFormData): Promise<{ ok: boolean; error?: string }> {
  return submit({
    type: 'contact',
    name: data.name,
    email: data.email,
    phone: data.phone,
    organization: data.organization,
    area: data.area,
    message: data.message,
    _hp: data._hp,
  })
}

export async function submitCallback(data: CallbackFormData): Promise<{ ok: boolean; error?: string }> {
  return submit({
    type: 'callback',
    name: data.name,
    phone: data.phone,
    message: data.schedule ? `Horario preferido: ${data.schedule}` : 'Solicitud de llamada',
    schedule: data.schedule,
    _hp: data._hp,
  })
}

export async function submitNewsletter(email: string, _hp?: string): Promise<{ ok: boolean; error?: string }> {
  return submit({ type: 'newsletter', email, _hp })
}
