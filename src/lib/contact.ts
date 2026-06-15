import { supabase, isSupabaseConfigured } from './supabase'

export type ContactFormData = {
  name: string
  email: string
  phone?: string
  organization?: string
  area?: string
  message: string
}

export type CallbackFormData = {
  name: string
  phone: string
  schedule?: string
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
}

function friendlyError(message: string): string {
  if (message.includes('row-level security')) {
    return 'El formulario no está habilitado en el servidor. Contacte al administrador.'
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
    const data = (await res.json().catch(() => ({}))) as { error?: string; ok?: boolean }
    if (res.ok) return { ok: true }
    return { ok: false, error: data.error ?? 'No se pudo enviar' }
  } catch {
    return { ok: false, unavailable: true }
  }
}

async function submitViaSupabase(payload: ApiPayload): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: 'Servicio no disponible' }
  }

  const rpcArgs = {
    p_type: payload.type,
    p_name: payload.name ?? null,
    p_email: payload.email ?? null,
    p_phone: payload.phone ?? null,
    p_organization: payload.organization ?? null,
    p_area: payload.area ?? null,
    p_message: payload.message ?? null,
  }

  const { error: rpcError } = await supabase.rpc('submit_contact_submission', rpcArgs)
  if (!rpcError) return { ok: true }

  if (payload.type === 'contact') {
    const { error } = await supabase.from('contact_submissions').insert({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || null,
      organization: payload.organization || null,
      area: payload.area || null,
      message: payload.message,
      type: 'contact',
    })
    if (error) return { ok: false, error: friendlyError(error.message) }
    return { ok: true }
  }

  if (payload.type === 'callback') {
    const { error } = await supabase.from('contact_submissions').insert({
      name: payload.name,
      phone: payload.phone,
      message: payload.message,
      type: 'callback',
    })
    if (error) return { ok: false, error: friendlyError(error.message) }
    return { ok: true }
  }

  const { error } = await supabase.from('contact_submissions').insert({
    email: payload.email,
    type: 'newsletter',
  })
  if (error) return { ok: false, error: friendlyError(error.message) }
  return { ok: true }
}

async function submit(payload: ApiPayload): Promise<{ ok: boolean; error?: string }> {
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
  })
}

export async function submitCallback(data: CallbackFormData): Promise<{ ok: boolean; error?: string }> {
  return submit({
    type: 'callback',
    name: data.name,
    phone: data.phone,
    message: data.schedule ? `Horario preferido: ${data.schedule}` : 'Solicitud de llamada',
    schedule: data.schedule,
  })
}

export async function submitNewsletter(email: string): Promise<{ ok: boolean; error?: string }> {
  return submit({ type: 'newsletter', email })
}
