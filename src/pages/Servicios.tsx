import { useCallback, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import Layout, { SectionHeading } from '../components/Layout'
import PageHero, { CTASection } from '../components/PageHero'
import CarouselDots from '../components/CarouselDots'
import HorizontalSlider from '../components/HorizontalSlider'
import { IMAGES } from '../data/images'
import { useServicesData, usePageCopy } from '../context/ContentContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { useSlider } from '../hooks/useSlider'
import { ctaToLinks, resolveImage } from '../lib/pageCopy'

function serviceIndexFromHash(services: { id: string }[], hashId: string) {
  if (!hashId) return 0
  const idx = services.findIndex((s) => s.id === hashId)
  return idx >= 0 ? idx : 0
}

export default function Servicios() {
  const { hash } = useLocation()
  const hashId = hash.replace(/^#/, '')
  const copy = usePageCopy('servicios')
  const { services, serviceDetails } = useServicesData()
  const initialIndex = useMemo(() => serviceIndexFromHash(services, hashId), [services, hashId])
  const { index: activeIndex, setIndex: setActiveIndex, next, prev } = useSlider(services.length, initialIndex)
  const ctaLinks = ctaToLinks(copy.cta)

  usePageMeta({ title: copy.seo.title, description: copy.seo.description })

  const selectService = useCallback(
    (i: number) => {
      setActiveIndex(i)
      const id = services[i]?.id
      if (id) {
        window.history.replaceState(null, '', `${window.location.pathname}#${id}`)
      }
    },
    [services, setActiveIndex],
  )

  useEffect(() => {
    if (!hashId) return
    const idx = services.findIndex((s) => s.id === hashId)
    if (idx < 0) return

    setActiveIndex(idx)
    const timer = window.setTimeout(() => {
      document.getElementById('servicios-slider')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
    return () => window.clearTimeout(timer)
  }, [hashId, services, setActiveIndex])

  const active = services[activeIndex] ?? services[0]

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
                  onClick={() => selectService(i)}
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

            <div id="servicios-slider" className="scroll-mt-28">
              {services.length > 1 && (
                <div className="flex items-center justify-end gap-2 mb-4">
                  <button type="button" onClick={prev} className="w-9 h-9 flex items-center justify-center rounded-full border border-background-300 hover:bg-accent-500 hover:border-accent-500 hover:text-white text-foreground-600 transition-all" aria-label="Especialidad anterior">
                    <i className="ri-arrow-left-line" />
                  </button>
                  <button type="button" onClick={next} className="w-9 h-9 flex items-center justify-center rounded-full border border-background-300 hover:bg-accent-500 hover:border-accent-500 hover:text-white text-foreground-600 transition-all" aria-label="Especialidad siguiente">
                    <i className="ri-arrow-right-line" />
                  </button>
                </div>
              )}
              <div className="min-h-[480px]">
                <HorizontalSlider index={activeIndex}>
                {services.map((service) => {
                  const details = serviceDetails[service.id]
                  return (
                    <div key={service.id} id={service.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start min-h-[420px]">
                      <div className="rounded-xl overflow-hidden h-[350px]">
                        <img alt={service.title} className="w-full h-full object-cover object-top" src={service.pageImage} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-accent-100/70">
                            <i className={`${service.icon} text-xl text-accent-500`} />
                          </div>
                          <h3 className="font-heading text-3xl font-bold text-foreground-950">{service.title}</h3>
                        </div>
                        <p className="text-base font-body text-foreground-600 leading-relaxed mb-2">{service.tagline}</p>
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
                  )
                })}
              </HorizontalSlider>
              </div>

              {services.length > 1 && (
                <div className="mt-8">
                  <CarouselDots count={services.length} current={activeIndex} onSelect={selectService} labelPrefix="Ir a especialidad" />
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
