import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout, { SectionHeading } from '../components/Layout'
import PageHero from '../components/PageHero'
import AutoCardSlider from '../components/AutoCardSlider'
import CarouselDots from '../components/CarouselDots'
import HorizontalSlider from '../components/HorizontalSlider'
import { IMAGES } from '../data/images'
import { type Licitacion, STATUS_FILTER_MAP } from '../data/licitaciones'
import { useLicitacionesData, usePageCopy } from '../context/ContentContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAutoplay } from '../hooks/useAutoplay'
import { resolveImage } from '../lib/pageCopy'

const statusColors: Record<Licitacion['status'], string> = {
  Publicada: 'bg-accent-100 text-accent-700 border-accent-200',
  'En Análisis': 'bg-secondary-100 text-secondary-700 border-secondary-200',
  Presentada: 'bg-primary-100 text-primary-700 border-primary-200',
  Adjudicada: 'bg-background-200 text-foreground-700 border-background-300',
  Finalizada: 'bg-background-200 text-foreground-600 border-background-300',
}

function LicitacionCard({ lic }: { lic: Licitacion }) {
  return (
    <article className="group h-full flex flex-col bg-background-50 border border-background-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-accent-300">
      <div className="relative h-44 overflow-hidden">
        <img alt={lic.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" loading="lazy" src={lic.image} />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/50 to-transparent" />
        <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-body font-medium border ${statusColors[lic.status]}`}>
          {lic.status}
        </span>
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-white/90 text-foreground-600 text-xs font-body">
          {lic.category}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-body font-mono text-foreground-400">{lic.code}</span>
        </div>
        <h3 className="text-base font-heading font-bold text-foreground-950 mb-2 line-clamp-2">{lic.title}</h3>
        <div className="flex flex-col gap-1 mb-3 text-xs text-foreground-500 font-body">
          <span className="flex items-center gap-1.5 line-clamp-1">
            <i className="ri-building-line text-sm shrink-0" />
            {lic.client}
          </span>
          <span className="flex items-center gap-1.5">
            <i className="ri-map-pin-line text-sm shrink-0" />
            {lic.location}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-background-100 border border-background-200 rounded-md p-2">
            <p className="text-xs text-foreground-400 font-body">Apertura</p>
            <p className="text-sm font-body font-medium text-foreground-800">{lic.apertura}</p>
          </div>
          <div className="bg-background-100 border border-background-200 rounded-md p-2">
            <p className="text-xs text-foreground-400 font-body">Cierre</p>
            <p className="text-sm font-body font-medium text-foreground-800">{lic.cierre}</p>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-background-200">
          <span className="text-lg font-heading font-bold text-foreground-950">{lic.budget}</span>
          <div className="flex items-center gap-3 text-xs text-foreground-400 font-body">
            <span className="flex items-center gap-1">
              <i className="ri-file-text-line text-sm" />
              {lic.docs} doc.
            </span>
            {lic.consultas !== undefined && (
              <span className="flex items-center gap-1">
                <i className="ri-question-answer-line text-sm" />
                {lic.consultas}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function FeaturedLicitaciones({ items, label, title }: { items: Licitacion[]; label?: string; title: string }) {
  const { index: current, setIndex: setCurrent, next, prev, bindPauseHandlers } = useAutoplay(items.length, { interval: 6500 })

  if (items.length === 0) return null

  return (
    <section className="py-16 md:py-20 bg-background-100 border-b border-background-200">
      <div className="w-full px-6 md:px-12 max-w-7xl mx-auto">
        <SectionHeading label={label} title={title} />
        <div {...bindPauseHandlers}>
          <div className="flex items-center justify-end gap-2 mb-4">
            <button type="button" onClick={prev} className="w-9 h-9 flex items-center justify-center rounded-full border border-background-300 hover:bg-accent-500 hover:border-accent-500 hover:text-white text-foreground-600 transition-all" aria-label="Licitación anterior">
              <i className="ri-arrow-left-line" />
            </button>
            <button type="button" onClick={next} className="w-9 h-9 flex items-center justify-center rounded-full border border-background-300 hover:bg-accent-500 hover:border-accent-500 hover:text-white text-foreground-600 transition-all" aria-label="Licitación siguiente">
              <i className="ri-arrow-right-line" />
            </button>
          </div>
          <HorizontalSlider index={current}>
            {items.map((lic) => (
              <div key={lic.id} className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-background-200 bg-background-50">
                <div className="relative h-[280px] md:h-[360px]">
                  <img alt={lic.title} className="w-full h-full object-cover object-top" src={lic.image} />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/50 to-transparent" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-body font-medium border ${statusColors[lic.status]}`}>{lic.status}</span>
                    <span className="text-xs font-body text-foreground-500">{lic.category}</span>
                    <span className="text-xs font-mono text-foreground-400">{lic.code}</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-foreground-950 mb-3">{lic.title}</h3>
                  <p className="text-sm font-body text-foreground-600 mb-4">{lic.client} · {lic.location}</p>
                  <div className="flex flex-wrap gap-4 text-sm font-body text-foreground-600 mb-6">
                    <span>Apertura: <strong className="text-foreground-900">{lic.apertura}</strong></span>
                    <span>Cierre: <strong className="text-foreground-900">{lic.cierre}</strong></span>
                    <span>Presupuesto: <strong className="text-foreground-900">{lic.budget}</strong></span>
                  </div>
                  <Link to="/contacto" className="self-start px-6 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-sm font-body font-medium rounded-md transition-all">
                    Consultar documentación
                  </Link>
                </div>
              </div>
            ))}
          </HorizontalSlider>
          {items.length > 1 && (
            <div className="mt-6">
              <CarouselDots count={items.length} current={current} onSelect={setCurrent} labelPrefix="Ir a licitación" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default function Licitaciones() {
  const copy = usePageCopy('licitaciones')
  const { licitaciones, licitacionStatuses, licitacionCategories } = useLicitacionesData()
  const [status, setStatus] = useState('Todas las Licitaciones')
  const [category, setCategory] = useState('Todas las Categorías')
  const [visible, setVisible] = useState(6)

  usePageMeta({ title: copy.seo.title, description: copy.seo.description })

  const filtered = useMemo(() => {
    const statusValue = STATUS_FILTER_MAP[status]
    return licitaciones.filter((l) => {
      const statusMatch = !statusValue || l.status === statusValue
      const catMatch = category === 'Todas las Categorías' || l.category === category
      return statusMatch && catMatch
    })
  }, [status, category, licitaciones])

  const featured = useMemo(
    () => filtered.filter((l) => l.status === 'Publicada' || l.status === 'En Análisis').slice(0, 6),
    [filtered],
  )

  return (
    <Layout>
      <PageHero
        label={copy.hero.label}
        title={copy.hero.title}
        subtitle={copy.hero.subtitle}
        image={resolveImage(copy.hero.image, IMAGES.licitacionesHero)}
        breadcrumb={[{ label: 'Licitaciones' }]}
      />

      <section className="py-8 bg-background-50 border-b border-background-200">
        <div className="w-full px-6 md:px-12 max-w-7xl mx-auto space-y-6">
          <div>
            <p className="text-xs font-body font-medium text-foreground-400 uppercase tracking-wider mb-3">Estado</p>
            <div className="flex flex-wrap gap-2">
              {licitacionStatuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setStatus(s); setVisible(6) }}
                  className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-300 border ${
                    status === s
                      ? 'bg-accent-500 text-white border-accent-500'
                      : 'bg-background-100 text-foreground-600 border-background-200 hover:border-accent-400 hover:text-accent-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-body font-medium text-foreground-400 uppercase tracking-wider mb-3">Categoría</p>
            <div className="flex flex-wrap gap-2">
              {licitacionCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { setCategory(c); setVisible(6) }}
                  className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-300 border ${
                    category === c
                      ? 'bg-secondary-500 text-white border-secondary-500'
                      : 'bg-background-100 text-foreground-600 border-background-200 hover:border-secondary-400 hover:text-secondary-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <FeaturedLicitaciones items={featured} label={copy.featured.label} title={copy.featured.title} />
      )}

      <section className="w-full px-6 md:px-12 py-20 md:py-28 bg-background-50">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            label={copy.list.label}
            title={copy.list.title}
            subtitle={`${filtered.length} licitaciones encontradas`}
          />

          {filtered.length === 0 ? (
            <p className="text-center text-foreground-500 font-body py-12">No hay licitaciones con los filtros seleccionados.</p>
          ) : (
            <>
              <AutoCardSlider
                items={filtered.slice(0, visible)}
                itemKey={(l) => l.id}
                ariaLabel="Licitaciones"
                perView={{ default: 1, md: 2, lg: 3 }}
                interval={5500}
                showArrows={filtered.length > 1}
                renderItem={(lic) => <LicitacionCard lic={lic} />}
              />

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
            </>
          )}
        </div>
      </section>

      <section className="w-full bg-background-100 py-16 md:py-20">
        <div className="px-6 md:px-12 max-w-3xl mx-auto text-center">
          {copy.provider.label && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-100 text-accent-700 text-xs font-body font-medium tracking-wider uppercase mb-6">
              {copy.provider.label}
            </span>
          )}
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground-950 mb-4">
            {copy.provider.title}
          </h2>
          {copy.provider.subtitle && (
            <p className="text-sm text-foreground-500 font-body leading-relaxed mb-8 max-w-xl mx-auto">
              {copy.provider.subtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={copy.provider.ctaPrimaryUrl}
              className="whitespace-nowrap px-8 py-3 bg-accent-500 hover:bg-accent-600 text-white text-sm font-body font-medium rounded-md transition-all duration-300"
            >
              {copy.provider.ctaPrimary}
            </Link>
            <Link
              to={copy.provider.ctaSecondaryUrl}
              className="whitespace-nowrap px-8 py-3 border border-foreground-300 hover:border-accent-400 rounded-md text-foreground-600 hover:text-accent-500 text-sm font-body font-medium transition-all duration-300"
            >
              {copy.provider.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
