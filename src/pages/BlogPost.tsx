import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { CTASection } from '../components/PageHero'
import { useBlogData, useBlogPostContent } from '../context/ContentContext'
import { usePageMeta } from '../hooks/usePageMeta'

export default function BlogPost() {
  const { id } = useParams()
  const { blogPosts } = useBlogData()
  const post = blogPosts.find((p) => p.id === id)
  const fallbackContent = useBlogPostContent(id ?? '')
  const content = post ? (post.content ?? fallbackContent) : undefined

  usePageMeta({
    title: post?.title ?? 'Artículo no encontrado',
    description: post?.excerpt,
  })

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-6">
          <h1 className="font-heading text-4xl font-bold text-foreground-950 mb-4">Artículo no encontrado</h1>
          <Link to="/blog" className="text-accent-500 font-body hover:text-accent-600">Volver al blog</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="relative pt-20">
        <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
          <img alt={post.title} className="w-full h-full object-cover object-top" src={post.image} />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 to-transparent" />
        </div>
      </section>

      <article className="py-20 md:py-28 bg-background-100">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-3xl mx-auto">
            <Breadcrumb items={[{ label: 'Blog', to: '/blog' }, { label: post.title }]} />
            <span className="text-accent-500 text-sm font-body font-semibold">{post.category}</span>
            <p className="text-sm font-body text-foreground-400 mt-1">{post.date} · {post.readTime}</p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950 leading-tight mt-4 mb-6">{post.title}</h1>
            <div className="flex items-center gap-3 mb-8">
              <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-body text-foreground-700">{post.author}</p>
                <p className="text-sm font-body text-foreground-500">{post.authorRole}</p>
              </div>
            </div>
            <div className="space-y-6">
              <p className="text-lg font-body text-foreground-700 leading-relaxed">{post.excerpt}</p>
              {content?.split('\n\n').map((para, i) => (
                <p key={i} className="text-base font-body text-foreground-600 leading-relaxed">{para}</p>
              ))}
            </div>
            <Link to="/blog" className="inline-flex items-center gap-2 mt-10 text-sm font-body font-medium text-accent-500 hover:text-accent-600 transition-colors">
              <i className="ri-arrow-left-line" /> Volver al blog
            </Link>
          </div>
        </div>
      </article>

      <CTASection
        title="¿Necesita asesoramiento técnico?"
        description="Nuestro equipo de ingeniería está disponible para responder sus consultas sobre proyectos de infraestructura."
        primaryLink={{ to: '/contacto', label: 'Contactar' }}
      />
    </Layout>
  )
}
