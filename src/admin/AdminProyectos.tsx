import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { saveProject, deleteProject, type DbProject } from '../lib/cms'
import { AdminPage, AdminCard, AdminTable, AdminButton, AdminModal, AdminInput, AdminTextarea, AdminSelect, AdminCheckbox, AdminBadge, AdminImageField, AdminLoading, AdminEmpty, AdminAlert } from './components/AdminUI'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAdminReady } from './hooks/useAdminReady'

const empty: DbProject = {
  id: '',
  title: '',
  client: '',
  location: '',
  year: new Date().getFullYear(),
  category: 'Infraestructura',
  description: '',
  carousel_description: '',
  tags: [],
  image_url: '',
  featured: false,
  published: true,
  sort_order: 0,
}

export default function AdminProyectos() {
  usePageMeta({ title: 'Proyectos — Admin' })
  const { ready } = useAdminReady()
  const [rows, setRows] = useState<DbProject[]>([])
  const [form, setForm] = useState<DbProject>(empty)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    if (!supabase) return
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase.from('projects').select('*').order('sort_order')
    if (err) setError(err.message)
    else setRows((data as DbProject[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (ready) load()
  }, [ready])

  const openNew = () => {
    setForm({ ...empty, id: `proj-${Date.now()}` })
    setOpen(true)
  }

  const openEdit = (row: DbProject) => {
    setForm({ ...row, tags: row.tags ?? [] })
    setOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const ok = await saveProject({
      ...form,
      tags: typeof form.tags === 'string' ? (form.tags as unknown as string).split(',').map((t) => t.trim()) : form.tags,
    })
    setSaving(false)
    if (ok) { setOpen(false); load() }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar proyecto?')) return
    await deleteProject(id)
    load()
  }

  return (
    <AdminPage
      title="Proyectos"
      description="Gestione el portafolio de obras y proyectos destacados."
      actions={<AdminButton onClick={openNew}><i className="ri-add-line" /> Nuevo proyecto</AdminButton>}
    >
      {error && <AdminAlert tone="error">{error}</AdminAlert>}
      <AdminCard>
        {loading ? <AdminLoading /> : rows.length === 0 ? <AdminEmpty message="No hay proyectos. Ejecute npm run seed o cree uno nuevo." /> : (
        <AdminTable headers={['Título', 'Cliente', 'Categoría', 'Estado', 'Acciones']}>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {row.image_url && <img src={row.image_url} alt="" className="w-10 h-10 rounded object-cover" />}
                  <div>
                    <p className="font-medium text-foreground-900">{row.title}</p>
                    {row.featured && <AdminBadge tone="accent">Destacado</AdminBadge>}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-foreground-600">{row.client}</td>
              <td className="px-4 py-3 text-foreground-600">{row.category}</td>
              <td className="px-4 py-3">
                <AdminBadge tone={row.published ? 'success' : 'warning'}>{row.published ? 'Publicado' : 'Borrador'}</AdminBadge>
              </td>
              <td className="px-4 py-3 text-right space-x-1">
                <AdminButton variant="ghost" onClick={() => openEdit(row)}>Editar</AdminButton>
                <AdminButton variant="ghost" onClick={() => handleDelete(row.id)}>Eliminar</AdminButton>
              </td>
            </tr>
          ))}
        </AdminTable>
        )}
      </AdminCard>

      <AdminModal open={open} title={form.id.startsWith('proj-') && !rows.find((r) => r.id === form.id) ? 'Nuevo proyecto' : 'Editar proyecto'} onClose={() => setOpen(false)} wide>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminInput label="ID" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
          <AdminInput label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <AdminInput label="Cliente" value={form.client ?? ''} onChange={(e) => setForm({ ...form, client: e.target.value })} />
          <AdminInput label="Ubicación" value={form.location ?? ''} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <AdminInput label="Año" type="number" value={form.year ?? ''} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
          <AdminSelect label="Categoría" value={form.category ?? ''} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {['Educación', 'Salud', 'Energía', 'Industrial', 'Viviendas', 'Infraestructura'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </AdminSelect>
          <AdminImageField label="Imagen (URL)" value={form.image_url ?? ''} onChange={(v) => setForm({ ...form, image_url: v })} />
          <AdminInput label="Tags (separados por coma)" value={(form.tags ?? []).join(', ')} onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()) })} className="md:col-span-2" />
          <AdminTextarea label="Descripción" value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="md:col-span-2" rows={4} />
          <AdminTextarea label="Descripción carrusel" value={form.carousel_description ?? ''} onChange={(e) => setForm({ ...form, carousel_description: e.target.value })} className="md:col-span-2" rows={2} />
          <AdminInput label="Orden" type="number" value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
          <div className="flex flex-col gap-2 justify-end">
            <AdminCheckbox label="Destacado" checked={form.featured ?? false} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            <AdminCheckbox label="Publicado" checked={form.published ?? true} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <AdminButton onClick={handleSave} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</AdminButton>
          <AdminButton variant="ghost" onClick={() => setOpen(false)}>Cancelar</AdminButton>
        </div>
      </AdminModal>
    </AdminPage>
  )
}
