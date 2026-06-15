import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Layout, { SectionHeading } from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import PageHero, { CTASection } from '../components/PageHero'
import { IMAGES } from '../data/images'
import { useProjectsData } from '../context/ContentContext'
import { usePageMeta } from '../hooks/usePageMeta'

const sectorLabels: Record<string, string> = {
  gobierno: 'Gobierno',
  educacion: 'Educación',
  salud: 'Salud',
  industria: 'Industria',
  mineria: 'Minería',
  agro: 'Agro',
  petroleo: 'Petróleo y Gas',
  inmobiliario: 'Inmobiliario',
}

export default function Proyectos() {
  const { projectsList, projectCategories } = useProjectsData()
  const [searchParams] = useSearchParams()
  const sectorParam = searchParams.get('sector')
  const [category, setCategory] = useState('Todos los Proyectos')

  usePageMeta({
    title: 'Proyectos',
    description: 'Más de 500 proyectos ejecutados en 4 provincias para organismos públicos, industrias y clientes privados.',
  })

  const filtered = useMemo(() => {
    let result = projectsList
    if (category !== 'Todos los Proyectos') {
      result = result.filter((p) => p.category === category)
    }
    if (sectorParam) {
      const sectorMap: Record<string, string[]> = {
        gobierno: ['Infraestructura', 'Educación', 'Salud'],
        educacion: ['Educación'],
        salud: ['Salud'],
        industria: ['Industrial'],
        mineria: ['Industrial', 'Infraestructura'],
        agro: ['Industrial'],
        petroleo: ['Energía', 'Industrial'],
        inmobiliario: ['Viviendas'],
      }
      const cats = sectorMap[sectorParam]
      if (cats) result = result.filter((p) => cats.includes(p.category))
    }
    return result
  }, [category, sectorParam, projectsList])

  return (
    <Layout>
      <PageHero
        title="Proyectos que transforman el Norte Argentino"
        subtitle="Más de 500 proyectos ejecutados en 4 provincias para organismos públicos, industrias y clientes privados. Conocé nuestra trayectoria."
        image={IMAGES.proyectosHero}
      />

      <section className="py-20 md:py-28 bg-background-100">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <Breadcrumb items={[{ label: 'Proyectos' }]} />
            <div className="flex flex-wrap gap-2 mb-10">
              {projectCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-300 ${
                    category === cat ? 'bg-accent-500 text-white' : 'bg-background-200 text-foreground-600 hover:bg-background-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {sectorParam && sectorLabels[sectorParam] && (
              <p className="mb-6 text-sm font-body text-foreground-600">
                Filtrando por sector: <span className="font-medium text-accent-600">{sectorLabels[sectorParam]}</span>
                {' · '}
                <Link to="/proyectos" className="text-accent-500 hover:text-accent-600">Ver todos</Link>
              </p>
            )}

            <SectionHeading title={category} subtitle={`${filtered.length} proyectos encontrados`} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filtered.map((project) => (
                <Link key={project.id} to={`/proyectos/${project.id}`} className="group rounded-xl overflow-hidden border border-background-200 bg-background-50 hover:border-background-300 transition-all duration-300 block">
                  <div className="relative h-56 overflow-hidden">
                    <img alt={project.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" src={project.image} />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/50 to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-accent-500 text-white text-xs font-body font-semibold rounded-full">{project.category}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-bold text-foreground-950 mb-2">{project.title}</h3>
                    <p className="text-sm font-body text-foreground-600 leading-relaxed line-clamp-4">{project.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Convertimos sus necesidades en soluciones de ingeniería"
        description="Nuestro equipo técnico está listo para analizar su proyecto y elaborar una propuesta a medida sin compromiso."
        primaryLink={{ to: '/contacto', label: 'Solicitar Cotización' }}
        secondaryLink={{ to: '/servicios', label: 'Ver Servicios' }}
        image={IMAGES.proyectosCta}
      />
    </Layout>
  )
}
