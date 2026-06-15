import { Link } from 'react-router-dom'
import Layout, { AccentButton } from '../components/Layout'
import { CTASection } from '../components/PageHero'
import { IMAGES } from '../data/images'
import { services } from '../data/services'
import { sectors, certifications, stats } from '../data/home'
import { siteContact } from '../data/contacto'
import { featuredProjects } from '../data/projects'
import { testimonials } from '../data/testimonials'
import { useCounter } from '../hooks/useCounter'
import { usePageMeta } from '../hooks/usePageMeta'
import { DEFAULT_DESCRIPTION } from '../data/site'
import { useState } from 'react'

function StatItem({ value, suffix, label, icon }: { value: number; suffix: string; label: string; icon: string }) {
  const { count, ref } = useCounter(value)
  return (
    <div ref={ref} className="flex flex-col items-center text-center group">
      <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-full bg-accent-100/80 group-hover:bg-accent-500 transition-colors duration-500">
        <i className={`${icon} text-xl text-accent-500 group-hover:text-white transition-colors duration-500`} />
      </div>
      <div className="flex items-baseline gap-0.5">
        <span className="text-4xl md:text-5xl font-heading font-bold text-foreground-950">{count}</span>
        <span className="text-2xl md:text-3xl font-heading font-light text-accent-500">{suffix}</span>
      </div>
      <p className="mt-2 text-sm font-body text-foreground-600">{label}</p>
    </div>
  )
}

function ProjectsCarousel() {
  const [current, setCurrent] = useState(0)
  const project = featuredProjects[current]

  const prev = () => setCurrent((c) => (c === 0 ? featuredProjects.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === featuredProjects.length - 1 ? 0 : c + 1))

  return (
    <section className="py-20 md:py-28 bg-background-100">
      <div className="w-full px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p className="text-accent-500 text-sm font-body font-semibold uppercase tracking-wider mb-3">Portafolio</p>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground-950 leading-tight">
                Proyectos<br /><span className="font-light italic text-foreground-600">destacados</span>
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={prev} className="w-10 h-10 flex items-center justify-center rounded-full border border-background-300 hover:bg-accent-500 hover:border-accent-500 hover:text-white text-foreground-600 transition-all duration-300" aria-label="Proyecto anterior">
                <i className="ri-arrow-left-line text-lg" />
              </button>
              <button onClick={next} className="w-10 h-10 flex items-center justify-center rounded-full border border-background-300 hover:bg-accent-500 hover:border-accent-500 hover:text-white text-foreground-600 transition-all duration-300" aria-label="Proyecto siguiente">
                <i className="ri-arrow-right-line text-lg" />
              </button>
              <Link to="/proyectos" className="whitespace-nowrap ml-2 px-5 py-2.5 text-sm font-body font-medium text-foreground-700 hover:text-accent-500 transition-colors">
                Ver todos
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-background-200 bg-background-50">
            <div className="relative h-[350px] md:h-[500px] overflow-hidden">
              <img alt={project.title} className="w-full h-full object-cover object-top transition-all duration-500" src={project.image} />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span className="inline-block px-3 py-1 bg-accent-500 text-white text-xs font-body font-semibold rounded-full mb-3">{project.year}</span>
              </div>
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground-950 mb-3">{project.title}</h3>
              <div className="flex flex-wrap items-center gap-3 text-sm font-body text-foreground-600 mb-4">
                <span className="flex items-center gap-1.5">
                  <i className="ri-building-2-line w-4 h-4 flex items-center justify-center text-accent-500" />
                  {project.client}
                </span>
                <span className="text-foreground-300">|</span>
                <span className="flex items-center gap-1.5">
                  <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center text-accent-500" />
                  {project.location}
                </span>
              </div>
              <p className="text-base font-body text-foreground-600 leading-relaxed mb-6">{project.carouselDescription || project.description}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-background-100 border border-background-200 text-xs font-body text-foreground-700 rounded-full">{tag}</span>
                ))}
              </div>
            <Link to={`/proyectos/${project.id}`} className="whitespace-nowrap self-start px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-body font-medium rounded-md transition-all duration-300">
                Ver proyecto completo
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            {featuredProjects.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${i === current ? 'bg-accent-500 w-8' : 'w-2.5 bg-background-300 hover:bg-background-400'}`}
                aria-label={`Ir al proyecto ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  usePageMeta({ title: 'Inicio', description: DEFAULT_DESCRIPTION })

  return (
    <Layout transparentNav>
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url("${IMAGES.hero}")` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/70 via-primary-950/50 to-primary-950/70" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-500/20 to-transparent blur-3xl" />
          <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-gradient-to-t from-primary-900/40 to-transparent blur-2xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-6 md:px-12 text-center">
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight max-w-5xl text-balance">
            Construimos la infraestructura que impulsa el crecimiento del Norte Argentino.
          </h1>
          <p className="mt-6 md:mt-8 text-base md:text-lg text-white/70 font-body font-light max-w-3xl leading-relaxed">
            Más de 15 años desarrollando proyectos de ingeniería, construcción y energía para organismos públicos, industrias y clientes privados.
          </p>
          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center gap-4">
            <AccentButton to="/contacto">Solicitar Cotización</AccentButton>
            <Link to="/proyectos" className="whitespace-nowrap px-10 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm md:text-base font-body font-medium rounded-md transition-all duration-300">
              Ver Proyectos
            </Link>
          </div>
        </div>
      </section>

      <section id="stats" className="relative py-20 md:py-28 bg-background-100">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden mb-16 h-[300px] md:h-[420px]">
              <img alt="Vista aérea de obras de EMPRENOR GROUP" className="w-full h-full object-cover object-top" loading="lazy" src={IMAGES.statsAerial} />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/30 to-transparent" />
            </div>
            <div className="text-center mb-14">
              <p className="text-foreground-500 font-heading text-2xl md:text-3xl font-light italic leading-relaxed max-w-3xl mx-auto">
                <span className="text-foreground-950 font-bold not-italic">+500 proyectos</span> ejecutados,
                <span className="text-foreground-950 font-bold not-italic"> más de 15 años</span> de experiencia y presencia en
                <span className="text-foreground-950 font-bold not-italic"> 4 provincias</span> del Norte Argentino.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-6">
              {stats.map((stat) => (
                <StatItem key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background-50">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground-950 leading-tight">
                Divisiones de<br /><span className="font-light italic text-foreground-600">servicio</span>
              </h2>
              <p className="mt-4 text-base font-body text-foreground-600 max-w-xl">
                Soluciones integrales de ingeniería para cada etapa del proyecto.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link key={service.id} to={`/servicios#${service.id}`} className="group block rounded-lg border border-background-200 overflow-hidden bg-background-50 hover:border-background-300 transition-all duration-300">
                  <div className="relative h-56 overflow-hidden">
                    <img alt={service.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" loading="lazy" src={service.image} />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent-100/70">
                        <i className={`${service.icon} text-lg text-accent-500`} />
                      </div>
                      <h3 className="font-heading text-xl font-semibold text-foreground-950">{service.title}</h3>
                    </div>
                    <p className="text-sm font-body text-foreground-600 leading-relaxed">{service.description}</p>
                    <span className="inline-flex items-center gap-1 mt-4 text-xs font-body font-medium text-accent-500 group-hover:text-accent-600 transition-colors">
                      Ver más<i className="ri-arrow-right-line w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProjectsCarousel />

      <section className="py-20 md:py-28 bg-background-50">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground-950 leading-tight">
                Sectores<span className="font-light italic text-foreground-600"> que confían en nosotros</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {sectors.map((sector) => (
                <Link key={sector.id} to={`/proyectos?sector=${sector.id}`} className="group relative rounded-xl overflow-hidden aspect-[3/4]">
                  <img alt={sector.title} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700" loading="lazy" src={sector.image} />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                        <i className={`${sector.icon} text-white text-sm`} />
                      </div>
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-white">{sector.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background-100">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-accent-500 text-sm font-body font-semibold uppercase tracking-wider mb-3">Calidad Garantizada</p>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground-950">Certificaciones</h2>
              <p className="mt-4 text-base font-body text-foreground-600 max-w-2xl mx-auto">
                Nuestros procesos y estándares están respaldados por las certificaciones más exigentes a nivel nacional e internacional.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {certifications.map((cert) => (
                <div key={cert.title} className="group flex flex-col items-center text-center p-8 rounded-lg border border-background-200 bg-background-50 hover:border-accent-300 transition-all duration-300">
                  <div className="w-16 h-16 flex items-center justify-center mb-5 rounded-full bg-accent-100/70 group-hover:bg-accent-500 transition-colors duration-500">
                    <i className={`${cert.icon} text-2xl text-accent-500 group-hover:text-white transition-colors duration-500`} />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-1">{cert.title}</h3>
                  <p className="text-xs font-body text-foreground-500 leading-relaxed">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background-50">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <p className="text-accent-500 text-sm font-body font-semibold uppercase tracking-wider mb-3">Testimonios</p>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground-950 leading-tight max-w-2xl">
                Lo que dicen<span className="font-light italic text-foreground-600"> nuestros clientes</span>
              </h2>
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className={`break-inside-avoid mb-6 p-6 md:p-8 rounded-xl bg-background-100 border border-background-200 ${t.offset ? 'lg:mt-8' : ''}`}>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-background-200">
                      <img alt={t.name} className="w-full h-full object-cover" loading="lazy" src={t.avatar} />
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-foreground-900">{t.name}</p>
                      <p className="font-body text-xs text-foreground-500">{t.role}</p>
                      <p className="font-body text-xs text-accent-500 font-medium mt-0.5">{t.company}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <i className="ri-double-quotes-l text-3xl text-accent-200 absolute -top-1 -left-1" />
                    <p className="text-sm font-body text-foreground-700 leading-relaxed pl-6 italic">{t.quote}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        label="Comencemos su proyecto"
        title="Solicite una reunión técnica con nuestro equipo de ingeniería"
        description="Analizaremos los requerimientos de su proyecto y le presentaremos una propuesta técnica y económica a medida."
        primaryLink={{ to: '/contacto', label: 'Solicitar Reunión Técnica' }}
        secondaryLink={{ to: siteContact.primaryPhone.href, label: 'Llamar por Teléfono' }}
        image={IMAGES.cta}
      />
    </Layout>
  )
}
