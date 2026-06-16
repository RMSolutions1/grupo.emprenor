import { createClient } from '@supabase/supabase-js'

type ContactBody = {
  type: 'contact' | 'callback' | 'newsletter'
  name?: string
  email?: string
  phone?: string
  organization?: string
  area?: string
  message?: string
  schedule?: string
}

type VercelRequest = { method?: string; body?: ContactBody | string }
type VercelResponse = { status: (code: number) => { json: (body: unknown) => void } }

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  let row: Record<string, unknown>
  switch (body.type) {
    case 'contact':
      if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
        return res.status(400).json({ error: 'Complete nombre, email y mensaje' })
      }
      row = {
        name: body.name.trim(),
        email: body.email.trim(),
        phone: body.phone?.trim() || null,
        organization: body.organization?.trim() || null,
        area: body.area?.trim() || null,
        message: body.message.trim(),
        type: 'contact',
      }
      break
    case 'callback':
      if (!body.name?.trim() || !body.phone?.trim()) {
        return res.status(400).json({ error: 'Complete nombre y teléfono' })
      }
      row = {
        name: body.name.trim(),
        phone: body.phone.trim(),
        message: body.schedule?.trim() ? `Horario preferido: ${body.schedule.trim()}` : 'Solicitud de llamada',
        type: 'callback',
      }
      break
    case 'newsletter':
      if (!body.email?.trim()) {
        return res.status(400).json({ error: 'Ingrese un email' })
      }
      row = { email: body.email.trim(), type: 'newsletter' }
      break
    default:
      return res.status(400).json({ error: 'Tipo de formulario inválido' })
  }

  const { error } = await supabase.from('contact_submissions').insert(row)
  if (error) {
    console.error('contact_submissions insert:', error.message)
    return res.status(500).json({ error: 'No se pudo guardar. Intente nuevamente.' })
  }

  return res.status(200).json({ ok: true })
}
