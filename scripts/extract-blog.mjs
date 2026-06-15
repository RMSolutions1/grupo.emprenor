import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const js = readFileSync(
  'C:/Users/Windows/.cursor/projects/c-Users-Windows-Documents-grupoemprenor/agent-tools/9dda2eb3-1190-4657-8eaa-480ecbf2e477.txt',
  'utf8',
).replace(/^\uFEFF/, '')

const catMap = {
  ingenieria: 'Ingeniería',
  construccion: 'Construcción',
  energia: 'Energía',
  licitaciones: 'Licitaciones',
  normativas: 'Normativas',
  viviendas: 'Viviendas',
}

const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} de ${months[m - 1]} de ${y}`
}

const articles = []
for (let i = 1; i <= 13; i++) {
  const id = `art-${String(i).padStart(3, '0')}`
  const start = js.indexOf(`id:\`${id}\``)
  if (start < 0) continue
  const chunk = js.slice(start, start + 4000)
  const pick = (key) => {
    const m = chunk.match(new RegExp(`${key}:\`([^\`]+)\``))
    return m ? m[1] : ''
  }
  const seqM = chunk.match(/seq=(blog-art\d+-2026)/)
  articles.push({
    id: pick('slug'),
    title: pick('title'),
    excerpt: pick('excerpt'),
    category: catMap[pick('category')] || pick('category'),
    author: pick('author'),
    authorRole: pick('authorRole'),
    date: formatDate(pick('date')),
    readTime: `${pick('readTime')} de lectura`,
    imageSeq: seqM ? seqM[1] : '',
    featured: i === 1,
  })
}

writeFileSync(join(__dirname, '../src/data/blog-extract.json'), JSON.stringify(articles, null, 2))
console.log(JSON.stringify(articles.map((a) => ({ id: a.id, category: a.category })), null, 2))
