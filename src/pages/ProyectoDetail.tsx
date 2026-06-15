import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { CTASection } from '../components/PageHero'
import { IMAGES } from '../data/images'
import { projects } from '../data/projects'
import { usePageMeta } from '../hooks/usePageMeta'

export default function ProyectoDetail() {
  const { id } = useParams()
  const project = projects.find((p) => p.id === id)

  usePageMeta({
    title: project?.title ?? 'Proyecto no encontrado',
    description: project?.description.slice(0, 160),
  })

  if (!project) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-6">
          <h1 className="font-heading text-4xl font-bold text-foreground-950 mb-4">Proyecto no encontrado</h1>
          <Link to="/proyectos" className="text-accent-500 font-body hover:text-accent-600">Volver a proyectos</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="relative pt-20">
        <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <img alt={project.title} className="w-full h-full object-cover object-top" src={project.image} />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
              <span className="inline-block px-3 py-1 bg-accent-500 text-white text-xs font-body font-semibold rounded-full mb-4">{project.category} · {project.year}</span>
              <h1 className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight">{project.title}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background-100">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <Breadcrumb items={[{ label: 'Proyectos', to: '/proyectos' }, { label: project.title }]} />
            <div className="flex flex-wrap gap-6 mb-8 text-sm font-body text-foreground-600">
              <span className="flex items-center gap-2"><i className="ri-building-2-line text-accent-500" />{project.client}</span>
              <span className="flex items-center gap-2"><i className="ri-map-pin-line text-accent-500" />{project.location}</span>
            </div>
            <p className="text-lg font-body text-foreground-700 leading-relaxed mb-8">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-10">
              {project.tags.map((tag) => (
                <span key={tag} className="px-4 py-1.5 bg-background-50 border border-background-200 text-sm font-body text-foreground-700 rounded-full">{tag}</span>
              ))}
            </div>
            <Link to="/proyectos" className="inline-flex items-center gap-2 text-sm font-body font-medium text-accent-500 hover:text-accent-600 transition-colors">
              <i className="ri-arrow-left-line" /> Volver a proyectos
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="¿Interesado en un proyecto similar?"
        description="Contacte a nuestro equipo técnico para conocer cómo podemos ayudarle con su próximo desarrollo."
        primaryLink={{ to: '/contacto', label: 'Solicitar Cotización' }}
        image={IMAGES.proyectosCta}
      />
    </Layout>
  )
}
