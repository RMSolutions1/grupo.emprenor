import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const articles = JSON.parse(readFileSync(join(__dirname, '../src/data/blog-extract.json'), 'utf8'))

const authorAvatars = {
  'Ing. Gabriel Montenegro': 'author-gm-2026',
  'Ing. Carolina Quiroga': 'author-cq-2026',
  'Arq. Martín Delgado': 'author-md-2026',
  'Lic. Andrea Vallejos': 'author-av-2026',
  'Arq. Lucía Fernández': 'author-lf-2026',
  'Ing. Pablo Soria': 'author-ps-2026',
}

const lines = articles.map((a) => {
  const avatar = authorAvatars[a.author] || 'author-gm-2026'
  return `  {
    id: '${a.id}',
    title: ${JSON.stringify(a.title)},
    excerpt: ${JSON.stringify(a.excerpt)},
    category: '${a.category}',
    author: ${JSON.stringify(a.author)},
    authorRole: ${JSON.stringify(a.authorRole)},
    authorAvatar: image('${avatar}'),
    date: ${JSON.stringify(a.date)},
    readTime: ${JSON.stringify(a.readTime)},
    image: image('${a.imageSeq}'),
    featured: ${a.featured},
  }`
})

const out = `import { image } from './images'

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  authorRole: string
  authorAvatar: string
  date: string
  readTime: string
  image: string
  featured?: boolean
  content?: string
}

export const blogPosts: BlogPost[] = [
${lines.join(',\n')},
]

export const blogCategories = [
  { label: 'Todos los Artículos', count: 13 },
  { label: 'Ingeniería', count: 3 },
  { label: 'Construcción', count: 3 },
  { label: 'Energía', count: 2 },
  { label: 'Licitaciones', count: 2 },
  { label: 'Normativas', count: 1 },
  { label: 'Viviendas', count: 2 },
] as const
`

writeFileSync(join(__dirname, '../src/data/blog.ts'), out)
console.log('blog.ts generated')
