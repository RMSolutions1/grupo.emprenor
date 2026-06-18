type SmtpSendOptions = {
  to: string
  subject: string
  html: string
  replyTo?: string
}

function envTrim(key: string): string | undefined {
  const v = process.env[key]
  if (v == null) return undefined
  const t = v.trim()
  return t || undefined
}

export function isSmtpConfigured(): boolean {
  return Boolean(
    envTrim('SMTP_HOST') &&
      envTrim('SMTP_USER') &&
      envTrim('SMTP_PASS') &&
      envTrim('MAIL_FROM'),
  )
}

function smtpPort(): number {
  const raw = envTrim('SMTP_PORT')
  if (!raw) return 465
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) ? n : 465
}

function smtpSecure(): boolean {
  const flag = envTrim('SMTP_SECURE')
  if (flag === 'false') return false
  if (flag === 'true') return true
  return smtpPort() === 465
}

export async function sendViaSmtp({ to, subject, html, replyTo }: SmtpSendOptions): Promise<{ ok: boolean; error?: string }> {
  const host = envTrim('SMTP_HOST')
  const user = envTrim('SMTP_USER')
  const pass = envTrim('SMTP_PASS')
  const from = envTrim('MAIL_FROM')
  if (!host || !user || !pass || !from) {
    return { ok: false, error: 'SMTP incompleto (SMTP_HOST, SMTP_USER, SMTP_PASS, MAIL_FROM)' }
  }

  try {
    const nodemailer = await import('nodemailer')
    const createTransport = nodemailer.default?.createTransport ?? nodemailer.createTransport
    const transport = createTransport({
      host,
      port: smtpPort(),
      secure: smtpSecure(),
      auth: { user, pass },
    })

    await transport.sendMail({
      from,
      to: to.trim(),
      subject: subject.trim(),
      html,
      replyTo: (replyTo || envTrim('MAIL_REPLY_TO') || user).trim(),
    })

    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, error: msg }
  }
}
