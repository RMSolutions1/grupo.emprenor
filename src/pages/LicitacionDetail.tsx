import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { useLicitacionesData } from '../context/ContentContext'
import { usePageMeta } from '../hooks/usePageMeta'
import {
  fetchLicitacionDocumentos,
  fetchLicitacionConsultas,
  type LicitacionDocumento,
  type LicitacionConsulta,
} from '../lib/cms'
import { docTypeLabel, formatFileSize } from '../lib/documents'
import { submitLicitacionConsulta } from '../lib/licitacionConsulta'
import { isSupabaseConfigured } from '../lib/supabase'

const statusColors: Record<string, string> = {
  Publicada: 'bg-accent-100 text-accent-700 border-accent-200',
  'En Análisis': 'bg-secondary-100 text-secondary-700 border-secondary-200',
  Presentada: 'bg-primary-100 text-primary-700 border-primary-200',
  Adjudicada: 'bg-background-200 text-foreground-700 border-background-300',
  Finalizada: 'bg-background-200 text-foreground-600 border-background-300',
}

export default function LicitacionDetail() {
  const { id } = useParams()
  const { licitaciones } = useLicitacionesData()
  const lic = licitaciones.find((l) => l.id === id)

  const [docs, setDocs] = useState<LicitacionDocumento[]>([])
  const [consultas, setConsultas] = useState<LicitacionConsulta[]>([])
  const [loadingExtras, setLoadingExtras] = useState(true)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [organization, setOrganization] = useState('')
  const [question, setQuestion] = useState('')
  const [hp, setHp] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  usePageMeta({
    title: lic?.title ?? 'Licitación',
    description: lic?.description?.slice(0, 160) ?? lic?.title,
    path: id ? `/licitaciones/${id}` : '/licitaciones',
    image: lic?.image,
  })

  useEffect(() => {
    if (!id || !isSupabaseConfigured) {
      setLoadingExtras(false)
      return
    }
    let cancelled = false
    Promise.all([
      fetchLicitacionDocumentos(id),
      fetchLicitacionConsultas(id),
    ]).then(([d, c]) => {
      if (cancelled) return
      setDocs(d)
      setConsultas(c)
      setLoadingExtras(false)
    })
    return () => { cancelled = true }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setSending(true)
    setFormError(null)
    const result = await submitLicitacionConsulta({
      licitacionId: id,
      name,
      email,
      organization,
      question,
      _hp: hp,
    })
    setSending(false)
    if (result.ok) {
      setSent(true)
      setQuestion('')
    } else {
      setFormError(result.error ?? 'Error al enviar')
    }
  }

  if (!lic) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center site-header-offset px-6">
          <h1 className="font-heading text-4xl font-bold text-foreground-950 mb-4">Licitación no encontrada</h1>
          <Link to="/licitaciones" className="text-accent-500 font-body hover:text-accent-600">Volver a licitaciones</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="relative site-header-offset">
        <div className="relative h-[45vh] min-h-[360px] overflow-hidden">
          <img alt={lic.title} className="w-full h-full object-cover object-top" src={lic.image} />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/85 via-primary-950/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-body font-medium border ${statusColors[lic.status] ?? statusColors.Publicada}`}>{lic.status}</span>
                <span className="text-xs font-body text-white/80">{lic.category}</span>
                <span className="text-xs font-mono text-white/60">{lic.code}</span>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight max-w-4xl">{lic.title}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background-100">
        <div className="w-full px-6 md:px-12 max-w-4xl mx-auto">
          <Breadcrumb items={[{ label: 'Licitaciones', to: '/licitaciones' }, { label: lic.title }]} />

          <div className="flex flex-wrap gap-6 mb-8 text-sm font-body text-foreground-600">
            <span className="flex items-center gap-2"><i className="ri-building-line text-accent-500" />{lic.client}</span>
            <span className="flex items-center gap-2"><i className="ri-map-pin-line text-accent-500" />{lic.location}</span>
            <span className="flex items-center gap-2"><i className="ri-money-dollar-circle-line text-accent-500" />{lic.budget}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="p-4 rounded-lg border border-background-200 bg-background-50">
              <p className="text-xs text-foreground-400 font-body mb-1">Apertura</p>
              <p className="font-body font-semibold text-foreground-900">{lic.apertura}</p>
            </div>
            <div className="p-4 rounded-lg border border-background-200 bg-background-50">
              <p className="text-xs text-foreground-400 font-body mb-1">Cierre</p>
              <p className="font-body font-semibold text-foreground-900">{lic.cierre}</p>
            </div>
          </div>

          {lic.description && (
            <p className="text-base font-body text-foreground-700 leading-relaxed mb-12">{lic.description}</p>
          )}

          <div className="mb-14">
            <h2 className="font-heading text-2xl font-bold text-foreground-950 mb-6 flex items-center gap-2">
              <i className="ri-folder-open-line text-accent-500" />
              Documentación
            </h2>
            {loadingExtras ? (
              <p className="text-sm text-foreground-500 font-body">Cargando documentos…</p>
            ) : docs.length === 0 ? (
              <p className="text-sm text-foreground-500 font-body p-6 rounded-xl border border-background-200 bg-background-50">
                No hay documentos publicados. Para consultas sobre pliegos, use el formulario más abajo o{' '}
                <Link to="/contacto" className="text-accent-500 hover:text-accent-600">contáctenos</Link>.
              </p>
            ) : (
              <ul className="space-y-3">
                {docs.map((doc) => (
                  <li key={doc.id}>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={doc.file_name ?? undefined}
                      className="flex items-center justify-between gap-4 p-4 rounded-xl border border-background-200 bg-background-50 hover:border-accent-300 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center shrink-0">
                          <i className="ri-file-download-line text-accent-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-body font-medium text-foreground-900 truncate">{doc.title}</p>
                          <p className="text-xs text-foreground-500 font-body">
                            {docTypeLabel(doc.doc_type)}
                            {doc.file_size ? ` · ${formatFileSize(doc.file_size)}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-body font-medium text-accent-500 group-hover:text-accent-600 shrink-0">Descargar</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {consultas.length > 0 && (
            <div className="mb-14">
              <h2 className="font-heading text-2xl font-bold text-foreground-950 mb-6 flex items-center gap-2">
                <i className="ri-question-answer-line text-accent-500" />
                Consultas y respuestas
              </h2>
              <div className="space-y-4">
                {consultas.map((c) => (
                  <article key={c.id} className="p-5 rounded-xl border border-background-200 bg-background-50">
                    <p className="text-sm font-body text-foreground-800 mb-3"><strong>Consulta:</strong> {c.question}</p>
                    {c.answer && (
                      <p className="text-sm font-body text-foreground-600 border-l-2 border-accent-400 pl-4"><strong>Respuesta:</strong> {c.answer}</p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 md:p-8 rounded-xl border border-background-200 bg-background-50">
            <h2 className="font-heading text-xl font-bold text-foreground-950 mb-2">Realizar consulta técnica</h2>
            <p className="text-sm font-body text-foreground-600 mb-6">
              Envíe su consulta sobre esta licitación. Las respuestas oficiales se publican en esta página.
            </p>
            {sent ? (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm font-body">
                Consulta enviada correctamente. Recibirá respuesta por email cuando sea publicada.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="_hp" value={hp} onChange={(e) => setHp(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body font-medium text-foreground-600 mb-1">Nombre *</label>
                    <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full h-11 px-4 rounded-md border border-background-300 bg-background-100 text-sm font-body focus:outline-none focus:border-accent-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-body font-medium text-foreground-600 mb-1">Email *</label>
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-11 px-4 rounded-md border border-background-300 bg-background-100 text-sm font-body focus:outline-none focus:border-accent-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-body font-medium text-foreground-600 mb-1">Empresa / Organización</label>
                  <input value={organization} onChange={(e) => setOrganization(e.target.value)} className="w-full h-11 px-4 rounded-md border border-background-300 bg-background-100 text-sm font-body focus:outline-none focus:border-accent-500" />
                </div>
                <div>
                  <label className="block text-xs font-body font-medium text-foreground-600 mb-1">Consulta *</label>
                  <textarea required rows={4} value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full px-4 py-3 rounded-md border border-background-300 bg-background-100 text-sm font-body focus:outline-none focus:border-accent-500 resize-y" />
                </div>
                {formError && <p className="text-sm text-red-600 font-body">{formError}</p>}
                <button type="submit" disabled={sending} className="px-6 py-2.5 bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white text-sm font-body font-medium rounded-md transition-all">
                  {sending ? 'Enviando…' : 'Enviar consulta'}
                </button>
              </form>
            )}
          </div>

          <div className="mt-10">
            <Link to="/licitaciones" className="inline-flex items-center gap-2 text-sm font-body font-medium text-accent-500 hover:text-accent-600">
              <i className="ri-arrow-left-line" /> Volver a licitaciones
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
