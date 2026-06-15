import { useEffect, useState } from 'react'
import { fetchSiteSettings, upsertSiteSettings } from '../lib/cms'
import { timeline, values, team, regions } from '../data/empresa'
import {
  AdminPage, AdminCard, AdminInput, AdminTextarea, AdminImageField, AdminLoading,
} from './components/AdminUI'
import { FormSection, ItemCard, SaveBar } from './components/FormHelpers'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAdminReady } from './hooks/useAdminReady'

type TimelineItem = (typeof timeline)[number]
type ValueItem = (typeof values)[number]
type TeamMember = (typeof team)[number]
type Region = (typeof regions)[number]

export default function AdminEmpresa() {
  usePageMeta({ title: 'Empresa — Admin' })
  const { ready } = useAdminReady()
  const [timelineList, setTimelineList] = useState<TimelineItem[]>(timeline)
  const [valuesList, setValuesList] = useState<ValueItem[]>(values)
  const [teamList, setTeamList] = useState<TeamMember[]>(team)
  const [regionsList, setRegionsList] = useState<Region[]>(regions)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ready) return
    fetchSiteSettings().then((s) => {
      if (s?.empresa?.timeline?.length) setTimelineList(s.empresa.timeline)
      if (s?.empresa?.values?.length) setValuesList(s.empresa.values)
      if (s?.empresa?.team?.length) setTeamList(s.empresa.team)
      if (s?.empresa?.regions?.length) setRegionsList(s.empresa.regions)
      setLoading(false)
    })
  }, [ready])

  const save = async () => {
    setSaving(true)
    setSaved(false)
    setError(null)
    const ok = await upsertSiteSettings({
      empresa: { timeline: timelineList, values: valuesList, team: teamList, regions: regionsList },
    })
    setSaving(false)
    if (ok) setSaved(true)
    else setError('No se pudo guardar. Intente nuevamente.')
  }

  if (loading) {
    return (
      <AdminPage title="Empresa" description="Historia, valores, equipo y regiones.">
        <AdminCard><AdminLoading /></AdminCard>
      </AdminPage>
    )
  }

  return (
    <AdminPage title="Empresa" description="Contenido de la página Empresa: historia, valores, equipo directivo y presencia regional.">
      <AdminCard className="p-6 md:p-8">
        <FormSection
          title="Línea de tiempo"
          description="Hitos históricos de EMPRENOR GROUP."
          onAdd={() => setTimelineList([...timelineList, { year: '', shortYear: '', title: '', description: '' }])}
          addLabel="Agregar hito"
        >
          {timelineList.map((item, i) => (
            <ItemCard key={i} title="Hito" index={i} onRemove={() => setTimelineList(timelineList.filter((_, j) => j !== i))}>
              <AdminInput label="Año" value={item.year} onChange={(e) => { const n = [...timelineList]; n[i] = { ...item, year: e.target.value }; setTimelineList(n) }} />
              <AdminInput label="Año corto" value={item.shortYear} onChange={(e) => { const n = [...timelineList]; n[i] = { ...item, shortYear: e.target.value }; setTimelineList(n) }} placeholder="08" />
              <AdminInput label="Título" value={item.title} onChange={(e) => { const n = [...timelineList]; n[i] = { ...item, title: e.target.value }; setTimelineList(n) }} className="md:col-span-2" />
              <AdminTextarea label="Descripción" value={item.description} onChange={(e) => { const n = [...timelineList]; n[i] = { ...item, description: e.target.value }; setTimelineList(n) }} className="md:col-span-2" rows={2} />
            </ItemCard>
          ))}
        </FormSection>

        <FormSection
          title="Valores"
          description="Principios que guían a la organización."
          onAdd={() => setValuesList([...valuesList, { title: '', description: '', icon: 'ri-award-line' }])}
          addLabel="Agregar valor"
        >
          {valuesList.map((item, i) => (
            <ItemCard key={i} title="Valor" index={i} onRemove={() => setValuesList(valuesList.filter((_, j) => j !== i))}>
              <AdminInput label="Título" value={item.title} onChange={(e) => { const n = [...valuesList]; n[i] = { ...item, title: e.target.value }; setValuesList(n) }} />
              <AdminInput label="Icono" value={item.icon} onChange={(e) => { const n = [...valuesList]; n[i] = { ...item, icon: e.target.value }; setValuesList(n) }} />
              <AdminTextarea label="Descripción" value={item.description} onChange={(e) => { const n = [...valuesList]; n[i] = { ...item, description: e.target.value }; setValuesList(n) }} className="md:col-span-2" rows={2} />
            </ItemCard>
          ))}
        </FormSection>

        <FormSection
          title="Equipo directivo"
          description="Miembros del directorio mostrados en la web."
          onAdd={() => setTeamList([...teamList, { name: '', role: '', description: '', avatar: '' }])}
          addLabel="Agregar miembro"
        >
          {teamList.map((member, i) => (
            <ItemCard key={i} title="Miembro" index={i} onRemove={() => setTeamList(teamList.filter((_, j) => j !== i))}>
              <AdminInput label="Nombre" value={member.name} onChange={(e) => { const n = [...teamList]; n[i] = { ...member, name: e.target.value }; setTeamList(n) }} />
              <AdminInput label="Cargo" value={member.role} onChange={(e) => { const n = [...teamList]; n[i] = { ...member, role: e.target.value }; setTeamList(n) }} />
              <AdminTextarea label="Biografía breve" value={member.description} onChange={(e) => { const n = [...teamList]; n[i] = { ...member, description: e.target.value }; setTeamList(n) }} className="md:col-span-2" rows={3} />
              <div className="md:col-span-2">
                <AdminImageField label="Foto" value={member.avatar} onChange={(v) => { const n = [...teamList]; n[i] = { ...member, avatar: v }; setTeamList(n) }} />
              </div>
            </ItemCard>
          ))}
        </FormSection>

        <FormSection
          title="Regiones de operación"
          description="Provincias y ciudades donde trabaja el grupo."
          onAdd={() => setRegionsList([...regionsList, { name: '', cities: '' }])}
          addLabel="Agregar región"
        >
          {regionsList.map((region, i) => (
            <ItemCard key={i} title="Región" index={i} onRemove={() => setRegionsList(regionsList.filter((_, j) => j !== i))}>
              <AdminInput label="Provincia / región" value={region.name} onChange={(e) => { const n = [...regionsList]; n[i] = { ...region, name: e.target.value }; setRegionsList(n) }} />
              <AdminInput label="Ciudades" value={region.cities} onChange={(e) => { const n = [...regionsList]; n[i] = { ...region, cities: e.target.value }; setRegionsList(n) }} placeholder="Ciudad A · Ciudad B" />
            </ItemCard>
          ))}
        </FormSection>

        <SaveBar onSave={save} saving={saving} saved={saved} error={error} />
      </AdminCard>
    </AdminPage>
  )
}
