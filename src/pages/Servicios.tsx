import { useEffect, useState } from 'react'
import Layout, { SectionHeading } from '../components/Layout'
import PageHero, { CTASection } from '../components/PageHero'
import { IMAGES } from '../data/images'
import { useServicesData } from '../context/ContentContext'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Servicios() {
  const { services, serviceDetails } = useServicesData()
  const [activeTab, setActiveTab] = useState(services[0]?.id ?? '')

  usePageMeta({
    title: 'Servicios',
    description: 'Seis divisiones de ingeniería, construcción, energía y mantenimiento para proyectos de cualquier escala.',
  })

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && services.find((s) => s.id === hash)) {
      setActiveTab(hash)
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } else if (services.length && !services.find((s) => s.id === activeTab)) {
      setActiveTab(services[0].id)
    }
  }, [services, activeTab])

  const active = services.find((s) => s.id === activeTab) || services[0]
  const details = serviceDetails[activeTab]

  return (
    <Layout>
      <PageHero
        title="Servicios de Ingeniería y Construcción"
        subtitle="Soluciones integrales en seis divisiones especializadas que cubren cada etapa y escala de su proyecto."
        image={IMAGES.serviciosHero}
      />

      <section className="py-20 md:py-28 bg-background-100">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <SectionHeading label="Divisiones" title={<>Seis áreas de especialización para proyectos de <span className="font-light italic text-foreground-600">cualquier escala</span></>} />

            <div className="flex flex-wrap gap-2 mb-12">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveTab(s.id)}
                  className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-300 ${
                    activeTab === s.id ? 'bg-accent-500 text-white' : 'bg-background-200 text-foreground-600 hover:bg-background-300'
                  }`}
                >
                  {s.tabTitle}
                </button>
              ))}
            </div>

            <div id={active.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start scroll-mt-28">
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
                  {details.items.map((item) => (
                    <div key={item.title} className="p-4 rounded-lg border border-background-200 bg-background-50">
                      <h4 className="font-heading text-base font-semibold text-foreground-950 mb-1">{item.title}</h4>
                      <p className="text-xs font-body text-foreground-600 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background-50">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <SectionHeading label="Soluciones Integrales" title="Todas nuestras divisiones" />
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
        label="¿No encuentra lo que busca?"
        title="Desarrollamos soluciones a medida para su proyecto"
        description="Cuéntenos sobre su proyecto y nuestro equipo técnico le presentará una propuesta personalizada sin cargo."
        primaryLink={{ to: '/contacto', label: 'Solicitar Asesoramiento' }}
        image={IMAGES.serviciosCta}
      />
    </Layout>
  )
}
