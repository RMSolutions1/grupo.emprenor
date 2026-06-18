import { createClient } from '@supabase/supabase-js'
import { verifyStaffRequest } from '../_lib/auth'
import { escapeHtml, isMailConfigured, mailShell, sendMail } from '../_lib/mail'

type ReplyBody = {
  kind: 'contact' | 'licitacion'
  id: string
  message: string
  subject?: string
  publishAnswer?: boolean
}

type VercelRequest = {
  method?: string
  body?: ReplyBody | string
  headers?: Record<string, string | string[] | undefined>
}
type VercelResponse = { status: (code: number) => { json: (body: unknown) => void }; setHeader?: (k: string, v: string) => void }

const CORS_ORIGINS = [
  'https://grupo.emprenor.com',
  'https://www.emprenor.com.ar',
  'https://emprenor.com.ar',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

function setCors(req: VercelRequest, res: VercelResponse) {
  const origin = typeof req.headers?.origin === 'string' ? req.headers.origin : ''
  if (CORS_ORIGINS.includes(origin)) {
    res.setHeader?.('Access-Control-Allow-Origin', origin)
    res.setHeader?.('Access-Control-Allow-Headers', 'Authorization, Content-Type')
    res.setHeader?.('Access-Control-Allow-Methods', 'POST, OPTIONS')
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(req, res)
  if (req.method === 'OPTIONS') {
    return res.status(204).json({})
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const auth = await verifyStaffRequest(req)
  if (!auth.ok) {
    return res.status(401).json({ error: auth.error })
  }

  if (!isMailConfigured()) {
    return res.status(503).json({ error: 'Email no configurado. Configure SMTP (Ferozo) o RESEND_API_KEY en Vercel.' })
  }

  let body: ReplyBody
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {}) as ReplyBody
  } catch {
    return res.status(400).json({ error: 'Datos inválidos' })
  }

  const message = body.message?.trim()
  if (!body.id || !message || message.length > 5000) {
    return res.status(400).json({ error: 'Complete el mensaje de respuesta' })
  }

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return res.status(503).json({ error: 'Supabase no configurado' })
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })
  const replyTo = process.env.MAIL_REPLY_TO || staffFromEmail()

  if (body.kind === 'contact') {
    const { data: row, error } = await supabase.from('contact_submissions').select('*').eq('id', body.id).maybeSingle()
    if (error || !row) {
      return res.status(404).json({ error: 'Consulta no encontrada' })
    }
    if (!row.email) {
      return res.status(400).json({ error: 'Esta consulta no tiene email para responder' })
    }

    const subject = body.subject?.trim() || `Re: Su consulta a EMPRENOR GROUP`
    const html = mailShell(
      'Respuesta a su consulta',
      `<p>Estimado/a ${escapeHtml(row.name || '')},</p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>
${row.message ? `<p style="margin-top:24px;font-size:13px;color:#6b7280">— Su mensaje original —</p><p style="white-space:pre-wrap;font-size:13px;color:#6b7280;background:#f9fafb;padding:12px;border-radius:8px">${escapeHtml(row.message)}</p>` : ''}`,
    )

    const sent = await sendMail({ to: row.email, subject, html, replyTo })
    if (!sent.ok) {
      return res.status(502).json({ error: sent.error ?? 'No se pudo enviar el email' })
    }

    const now = new Date().toISOString()
    await supabase
      .from('contact_submissions')
      .update({ staff_reply: message, replied_at: now, read: true })
      .eq('id', body.id)

    return res.status(200).json({ ok: true })
  }

  if (body.kind === 'licitacion') {
    const { data: row, error } = await supabase.from('licitacion_consultas').select('*').eq('id', body.id).maybeSingle()
    if (error || !row) {
      return res.status(404).json({ error: 'Consulta de licitación no encontrada' })
    }

    const subject = body.subject?.trim() || `Re: Consulta técnica — Licitación ${row.licitacion_id}`
    const html = mailShell(
      'Respuesta a su consulta técnica',
      `<p>Estimado/a ${escapeHtml(row.name)},</p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>
<p style="margin-top:24px;font-size:13px;color:#6b7280">— Su consulta —</p>
<p style="white-space:pre-wrap;font-size:13px;color:#6b7280;background:#f9fafb;padding:12px;border-radius:8px">${escapeHtml(row.question)}</p>
<p style="font-size:13px;color:#6b7280;margin-top:16px">Licitación: <strong>${escapeHtml(row.licitacion_id)}</strong></p>`,
    )

    const sent = await sendMail({ to: row.email, subject, html, replyTo })
    if (!sent.ok) {
      return res.status(502).json({ error: sent.error ?? 'No se pudo enviar el email' })
    }

    const now = new Date().toISOString()
    const publish = body.publishAnswer ?? true
    await supabase
      .from('licitacion_consultas')
      .update({
        answer: message,
        answered_at: now,
        status: publish ? 'published' : 'answered',
        published: publish,
        read: true,
      })
      .eq('id', body.id)

    return res.status(200).json({ ok: true })
  }

  return res.status(400).json({ error: 'Tipo de respuesta inválido' })
}

function staffFromEmail(): string {
  const from = process.env.MAIL_FROM ?? ''
  const match = from.match(/<([^>]+)>/)
  return match?.[1] ?? 'info@emprenor.com.ar'
}
