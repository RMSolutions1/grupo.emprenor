import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const js = readFileSync(
  'C:/Users/Windows/.cursor/projects/c-Users-Windows-Documents-grupoemprenor/agent-tools/9dda2eb3-1190-4657-8eaa-480ecbf2e477.txt',
  'utf8',
)

const ids = ['ingenieria', 'construccion', 'energia', 'industrial', 'viviendas', 'mantenimiento']
const imageMap = {
  ingenieria: { div: 'div-eng-2026-01', page: 'serv-ing-2026', icon: 'ri-ruler-line', tab: 'Ingeniería' },
  construccion: { div: 'div-const-2026-02', page: 'serv-const-2026', icon: 'ri-building-line', tab: 'Construcción' },
  energia: { div: 'div-en-2026-03', page: 'serv-energy-2026', icon: 'ri-flashlight-line', tab: 'Energía' },
  industrial: { div: 'div-ind-2026-04', page: 'serv-ind-2026', icon: 'ri-store-2-line', tab: 'Obras Industriales' },
  viviendas: { div: 'div-viv-2026-05', page: 'serv-viv-2026', icon: 'ri-home-4-line', tab: 'Viviendas' },
  mantenimiento: { div: 'div-mant-2026-06', page: 'serv-mant-2026', icon: 'ri-tools-line', tab: 'Mantenimiento' },
}

const homeDesc = {
  ingenieria: 'Cálculo estructural, dirección técnica, proyecto ejecutivo e inspección de obras.',
  construccion: 'Obras civiles, infraestructura, urbanización y desarrollos a gran escala.',
  energia: 'Instalaciones de baja y media tensión, tableros eléctricos y automatización industrial.',
  industrial: 'Naves industriales, plantas de producción, galpones y desarrollos logísticos.',
  viviendas: 'Viviendas tradicionales, prefabricadas y modulares de alta calidad constructiva.',
  mantenimiento: 'Mantenimiento correctivo, preventivo e integral para infraestructura e instalaciones.',
}

const services = []
const details = {}

for (const id of ids) {
  const start = js.indexOf(`id:\`${id}\`,name:`)
  const chunk = js.slice(start, start + 3500)
  const pick = (k) => {
    const m = chunk.match(new RegExp(`${k}:\`([^\`]+)\``))
    return m ? m[1] : ''
  }
  const subs = [...chunk.matchAll(/subservicios:\[\{name:\`([^\`]+)\`,description:\`([^\`]+)\`/g)]
  if (subs.length === 0) {
    const subChunk = chunk.slice(chunk.indexOf('subservicios:['))
    const subMatches = [...subChunk.matchAll(/\{name:\`([^\`]+)\`,description:\`([^\`]+)\`/g)]
    subMatches.forEach((m) => subs.push(m))
  }
  const meta = imageMap[id]
  services.push({
    id,
    title: pick('name') || meta.tab,
    tabTitle: meta.tab,
    description: homeDesc[id],
    tagline: pick('tagline'),
    icon: meta.icon,
    image: meta.div,
    pageImage: meta.page,
    services: subs.map((m) => m[1]),
  })
  details[id] = {
    intro: pick('description'),
    items: subs.map((m) => ({ title: m[1], description: m[2] })),
  }
}

const svcLines = services.map((s) => `  {
    id: '${s.id}',
    title: ${JSON.stringify(s.title)},
    tabTitle: '${s.tabTitle}',
    description: ${JSON.stringify(s.description)},
    tagline: ${JSON.stringify(s.tagline)},
    icon: '${s.icon}',
    image: image('${s.image}'),
    pageImage: image('${s.pageImage}'),
    services: ${JSON.stringify(s.services)},
  }`)

const detailLines = Object.entries(details).map(([id, d]) => `  ${id}: {
    intro: ${JSON.stringify(d.intro)},
    items: [
${d.items.map((i) => `      { title: ${JSON.stringify(i.title)}, description: ${JSON.stringify(i.description)} },`).join('\n')}
    ],
  }`)

const out = `import { image } from './images'

export interface Service {
  id: string
  title: string
  tabTitle: string
  description: string
  tagline: string
  icon: string
  image: string
  pageImage: string
  services: string[]
}

export const services: Service[] = [
${svcLines.join(',\n')},
]

export const serviceDetails: Record<string, { intro: string; items: { title: string; description: string }[] }> = {
${detailLines.join('\n')}
}
`

writeFileSync(join(__dirname, '../src/data/services.ts'), out)
console.log('services.ts generated', services.length)
