import { AdminPage, AdminCard, AdminAlert } from './components/AdminUI'
import { usePageMeta } from '../hooks/usePageMeta'

const imageFolders = [
  { path: '/images/', description: 'Fotografías de proyectos, servicios, sectores y blog (~120 archivos)' },
  { path: '/brand/', description: 'Logos y assets de marca EMPRENOR' },
]

export default function AdminMedios() {
  usePageMeta({ title: 'Medios — Admin' })

  return (
    <AdminPage
      title="Medios e imágenes"
      description="Las imágenes del sitio están en la carpeta public/ del proyecto. En la base de datos se guardan las rutas (ej. /images/proyecto.jpg)."
    >
      <AdminAlert tone="info">
        Para cambiar una imagen: reemplace el archivo en <code className="text-xs bg-white/80 px-1 rounded">public/images/</code> manteniendo el mismo nombre, o suba una nueva y actualice la URL en Proyectos, Servicios o Blog.
      </AdminAlert>

      <div className="grid gap-4 mt-6">
        {imageFolders.map((folder) => (
          <AdminCard key={folder.path} className="p-6">
            <h3 className="font-heading text-lg font-semibold text-foreground-950">{folder.path}</h3>
            <p className="text-sm font-body text-foreground-600 mt-1">{folder.description}</p>
            <p className="text-xs font-body text-foreground-400 mt-3">
              En producción (Vercel) los archivos de <code>public/</code> se sirven automáticamente desde la raíz del dominio.
            </p>
          </AdminCard>
        ))}
      </div>

      <AdminCard className="p-6 mt-6">
        <h3 className="font-heading text-lg font-semibold mb-2">Supabase Storage (opcional)</h3>
        <p className="text-sm font-body text-foreground-600 leading-relaxed">
          Puede crear un bucket <strong>media</strong> en Supabase Storage para subir imágenes dinámicamente. Por ahora el sitio usa rutas locales en <code>/images/</code> y <code>/brand/</code>, ya incluidas en el repositorio y desplegadas con Vercel.
        </p>
      </AdminCard>
    </AdminPage>
  )
}
