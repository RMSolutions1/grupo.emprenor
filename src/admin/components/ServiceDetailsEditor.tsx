import { FormSection, ItemCard } from './FormHelpers'
import { AdminTextarea, AdminInput } from './AdminUI'

type DetailItem = { title: string; description: string }

export function ServiceDetailsEditor({ intro, items, onIntroChange, onItemsChange }: {
  intro: string
  items: DetailItem[]
  onIntroChange: (v: string) => void
  onItemsChange: (items: DetailItem[]) => void
}) {
  return (
    <div className="md:col-span-2 space-y-4 pt-4 border-t border-background-200">
      <h3 className="text-sm font-body font-semibold text-foreground-800">Contenido detallado de la página</h3>
      <AdminTextarea label="Texto introductorio" value={intro} onChange={(e) => onIntroChange(e.target.value)} rows={3} />
      <FormSection
        title="Subservicios detallados"
        description="Bloques con título y descripción en la pestaña del servicio."
        onAdd={() => onItemsChange([...items, { title: '', description: '' }])}
        addLabel="Agregar bloque"
      >
        {items.map((item, i) => (
          <ItemCard key={i} title="Bloque" index={i} onRemove={() => onItemsChange(items.filter((_, j) => j !== i))}>
            <AdminInput label="Título" value={item.title} onChange={(e) => { const n = [...items]; n[i] = { ...item, title: e.target.value }; onItemsChange(n) }} />
            <AdminTextarea label="Descripción" value={item.description} onChange={(e) => { const n = [...items]; n[i] = { ...item, description: e.target.value }; onItemsChange(n) }} className="md:col-span-2" rows={2} />
          </ItemCard>
        ))}
      </FormSection>
    </div>
  )
}

export function parseServiceDetails(raw: unknown): { intro: string; items: DetailItem[] } {
  if (!raw || typeof raw !== 'object') return { intro: '', items: [] }
  const d = raw as { intro?: string; items?: DetailItem[] }
  return { intro: d.intro ?? '', items: Array.isArray(d.items) ? d.items : [] }
}
