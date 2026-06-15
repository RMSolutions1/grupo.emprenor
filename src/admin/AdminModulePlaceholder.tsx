import { useLocation } from 'react-router-dom'
import { adminModules } from '../lib/supabase'
import { usePageMeta } from '../hooks/usePageMeta'

export default function AdminModulePlaceholder() {
  const { pathname } = useLocation()
  const mod = adminModules.find((m) => m.path === pathname)

  usePageMeta({ title: `${mod?.title ?? 'Módulo'} — Admin` })

  return (
    <div className="p-8 md:p-10 max-w-3xl">
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-accent-100/70 mb-4">
        <i className={`${mod?.icon ?? 'ri-settings-line'} text-xl text-accent-500`} />
      </div>
      <h1 className="font-heading text-3xl font-bold text-foreground-950 mb-2">{mod?.title ?? 'Módulo'}</h1>
      <p className="text-base font-body text-foreground-600 leading-relaxed mb-6">{mod?.description}</p>
      <div className="p-6 rounded-xl border border-background-200 bg-background-50">
        <p className="text-sm font-body text-foreground-600 leading-relaxed">
          Este editor está en desarrollo. Permitirá crear, editar y eliminar registros con subida de imágenes,
          vista previa y publicación inmediata en el sitio público.
        </p>
        <p className="text-xs font-body text-foreground-400 mt-4">
          Fase 2 del CMS: formularios CRUD conectados a Supabase para este módulo.
        </p>
      </div>
    </div>
  )
}
