import { useEffect, useState } from 'react'
import { AdminPage, AdminCard, AdminTable, AdminBadge, AdminButton, AdminModal, AdminAlert } from './components/AdminUI'
import { fetchContactSubmissions, markSubmissionRead, deleteSubmission, type ContactSubmission } from '../lib/cms'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAdminReady } from './hooks/useAdminReady'

const typeLabels = { contact: 'Consulta', callback: 'Callback', newsletter: 'Newsletter' }

export default function AdminConsultas() {
  usePageMeta({ title: 'Consultas — Admin' })
  const { ready } = useAdminReady()
  const [items, setItems] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ContactSubmission | null>(null)

  const load = async () => {
    setLoading(true)
    setItems(await fetchContactSubmissions())
    setLoading(false)
  }

  useEffect(() => {
    if (ready) load()
  }, [ready])

  const unread = items.filter((i) => !i.read).length

  const toggleRead = async (item: ContactSubmission) => {
    await markSubmissionRead(item.id, !item.read)
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar esta consulta?')) return
    await deleteSubmission(id)
    setSelected(null)
    load()
  }

  return (
    <AdminPage
      title="Consultas recibidas"
      description={`${items.length} mensajes · ${unread} sin leer`}
      actions={
        <AdminButton variant="ghost" onClick={load}>
          <i className="ri-refresh-line" /> Actualizar
        </AdminButton>
      }
    >
      <AdminCard>
        {loading ? (
          <p className="p-8 text-sm font-body text-foreground-500">Cargando…</p>
        ) : items.length === 0 ? (
          <AdminAlert tone="info">No hay consultas todavía. Aparecerán aquí cuando alguien envíe un formulario desde el sitio.</AdminAlert>
        ) : (
          <AdminTable headers={['Tipo', 'Nombre / Email', 'Fecha', 'Estado', '']}>
            {items.map((item) => (
              <tr key={item.id} className={!item.read ? 'bg-accent-50/40' : ''}>
                <td className="px-4 py-3">
                  <AdminBadge tone={item.type === 'newsletter' ? 'accent' : 'neutral'}>{typeLabels[item.type]}</AdminBadge>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground-900">{item.name || item.email || '—'}</p>
                  {item.email && item.name && <p className="text-xs text-foreground-500">{item.email}</p>}
                </td>
                <td className="px-4 py-3 text-foreground-600 whitespace-nowrap">
                  {new Date(item.created_at).toLocaleString('es-AR')}
                </td>
                <td className="px-4 py-3">
                  <AdminBadge tone={item.read ? 'neutral' : 'warning'}>{item.read ? 'Leída' : 'Nueva'}</AdminBadge>
                </td>
                <td className="px-4 py-3 text-right">
                  <AdminButton variant="ghost" onClick={() => setSelected(item)}>Ver</AdminButton>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      <AdminModal open={!!selected} title="Detalle de consulta" onClose={() => setSelected(null)} wide>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm font-body">
              <div><span className="text-foreground-500">Tipo:</span> {typeLabels[selected.type]}</div>
              <div><span className="text-foreground-500">Fecha:</span> {new Date(selected.created_at).toLocaleString('es-AR')}</div>
              {selected.name && <div><span className="text-foreground-500">Nombre:</span> {selected.name}</div>}
              {selected.email && <div><span className="text-foreground-500">Email:</span> {selected.email}</div>}
              {selected.phone && <div><span className="text-foreground-500">Teléfono:</span> {selected.phone}</div>}
              {selected.organization && <div><span className="text-foreground-500">Organización:</span> {selected.organization}</div>}
              {selected.area && <div><span className="text-foreground-500">Área:</span> {selected.area}</div>}
            </div>
            {selected.message && (
              <div>
                <p className="text-xs font-body text-foreground-500 mb-1">Mensaje</p>
                <p className="text-sm font-body text-foreground-800 whitespace-pre-wrap bg-background-100 p-4 rounded-lg">{selected.message}</p>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <AdminButton onClick={() => { toggleRead(selected); setSelected({ ...selected, read: !selected.read }) }}>
                {selected.read ? 'Marcar como no leída' : 'Marcar como leída'}
              </AdminButton>
              <AdminButton variant="danger" onClick={() => remove(selected.id)}>Eliminar</AdminButton>
            </div>
          </div>
        )}
      </AdminModal>
    </AdminPage>
  )
}
