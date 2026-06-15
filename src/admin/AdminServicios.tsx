import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { saveService, deleteService, type DbService } from '../lib/cms'
import { AdminPage, AdminCard, AdminTable, AdminButton, AdminModal, AdminInput, AdminTextarea, AdminCheckbox, AdminBadge, AdminImageField, AdminLoading, AdminEmpty, AdminAlert } from './components/AdminUI'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAdminReady } from './hooks/useAdminReady'
import { ServiceDetailsEditor, parseServiceDetails } from './components/ServiceDetailsEditor'

type DetailItem = { title: string; description: string }

const empty: DbService = {
  id: '',
  title: '',
  tab_title: '',
  description: '',
  tagline: '',
  icon: 'ri-tools-line',
  image_url: '',
  page_image_url: '',
  services: [],
  details: {},
  sort_order: 0,
  published: true,
}

export default function AdminServicios() {
  usePageMeta({ title: 'Servicios — Admin' })
  const { ready } = useAdminReady()
  const [rows, setRows] = useState<DbService[]>([])
  const [form, setForm] = useState<DbService>(empty)
  const [open, setOpen] = useState(false)
  const [isNew, setIsNew] = useState(false)
  const [detailIntro, setDetailIntro] = useState('')
  const [detailItems, setDetailItems] = useState<DetailItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const load = async () => {
    if (!supabase) return
    setLoading(true)
    const { data } = await supabase.from('services').select('*').order('sort_order')
    setRows((data as DbService[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (ready) load()
  }, [ready])

  const openEdit = (row: DbService) => {
    setForm(row)
    const parsed = parseServiceDetails(row.details)
    setDetailIntro(parsed.intro)
    setDetailItems(parsed.items)
    setIsNew(false)
    setSaveError(null)
    setOpen(true)
  }

  const openNew = () => {
    setForm({ ...empty, id: `svc-${Date.now()}` })
    setDetailIntro('')
    setDetailItems([])
    setIsNew(true)
    setSaveError(null)
    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      setSaveError('Ingrese el nombre del servicio.')
      return
    }
    setSaving(true)
    setSaveError(null)
    const ok = await saveService({
      ...form,
      tab_title: form.title,
      services: typeof form.services === 'string' ? (form.services as unknown as string).split(',').map((s) => s.trim()) : form.services,
      details: { intro: detailIntro, items: detailItems },
    })
    setSaving(false)
    if (ok) {
      setOpen(false)
      load()
    } else {
      setSaveError('No se pudo guardar. Intente nuevamente.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este servicio?')) return
    await deleteService(id)
    load()
  }

  return (
    <AdminPage title="Servicios" description="Divisiones de negocio y contenido de la página Servicios." actions={<AdminButton onClick={openNew}><i className="ri-add-line" /> Nuevo</AdminButton>}>
      <AdminCard>
        {loading ? <AdminLoading /> : rows.length === 0 ? <AdminEmpty message="No hay servicios cargados." /> : (
        <AdminTable headers={['Servicio', 'Tagline', 'Estado', 'Acciones']}>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <i className={`${row.icon} text-accent-500`} />
                  <span className="font-medium">{row.title}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-foreground-600 max-w-xs truncate">{row.tagline}</td>
              <td className="px-4 py-3"><AdminBadge tone={row.published ? 'success' : 'warning'}>{row.published ? 'Publicado' : 'Borrador'}</AdminBadge></td>
              <td className="px-4 py-3 text-right space-x-1">
                <AdminButton variant="ghost" onClick={() => openEdit(row)}>Editar</AdminButton>
                <AdminButton variant="ghost" onClick={() => handleDelete(row.id)}>Eliminar</AdminButton>
              </td>
            </tr>
          ))}
        </AdminTable>
        )}
      </AdminCard>

      <AdminModal open={open} title={isNew ? 'Nuevo servicio' : 'Editar servicio'} onClose={() => setOpen(false)} wide>
        {saveError && <AdminAlert tone="error">{saveError}</AdminAlert>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <AdminInput label="Nombre del servicio" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="md:col-span-2" />
          <AdminTextarea label="Descripción" value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="md:col-span-2" />
          <AdminInput label="Frase destacada" value={form.tagline ?? ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="md:col-span-2" />
          <AdminImageField label="Imagen listado" value={form.image_url ?? ''} onChange={(v) => setForm({ ...form, image_url: v })} folder="servicios" />
          <AdminImageField label="Imagen página" value={form.page_image_url ?? ''} onChange={(v) => setForm({ ...form, page_image_url: v })} folder="servicios" />
          <AdminInput label="Lista de capacidades (separar con comas)" value={(form.services ?? []).join(', ')} onChange={(e) => setForm({ ...form, services: e.target.value.split(',').map((s) => s.trim()) })} className="md:col-span-2" />
          <ServiceDetailsEditor intro={detailIntro} items={detailItems} onIntroChange={setDetailIntro} onItemsChange={setDetailItems} />
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
