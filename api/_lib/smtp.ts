import nodemailer from 'nodemailer'

type SmtpSendOptions = {
  to: string
  subject: string
  html: string
  replyTo?: string
}

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.MAIL_FROM,
  )
}

function smtpPort(): number {
  const raw = process.env.SMTP_PORT
  if (!raw) return 465
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) ? n : 465
}

function smtpSecure(): boolean {
  if (process.env.SMTP_SECURE === 'false') return false
  if (process.env.SMTP_SECURE === 'true') return true
  return smtpPort() === 465
}

export async function sendViaSmtp({ to, subject, html, replyTo }: SmtpSendOptions): Promise<{ ok: boolean; error?: string }> {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.MAIL_FROM
  if (!host || !user || !pass || !from) {
    return { ok: false, error: 'SMTP incompleto (SMTP_HOST, SMTP_USER, SMTP_PASS, MAIL_FROM)' }
  }

  try {
    const transport = nodemailer.createTransport({
      host,
      port: smtpPort(),
      secure: smtpSecure(),
      auth: { user, pass },
    })

    await transport.sendMail({
      from,
      to,
      subject,
      html,
      replyTo: replyTo || process.env.MAIL_REPLY_TO || user,
    })

    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, error: msg }
  }
}
