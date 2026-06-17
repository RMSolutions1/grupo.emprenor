import { useEffect } from 'react'
import Layout, { SectionHeading } from '../components/Layout'
import PageHero, { CTASection } from '../components/PageHero'
import CarouselDots from '../components/CarouselDots'
import { IMAGES } from '../data/images'
import { useServicesData, usePageCopy } from '../context/ContentContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAutoplay } from '../hooks/useAutoplay'
import { ctaToLinks, resolveImage } from '../lib/pageCopy'

export default function Servicios() {
  const copy = usePageCopy('servicios')
  const { services, serviceDetails } = useServicesData()
  const { index: activeIndex, setIndex: setActiveIndex, bindPauseHandlers } = useAutoplay(services.length, { interval: 7000 })
  const ctaLinks = ctaToLinks(copy.cta)

  usePageMeta({ title: copy.seo.title, description: copy.seo.description })

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    const idx = services.findIndex((s) => s.id === hash)
    if (idx >= 0) {
      setActiveIndex(idx)
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [services, setActiveIndex])

  const active = services[activeIndex] ?? services[0]
  const details = active ? serviceDetails[active.id] : undefined

  if (!active) return null

  return (
    <Layout>
      <PageHero
        title={copy.hero.title}
        subtitle={copy.hero.subtitle}
        label={copy.hero.label}
        image={resolveImage(copy.hero.image, IMAGES.serviciosHero)}
        breadcrumb={[{ label: 'Servicios' }]}
      />

      <section className="py-20 md:py-28 bg-background-100">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <SectionHeading label={copy.divisions.label} title={copy.divisions.title} />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-12">
              {services.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-body font-medium text-center leading-snug transition-all duration-300 ${
                    activeIndex === i
                      ? 'bg-accent-500 text-white shadow-sm'
                      : 'bg-background-200 text-foreground-600 hover:bg-background-300'
                  }`}
                >
                  {s.tabTitle}
                </button>
              ))}
            </div>

            <div id={active.id} className="scroll-mt-28" {...bindPauseHandlers}>
              <div key={active.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start animate-fade-in">
                <div className="rounded-xl overflow-hidden h-[350px]">
                  <img alt={active.title} className="w-full h-full object-cover object-top" src={active.pageImage} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-accent-100/70">
                      <i className={`${active.icon} text-xl text-accent-500`} />
                    </div>
                    <h3 className="font-heading text-3xl font-bold text-foreground-950">{active.title}</h3>
                  </div>
                  <p className="text-base font-body text-foreground-600 leading-relaxed mb-2">{active.tagline}</p>
                  {details && <p className="text-base font-body text-foreground-600 leading-relaxed mb-8">{details.intro}</p>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {details?.items.map((item) => (
                      <div key={item.title} className="p-4 rounded-lg border border-background-200 bg-background-50">
                        <h4 className="font-heading text-base font-semibold text-foreground-950 mb-1">{item.title}</h4>
                        <p className="text-xs font-body text-foreground-600 leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {services.length > 1 && (
                <div className="mt-8">
                  <CarouselDots count={services.length} current={activeIndex} onSelect={setActiveIndex} labelPrefix="Ir a especialidad" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background-50">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <SectionHeading label={copy.grid.label} title={copy.grid.title} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="p-6 rounded-xl border border-background-200 bg-background-100 hover:border-accent-300 transition-all duration-300 scroll-mt-28">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent-100/70">
                      <i className={`${service.icon} text-lg text-accent-500`} />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-foreground-950">{service.tabTitle}</h3>
                  </div>
                  <p className="text-sm font-body text-foreground-600 leading-relaxed mb-4">{service.tagline}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.services.map((s) => (
                      <span key={s} className="px-3 py-1 bg-background-50 border border-background-200 text-xs font-body text-foreground-700 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        label={copy.cta.label}
        title={copy.cta.title}
        description={copy.cta.description}
        primaryLink={ctaLinks.primaryLink}
        image={resolveImage(copy.cta.image, IMAGES.serviciosCta)}
      />
    </Layout>
  )
}
