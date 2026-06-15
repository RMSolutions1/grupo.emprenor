import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { saveLicitacion, deleteLicitacion, type DbLicitacion } from '../lib/cms'
import { licitacionStatuses, licitacionCategories } from '../data/licitaciones'
import { AdminPage, AdminCard, AdminTable, AdminButton, AdminModal, AdminInput, AdminSelect, AdminCheckbox, AdminBadge, AdminLoading, AdminEmpty, AdminAlert } from './components/AdminUI'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAdminReady } from './hooks/useAdminReady'

const empty: DbLicitacion = {
  id: '',
  code: '',
  status: 'Publicada',
  category: 'Obra Civil',
  title: '',
  client: '',
  location: '',
  apertura: '',
  cierre: '',
  budget: '',
  docs: 0,
  consultas: 0,
  published: true,
}

export default function AdminLicitaciones() {
  usePageMeta({ title: 'Licitaciones — Admin' })
  const { ready } = useAdminReady()
  const [rows, setRows] = useState<DbLicitacion[]>([])
  const [form, setForm] = useState<DbLicitacion>(empty)
  const [open, setOpen] = useState(false)
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const load = async () => {
    if (!supabase) return
    setLoading(true)
    const { data } = await supabase.from('licitaciones').select('*').order('updated_at', { ascending: false })
    setRows((data as DbLicitacion[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (ready) load()
  }, [ready])

  const openNew = () => {
    setForm({ ...empty, id: `lic-${Date.now()}` })
    setIsNew(true)
    setSaveError(null)
    setOpen(true)
  }

  const openEdit = (row: DbLicitacion) => {
    setForm(row)
    setIsNew(false)
    setSaveError(null)
    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      setSaveError('Ingrese el título de la licitación.')
      return
    }
    setSaving(true)
    setSaveError(null)
    const ok = await saveLicitacion(form)
    setSaving(false)
    if (ok) {
      setOpen(false)
      load()
    } else {
      setSaveError('No se pudo guardar. Intente nuevamente.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta licitación?')) return
    await deleteLicitacion(id)
    load()
  }

  return (
    <AdminPage title="Licitaciones" description="Llamados a licitación y estados." actions={<AdminButton onClick={openNew}><i className="ri-add-line" /> Nueva</AdminButton>}>
      <AdminCard>
        {loading ? <AdminLoading /> : rows.length === 0 ? <AdminEmpty message="No hay licitaciones cargadas." /> : (
        <AdminTable headers={['Código', 'Título', 'Estado', 'Cierre', 'Acciones']}>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-3 font-mono text-xs">{row.code}</td>
              <td className="px-4 py-3 font-medium max-w-xs truncate">{row.title}</td>
              <td className="px-4 py-3"><AdminBadge>{row.status}</AdminBadge></td>
              <td className="px-4 py-3 text-foreground-600">{row.cierre}</td>
              <td className="px-4 py-3 text-right space-x-1">
                <AdminButton variant="ghost" onClick={() => openEdit(row)}>Editar</AdminButton>
                <AdminButton variant="ghost" onClick={() => handleDelete(row.id)}>Eliminar</AdminButton>
              </td>
            </tr>
          ))}
        </AdminTable>
        )}
      </AdminCard>

      <AdminModal open={open} title={isNew ? 'Nueva licitación' : 'Editar licitación'} onClose={() => setOpen(false)} wide>
        {saveError && <AdminAlert tone="error">{saveError}</AdminAlert>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <AdminInput label="Código" value={form.code ?? ''} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="LIC-2026-001" />
          <AdminSelect label="Estado" value={form.status ?? ''} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {licitacionStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </AdminSelect>
          <AdminSelect label="Categoría" value={form.category ?? ''} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {licitacionCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </AdminSelect>
          <AdminInput label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="md:col-span-2" />
          <AdminInput label="Cliente" value={form.client ?? ''} onChange={(e) => setForm({ ...form, client: e.target.value })} />
          <AdminInput label="Ubicación" value={form.location ?? ''} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <AdminInput label="Fecha de apertura" value={form.apertura ?? ''} onChange={(e) => setForm({ ...form, apertura: e.target.value })} placeholder="15/03/2026" />
          <AdminInput label="Fecha de cierre" value={form.cierre ?? ''} onChange={(e) => setForm({ ...form, cierre: e.target.value })} placeholder="30/04/2026" />
          <AdminInput label="Presupuesto estimado" value={form.budget ?? ''} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="md:col-span-2" />
          <AdminInput label="Cantidad de documentos" type="number" value={form.docs ?? 0} onChange={(e) => setForm({ ...form, docs: Number(e.target.value) })} />
          <AdminInput label="Consultas recibidas" type="number" value={form.consultas ?? 0} onChange={(e) => setForm({ ...form, consultas: Number(e.target.value) })} />
          <AdminCheckbox label="Publicado" checked={form.published ?? true} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
        </div>
        <div className="flex gap-2 mt-6">
          <AdminButton onClick={handleSave} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</AdminButton>
          <AdminButton variant="ghost" onClick={() => setOpen(false)}>Cancelar</AdminButton>
        </div>
      </AdminModal>
    </AdminPage>
  )
}
