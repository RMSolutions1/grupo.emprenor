import { useEffect, useRef, useState } from 'react'
import {
  saveLicitacion,
  deleteLicitacion,
  fetchLicitacionDocumentos,
  fetchAllLicitacionConsultas,
  saveLicitacionDocumento,
  deleteLicitacionDocumento,
  updateLicitacionConsulta,
  deleteLicitacionConsulta,
  checkLicitacionPortalReady,
  type DbLicitacion,
  type LicitacionDocumento,
  type LicitacionConsulta,
} from '../lib/cms'
import { LICITACION_STATUS_VALUES, LICITACION_CATEGORY_VALUES } from '../data/licitaciones'
import { uploadLicitacionDocument, docTypeLabel, type DocType } from '../lib/documents'
import { supabase } from '../lib/supabase'
import {
  AdminPage, AdminCard, AdminTable, AdminButton, AdminModal, AdminInput, AdminSelect, AdminCheckbox, AdminBadge, AdminLoading, AdminEmpty, AdminAlert, AdminTextarea,
} from './components/AdminUI'
import { AdminTabs, AdminTabPanel } from './components/AdminTabs'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAdminReady } from './hooks/useAdminReady'

const empty: DbLicitacion = {
  id: '',
  code: '',
  status: 'Publicada',
  category: 'Obra Civil',
  title: '',
  client: '',
  location: '',
  apertura: '',
  cierre: '',
  budget: '',
  docs: 0,
  consultas: 0,
  description: '',
  image_url: '',
  published: true,
}

const DOC_TYPES: DocType[] = ['pliego', 'anexo', 'plano', 'acta', 'otro']

export default function AdminLicitaciones() {
  usePageMeta({ title: 'Licitaciones — Admin' })
  const { ready } = useAdminReady()
  const [rows, setRows] = useState<DbLicitacion[]>([])
  const [form, setForm] = useState<DbLicitacion>(empty)
  const [open, setOpen] = useState(false)
  const [modalTab, setModalTab] = useState('datos')
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [docs, setDocs] = useState<LicitacionDocumento[]>([])
  const [consultas, setConsultas] = useState<LicitacionConsulta[]>([])
  const [docTitle, setDocTitle] = useState('')
  const [docType, setDocType] = useState<DocType>('pliego')
  const [uploading, setUploading] = useState(false)
  const [portalReady, setPortalReady] = useState<'ready' | 'missing' | 'unknown' | 'loading'>('loading')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    if (!supabase) return
    setLoading(true)
    const { data } = await supabase.from('licitaciones').select('*').order('updated_at', { ascending: false })
    setRows((data as DbLicitacion[]) ?? [])
    setLoading(false)
  }

  const loadExtras = async (licitacionId: string) => {
    const [d, c] = await Promise.all([
      fetchLicitacionDocumentos(licitacionId, false),
      fetchAllLicitacionConsultas(),
    ])
    setDocs(d)
    setConsultas(c.filter((q) => q.licitacion_id === licitacionId))
  }

  useEffect(() => {
    if (!ready) return
    load()
    checkLicitacionPortalReady().then(setPortalReady)
  }, [ready])

  const openNew = () => {
    setForm({ ...empty, id: `lic-${Date.now()}` })
    setDocs([])
    setConsultas([])
    setIsNew(true)
    setModalTab('datos')
    setSaveError(null)
    setOpen(true)
  }

  const openEdit = async (row: DbLicitacion) => {
    setForm(row)
    setIsNew(false)
    setModalTab('datos')
    setSaveError(null)
    setOpen(true)
    await loadExtras(row.id)
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      setSaveError('Ingrese el título de la licitación.')
      return
    }
    setSaving(true)
    setSaveError(null)
    const ok = await saveLicitacion(form)
    setSaving(false)
    if (ok) {
      setOpen(false)
      load()
    } else {
      setSaveError('No se pudo guardar. Intente nuevamente.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta licitación y todos sus documentos?')) return
    await deleteLicitacion(id)
    load()
  }

  const handleUploadDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !form.id) return
    setUploading(true)
    const { url, error } = await uploadLicitacionDocument(file, form.id)
    if (error || !url) {
      setSaveError(error ?? 'Error al subir archivo')
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
      return
    }
    const result = await saveLicitacionDocumento({
      id: crypto.randomUUID(),
      licitacion_id: form.id,
      title: docTitle.trim() || file.name,
      doc_type: docType,
      file_url: url,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type || null,
      sort_order: docs.length,
      published: true,
    })
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
    if (!result.ok) {
      setSaveError(result.error ?? 'No se pudo registrar el documento')
      return
    }
    setDocTitle('')
    await loadExtras(form.id)
    load()
  }

  const removeDoc = async (id: string) => {
    if (!confirm('¿Eliminar este documento?')) return
    await deleteLicitacionDocumento(id)
    if (form.id) await loadExtras(form.id)
    load()
  }

  const answerConsulta = async (c: LicitacionConsulta, answer: string, publish: boolean) => {
    await updateLicitacionConsulta(c.id, {
      answer: answer.trim(),
      status: publish ? 'published' : 'answered',
      published: publish,
      answered_at: new Date().toISOString(),
    })
    if (form.id) await loadExtras(form.id)
  }

  const removeConsulta = async (id: string) => {
    if (!confirm('¿Eliminar esta consulta?')) return
    await deleteLicitacionConsulta(id)
    if (form.id) await loadExtras(form.id)
  }

  return (
    <AdminPage title="Licitaciones" description="Llamados, pliegos PDF/DOCX, planos y consultas técnicas. Los cambios se ven en ambos dominios al instante (misma base Supabase)." actions={<AdminButton onClick={openNew}><i className="ri-add-line" /> Nueva</AdminButton>}>
      {portalReady === 'missing' && (
        <AdminAlert tone="error">
          Falta ejecutar la migración SQL en Supabase:{' '}
          <code className="text-xs bg-background-100 px-1 rounded">scripts/migrate-licitaciones-portal.sql</code>
        </AdminAlert>
      )}
      {portalReady === 'ready' && (
        <AdminAlert tone="info">
          Portal de documentos activo. Para subir pliegos: <strong>Editar</strong> una licitación → pestaña <strong>Documentos</strong>.
        </AdminAlert>
      )}
      <AdminCard className="mt-4">
        {loading ? <AdminLoading /> : rows.length === 0 ? <AdminEmpty message="No hay licitaciones cargadas." /> : (
        <AdminTable headers={['Código', 'Título', 'Estado', 'Docs', 'Consultas', 'Acciones']}>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-3 font-mono text-xs">{row.code}</td>
              <td className="px-4 py-3 font-medium max-w-xs truncate">{row.title}</td>
              <td className="px-4 py-3"><AdminBadge>{row.status}</AdminBadge></td>
              <td className="px-4 py-3 text-foreground-600">{row.docs ?? 0}</td>
              <td className="px-4 py-3 text-foreground-600">{row.consultas ?? 0}</td>
              <td className="px-4 py-3 text-right space-x-1">
                <AdminButton variant="ghost" onClick={() => openEdit(row)}>Editar</AdminButton>
                <AdminButton variant="ghost" onClick={() => handleDelete(row.id)}>Eliminar</AdminButton>
              </td>
            </tr>
          ))}
        </AdminTable>
        )}
      </AdminCard>

      <AdminModal open={open} title={isNew ? 'Nueva licitación' : 'Editar licitación'} onClose={() => setOpen(false)} wide>
        {saveError && <AdminAlert tone="error">{saveError}</AdminAlert>}

        {!isNew && (
          <AdminTabs
            tabs={[
              { id: 'datos', label: 'Datos', icon: 'ri-file-list-line' },
              { id: 'docs', label: `Documentos (${docs.length})`, icon: 'ri-folder-open-line' },
              { id: 'consultas', label: `Consultas (${consultas.length})`, icon: 'ri-question-answer-line' },
            ]}
            active={modalTab}
            onChange={setModalTab}
          />
        )}

        <AdminTabPanel active={modalTab} id="datos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <AdminInput label="Código" value={form.code ?? ''} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="LIC-2026-001" />
            <AdminSelect label="Estado" value={form.status ?? ''} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {LICITACION_STATUS_VALUES.map((s) => <option key={s} value={s}>{s}</option>)}
            </AdminSelect>
            <AdminSelect label="Categoría" value={form.category ?? ''} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {LICITACION_CATEGORY_VALUES.map((c) => <option key={c} value={c}>{c}</option>)}
            </AdminSelect>
            <AdminInput label="URL imagen (opcional)" value={form.image_url ?? ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            <AdminInput label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="md:col-span-2" />
            <AdminTextarea label="Descripción / alcance" value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="md:col-span-2" rows={3} />
            <AdminInput label="Cliente" value={form.client ?? ''} onChange={(e) => setForm({ ...form, client: e.target.value })} />
            <AdminInput label="Ubicación" value={form.location ?? ''} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <AdminInput label="Fecha de apertura" value={form.apertura ?? ''} onChange={(e) => setForm({ ...form, apertura: e.target.value })} placeholder="15/03/2026" />
            <AdminInput label="Fecha de cierre" value={form.cierre ?? ''} onChange={(e) => setForm({ ...form, cierre: e.target.value })} placeholder="30/04/2026" />
            <AdminInput label="Presupuesto estimado" value={form.budget ?? ''} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="md:col-span-2" />
            <AdminCheckbox label="Publicado" checked={form.published ?? true} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          </div>
          <div className="flex gap-2 mt-6">
            <AdminButton onClick={handleSave} disabled={saving}>{saving ? 'Guardando…' : 'Guardar licitación'}</AdminButton>
            <AdminButton variant="ghost" onClick={() => setOpen(false)}>Cancelar</AdminButton>
          </div>
        </AdminTabPanel>

        <AdminTabPanel active={modalTab} id="docs">
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-background-200 bg-background-50">
              <AdminInput label="Título del documento" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} placeholder="Pliego de bases y condiciones" />
              <AdminSelect label="Tipo" value={docType} onChange={(e) => setDocType(e.target.value as DocType)}>
                {DOC_TYPES.map((t) => <option key={t} value={t}>{docTypeLabel(t)}</option>)}
              </AdminSelect>
              <div>
                <label className="block text-xs font-body font-medium text-foreground-600 mb-1">Archivo (PDF, DOCX, ZIP…)</label>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.dwg,.dxf,.jpg,.jpeg,.png" onChange={handleUploadDoc} disabled={uploading} className="block w-full text-sm font-body" />
              </div>
            </div>
            {uploading && <p className="text-sm text-foreground-500 font-body">Subiendo archivo…</p>}
            {docs.length === 0 ? (
              <AdminEmpty message="Sin documentos. Suba pliegos, anexos o planos arriba." />
            ) : (
              <ul className="space-y-2">
                {docs.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-background-200">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{d.title}</p>
                      <p className="text-xs text-foreground-500">{docTypeLabel(d.doc_type)} · <a href={d.file_url} target="_blank" rel="noreferrer" className="text-accent-500">Ver</a></p>
                    </div>
                    <AdminButton variant="ghost" onClick={() => removeDoc(d.id)}>Eliminar</AdminButton>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </AdminTabPanel>

        <AdminTabPanel active={modalTab} id="consultas">
          <div className="mt-4 space-y-4">
            {consultas.length === 0 ? (
              <AdminEmpty message="Sin consultas recibidas para esta licitación." />
            ) : (
              consultas.map((c) => (
                <ConsultaCard key={c.id} consulta={c} onSave={answerConsulta} onDelete={removeConsulta} />
              ))
            )}
          </div>
        </AdminTabPanel>
      </AdminModal>
    </AdminPage>
  )
}

function ConsultaCard({ consulta, onSave, onDelete }: {
  consulta: LicitacionConsulta
  onSave: (c: LicitacionConsulta, answer: string, publish: boolean) => void
  onDelete: (id: string) => void
}) {
  const [answer, setAnswer] = useState(consulta.answer ?? '')

  return (
    <div className="p-4 rounded-xl border border-background-200 bg-white">
      <div className="flex flex-wrap justify-between gap-2 mb-2">
        <p className="text-sm font-medium">{consulta.name} · {consulta.email}</p>
        <AdminBadge tone={consulta.published ? 'accent' : consulta.status === 'pending' ? 'warning' : 'neutral'}>
          {consulta.published ? 'Publicada' : consulta.status}
        </AdminBadge>
      </div>
      {consulta.organization && <p className="text-xs text-foreground-500 mb-2">{consulta.organization}</p>}
      <p className="text-sm text-foreground-700 mb-3">{consulta.question}</p>
      <AdminTextarea label="Respuesta oficial" rows={3} value={answer} onChange={(e) => setAnswer(e.target.value)} />
      <div className="flex flex-wrap gap-2 mt-3">
        <AdminButton variant="ghost" onClick={() => onSave(consulta, answer, false)}>Guardar borrador</AdminButton>
        <AdminButton onClick={() => onSave(consulta, answer, true)}>Publicar respuesta</AdminButton>
        <AdminButton variant="ghost" onClick={() => onDelete(consulta.id)}>Eliminar</AdminButton>
      </div>
    </div>
  )
}
