import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { setCors } from './_lib/cors.js'

type ContactBody = {
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

type VercelRequest = {
  method?: string
  body?: ContactBody | string
  headers?: Record<string, string | string[] | undefined>
}
type VercelResponse = {
  status: (code: number) => { json: (body: unknown) => void }
  setHeader?: (k: string, v: string) => void
}

const LIMITS = {
  name: 200,
  email: 320,
  phone: 40,
  organization: 200,
  area: 100,
  message: 5000,
  schedule: 200,
} as const

const RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function trim(value: string | undefined, max: number): string | null {
  if (!value) return null
  const v = value.trim()
  if (!v || v.length > max) return null
  return v
}

function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email) && email.length <= LIMITS.email
}

async function isRateLimited(
  supabase: SupabaseClient,
  field: 'email' | 'phone',
  value: string,
): Promise<boolean> {
  const since = new Date(Date.now() - RATE_LIMIT.windowMs).toISOString()
  const { count, error } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq(field, value)
    .gte('created_at', since)

  if (error) return false
  return (count ?? 0) >= RATE_LIMIT.max
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(req, res)
  if (req.method === 'OPTIONS') {
    return res.status(204).json({})
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return res.status(503).json({ error: 'Servicio no configurado en el servidor' })
  }

  let body: ContactBody
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {}) as ContactBody
  } catch {
    return res.status(400).json({ error: 'Datos inválidos' })
  }

  if (body._hp?.trim()) {
    return res.status(200).json({ ok: true })
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  let row: Record<string, unknown>
  switch (body.type) {
    case 'contact': {
      const name = trim(body.name, LIMITS.name)
      const email = trim(body.email, LIMITS.email)
      const message = trim(body.message, LIMITS.message)
      if (!name || !email || !message || !isValidEmail(email)) {
        return res.status(400).json({ error: 'Complete nombre, email y mensaje válidos' })
      }
      if (await isRateLimited(supabase, 'email', email)) {
        return res.status(429).json({ error: 'Demasiados envíos. Intente más tarde.' })
      }
      row = {
        name,
        email,
        phone: trim(body.phone, LIMITS.phone),
        organization: trim(body.organization, LIMITS.organization),
        area: trim(body.area, LIMITS.area),
        message,
        type: 'contact',
      }
      break
    }
    case 'callback': {
      const name = trim(body.name, LIMITS.name)
      const phone = trim(body.phone, LIMITS.phone)
      if (!name || !phone) {
        return res.status(400).json({ error: 'Complete nombre y teléfono' })
      }
      if (await isRateLimited(supabase, 'phone', phone)) {
        return res.status(429).json({ error: 'Demasiados envíos. Intente más tarde.' })
      }
      const schedule = trim(body.schedule, LIMITS.schedule)
      row = {
        name,
        phone,
        message: schedule ? `Horario preferido: ${schedule}` : 'Solicitud de llamada',
        type: 'callback',
      }
      break
    }
    case 'newsletter': {
      const email = trim(body.email, LIMITS.email)
      if (!email || !isValidEmail(email)) {
        return res.status(400).json({ error: 'Ingrese un email válido' })
      }
      if (await isRateLimited(supabase, 'email', email)) {
        return res.status(429).json({ error: 'Demasiados envíos. Intente más tarde.' })
      }
      row = { email, type: 'newsletter' }
      break
    }
    default:
      return res.status(400).json({ error: 'Tipo de formulario inválido' })
  }

  const { error } = await supabase.from('contact_submissions').insert(row)
  if (error) {
    console.error('contact_submissions insert:', error.message)
    return res.status(500).json({ error: 'No se pudo guardar. Intente nuevamente.' })
  }

  try {
    const { notifyStaffNewContact } = await import('./_lib/notifyStaff.js')
    await notifyStaffNewContact(row as Parameters<typeof notifyStaffNewContact>[0])
  } catch (e) {
    console.error('notify staff contact:', e)
  }

  return res.status(200).json({ ok: true })
}
