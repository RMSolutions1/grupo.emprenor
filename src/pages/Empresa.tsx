import Layout, { SectionHeading } from '../components/Layout'
import PageHero, { CTASection } from '../components/PageHero'
import { IMAGES } from '../data/images'
import { useEmpresaData, usePageCopy } from '../context/ContentContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { ctaToLinks, resolveImage } from '../lib/pageCopy'

export default function Empresa() {
  const copy = usePageCopy('empresa')
  const { timeline, values, team, regions } = useEmpresaData()
  const ctaLinks = ctaToLinks(copy.cta)

  usePageMeta({ title: copy.seo.title, description: copy.seo.description })

  return (
    <Layout>
      <PageHero
        label={copy.hero.label}
        title={copy.hero.title}
        subtitle={copy.hero.subtitle}
        image={resolveImage(copy.hero.image, IMAGES.empresaHero)}
        breadcrumb={[{ label: 'Empresa' }]}
      />

      <section className="py-20 md:py-28 bg-background-100">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <SectionHeading label={copy.history.label} title={copy.history.title} />
              <div className="space-y-4 text-base font-body text-foreground-600 leading-relaxed">
                {copy.history.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              {timeline.map((item, i) => (
                <div key={item.year} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-accent-500 text-white flex items-center justify-center text-sm font-body font-bold flex-shrink-0">{item.shortYear}</div>
                    {i < timeline.length - 1 && <div className="w-px flex-1 bg-background-300 my-2" />}
                  </div>
                  <div className="pb-6">
                    <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-1">{item.title}</h3>
                    <p className="text-sm font-body text-foreground-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background-50">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 rounded-xl bg-background-100 border border-background-200">
              <h3 className="font-heading text-2xl font-bold text-foreground-950 mb-4">Misión</h3>
              <p className="text-base font-body text-foreground-600 leading-relaxed">{copy.mission}</p>
            </div>
            <div className="p-8 rounded-xl bg-background-100 border border-background-200">
              <h3 className="font-heading text-2xl font-bold text-foreground-950 mb-4">Visión</h3>
              <p className="text-base font-body text-foreground-600 leading-relaxed">{copy.vision}</p>
            </div>
          </div>
          <h3 className="font-heading text-4xl md:text-5xl font-bold text-foreground-950 leading-tight mb-14 md:mb-16">{copy.valuesTitle}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="p-6 rounded-xl border border-background-200 bg-background-50 hover:border-accent-300 transition-all duration-300">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent-100/70 mb-4">
                  <i className={`${v.icon} text-lg text-accent-500`} />
                </div>
                <h4 className="font-heading text-lg font-semibold text-foreground-950 mb-2">{v.title}</h4>
                <p className="text-sm font-body text-foreground-600 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background-100">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <SectionHeading label={copy.team.label} title={copy.team.title} subtitle={copy.team.subtitle} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member) => (
                <div key={member.name} className="group rounded-xl overflow-hidden border border-background-200 bg-background-50 hover:border-background-300 transition-all duration-300">
                  <div className="h-64 overflow-hidden">
                    <img alt={member.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" src={member.avatar} />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-semibold text-foreground-950">{member.name}</h3>
                    <p className="text-sm font-body text-accent-500 font-medium mt-1">{member.role}</p>
                    <p className="text-sm font-body text-foreground-600 leading-relaxed mt-3">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background-50">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <SectionHeading label={copy.regions.label} title={copy.regions.title} subtitle={copy.regions.subtitle} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
              <div className="relative rounded-xl overflow-hidden h-[400px] md:h-[500px]">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${IMAGES.mapaCobertura}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/20 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {regions.map((region, i) => (
                  <div key={region.name} className="p-6 rounded-xl border border-background-200 bg-background-100">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-accent-500 text-white text-sm font-body font-bold">{i + 1}</span>
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-accent-100/70">
                        <i className="ri-map-pin-line text-accent-500" />
                      </div>
                    </div>
                    <h4 className="font-heading text-xl font-semibold text-foreground-950 mb-1">{region.name}</h4>
                    <p className="text-sm font-body text-foreground-600">{region.cities}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title={copy.cta.title}
        description={copy.cta.description}
        primaryLink={ctaLinks.primaryLink}
        image={resolveImage(copy.cta.image, IMAGES.empresaCta)}
      />
    </Layout>
  )
}
