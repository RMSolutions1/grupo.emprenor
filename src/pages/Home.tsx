import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import HomeHero from '../components/HomeHero'
import AutoCardSlider from '../components/AutoCardSlider'
import CarouselDots from '../components/CarouselDots'
import { CTASection } from '../components/PageHero'
import { IMAGES } from '../data/images'
import { useServicesData, useHomeData, useSiteContact, useProjectsData, usePageCopy } from '../context/ContentContext'
import { useCounter } from '../hooks/useCounter'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAutoplay } from '../hooks/useAutoplay'
import { ctaToLinks, getHomeHeroSlides, resolveImage } from '../lib/pageCopy'

function StatItem({ value, suffix, label, icon }: { value: number; suffix: string; label: string; icon: string }) {
  const { count, ref } = useCounter(value)
  return (
    <div ref={ref} className="flex flex-col items-center text-center group">
      <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-full bg-accent-100/80 group-hover:bg-accent-500 transition-colors duration-500">
        <i className={`${icon} text-xl text-accent-500 group-hover:text-white transition-colors duration-500`} />
      </div>
      <div className="flex items-baseline gap-0.5">
        <span className="text-4xl md:text-5xl font-heading font-bold text-foreground-950">{count}</span>
        {suffix ? <span className="text-2xl md:text-3xl font-heading font-light text-accent-500">{suffix}</span> : null}
      </div>
      <p className="mt-2 text-sm font-body text-foreground-600">{label}</p>
    </div>
  )
}

function ProjectsCarousel() {
  const copy = usePageCopy('home')
  const { featuredProjects } = useProjectsData()
  const { index: current, setIndex: setCurrent, next, prev, bindPauseHandlers } = useAutoplay(featuredProjects.length, { interval: 7000 })
  const project = featuredProjects[current]

  if (!project) return null

  return (
    <section className="py-20 md:py-28 bg-background-100">
      <div className="w-full px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              {copy.projects.label && (
                <p className="text-accent-500 text-sm font-body font-semibold uppercase tracking-wider mb-3">{copy.projects.label}</p>
              )}
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground-950 leading-tight">
                {copy.projects.title}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={prev} className="w-10 h-10 flex items-center justify-center rounded-full border border-background-300 hover:bg-accent-500 hover:border-accent-500 hover:text-white text-foreground-600 transition-all duration-300" aria-label="Proyecto anterior">
                <i className="ri-arrow-left-line text-lg" />
              </button>
              <button type="button" onClick={next} className="w-10 h-10 flex items-center justify-center rounded-full border border-background-300 hover:bg-accent-500 hover:border-accent-500 hover:text-white text-foreground-600 transition-all duration-300" aria-label="Proyecto siguiente">
                <i className="ri-arrow-right-line text-lg" />
              </button>
              <Link to="/proyectos" className="whitespace-nowrap ml-2 px-5 py-2.5 text-sm font-body font-medium text-foreground-700 hover:text-accent-500 transition-colors">
                {copy.projects.linkLabel}
              </Link>
            </div>
          </div>

          <div {...bindPauseHandlers}>
            <div key={project.id} className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-background-200 bg-background-50 animate-fade-in">
              <div className="relative h-[350px] md:h-[500px] overflow-hidden">
                <img alt={project.title} className="w-full h-full object-cover object-top" src={project.image} />
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

            <div className="mt-8">
              <CarouselDots count={featuredProjects.length} current={current} onSelect={setCurrent} labelPrefix="Ir al proyecto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const copy = usePageCopy('home')
  const { services } = useServicesData()
  const { sectors, certifications, stats, testimonials } = useHomeData()
  const siteContact = useSiteContact()
  const ctaLinks = ctaToLinks({
    ...copy.cta,
    secondaryUrl: copy.cta.secondaryUrl || siteContact.primaryPhone.href,
  })

  usePageMeta({ title: copy.seo.title, description: copy.seo.description })

  const heroSlides = getHomeHeroSlides(copy)
  const statsImage = resolveImage(copy.statsImage, IMAGES.statsAerial)
  const ctaImage = resolveImage(copy.cta.image, IMAGES.cta)

  return (
    <Layout transparentNav>
      <HomeHero
        slides={heroSlides}
        strip={copy.heroStrip ?? []}
        ctaPrimary={copy.hero.ctaPrimary}
        ctaSecondary={copy.hero.ctaSecondary}
        ctaSecondaryUrl={copy.hero.ctaSecondaryUrl}
      />

      <section id="stats" className="relative py-20 md:py-28 bg-background-100 pt-28 md:pt-32">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden mb-16 h-[300px] md:h-[420px]">
              <img alt="Vista aérea de obras de EMPRENOR GROUP" className="w-full h-full object-cover object-top" loading="lazy" src={statsImage} />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/30 to-transparent" />
            </div>
            <div className="text-center mb-14">
              <p className="text-foreground-500 font-body text-xl md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
                {copy.statsIntro}
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
                {copy.services.title}
              </h2>
              {copy.services.subtitle && (
                <p className="mt-4 text-base font-body text-foreground-600 max-w-xl">
                  {copy.services.subtitle}
                </p>
              )}
            </div>
            <AutoCardSlider
              items={services}
              itemKey={(s) => s.id}
              ariaLabel="Servicios"
              perView={{ default: 1, md: 2, lg: 3 }}
              interval={5000}
              renderItem={(service) => (
                <Link to={`/servicios#${service.id}`} className="group block h-full rounded-lg border border-background-200 overflow-hidden bg-background-50 hover:border-background-300 transition-all duration-300">
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
              )}
            />
          </div>
        </div>
      </section>

      <ProjectsCarousel />

      <section className="py-20 md:py-28 bg-background-50">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground-950 leading-tight">
                {copy.sectors.title}
              </h2>
            </div>
            <AutoCardSlider
              items={sectors}
              itemKey={(s) => s.id}
              ariaLabel="Sectores"
              perView={{ default: 2, md: 3, lg: 4 }}
              interval={5500}
              renderItem={(sector) => (
                <Link to={`/proyectos?sector=${sector.id}`} className="group relative block rounded-xl overflow-hidden aspect-[3/4]">
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
              )}
            />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background-100">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              {copy.certifications.label && (
                <p className="text-accent-500 text-sm font-body font-semibold uppercase tracking-wider mb-3">{copy.certifications.label}</p>
              )}
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground-950">{copy.certifications.title}</h2>
              {copy.certifications.subtitle && (
                <p className="mt-4 text-base font-body text-foreground-600 max-w-2xl mx-auto">
                  {copy.certifications.subtitle}
                </p>
              )}
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
              {copy.testimonials.label && (
                <p className="text-accent-500 text-sm font-body font-semibold uppercase tracking-wider mb-3">{copy.testimonials.label}</p>
              )}
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground-950 leading-tight max-w-2xl">
                {copy.testimonials.title}
              </h2>
            </div>
            <AutoCardSlider
              items={testimonials}
              itemKey={(t) => t.name}
              ariaLabel="Testimonios"
              perView={{ default: 1, md: 2, lg: 3 }}
              interval={6500}
              renderItem={(t) => (
                <div className="h-full p-6 md:p-8 rounded-xl bg-background-100 border border-background-200">
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
              )}
            />
          </div>
        </div>
      </section>

      <CTASection
        label={copy.cta.label}
        title={copy.cta.title}
        description={copy.cta.description}
        primaryLink={ctaLinks.primaryLink}
        secondaryLink={ctaLinks.secondaryLink}
        image={ctaImage}
      />
    </Layout>
  )
}
