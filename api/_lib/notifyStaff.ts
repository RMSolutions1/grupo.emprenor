import { escapeHtml, mailShell, sendMail, staffNotifyEmail } from './mail'

type ContactRecord = {
  id?: string
  type?: string
  name?: string | null
  email?: string | null
  phone?: string | null
  message?: string | null
  organization?: string | null
  area?: string | null
}

type LicitacionRecord = {
  id?: string
  licitacion_id?: string
  name?: string
  email?: string
  organization?: string | null
  question?: string
}

const typeLabels: Record<string, string> = {
  contact: 'Consulta de contacto',
  callback: 'Solicitud de llamada',
  newsletter: 'Suscripción newsletter',
}

export async function notifyStaffNewContact(record: ContactRecord): Promise<void> {
  const label = typeLabels[record.type ?? 'contact'] ?? 'Nuevo mensaje'
  const adminUrl = process.env.ADMIN_PANEL_URL || 'https://grupo.emprenor.com/admin/consultas'
  const body = `
<p><strong>Tipo:</strong> ${escapeHtml(label)}</p>
${record.name ? `<p><strong>Nombre:</strong> ${escapeHtml(record.name)}</p>` : ''}
${record.email ? `<p><strong>Email:</strong> ${escapeHtml(record.email)}</p>` : ''}
${record.phone ? `<p><strong>Teléfono:</strong> ${escapeHtml(record.phone)}</p>` : ''}
${record.organization ? `<p><strong>Organización:</strong> ${escapeHtml(record.organization)}</p>` : ''}
${record.area ? `<p><strong>Área:</strong> ${escapeHtml(record.area)}</p>` : ''}
${record.message ? `<p><strong>Mensaje:</strong></p><p style="white-space:pre-wrap;background:#f3f4f6;padding:12px;border-radius:8px">${escapeHtml(record.message)}</p>` : ''}
<p><a href="${escapeHtml(adminUrl)}" style="display:inline-block;margin-top:12px;padding:10px 16px;background:#c8922a;color:#fff;text-decoration:none;border-radius:8px">Abrir bandeja de entrada</a></p>`

  await sendMail({
    to: staffNotifyEmail(),
    subject: `[EMPRENOR] ${label}${record.name ? ` — ${record.name}` : ''}`,
    html: mailShell('Nueva consulta en el sitio', body),
    replyTo: record.email ?? undefined,
  })
}

export async function notifyStaffNewLicitacionConsulta(record: LicitacionRecord): Promise<void> {
  const adminUrl = process.env.ADMIN_PANEL_URL || 'https://grupo.emprenor.com/admin/consultas'
  const body = `
<p><strong>Licitación:</strong> ${escapeHtml(record.licitacion_id ?? '—')}</p>
<p><strong>Consultante:</strong> ${escapeHtml(record.name ?? '—')} (${escapeHtml(record.email ?? '')})</p>
${record.organization ? `<p><strong>Organización:</strong> ${escapeHtml(record.organization)}</p>` : ''}
<p><strong>Pregunta:</strong></p>
<p style="white-space:pre-wrap;background:#f3f4f6;padding:12px;border-radius:8px">${escapeHtml(record.question ?? '')}</p>
<p><a href="${escapeHtml(adminUrl)}" style="display:inline-block;margin-top:12px;padding:10px 16px;background:#c8922a;color:#fff;text-decoration:none;border-radius:8px">Responder desde el panel</a></p>`

  await sendMail({
    to: staffNotifyEmail(),
    subject: `[EMPRENOR] Consulta técnica — ${record.licitacion_id ?? 'licitación'}`,
    html: mailShell('Nueva consulta de licitación', body),
    replyTo: record.email,
  })
}
