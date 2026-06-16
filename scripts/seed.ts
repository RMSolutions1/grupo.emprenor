/**
 * Seed inicial: migra datos estáticos a Supabase.
 * Uso: npm run seed
 * Requiere SUPABASE_SERVICE_ROLE_KEY en .env.local (recomendado) o credenciales admin.
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { projects, projectsList } from '../src/data/projects'
import { services, serviceDetails } from '../src/data/services'
import { blogPosts } from '../src/data/blog'
import { getBlogContent } from '../src/data/blogContent'
import { licitaciones } from '../src/data/licitaciones'
import { siteContact, contactAreas } from '../src/data/contacto'
import { sectors, certifications, stats } from '../src/data/home'
import { testimonials } from '../src/data/testimonials'
import { timeline, values, team, regions } from '../src/data/empresa'
import { defaultPages } from '../src/data/pages'

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env.local')
  if (!existsSync(envPath)) return
  const lines = readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnv()

const url = process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.VITE_SUPABASE_ANON_KEY
const adminEmail = process.env.SEED_ADMIN_EMAIL
const adminPassword = process.env.SEED_ADMIN_PASSWORD

if (!url) {
  console.error('❌ Falta VITE_SUPABASE_URL en .env.local')
  process.exit(1)
}

async function getClient() {
  if (serviceKey) {
    console.log('→ Usando service role key')
    return createClient(url!, serviceKey, { auth: { persistSession: false } })
  }
  if (!anonKey) {
    console.error('❌ Agregue SUPABASE_SERVICE_ROLE_KEY o VITE_SUPABASE_ANON_KEY + credenciales admin')
    process.exit(1)
  }
  const client = createClient(url!, anonKey, { auth: { persistSession: false } })
  if (adminEmail && adminPassword) {
    console.log('→ Autenticando como admin…')
    const { error } = await client.auth.signInWithPassword({ email: adminEmail, password: adminPassword })
    if (error) {
      console.error('❌ Login fallido:', error.message)
      process.exit(1)
    }
  } else {
    console.error('❌ Sin service role, configure SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD')
    process.exit(1)
  }
  return client
}

async function seed() {
  const supabase = await getClient()
  console.log('🌱 Iniciando seed EMPRENOR…\n')

  const sortMap = Object.fromEntries(projectsList.map((p, i) => [p.id, i]))

  const projectRows = projects.map((p) => ({
    id: p.id,
    title: p.title,
    client: p.client,
    location: p.location,
    year: p.year,
    category: p.category,
    description: p.description,
    carousel_description: p.carouselDescription ?? null,
    tags: p.tags,
    image_url: p.image,
    featured: p.featured ?? false,
    published: true,
    sort_order: sortMap[p.id] ?? 99,
  }))

  const { error: projErr } = await supabase.from('projects').upsert(projectRows)
  console.log(projErr ? `❌ Proyectos: ${projErr.message}` : `✓ Proyectos: ${projectRows.length}`)

  const serviceRows = services.map((s, i) => ({
    id: s.id,
    title: s.title,
    tab_title: s.tabTitle,
    description: s.description,
    tagline: s.tagline,
    icon: s.icon,
    image_url: s.image,
    page_image_url: s.pageImage,
    services: s.services,
    details: serviceDetails[s.id] ?? {},
    sort_order: i,
    published: true,
  }))

  const { error: svcErr } = await supabase.from('services').upsert(serviceRows)
  console.log(svcErr ? `❌ Servicios: ${svcErr.message}` : `✓ Servicios: ${serviceRows.length}`)

  const blogRows = blogPosts.map((b) => ({
    id: b.id,
    title: b.title,
    excerpt: b.excerpt,
    content: getBlogContent(b.id),
    category: b.category,
    author: b.author,
    author_role: b.authorRole,
    author_avatar_url: b.authorAvatar,
    image_url: b.image,
    date_label: b.date,
    read_time: b.readTime,
    featured: b.featured ?? false,
    published: true,
  }))

  const { error: blogErr } = await supabase.from('blog_posts').upsert(blogRows)
  console.log(blogErr ? `❌ Blog: ${blogErr.message}` : `✓ Blog: ${blogRows.length}`)

  const licRows = licitaciones.map((l) => ({
    id: l.id,
    code: l.code,
    status: l.status,
    category: l.category,
    title: l.title,
    client: l.client,
    location: l.location,
    apertura: l.apertura,
    cierre: l.cierre,
    budget: l.budget,
    docs: l.docs,
    consultas: l.consultas ?? 0,
    published: true,
  }))

  const { error: licErr } = await supabase.from('licitaciones').upsert(licRows)
  console.log(licErr ? `❌ Licitaciones: ${licErr.message}` : `✓ Licitaciones: ${licRows.length}`)

  const settingsRow = {
    id: 'main',
    contact: siteContact,
    stats,
    social: {
      instagram: 'https://instagram.com/emprenorgroup',
      youtube: 'https://youtube.com/@emprenorgroup',
      facebook: 'https://facebook.com/emprenorgroup',
    },
    testimonials,
    home: { sectors, certifications },
    empresa: { timeline, values, team, regions },
    contact_areas: contactAreas,
    pages: defaultPages,
    updated_at: new Date().toISOString(),
  }

  const { error: setErr } = await supabase.from('site_settings').upsert(settingsRow)
  console.log(setErr ? `❌ Site settings: ${setErr.message}` : '✓ Configuración del sitio')

  console.log('\n✅ Seed completado.')
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
