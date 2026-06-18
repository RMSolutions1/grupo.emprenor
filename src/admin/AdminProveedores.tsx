import { useEffect, useState } from 'react'
import {
  AdminPage,
  AdminCard,
  AdminTable,
  AdminButton,
  AdminModal,
  AdminBadge,
  AdminAlert,
  AdminTextarea,
  AdminLoading,
  AdminEmpty,
} from './components/AdminUI'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAdminReady } from './hooks/useAdminReady'
import {
  fetchOrganizaciones,
  updateOrganizacionStatus,
  checkPortalProveedoresReady,
  ORG_STATUS_LABELS,
  type Organizacion,
  type OrgStatus,
} from '../lib/proveedor'

export default function AdminProveedores() {
  usePageMeta({ title: 'Proveedores — Admin' })
  const { ready } = useAdminReady()
  const [rows, setRows] = useState<Organizacion[]>([])
  const [filter, setFilter] = useState<OrgStatus | 'all'>('pendiente')
  const [loading, setLoading] = useState(true)
  const [portalReady, setPortalReady] = useState<'ready' | 'missing' | 'loading'>('loading')
  const [selected, setSelected] = useState<Organizacion | null>(null)
  const [action, setAction] = useState<'aprobar' | 'rechazar' | 'suspender' | null>(null)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const data = await fetchOrganizaciones(filter === 'all' ? undefined : filter)
    setRows(data)
    setLoading(false)
  }

  useEffect(() => {
    if (!ready) return
    checkPortalProveedoresReady().then(setPortalReady)
    load()
  }, [ready, filter])

  const openAction = (row: Organizacion, act: typeof action) => {
    setSelected(row)
    setAction(act)
    setNote('')
    setError(null)
  }

  const confirmAction = async () => {
    if (!selected || !action) return
    setSaving(true)
    setError(null)
    const statusMap = { aprobar: 'aprobado', rechazar: 'rechazado', suspender: 'suspendido' } as const
    const result = await updateOrganizacionStatus(selected.id, statusMap[action], note)
    setSaving(false)
    if (!result.ok) {
      setError(result.error ?? 'Error')
      return
    }
    setSelected(null)
    setAction(null)
    await load()
  }

  const tabs: { id: OrgStatus | 'all'; label: string }[] = [
    { id: 'pendiente', label: 'Pendientes' },
    { id: 'aprobado', label: 'Aprobados' },
    { id: 'rechazado', label: 'Rechazados' },
    { id: 'suspendido', label: 'Suspendidos' },
    { id: 'all', label: 'Todos' },
  ]

  return (
    <AdminPage
      title="Proveedores"
      description="Registro, aprobación y gestión de empresas proveedoras del portal digital."
      actions={
        <AdminButton variant="secondary" onClick={() => void load()}>
          <i className="ri-refresh-line" /> Actualizar
        </AdminButton>
      }
    >
      {portalReady === 'missing' && (
        <AdminAlert tone="error" className="mb-6">
          Ejecute <code className="text-xs">scripts/migrate-portal-proveedores.sql</code> en Supabase (o{' '}
          <code className="text-xs">npm run migrate:proveedores</code>).
        </AdminAlert>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-body transition-colors ${
              filter === t.id ? 'bg-primary-500 text-white' : 'bg-white border border-background-200 text-foreground-600 hover:bg-background-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AdminCard>
        {loading ? (
          <AdminLoading />
        ) : rows.length === 0 ? (
          <AdminEmpty message="No hay proveedores en esta categoría." />
        ) : (
          <AdminTable headers={['Empresa', 'CUIT', 'Email', 'Rubros', 'Estado', 'Registro', 'Acciones']}>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 font-medium">{row.razon_social}</td>
                <td className="px-4 py-3 font-mono text-xs">{row.cuit}</td>
                <td className="px-4 py-3">{row.email}</td>
                <td className="px-4 py-3 text-foreground-600 max-w-[140px] truncate">
                  {row.rubros.slice(0, 2).join(', ')}{row.rubros.length > 2 ? '…' : ''}
                </td>
                <td className="px-4 py-3">
                  <AdminBadge tone={row.status === 'aprobado' ? 'success' : row.status === 'pendiente' ? 'warning' : 'neutral'}>
                    {ORG_STATUS_LABELS[row.status]}
                  </AdminBadge>
                </td>
                <td className="px-4 py-3 text-foreground-500">{new Date(row.created_at).toLocaleDateString('es-AR')}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {row.status === 'pendiente' && (
                      <>
                        <AdminButton variant="primary" className="!h-8 !px-2 !text-xs" onClick={() => openAction(row, 'aprobar')}>
                          Aprobar
                        </AdminButton>
                        <AdminButton variant="danger" className="!h-8 !px-2 !text-xs" onClick={() => openAction(row, 'rechazar')}>
                          Rechazar
                        </AdminButton>
                      </>
                    )}
                    {row.status === 'aprobado' && (
                      <AdminButton variant="ghost" className="!h-8 !px-2 !text-xs" onClick={() => openAction(row, 'suspender')}>
                        Suspender
                      </AdminButton>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      <AdminModal
        open={!!selected && !!action}
        onClose={() => { setSelected(null); setAction(null) }}
        title={
          action === 'aprobar' ? 'Aprobar proveedor' : action === 'rechazar' ? 'Rechazar registro' : 'Suspender proveedor'
        }
      >
        {selected && (
          <div className="space-y-4">
            <p className="text-sm font-body text-foreground-600">
              <strong>{selected.razon_social}</strong> — CUIT {selected.cuit}
            </p>
            {error && <AdminAlert tone="error">{error}</AdminAlert>}
            <AdminTextarea
              label="Nota (opcional, visible para el proveedor si rechaza/suspende)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <AdminButton variant="ghost" onClick={() => { setSelected(null); setAction(null) }}>Cancelar</AdminButton>
              <AdminButton
                variant={action === 'aprobar' ? 'primary' : 'danger'}
                disabled={saving}
                onClick={() => void confirmAction()}
              >
                {saving ? 'Guardando…' : 'Confirmar'}
              </AdminButton>
            </div>
          </div>
        )}
      </AdminModal>
    </AdminPage>
  )
}
