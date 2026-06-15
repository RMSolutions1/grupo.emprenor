import type { ReactNode } from 'react'
import { AdminButton } from './AdminUI'

export function FormSection({ title, description, children, onAdd, addLabel }: {
  title: string
  description?: string
  children: ReactNode
  onAdd?: () => void
  addLabel?: string
}) {
  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground-950">{title}</h2>
          {description && <p className="text-sm font-body text-foreground-500 mt-1">{description}</p>}
        </div>
        {onAdd && (
          <AdminButton variant="ghost" onClick={onAdd}>
            <i className="ri-add-line" /> {addLabel ?? 'Agregar'}
          </AdminButton>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

export function ItemCard({ title, index, onRemove, children }: {
  title: string
  index?: number
  onRemove?: () => void
  children: ReactNode
}) {
  return (
    <div className="p-5 rounded-xl border border-background-200 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-body font-semibold text-foreground-800">
          {index !== undefined ? `${title} ${index + 1}` : title}
        </h3>
        {onRemove && (
          <button type="button" onClick={onRemove} className="text-xs font-body text-red-600 hover:text-red-700 flex items-center gap-1">
            <i className="ri-delete-bin-line" /> Quitar
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  )
}

export function SaveBar({ onSave, saving, saved, error }: {
  onSave: () => void
  saving?: boolean
  saved?: boolean
  error?: string | null
}) {
  return (
    <div className="sticky bottom-0 mt-8 p-4 rounded-xl border border-background-200 bg-background-50/95 backdrop-blur flex flex-wrap items-center gap-4">
      <AdminButton onClick={onSave} disabled={saving}>
        <i className="ri-save-line" /> {saving ? 'Guardando…' : 'Guardar cambios'}
      </AdminButton>
      {saved && <span className="text-sm font-body text-green-700">✓ Guardado correctamente</span>}
      {error && <span className="text-sm font-body text-red-600">{error}</span>}
    </div>
  )
}
