import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { saveBlogPost, deleteBlogPost, type DbBlogPost } from '../lib/cms'
import { AdminPage, AdminCard, AdminTable, AdminButton, AdminModal, AdminInput, AdminTextarea, AdminCheckbox, AdminBadge, AdminImageField, AdminLoading, AdminEmpty } from './components/AdminUI'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAdminReady } from './hooks/useAdminReady'

const empty: DbBlogPost = {
  id: '',
  title: '',
  excerpt: '',
  content: '',
  category: '',
  author: '',
  author_role: '',
  author_avatar_url: '',
  image_url: '',
  date_label: '',
  read_time: '',
  featured: false,
  published: true,
}

export default function AdminBlog() {
  usePageMeta({ title: 'Blog — Admin' })
  const { ready } = useAdminReady()
  const [rows, setRows] = useState<DbBlogPost[]>([])
  const [form, setForm] = useState<DbBlogPost>(empty)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    if (!supabase) return
    setLoading(true)
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    setRows((data as DbBlogPost[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (ready) load()
  }, [ready])

  const openNew = () => {
    setForm({ ...empty, id: `blog-${Date.now()}` })
    setOpen(true)
  }

  const openEdit = (row: DbBlogPost) => {
    setForm(row)
    setOpen(true)
  }

  const handleSave = async () => {
    await saveBlogPost(form)
    setOpen(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar artículo?')) return
    await deleteBlogPost(id)
    load()
  }

  return (
    <AdminPage title="Blog" description="Artículos y novedades del sitio." actions={<AdminButton onClick={openNew}><i className="ri-add-line" /> Nuevo artículo</AdminButton>}>
      <AdminCard>
        {loading ? <AdminLoading /> : rows.length === 0 ? <AdminEmpty message="No hay artículos. Ejecute npm run seed o cree uno nuevo." /> : (
        <AdminTable headers={['Título', 'Categoría', 'Autor', 'Estado', 'Acciones']}>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-3 font-medium">{row.title}</td>
              <td className="px-4 py-3 text-foreground-600">{row.category}</td>
              <td className="px-4 py-3 text-foreground-600">{row.author}</td>
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

      <AdminModal open={open} title="Artículo" onClose={() => setOpen(false)} wide>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminInput label="ID" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
          <AdminInput label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <AdminInput label="Categoría" value={form.category ?? ''} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <AdminInput label="Fecha" value={form.date_label ?? ''} onChange={(e) => setForm({ ...form, date_label: e.target.value })} />
          <AdminInput label="Autor" value={form.author ?? ''} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <AdminInput label="Rol autor" value={form.author_role ?? ''} onChange={(e) => setForm({ ...form, author_role: e.target.value })} />
          <AdminImageField label="Avatar autor" value={form.author_avatar_url ?? ''} onChange={(v) => setForm({ ...form, author_avatar_url: v })} />
          <AdminImageField label="Imagen portada" value={form.image_url ?? ''} onChange={(v) => setForm({ ...form, image_url: v })} />
          <AdminInput label="Tiempo lectura" value={form.read_time ?? ''} onChange={(e) => setForm({ ...form, read_time: e.target.value })} />
          <AdminTextarea label="Extracto" value={form.excerpt ?? ''} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="md:col-span-2" />
          <AdminTextarea label="Contenido (HTML/Markdown)" value={form.content ?? ''} onChange={(e) => setForm({ ...form, content: e.target.value })} className="md:col-span-2" rows={12} />
          <AdminCheckbox label="Destacado" checked={form.featured ?? false} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
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
