import { notifyStaffNewContact, notifyStaffNewLicitacionConsulta } from '../_lib/notifyStaff.js'

type WebhookPayload = {
  type?: string
  table?: string
  record?: Record<string, unknown>
}

type VercelRequest = {
  method?: string
  body?: WebhookPayload | string
  headers?: Record<string, string | string[] | undefined>
}
type VercelResponse = { status: (code: number) => { json: (body: unknown) => void } }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método no permitido' })
    }

  const secret = process.env.INBOX_WEBHOOK_SECRET
  const auth = req.headers?.authorization
  const token = typeof auth === 'string' && auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!secret || token !== secret) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  let payload: WebhookPayload
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {}) as WebhookPayload
  } catch {
    return res.status(400).json({ error: 'Payload inválido' })
  }

  if (payload.type !== 'INSERT' || !payload.record) {
    return res.status(200).json({ ok: true, skipped: true })
  }

  try {
    if (payload.table === 'contact_submissions') {
      await notifyStaffNewContact(payload.record as Parameters<typeof notifyStaffNewContact>[0])
    } else if (payload.table === 'licitacion_consultas') {
      await notifyStaffNewLicitacionConsulta(payload.record as Parameters<typeof notifyStaffNewLicitacionConsulta>[0])
    }
  } catch (e) {
    console.error('webhook inbox notify:', e)
    return res.status(500).json({ error: 'Error al enviar notificación' })
  }

  return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('webhook inbox error:', e)
    return res.status(500).json({ error: e instanceof Error ? e.message : 'Error interno' })
  }
}
