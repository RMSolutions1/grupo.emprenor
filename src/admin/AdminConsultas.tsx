import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  AdminPage,
  AdminCard,
  AdminTable,
  AdminBadge,
  AdminButton,
  AdminModal,
  AdminAlert,
  AdminTextarea,
  AdminInput,
} from './components/AdminUI'
import {
  fetchContactSubmissions,
  fetchAllLicitacionConsultas,
  markSubmissionRead,
  markLicitacionConsultaRead,
  deleteSubmission,
  deleteLicitacionConsulta,
  type ContactSubmission,
  type LicitacionConsulta,
} from '../lib/cms'
import { sendStaffReply, isMailApiLikelyAvailable } from '../lib/adminMail'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAdminReady } from './hooks/useAdminReady'
import { useAdminNotificationsContext } from './AdminNotificationsContext'

const typeLabels = { contact: 'Consulta', callback: 'Callback', newsletter: 'Newsletter' } as const

type Tab = 'all' | 'contact' | 'callback' | 'newsletter' | 'licitaciones'

export default function AdminConsultas() {
  usePageMeta({ title: 'Bandeja de entrada — Admin' })
  const { ready } = useAdminReady()
  const { refresh: refreshNotifications, counts } = useAdminNotificationsContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState<ContactSubmission[]>([])
  const [licItems, setLicItems] = useState<LicitacionConsulta[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null)
  const [selectedLic, setSelectedLic] = useState<LicitacionConsulta | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replySubject, setReplySubject] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [publishAnswer, setPublishAnswer] = useState(true)

  const tab = (searchParams.get('tab') as Tab) || 'all'

  const load = async () => {
    setLoading(true)
    const [c, l] = await Promise.all([fetchContactSubmissions(), fetchAllLicitacionConsultas()])
    setItems(c)
    setLicItems(l)
    setLoading(false)
    refreshNotifications()
  }

  useEffect(() => {
    if (ready) load()
  }, [ready])

  useEffect(() => {
    const id = searchParams.get('id')
    if (!id || loading) return
    if (tab === 'licitaciones') {
      const found = licItems.find((l) => l.id === id)
      if (found) {
        setSelectedLic(found)
        setReplyText(found.answer ?? '')
        if (!found.read) markLicitacionConsultaRead(found.id, true).then(load)
      }
    } else {
      const found = items.find((i) => i.id === id)
      if (found) {
        setSelectedContact(found)
        setReplyText(found.staff_reply ?? '')
        if (!found.read) markSubmissionRead(found.id, true).then(load)
      }
    }
  }, [searchParams, items, licItems, loading, tab])

  const setTab = (t: Tab) => {
    setSearchParams(t === 'all' ? {} : { tab: t })
  }

  const filteredContacts = useMemo(() => {
    if (tab === 'licitaciones') return []
    if (tab === 'all') return items
    return items.filter((i) => i.type === tab)
  }, [items, tab])

  const filteredLic = tab === 'licitaciones' || tab === 'all' ? licItems : []

  const pendingLic = licItems.filter((l) => !l.read && l.status === 'pending').length

  const openContact = (item: ContactSubmission) => {
    setSelectedLic(null)
    setSelectedContact(item)
    setReplyText(item.staff_reply ?? '')
    setReplySubject('')
    setSendError(null)
    setSearchParams({ tab: item.type, id: item.id })
    if (!item.read) markSubmissionRead(item.id, true).then(load)
  }

  const openLic = (item: LicitacionConsulta) => {
    setSelectedContact(null)
    setSelectedLic(item)
    setReplyText(item.answer ?? '')
    setReplySubject('')
    setSendError(null)
    setPublishAnswer(true)
    setSearchParams({ tab: 'licitaciones', id: item.id })
    if (!item.read) markLicitacionConsultaRead(item.id, true).then(load)
  }

  const sendReply = async () => {
    if (!replyText.trim()) return
    setSending(true)
    setSendError(null)
    const payload = selectedContact
      ? { kind: 'contact' as const, id: selectedContact.id, message: replyText.trim(), subject: replySubject.trim() || undefined }
      : selectedLic
        ? { kind: 'licitacion' as const, id: selectedLic.id, message: replyText.trim(), subject: replySubject.trim() || undefined, publishAnswer }
        : null
    if (!payload) return
    const result = await sendStaffReply(payload)
    setSending(false)
    if (!result.ok) {
      setSendError(result.error ?? 'Error al enviar')
      return
    }
    await load()
    if (selectedContact) setSelectedContact({ ...selectedContact, staff_reply: replyText.trim(), read: true, replied_at: new Date().toISOString() })
    if (selectedLic) setSelectedLic({ ...selectedLic, answer: replyText.trim(), read: true, status: publishAnswer ? 'published' : 'answered', published: publishAnswer })
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'all', label: 'Todos', count: counts.total },
    { id: 'contact', label: 'Consultas', count: items.filter((i) => i.type === 'contact' && !i.read).length || undefined },
    { id: 'callback', label: 'Callbacks', count: items.filter((i) => i.type === 'callback' && !i.read).length || undefined },
    { id: 'newsletter', label: 'Newsletter' },
    { id: 'licitaciones', label: 'Licitaciones', count: pendingLic || undefined },
  ]

  return (
    <AdminPage
      title="Bandeja de entrada"
      description={`${items.length + licItems.length} mensajes · ${counts.total} pendientes`}
      actions={
        <AdminButton variant="ghost" onClick={load}>
          <i className="ri-refresh-line" /> Actualizar
        </AdminButton>
      }
    >
      {!isMailApiLikelyAvailable() && (
        <AdminAlert tone="warning" className="mb-4">
          Para enviar respuestas por email configure SMTP en Vercel (correo Ferozo) o Resend como alternativa.
          Desde Ferozo las respuestas usan la API de grupo.emprenor.com.
        </AdminAlert>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 px-4 h-9 rounded-full text-sm font-body transition-colors ${tab === t.id ? 'bg-primary-500 text-white' : 'bg-white border border-background-200 text-foreground-700 hover:border-accent-200'}`}
          >
            {t.label}
            {t.count != null && t.count > 0 && (
              <span className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center ${tab === t.id ? 'bg-white/20' : 'bg-accent-500 text-white'}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <AdminCard>
        {loading ? (
          <p className="p-8 text-sm font-body text-foreground-500">Cargando…</p>
        ) : filteredContacts.length === 0 && filteredLic.length === 0 ? (
          <AdminAlert tone="info">No hay mensajes en esta categoría.</AdminAlert>
        ) : (
          <AdminTable headers={['Tipo', 'Remitente', 'Fecha', 'Estado', '']}>
            {filteredContacts.map((item) => (
              <tr key={item.id} className={!item.read ? 'bg-accent-50/40' : ''}>
                <td className="px-4 py-3">
                  <AdminBadge tone={item.type === 'newsletter' ? 'accent' : 'neutral'}>{typeLabels[item.type]}</AdminBadge>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground-900">{item.name || item.email || '—'}</p>
                  {item.email && item.name && <p className="text-xs text-foreground-500">{item.email}</p>}
                </td>
                <td className="px-4 py-3 text-foreground-600 whitespace-nowrap">{new Date(item.created_at).toLocaleString('es-AR')}</td>
                <td className="px-4 py-3">
                  <AdminBadge tone={item.replied_at ? 'success' : item.read ? 'neutral' : 'warning'}>
                    {item.replied_at ? 'Respondida' : item.read ? 'Leída' : 'Nueva'}
                  </AdminBadge>
                </td>
                <td className="px-4 py-3 text-right">
                  <AdminButton variant="ghost" onClick={() => openContact(item)}>Abrir</AdminButton>
                </td>
              </tr>
            ))}
            {(tab === 'all' || tab === 'licitaciones') &&
              filteredLic.map((item) => (
                <tr key={item.id} className={!item.read && item.status === 'pending' ? 'bg-emerald-50/40' : ''}>
                  <td className="px-4 py-3">
                    <AdminBadge tone="accent">Licitación</AdminBadge>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground-900">{item.name}</p>
                    <p className="text-xs text-foreground-500">{item.email} · {item.licitacion_id}</p>
                  </td>
                  <td className="px-4 py-3 text-foreground-600 whitespace-nowrap">{new Date(item.created_at).toLocaleString('es-AR')}</td>
                  <td className="px-4 py-3">
                    <AdminBadge tone={item.status === 'pending' ? 'warning' : 'success'}>
                      {item.status === 'pending' ? 'Pendiente' : 'Respondida'}
                    </AdminBadge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <AdminButton variant="ghost" onClick={() => openLic(item)}>Abrir</AdminButton>
                  </td>
                </tr>
              ))}
          </AdminTable>
        )}
      </AdminCard>

      <AdminModal open={!!selectedContact} title="Consulta de contacto" onClose={() => { setSelectedContact(null); setSearchParams({ tab }) }} wide>
        {selectedContact && (
          <InboxDetail
            fields={[
              ['Tipo', typeLabels[selectedContact.type]],
              ['Fecha', new Date(selectedContact.created_at).toLocaleString('es-AR')],
              selectedContact.name ? ['Nombre', selectedContact.name] : null,
              selectedContact.email ? ['Email', selectedContact.email] : null,
              selectedContact.phone ? ['Teléfono', selectedContact.phone] : null,
              selectedContact.organization ? ['Organización', selectedContact.organization] : null,
              selectedContact.area ? ['Área', selectedContact.area] : null,
            ].filter(Boolean) as [string, string][]}
            message={selectedContact.message}
            previousReply={selectedContact.staff_reply}
            previousReplyAt={selectedContact.replied_at}
            canReply={Boolean(selectedContact.email) && selectedContact.type !== 'newsletter'}
            replyText={replyText}
            replySubject={replySubject}
            onReplyText={setReplyText}
            onReplySubject={setReplySubject}
            sending={sending}
            sendError={sendError}
            onSend={sendReply}
            extraActions={
              <>
                <AdminButton onClick={() => { markSubmissionRead(selectedContact.id, !selectedContact.read); load(); setSelectedContact({ ...selectedContact, read: !selectedContact.read }) }}>
                  {selectedContact.read ? 'Marcar no leída' : 'Marcar leída'}
                </AdminButton>
                <AdminButton variant="danger" onClick={async () => { if (!confirm('¿Eliminar?')) return; await deleteSubmission(selectedContact.id); setSelectedContact(null); load() }}>Eliminar</AdminButton>
              </>
            }
          />
        )}
      </AdminModal>

      <AdminModal open={!!selectedLic} title="Consulta de licitación" onClose={() => { setSelectedLic(null); setSearchParams({ tab: 'licitaciones' }) }} wide>
        {selectedLic && (
          <InboxDetail
            fields={[
              ['Licitación', selectedLic.licitacion_id],
              ['Fecha', new Date(selectedLic.created_at).toLocaleString('es-AR')],
              ['Nombre', selectedLic.name],
              ['Email', selectedLic.email],
              selectedLic.organization ? ['Organización', selectedLic.organization] : null,
            ].filter(Boolean) as [string, string][]}
            message={selectedLic.question}
            messageLabel="Pregunta"
            previousReply={selectedLic.answer}
            previousReplyAt={selectedLic.answered_at}
            canReply
            replyText={replyText}
            replySubject={replySubject}
            onReplyText={setReplyText}
            onReplySubject={setReplySubject}
            sending={sending}
            sendError={sendError}
            onSend={sendReply}
            licitacionOptions={
              <label className="flex items-center gap-2 text-sm font-body text-foreground-700 cursor-pointer">
                <input type="checkbox" checked={publishAnswer} onChange={(e) => setPublishAnswer(e.target.checked)} className="rounded border-background-300" />
                Publicar respuesta en el portal web
              </label>
            }
            extraActions={
              <AdminButton variant="danger" onClick={async () => { if (!confirm('¿Eliminar consulta?')) return; await deleteLicitacionConsulta(selectedLic.id); setSelectedLic(null); load() }}>Eliminar</AdminButton>
            }
          />
        )}
      </AdminModal>
    </AdminPage>
  )
}

function InboxDetail({
  fields,
  message,
  messageLabel = 'Mensaje',
  previousReply,
  previousReplyAt,
  canReply,
  replyText,
  replySubject,
  onReplyText,
  onReplySubject,
  sending,
  sendError,
  onSend,
  licitacionOptions,
  extraActions,
}: {
  fields: [string, string][]
  message: string | null
  messageLabel?: string
  previousReply: string | null
  previousReplyAt: string | null
  canReply: boolean
  replyText: string
  replySubject: string
  onReplyText: (v: string) => void
  onReplySubject: (v: string) => void
  sending: boolean
  sendError: string | null
  onSend: () => void
  licitacionOptions?: React.ReactNode
  extraActions?: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-body">
        {fields.map(([k, v]) => (
          <div key={k}><span className="text-foreground-500">{k}:</span> {v}</div>
        ))}
      </div>
      {message && (
        <div>
          <p className="text-xs font-body text-foreground-500 mb-1">{messageLabel}</p>
          <p className="text-sm font-body text-foreground-800 whitespace-pre-wrap bg-background-100 p-4 rounded-lg">{message}</p>
        </div>
      )}
      {previousReply && (
        <div>
          <p className="text-xs font-body text-foreground-500 mb-1">
            Respuesta enviada{previousReplyAt ? ` · ${new Date(previousReplyAt).toLocaleString('es-AR')}` : ''}
          </p>
          <p className="text-sm font-body text-foreground-800 whitespace-pre-wrap bg-emerald-50 p-4 rounded-lg border border-emerald-100">{previousReply}</p>
        </div>
      )}
      {canReply && (
        <div className="border-t border-background-200 pt-4 space-y-3">
          <p className="text-sm font-body font-medium text-foreground-900">Responder por email</p>
          <AdminInput label="Asunto (opcional)" value={replySubject} onChange={(e) => onReplySubject(e.target.value)} placeholder="Re: Su consulta a EMPRENOR" />
          <AdminTextarea label="Mensaje" value={replyText} onChange={(e) => onReplyText(e.target.value)} rows={5} placeholder="Escriba su respuesta…" />
          {licitacionOptions}
          {sendError && <AdminAlert tone="error">{sendError}</AdminAlert>}
          <AdminButton onClick={onSend} disabled={sending || !replyText.trim()}>
            <i className="ri-send-plane-line" />
            {sending ? 'Enviando…' : 'Enviar respuesta'}
          </AdminButton>
        </div>
      )}
      {!canReply && (
        <AdminAlert tone="info">Las suscripciones newsletter no admiten respuesta directa desde el panel.</AdminAlert>
      )}
      <div className="flex flex-wrap gap-2 pt-2">{extraActions}</div>
    </div>
  )
}
