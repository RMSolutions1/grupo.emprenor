import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { saveService, type DbService } from '../lib/cms'
import { AdminPage, AdminCard, AdminTable, AdminButton, AdminModal, AdminInput, AdminTextarea, AdminCheckbox, AdminBadge, AdminImageField, AdminLoading, AdminEmpty } from './components/AdminUI'
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
  const [detailIntro, setDetailIntro] = useState('')
  const [detailItems, setDetailItems] = useState<DetailItem[]>([])
  const [loading, setLoading] = useState(true)

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
    setOpen(true)
  }

  const openNew = () => {
    setForm({ ...empty, id: `svc-${Date.now()}` })
    setDetailIntro('')
    setDetailItems([])
    setOpen(true)
  }

  const handleSave = async () => {
    await saveService({
      ...form,
      services: typeof form.services === 'string' ? (form.services as unknown as string).split(',').map((s) => s.trim()) : form.services,
      details: { intro: detailIntro, items: detailItems },
    })
    setOpen(false)
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
              <td className="px-4 py-3 text-right"><AdminButton variant="ghost" onClick={() => openEdit(row)}>Editar</AdminButton></td>
            </tr>
          ))}
        </AdminTable>
        )}
      </AdminCard>

      <AdminModal open={open} title="Editar servicio" onClose={() => setOpen(false)} wide>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminInput label="ID" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
          <AdminInput label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <AdminInput label="Tab title" value={form.tab_title ?? ''} onChange={(e) => setForm({ ...form, tab_title: e.target.value })} />
          <AdminInput label="Icono (Remix)" value={form.icon ?? ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          <AdminTextarea label="Descripción" value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="md:col-span-2" />
          <AdminInput label="Tagline" value={form.tagline ?? ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="md:col-span-2" />
          <AdminImageField label="Imagen listado" value={form.image_url ?? ''} onChange={(v) => setForm({ ...form, image_url: v })} />
          <AdminImageField label="Imagen página" value={form.page_image_url ?? ''} onChange={(v) => setForm({ ...form, page_image_url: v })} />
          <AdminInput label="Lista rápida (separar con comas)" value={(form.services ?? []).join(', ')} onChange={(e) => setForm({ ...form, services: e.target.value.split(',').map((s) => s.trim()) })} className="md:col-span-2" />
          <ServiceDetailsEditor intro={detailIntro} items={detailItems} onIntroChange={setDetailIntro} onItemsChange={setDetailItems} />
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
