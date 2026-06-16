import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { IMAGES } from '../data/images'
import { type Licitacion } from '../data/licitaciones'
import { useLicitacionesData } from '../context/ContentContext'
import { usePageMeta } from '../hooks/usePageMeta'

const statusColors: Record<Licitacion['status'], string> = {
  Publicada: 'bg-accent-100 text-accent-700 border-accent-200',
  'En Análisis': 'bg-secondary-100 text-secondary-700 border-secondary-200',
  Presentada: 'bg-primary-100 text-primary-700 border-primary-200',
  Adjudicada: 'bg-background-200 text-foreground-700 border-background-300',
  Finalizada: 'bg-background-200 text-foreground-600 border-background-300',
}

function formatBudgetDisplay(budget: string): string {
  return budget
}

function truncateText(text: string, max = 35): string {
  return text.length > max ? `${text.slice(0, max)}...` : text
}

export default function Licitaciones() {
  const { licitaciones, licitacionStatuses, licitacionCategories } = useLicitacionesData()
  const [status, setStatus] = useState('Todas las Licitaciones')
  const [category, setCategory] = useState('Todas las Categorías')
  const [visible, setVisible] = useState(6)

  usePageMeta({
    title: 'Licitaciones',
    description: 'Portal de licitaciones vigentes de EMPRENOR GROUP. Acceda a documentación, consultas y ofertas.',
  })

  const filtered = useMemo(() => {
    const statusMap: Record<string, string> = {
      Publicadas: 'Publicada',
      Presentadas: 'Presentada',
      Adjudicadas: 'Adjudicada',
      Finalizadas: 'Finalizada',
      'En Análisis': 'En Análisis',
    }
    return licitaciones.filter((l) => {
      const statusMatch = status === 'Todas las Licitaciones' || l.status === (statusMap[status] || status)
      const catMatch = category === 'Todas las Categorías' || l.category === category
      return statusMatch && catMatch
    })
  }, [status, category, licitaciones])

  return (
    <Layout>
      <section className="relative w-full h-[500px] flex items-center justify-center overflow-hidden site-header-offset">
        <img
          alt="Portal de Licitaciones EMPRENOR GROUP"
          className="absolute inset-0 w-full h-full object-cover object-center"
          src={IMAGES.licitacionesHero}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 w-full px-6 md:px-12 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-500/90 text-white text-xs font-body font-medium tracking-wider uppercase mb-6">
            Transparencia y Gestión
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 max-w-3xl mx-auto leading-tight">
            Portal de Licitaciones
          </h1>
          <p className="text-base md:text-lg text-white/80 font-body max-w-2xl mx-auto leading-relaxed">
            Acceda a llamados vigentes, descargue documentación, realice consultas y presente sus ofertas. Interactuamos con organismos públicos y privados con total transparencia.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 text-white/60 text-xs font-body">
            <Link to="/" className="hover:text-accent-400 transition-colors whitespace-nowrap">Inicio</Link>
            <span>/</span>
            <span className="text-accent-400 font-medium whitespace-nowrap">Licitaciones</span>
          </div>
        </div>
      </section>

      <div className="w-full px-6 md:px-12">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-4">
          <span className="text-xs font-body font-medium text-foreground-400 uppercase tracking-wider whitespace-nowrap">Estado:</span>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {licitacionStatuses.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { setStatus(s); setVisible(6) }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-body font-medium transition-all duration-300 cursor-pointer border ${
                  status === s
                    ? 'bg-accent-500 text-white border-accent-500'
                    : 'bg-background-50 text-foreground-600 border-background-200 hover:border-accent-400 hover:text-accent-500'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <span className="hidden sm:inline text-foreground-200 mx-2">|</span>
          <span className="text-xs font-body font-medium text-foreground-400 uppercase tracking-wider whitespace-nowrap mt-2 sm:mt-0">Categoría:</span>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {licitacionCategories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => { setCategory(c); setVisible(6) }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-body font-medium transition-all duration-300 cursor-pointer border ${
                  category === c
                    ? 'bg-secondary-500 text-white border-secondary-500'
                    : 'bg-background-50 text-foreground-600 border-background-200 hover:border-secondary-400 hover:text-secondary-600'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="w-full px-6 md:px-12 py-20 md:py-28 bg-background-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground-950">Llamados Vigentes y Cerrados</h2>
            <p className="text-sm text-foreground-500 font-body mt-1">{filtered.length} licitaciones encontradas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.slice(0, visible).map((lic) => (
              <article
                key={lic.id}
                className="group bg-background-50 border border-background-200 rounded-lg p-5 transition-all duration-300 hover:border-accent-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-body font-mono text-foreground-400 whitespace-nowrap">{lic.code}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-body font-medium border whitespace-nowrap ${statusColors[lic.status]}`}>
                      {lic.status}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-background-100 text-foreground-500 text-xs font-body whitespace-nowrap">
                    {lic.category}
                  </span>
                </div>

                <h3 className="text-base font-heading font-bold text-foreground-950 mb-2 line-clamp-2">
                  {lic.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs text-foreground-500 font-body">
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <i className="ri-building-line text-sm" />
                    {truncateText(lic.client)}
                  </span>
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <i className="ri-map-pin-line text-sm" />
                    {lic.location}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-background-50 border border-background-100 rounded-md p-2.5">
                    <p className="text-xs text-foreground-400 font-body mb-0.5">Apertura</p>
                    <p className="text-sm font-body font-medium text-foreground-800">{lic.apertura}</p>
                  </div>
                  <div className="bg-background-50 border border-background-100 rounded-md p-2.5">
                    <p className="text-xs text-foreground-400 font-body mb-0.5">Cierre</p>
                    <p className="text-sm font-body font-medium text-foreground-800">{lic.cierre}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-background-100">
                  <span className="text-lg font-heading font-bold text-foreground-950">{formatBudgetDisplay(lic.budget)}</span>
                  <div className="flex items-center gap-3 text-xs text-foreground-400 font-body">
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <i className="ri-file-text-line text-sm" />
                      {lic.docs} doc.
                    </span>
                    {lic.consultas !== undefined && (
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <i className="ri-question-answer-line text-sm" />
                        {lic.consultas} consultas
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {visible < filtered.length && (
            <div className="text-center mt-10">
              <button
                type="button"
                onClick={() => setVisible((v) => v + 6)}
                className="px-8 py-3 bg-background-200 hover:bg-accent-500 hover:text-white text-foreground-700 text-sm font-body font-medium rounded-md transition-all duration-300"
              >
                Cargar más licitaciones ({filtered.length - visible} restantes)
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="w-full bg-background-100 py-16 md:py-20">
        <div className="px-6 md:px-12 max-w-3xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-100 text-accent-700 text-xs font-body font-medium tracking-wider uppercase mb-6">
            ¿Quiere participar?
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground-950 mb-4">
            Registre su empresa como proveedor
          </h2>
          <p className="text-sm text-foreground-500 font-body leading-relaxed mb-8 max-w-xl mx-auto">
            Al registrarse en nuestro portal de proveedores recibirá notificaciones automáticas de nuevos llamados, podrá descargar pliegos, realizar consultas técnicas y presentar sus ofertas de manera digital.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contacto"
              className="whitespace-nowrap px-8 py-3 bg-accent-500 hover:bg-accent-600 text-white text-sm font-body font-medium rounded-md transition-all duration-300"
            >
              Registrarme como Proveedor
            </Link>
            <Link
              to="/servicios"
              className="whitespace-nowrap px-8 py-3 border border-foreground-300 hover:border-accent-400 rounded-md text-foreground-600 hover:text-accent-500 text-sm font-body font-medium transition-all duration-300"
            >
              Conocer nuestros servicios
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
