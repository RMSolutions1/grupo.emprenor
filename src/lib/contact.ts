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

export async function submitContact(data: ContactFormData): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: 'Servicio no disponible' }
  }
  const { error } = await supabase.from('contact_submissions').insert({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    organization: data.organization || null,
    area: data.area || null,
    message: data.message,
    type: 'contact',
  })
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function submitCallback(data: CallbackFormData): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: 'Servicio no disponible' }
  }
  const message = data.schedule ? `Horario preferido: ${data.schedule}` : 'Solicitud de llamada'
  const { error } = await supabase.from('contact_submissions').insert({
    name: data.name,
    phone: data.phone,
    message,
    type: 'callback',
  })
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function submitNewsletter(email: string): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: 'Servicio no disponible' }
  }
  const { error } = await supabase.from('contact_submissions').insert({
    email,
    type: 'newsletter',
  })
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
