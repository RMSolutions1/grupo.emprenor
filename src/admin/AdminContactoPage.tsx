import { useEffect, useState } from 'react'
import { fetchSiteSettings, upsertSiteSettings } from '../lib/cms'
import { siteContact, contactAreas } from '../data/contacto'
import {
  AdminPage, AdminCard, AdminInput, AdminTextarea, AdminLoading,
} from './components/AdminUI'
import { FormSection, ItemCard, SaveBar } from './components/FormHelpers'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAdminReady } from './hooks/useAdminReady'

type ContactData = typeof siteContact
type Area = (typeof contactAreas)[number]

export default function AdminContacto() {
  usePageMeta({ title: 'Contacto — Admin' })
  const { ready } = useAdminReady()
  const [contact, setContact] = useState<ContactData>(siteContact)
  const [areas, setAreas] = useState<Area[]>(contactAreas)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ready) return
    fetchSiteSettings().then((s) => {
      if (s?.contact) setContact(s.contact)
      if (s?.contact_areas?.length) setAreas(s.contact_areas)
      setLoading(false)
    })
  }, [ready])

  const save = async () => {
    setSaving(true)
    setSaved(false)
    setError(null)
    const ok = await upsertSiteSettings({ contact, contact_areas: areas })
    setSaving(false)
    if (ok) setSaved(true)
    else setError('No se pudo guardar. Intente nuevamente.')
  }

  const updatePhone = (i: number, field: 'display' | 'href', value: string) => {
    const phones = [...contact.phones]
    phones[i] = { ...phones[i], [field]: value }
    setContact({ ...contact, phones })
  }

  const updateAddressLine = (i: number, value: string) => {
    const lines = [...contact.address.lines]
    lines[i] = value
    setContact({ ...contact, address: { ...contact.address, lines } })
  }

  if (loading) {
    return (
      <AdminPage title="Contacto" description="Teléfonos, dirección, horarios y áreas de email del sitio.">
        <AdminCard><AdminLoading /></AdminCard>
      </AdminPage>
    )
  }

  return (
    <AdminPage title="Contacto" description="Edite la información de contacto que aparece en el sitio y en el pie de página.">
      <AdminCard className="p-6 md:p-8">
        <FormSection title="Datos principales" description="Correos, dirección y horarios de atención.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput label="Email general" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
            <AdminInput label="Email licitaciones" type="email" value={contact.licitacionesEmail} onChange={(e) => setContact({ ...contact, licitacionesEmail: e.target.value })} />
            <AdminInput label="Dirección corta (footer)" value={contact.address.short} onChange={(e) => setContact({ ...contact, address: { ...contact.address, short: e.target.value } })} className="md:col-span-2" />
            <AdminInput label="Horario entre semana" value={contact.hours.weekdays} onChange={(e) => setContact({ ...contact, hours: { ...contact.hours, weekdays: e.target.value } })} />
            <AdminInput label="Horario sábados" value={contact.hours.saturday} onChange={(e) => setContact({ ...contact, hours: { ...contact.hours, saturday: e.target.value } })} />
          </div>
          <div className="grid grid-cols-1 gap-3 mt-2">
            <p className="text-xs font-body font-medium text-foreground-600">Líneas de dirección</p>
            {contact.address.lines.map((line, i) => (
              <AdminInput key={i} label={`Línea ${i + 1}`} value={line} onChange={(e) => updateAddressLine(i, e.target.value)} />
            ))}
          </div>
        </FormSection>

        <FormSection
          title="Teléfonos"
          description="Número visible y enlace para llamar (formato tel:+543874312800)."
          onAdd={() => setContact({ ...contact, phones: [...contact.phones, { display: '', href: '' }] })}
          addLabel="Agregar teléfono"
        >
          {contact.phones.map((phone, i) => (
            <ItemCard key={i} title="Teléfono" index={i} onRemove={contact.phones.length > 1 ? () => setContact({ ...contact, phones: contact.phones.filter((_, j) => j !== i) }) : undefined}>
              <AdminInput label="Número visible" value={phone.display} onChange={(e) => updatePhone(i, 'display', e.target.value)} />
              <AdminInput label="Enlace (href)" value={phone.href} onChange={(e) => updatePhone(i, 'href', e.target.value)} placeholder="tel:+543874312800" />
            </ItemCard>
          ))}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-background-200">
            <AdminInput label="Teléfono principal (visible)" value={contact.primaryPhone.display} onChange={(e) => setContact({ ...contact, primaryPhone: { ...contact.primaryPhone, display: e.target.value } })} />
            <AdminInput label="Enlace teléfono principal" value={contact.primaryPhone.href} onChange={(e) => setContact({ ...contact, primaryPhone: { ...contact.primaryPhone, href: e.target.value } })} />
          </div>
        </FormSection>

        <FormSection
          title="Áreas de contacto directo"
          description="Tarjetas de la página Contacto con email por área."
          onAdd={() => setAreas([...areas, { title: '', description: '', email: '', icon: 'ri-mail-line' }])}
          addLabel="Agregar área"
        >
          {areas.map((area, i) => (
            <ItemCard key={i} title="Área" index={i} onRemove={() => setAreas(areas.filter((_, j) => j !== i))}>
              <AdminInput label="Título" value={area.title} onChange={(e) => { const n = [...areas]; n[i] = { ...area, title: e.target.value }; setAreas(n) }} />
              <AdminInput label="Email" type="email" value={area.email} onChange={(e) => { const n = [...areas]; n[i] = { ...area, email: e.target.value }; setAreas(n) }} />
              <AdminInput label="Icono" value={area.icon} onChange={(e) => { const n = [...areas]; n[i] = { ...area, icon: e.target.value }; setAreas(n) }} placeholder="ri-ruler-line" />
              <AdminTextarea label="Descripción" value={area.description} onChange={(e) => { const n = [...areas]; n[i] = { ...area, description: e.target.value }; setAreas(n) }} className="md:col-span-2" rows={2} />
            </ItemCard>
          ))}
        </FormSection>

        <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
      </AdminCard>
    </AdminPage>
  )
}
