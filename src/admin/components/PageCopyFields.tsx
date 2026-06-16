import type { HeroCopy, SectionCopy, CtaCopy, SeoCopy } from '../../data/pages'
import { AdminInput, AdminTextarea } from './AdminUI'
import { AdminImageField } from './AdminImageField'
import { FormSection } from './FormHelpers'

export function SeoFields({ seo, onChange }: { seo: SeoCopy; onChange: (seo: SeoCopy) => void }) {
  return (
    <FormSection title="SEO de la página" description="Título y descripción para buscadores y redes sociales.">
      <div className="grid grid-cols-1 gap-4">
        <AdminInput label="Título SEO" value={seo.title} onChange={(e) => onChange({ ...seo, title: e.target.value })} />
        <AdminTextarea label="Descripción SEO" rows={2} value={seo.description} onChange={(e) => onChange({ ...seo, description: e.target.value })} />
      </div>
    </FormSection>
  )
}

export function HeroFields({ hero, onChange, showImage = true }: { hero: HeroCopy; onChange: (hero: HeroCopy) => void; showImage?: boolean }) {
  return (
    <FormSection title="Hero / Encabezado" description="Título principal, subtítulo e imagen de fondo.">
      <div className="grid grid-cols-1 gap-4">
        <AdminInput label="Etiqueta (opcional)" value={hero.label ?? ''} onChange={(e) => onChange({ ...hero, label: e.target.value })} />
        <AdminInput label="Título" value={hero.title} onChange={(e) => onChange({ ...hero, title: e.target.value })} />
        <AdminTextarea label="Subtítulo" rows={3} value={hero.subtitle ?? ''} onChange={(e) => onChange({ ...hero, subtitle: e.target.value })} />
        {showImage && (
          <AdminImageField label="Imagen de fondo" value={hero.image ?? ''} onChange={(url) => onChange({ ...hero, image: url })} />
        )}
      </div>
    </FormSection>
  )
}

export function SectionFields({ section, onChange, title = 'Sección' }: { section: SectionCopy; onChange: (s: SectionCopy) => void; title?: string }) {
  return (
    <FormSection title={title}>
      <div className="grid grid-cols-1 gap-4">
        <AdminInput label="Etiqueta (opcional)" value={section.label ?? ''} onChange={(e) => onChange({ ...section, label: e.target.value })} />
        <AdminInput label="Título" value={section.title} onChange={(e) => onChange({ ...section, title: e.target.value })} />
        <AdminTextarea label="Subtítulo (opcional)" rows={2} value={section.subtitle ?? ''} onChange={(e) => onChange({ ...section, subtitle: e.target.value })} />
      </div>
    </FormSection>
  )
}

export function CtaFields({ cta, onChange }: { cta: CtaCopy; onChange: (cta: CtaCopy) => void }) {
  return (
    <FormSection title="Llamado a la acción (CTA)" description="Bloque final con botones de contacto.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminInput label="Etiqueta (opcional)" value={cta.label ?? ''} onChange={(e) => onChange({ ...cta, label: e.target.value })} className="md:col-span-2" />
        <AdminInput label="Título" value={cta.title} onChange={(e) => onChange({ ...cta, title: e.target.value })} className="md:col-span-2" />
        <AdminTextarea label="Descripción" rows={2} value={cta.description} onChange={(e) => onChange({ ...cta, description: e.target.value })} className="md:col-span-2" />
        <AdminInput label="Botón principal — texto" value={cta.primaryLabel} onChange={(e) => onChange({ ...cta, primaryLabel: e.target.value })} />
        <AdminInput label="Botón principal — enlace" value={cta.primaryUrl} onChange={(e) => onChange({ ...cta, primaryUrl: e.target.value })} />
        <AdminInput label="Botón secundario — texto" value={cta.secondaryLabel ?? ''} onChange={(e) => onChange({ ...cta, secondaryLabel: e.target.value })} />
        <AdminInput label="Botón secundario — enlace" value={cta.secondaryUrl ?? ''} onChange={(e) => onChange({ ...cta, secondaryUrl: e.target.value })} />
        <AdminImageField label="Imagen de fondo" value={cta.image ?? ''} onChange={(url) => onChange({ ...cta, image: url })} />
      </div>
    </FormSection>
  )
}

export function ParagraphList({ label, paragraphs, onChange }: { label: string; paragraphs: string[]; onChange: (p: string[]) => void }) {
  return (
    <FormSection title={label}>
      <div className="space-y-3">
        {paragraphs.map((p, i) => (
          <AdminTextarea
            key={i}
            label={`Párrafo ${i + 1}`}
            rows={3}
            value={p}
            onChange={(e) => {
              const next = [...paragraphs]
              next[i] = e.target.value
              onChange(next)
            }}
          />
        ))}
      </div>
    </FormSection>
  )
}
