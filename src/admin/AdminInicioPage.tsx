import { useEffect, useState } from 'react'
import { fetchSiteSettings, upsertSiteSettings } from '../lib/cms'
import { stats, sectors, certifications } from '../data/home'
import { testimonials, type Testimonial } from '../data/testimonials'
import type { Sector } from '../data/home'
import {
  AdminPage, AdminCard, AdminInput, AdminTextarea, AdminCheckbox, AdminImageField, AdminLoading,
} from './components/AdminUI'
import { FormSection, ItemCard, SaveBar } from './components/FormHelpers'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAdminReady } from './hooks/useAdminReady'

type Stat = (typeof stats)[number]
type Cert = (typeof certifications)[number]

export default function AdminInicio() {
  usePageMeta({ title: 'Inicio — Admin' })
  const { ready } = useAdminReady()
  const [statList, setStatList] = useState<Stat[]>(stats)
  const [testimonialList, setTestimonialList] = useState<Testimonial[]>(testimonials)
  const [sectorList, setSectorList] = useState<Sector[]>(sectors)
  const [certList, setCertList] = useState<Cert[]>(certifications)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ready) return
    fetchSiteSettings().then((s) => {
      if (s?.stats?.length) setStatList(s.stats)
      if (s?.testimonials?.length) setTestimonialList(s.testimonials)
      if (s?.home?.sectors?.length) setSectorList(s.home.sectors)
      if (s?.home?.certifications?.length) setCertList(s.home.certifications)
      setLoading(false)
    })
  }, [ready])

  const save = async () => {
    setSaving(true)
    setSaved(false)
    setError(null)
    const ok = await upsertSiteSettings({
      stats: statList,
      testimonials: testimonialList,
      home: { sectors: sectorList, certifications: certList },
    })
    setSaving(false)
    if (ok) setSaved(true)
    else setError('No se pudo guardar. Intente nuevamente.')
  }

  if (loading) {
    return (
      <AdminPage title="Página de inicio" description="Estadísticas, testimonios y certificaciones.">
        <AdminCard><AdminLoading /></AdminCard>
      </AdminPage>
    )
  }

  return (
    <AdminPage title="Página de inicio" description="Editá las estadísticas, sectores, certificaciones y testimonios de la home con formularios simples.">
      <AdminCard className="p-6 md:p-8">
        <FormSection
          title="Estadísticas"
          description="Números del banner de la página principal."
          onAdd={() => setStatList([...statList, { value: 0, suffix: '+', label: '', icon: 'ri-star-line' }])}
          addLabel="Agregar estadística"
        >
          {statList.map((stat, i) => (
            <ItemCard key={i} title="Estadística" index={i} onRemove={() => setStatList(statList.filter((_, j) => j !== i))}>
              <AdminInput label="Valor numérico" type="number" value={stat.value} onChange={(e) => { const n = [...statList]; n[i] = { ...stat, value: Number(e.target.value) }; setStatList(n) }} />
              <AdminInput label="Sufijo (+, %, etc.)" value={stat.suffix} onChange={(e) => { const n = [...statList]; n[i] = { ...stat, suffix: e.target.value }; setStatList(n) }} />
              <AdminInput label="Etiqueta visible" value={stat.label} onChange={(e) => { const n = [...statList]; n[i] = { ...stat, label: e.target.value }; setStatList(n) }} className="md:col-span-2" />
            </ItemCard>
          ))}
        </FormSection>

        <FormSection
          title="Sectores"
          description="Tarjetas de sectores en los que trabaja la empresa."
          onAdd={() => setSectorList([...sectorList, { id: `sector-${Date.now()}`, title: '', icon: 'ri-building-line', image: '' }])}
          addLabel="Agregar sector"
        >
          {sectorList.map((sector, i) => (
            <ItemCard key={sector.id} title="Sector" index={i} onRemove={() => setSectorList(sectorList.filter((_, j) => j !== i))}>
              <AdminInput label="Nombre del sector" value={sector.title} onChange={(e) => { const n = [...sectorList]; n[i] = { ...sector, title: e.target.value }; setSectorList(n) }} />
              <div className="md:col-span-2">
                <AdminImageField label="Imagen" value={sector.image} onChange={(v) => { const n = [...sectorList]; n[i] = { ...sector, image: v }; setSectorList(n) }} folder="home" />
              </div>
            </ItemCard>
          ))}
        </FormSection>

        <FormSection
          title="Certificaciones"
          description="Sellos de calidad y normas."
          onAdd={() => setCertList([...certList, { title: '', description: '', icon: 'ri-award-line' }])}
          addLabel="Agregar certificación"
        >
          {certList.map((cert, i) => (
            <ItemCard key={i} title="Certificación" index={i} onRemove={() => setCertList(certList.filter((_, j) => j !== i))}>
              <AdminInput label="Nombre de la certificación" value={cert.title} onChange={(e) => { const n = [...certList]; n[i] = { ...cert, title: e.target.value }; setCertList(n) }} className="md:col-span-2" />
              <AdminTextarea label="Descripción" value={cert.description} onChange={(e) => { const n = [...certList]; n[i] = { ...cert, description: e.target.value }; setCertList(n) }} className="md:col-span-2" rows={2} />
            </ItemCard>
          ))}
        </FormSection>

        <FormSection
          title="Testimonios"
          description="Opiniones de clientes en la página principal."
          onAdd={() => setTestimonialList([...testimonialList, { name: '', role: '', company: '', quote: '', avatar: '' }])}
          addLabel="Agregar testimonio"
        >
          {testimonialList.map((t, i) => (
            <ItemCard key={i} title="Testimonio" index={i} onRemove={() => setTestimonialList(testimonialList.filter((_, j) => j !== i))}>
              <AdminInput label="Nombre" value={t.name} onChange={(e) => { const n = [...testimonialList]; n[i] = { ...t, name: e.target.value }; setTestimonialList(n) }} />
              <AdminInput label="Cargo" value={t.role} onChange={(e) => { const n = [...testimonialList]; n[i] = { ...t, role: e.target.value }; setTestimonialList(n) }} />
              <AdminInput label="Organización" value={t.company} onChange={(e) => { const n = [...testimonialList]; n[i] = { ...t, company: e.target.value }; setTestimonialList(n) }} className="md:col-span-2" />
              <AdminTextarea label="Cita" value={t.quote} onChange={(e) => { const n = [...testimonialList]; n[i] = { ...t, quote: e.target.value }; setTestimonialList(n) }} className="md:col-span-2" rows={3} />
              <div className="md:col-span-2">
                <AdminImageField label="Foto" value={t.avatar} onChange={(v) => { const n = [...testimonialList]; n[i] = { ...t, avatar: v }; setTestimonialList(n) }} folder="testimonials" />
              </div>
              <AdminCheckbox label="Mostrar desplazado a la derecha" checked={t.offset ?? false} onChange={(e) => { const n = [...testimonialList]; n[i] = { ...t, offset: e.target.checked }; setTestimonialList(n) }} />
            </ItemCard>
          ))}
        </FormSection>

        <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
      </AdminCard>
    </AdminPage>
  )
}
