import { AdminPage, AdminCard, AdminAlert } from './components/AdminUI'
import { usePageMeta } from '../hooks/usePageMeta'

const tips = [
  {
    icon: 'ri-building-2-line',
    title: 'Proyectos, Servicios y Blog',
    text: 'Al editar un registro, cada campo de imagen tiene dos opciones: subir desde tu PC o pegar un link de internet.',
  },
  {
    icon: 'ri-team-line',
    title: 'Empresa e Inicio',
    text: 'Las fotos del equipo directivo, sectores y testimonios se cambian igual: botón "Desde mi PC" o pestaña "Desde URL".',
  },
  {
    icon: 'ri-image-line',
    title: 'Imágenes del sitio original',
    text: 'Las fotos que vienen con el sitio (carpeta /images/) siguen funcionando. Podés reemplazarlas subiendo una nueva imagen y guardando.',
  },
]

export default function AdminMedios() {
  usePageMeta({ title: 'Medios — Admin' })

  return (
    <AdminPage
      title="Medios e imágenes"
      description="Subí fotos desde tu computadora o pegá un link. No hace falta tocar código ni carpetas del proyecto."
    >
      <AdminAlert tone="info">
        En <strong>Proyectos</strong>, <strong>Servicios</strong>, <strong>Blog</strong>, <strong>Empresa</strong> e <strong>Inicio</strong>, buscá el recuadro de imagen con los botones <em>Desde mi PC</em> y <em>Desde URL</em>. Elegí la foto, guardá el formulario y listo.
      </AdminAlert>

      <div className="grid gap-4 mt-6">
        {tips.map((tip) => (
          <AdminCard key={tip.title} className="p-6 flex gap-4">
            <div className="w-11 h-11 rounded-xl bg-accent-100 flex items-center justify-center shrink-0">
              <i className={`${tip.icon} text-xl text-accent-600`} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground-950">{tip.title}</h3>
              <p className="text-sm font-body text-foreground-600 mt-1 leading-relaxed">{tip.text}</p>
            </div>
          </AdminCard>
        ))}
      </div>

      <AdminCard className="p-6 mt-6">
        <h3 className="font-heading text-lg font-semibold mb-2">Primera vez: activar almacenamiento</h3>
        <p className="text-sm font-body text-foreground-600 leading-relaxed">
          Para subir desde la PC, ejecutá la sección <strong>Storage</strong> al final de <code className="text-xs bg-background-100 px-1 rounded">scripts/supabase-schema.sql</code> en el SQL Editor de Supabase. Crea el bucket <strong>media</strong> automáticamente.
        </p>
      </AdminCard>
    </AdminPage>
  )
}
