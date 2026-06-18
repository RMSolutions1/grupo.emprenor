import { isSmtpConfigured, sendViaSmtp } from './smtp'

type SendMailOptions = {
  to: string
  subject: string
  html: string
  replyTo?: string
}

export function isMailConfigured(): boolean {
  return isSmtpConfigured() || Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM)
}

export async function sendMail(options: SendMailOptions): Promise<{ ok: boolean; error?: string }> {
  if (isSmtpConfigured()) {
    return sendViaSmtp(options)
  }
  return sendViaResend(options)
}

async function sendViaResend({ to, subject, html, replyTo }: SendMailOptions): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.MAIL_FROM
  if (!apiKey || !from) {
    return { ok: false, error: 'Email no configurado (SMTP o RESEND_API_KEY + MAIL_FROM)' }
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    return { ok: false, error: body || `Resend HTTP ${res.status}` }
  }
  return { ok: true }
}

export function staffNotifyEmail(): string {
  return process.env.STAFF_NOTIFY_EMAIL || process.env.MAIL_REPLY_TO || process.env.SMTP_USER || 'info@emprenor.com.ar'
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function mailShell(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html><html lang="es"><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px">
<h2 style="color:#0f2744;margin:0 0 16px">${escapeHtml(title)}</h2>
${bodyHtml}
<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
<p style="font-size:12px;color:#6b7280">EMPRENOR GROUP — mensaje automático del sitio web</p>
</body></html>`
}
