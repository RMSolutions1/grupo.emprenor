import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout, { SectionHeading } from '../components/Layout'
import { useBlogData } from '../context/ContentContext'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Blog() {
  const { blogPosts, blogCategories } = useBlogData()
  const [category, setCategory] = useState('Todos los Artículos')
  const [search, setSearch] = useState('')
  const [visible, setVisible] = useState(6)

  usePageMeta({
    title: 'Blog',
    description: 'Artículos técnicos sobre ingeniería, construcción, energía y licitaciones en el Norte Argentino.',
  })

  const featured = blogPosts.find((p) => p.featured)!
  const filtered = useMemo(() => {
    let posts = blogPosts.filter((p) => !p.featured)
    if (category !== 'Todos los Artículos') {
      posts = posts.filter((p) => p.category === category)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    }
    return posts
  }, [category, search])

  return (
    <Layout>
      <section className="relative site-header-offset min-h-[500px]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${featured.image}")` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-950/60 to-primary-950/40" />
        <div className="relative z-10 flex flex-col justify-end min-h-[500px] px-6 md:px-12 pb-12">
          <div className="max-w-4xl">
            <span className="text-accent-400 text-sm font-body font-semibold uppercase tracking-wider">Artículo Destacado · {featured.readTime}</span>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight mt-4 mb-4">{featured.title}</h1>
            <p className="text-white/70 font-body text-base md:text-lg leading-relaxed mb-6 max-w-3xl">{featured.excerpt}</p>
            <div className="flex items-center gap-4 mb-6">
              <img src={featured.authorAvatar} alt={featured.author} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-body text-white/80">{featured.author}</p>
                <p className="text-sm font-body text-white/60">{featured.authorRole} — {featured.date}</p>
              </div>
            </div>
            <Link to={`/blog/${featured.id}`} className="inline-block mt-6 px-6 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-sm font-body font-medium rounded-md transition-all">
              Leer artículo completo
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background-100">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-10">
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setVisible(6) }}
                placeholder="Buscar artículos..."
                className="flex-1 px-4 py-3 rounded-lg border border-background-200 bg-background-50 text-sm font-body text-foreground-700 placeholder:text-foreground-400 focus:outline-none focus:border-accent-400"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-12">
              {blogCategories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => { setCategory(cat.label); setVisible(6) }}
                  className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-300 ${
                    category === cat.label ? 'bg-accent-500 text-white' : 'bg-background-200 text-foreground-600 hover:bg-background-300'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>

            <SectionHeading title="Todos los Artículos" subtitle={`${filtered.length} artículos encontrados`} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.slice(0, visible).map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="group rounded-xl overflow-hidden border border-background-200 bg-background-50 hover:border-background-300 transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    <img alt={post.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" src={post.image} />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-body font-medium text-accent-500">{post.category}</span>
                    <h3 className="font-heading text-lg font-semibold text-foreground-950 mt-2 mb-3 leading-snug">{post.title}</h3>
                    <p className="text-sm font-body text-foreground-600 leading-relaxed line-clamp-3">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>

            {visible < filtered.length && (
              <div className="text-center mt-10">
                <button onClick={() => setVisible((v) => v + 6)} className="px-8 py-3 bg-background-200 hover:bg-accent-500 hover:text-white text-foreground-700 text-sm font-body font-medium rounded-md transition-all duration-300">
                  Cargar más artículos ({filtered.length - visible} restantes)
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}
