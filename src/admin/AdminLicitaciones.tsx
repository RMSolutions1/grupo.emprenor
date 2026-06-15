import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { saveLicitacion, type DbLicitacion } from '../lib/cms'
import { licitacionStatuses, licitacionCategories } from '../data/licitaciones'
import { AdminPage, AdminCard, AdminTable, AdminButton, AdminModal, AdminInput, AdminSelect, AdminCheckbox, AdminBadge, AdminLoading, AdminEmpty } from './components/AdminUI'
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
  const [loading, setLoading] = useState(true)

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
    setOpen(true)
  }

  const handleSave = async () => {
    await saveLicitacion(form)
    setOpen(false)
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
              <td className="px-4 py-3 text-right">
                <AdminButton variant="ghost" onClick={() => { setForm(row); setOpen(true) }}>Editar</AdminButton>
              </td>
            </tr>
          ))}
        </AdminTable>
        )}
      </AdminCard>

      <AdminModal open={open} title="Licitación" onClose={() => setOpen(false)} wide>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminInput label="ID" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
          <AdminInput label="Código" value={form.code ?? ''} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <AdminSelect label="Estado" value={form.status ?? ''} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {licitacionStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </AdminSelect>
          <AdminSelect label="Categoría" value={form.category ?? ''} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {licitacionCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </AdminSelect>
          <AdminInput label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="md:col-span-2" />
          <AdminInput label="Cliente" value={form.client ?? ''} onChange={(e) => setForm({ ...form, client: e.target.value })} />
          <AdminInput label="Ubicación" value={form.location ?? ''} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <AdminInput label="Apertura" value={form.apertura ?? ''} onChange={(e) => setForm({ ...form, apertura: e.target.value })} />
          <AdminInput label="Cierre" value={form.cierre ?? ''} onChange={(e) => setForm({ ...form, cierre: e.target.value })} />
          <AdminInput label="Presupuesto" value={form.budget ?? ''} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          <AdminInput label="Documentos" type="number" value={form.docs ?? 0} onChange={(e) => setForm({ ...form, docs: Number(e.target.value) })} />
          <AdminInput label="Consultas" type="number" value={form.consultas ?? 0} onChange={(e) => setForm({ ...form, consultas: Number(e.target.value) })} />
          <AdminCheckbox label="Publicado" checked={form.published ?? true} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
        </div>
        <div className="flex gap-2 mt-6">
          <AdminButton onClick={handleSave}>Guardar</AdminButton>
          <AdminButton variant="ghost" onClick={() => setOpen(false)}>Cancelar</AdminButton>
        </div>
      </AdminModal>
    </AdminPage>
  )
}
