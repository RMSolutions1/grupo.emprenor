import { supabase } from './supabase'
import type { Project } from '../data/projects'
import type { Service } from '../data/services'
import type { Licitacion } from '../data/licitaciones'
import { licitacionImage } from '../data/licitaciones'
import type { BlogPost } from '../data/blog'
import { siteContact, contactAreas } from '../data/contacto'
import { stats } from '../data/home'
import { sectors, certifications } from '../data/home'
import { testimonials } from '../data/testimonials'
import { timeline, values, team, regions } from '../data/empresa'
import { defaultPages, type SitePages } from '../data/pages'
import { mergeSitePages } from './pageCopy'

export type SiteSettings = {
  id: string
  contact: typeof siteContact
  stats: typeof stats
  social: { instagram?: string; youtube?: string; facebook?: string }
  testimonials: typeof testimonials
  home: { sectors: typeof sectors; certifications: typeof certifications }
  empresa: { timeline: typeof timeline; values: typeof values; team: typeof team; regions: typeof regions }
  contact_areas: typeof contactAreas
  pages: SitePages
  updated_at?: string
}

export type ContactSubmission = {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  organization: string | null
  area: string | null
  message: string | null
  type: 'contact' | 'callback' | 'newsletter'
  read: boolean
  created_at: string
}

type DbProject = {
  id: string
  title: string
  client: string | null
  location: string | null
  year: number | null
  category: string | null
  description: string | null
  carousel_description: string | null
  tags: string[] | null
  image_url: string | null
  featured: boolean | null
  published: boolean | null
  sort_order: number | null
}

type DbService = {
  id: string
  title: string
  tab_title: string | null
  description: string | null
  tagline: string | null
  icon: string | null
  image_url: string | null
  page_image_url: string | null
  services: string[] | null
  details: Record<string, unknown> | null
  sort_order: number | null
  published: boolean | null
}

type DbBlogPost = {
  id: string
  title: string
  excerpt: string | null
  content: string | null
  category: string | null
  author: string | null
  author_role: string | null
  author_avatar_url: string | null
  image_url: string | null
  date_label: string | null
  read_time: string | null
  featured: boolean | null
  published: boolean | null
}

type DbLicitacion = {
  id: string
  code: string | null
  status: string | null
  category: string | null
  title: string
  client: string | null
  location: string | null
  apertura: string | null
  cierre: string | null
  budget: string | null
  docs: number | null
  consultas: number | null
  published: boolean | null
}

export function mapProject(row: DbProject): Project {
  return {
    id: row.id,
    title: row.title,
    client: row.client ?? '',
    location: row.location ?? '',
    year: row.year ?? 0,
    category: row.category ?? '',
    description: row.description ?? '',
    carouselDescription: row.carousel_description ?? undefined,
    tags: row.tags ?? [],
    image: row.image_url ?? '',
    featured: row.featured ?? false,
  }
}

export function mapService(row: DbService): Service & { details?: Record<string, unknown> } {
  return {
    id: row.id,
    title: row.title,
    tabTitle: row.tab_title ?? row.title,
    description: row.description ?? '',
    tagline: row.tagline ?? '',
    icon: row.icon ?? 'ri-tools-line',
    image: row.image_url ?? '',
    pageImage: row.page_image_url ?? row.image_url ?? '',
    services: row.services ?? [],
    details: row.details ?? undefined,
  }
}

export function mapBlogPost(row: DbBlogPost): BlogPost {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt ?? '',
    category: row.category ?? '',
    author: row.author ?? '',
    authorRole: row.author_role ?? '',
    authorAvatar: row.author_avatar_url ?? '',
    date: row.date_label ?? '',
    readTime: row.read_time ?? '',
    image: row.image_url ?? '',
    featured: row.featured ?? false,
    content: row.content ?? undefined,
  }
}

export function mapLicitacion(row: DbLicitacion): Licitacion {
  const lic = {
    id: row.id,
    code: row.code ?? '',
    status: (row.status ?? 'Publicada') as Licitacion['status'],
    category: row.category ?? '',
    title: row.title,
    client: row.client ?? '',
    location: row.location ?? '',
    apertura: row.apertura ?? '',
    cierre: row.cierre ?? '',
    budget: row.budget ?? '',
    docs: row.docs ?? 0,
    consultas: row.consultas ?? undefined,
  }
  return { ...lic, image: licitacionImage(lic) }
}

const defaultSettings: SiteSettings = {
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
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'main').maybeSingle()
  if (error || !data) return null
  return {
    id: data.id,
    contact: { ...defaultSettings.contact, ...(data.contact as object) },
    stats: (data.stats as typeof stats)?.length ? (data.stats as typeof stats) : defaultSettings.stats,
    social: { ...defaultSettings.social, ...(data.social as object) },
    testimonials: (data.testimonials as typeof testimonials)?.length ? (data.testimonials as typeof testimonials) : defaultSettings.testimonials,
    home: {
      sectors: (data.home as SiteSettings['home'])?.sectors?.length ? (data.home as SiteSettings['home']).sectors : defaultSettings.home.sectors,
      certifications: (data.home as SiteSettings['home'])?.certifications?.length ? (data.home as SiteSettings['home']).certifications : defaultSettings.home.certifications,
    },
    empresa: {
      timeline: (data.empresa as SiteSettings['empresa'])?.timeline?.length ? (data.empresa as SiteSettings['empresa']).timeline : defaultSettings.empresa.timeline,
      values: (data.empresa as SiteSettings['empresa'])?.values?.length ? (data.empresa as SiteSettings['empresa']).values : defaultSettings.empresa.values,
      team: (data.empresa as SiteSettings['empresa'])?.team?.length ? (data.empresa as SiteSettings['empresa']).team : defaultSettings.empresa.team,
      regions: (data.empresa as SiteSettings['empresa'])?.regions?.length ? (data.empresa as SiteSettings['empresa']).regions : defaultSettings.empresa.regions,
    },
    contact_areas: (data.contact_areas as typeof contactAreas)?.length ? (data.contact_areas as typeof contactAreas) : defaultSettings.contact_areas,
    pages: mergeSitePages((data.pages as Partial<SitePages>) ?? undefined),
    updated_at: data.updated_at,
  }
}

export async function fetchProjects(publishedOnly = true): Promise<Project[]> {
  if (!supabase) return []
  let query = supabase.from('projects').select('*').order('sort_order', { ascending: true })
  if (publishedOnly) query = query.eq('published', true)
  const { data, error } = await query
  if (error || !data?.length) return []
  return (data as DbProject[]).map(mapProject)
}

export async function fetchServices(publishedOnly = true): Promise<(Service & { details?: Record<string, unknown> })[]> {
  if (!supabase) return []
  let query = supabase.from('services').select('*').order('sort_order', { ascending: true })
  if (publishedOnly) query = query.eq('published', true)
  const { data, error } = await query
  if (error || !data?.length) return []
  return (data as DbService[]).map(mapService)
}

export async function fetchBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
  if (!supabase) return []
  let query = supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
  if (publishedOnly) query = query.eq('published', true)
  const { data, error } = await query
  if (error || !data?.length) return []
  return (data as DbBlogPost[]).map(mapBlogPost)
}

export async function fetchLicitaciones(publishedOnly = true): Promise<Licitacion[]> {
  if (!supabase) return []
  let query = supabase.from('licitaciones').select('*').order('updated_at', { ascending: false })
  if (publishedOnly) query = query.eq('published', true)
  const { data, error } = await query
  if (error || !data?.length) return []
  return (data as DbLicitacion[]).map(mapLicitacion)
}

export async function fetchContactSubmissions(): Promise<ContactSubmission[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return data as ContactSubmission[]
}

export async function markSubmissionRead(id: string, read: boolean): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('contact_submissions').update({ read }).eq('id', id)
  return !error
}

export async function deleteSubmission(id: string): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('contact_submissions').delete().eq('id', id)
  return !error
}

export async function upsertSiteSettings(partial: Partial<Omit<SiteSettings, 'id'>>): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('site_settings').upsert({
    id: 'main',
    ...partial,
    updated_at: new Date().toISOString(),
  })
  return !error
}

export async function saveProject(row: DbProject): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('projects').upsert({ ...row, updated_at: new Date().toISOString() })
  return !error
}

export async function deleteProject(id: string): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('projects').delete().eq('id', id)
  return !error
}

export async function saveService(row: DbService): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('services').upsert({ ...row, updated_at: new Date().toISOString() })
  return !error
}

export async function deleteService(id: string): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('services').delete().eq('id', id)
  return !error
}

export async function saveBlogPost(row: DbBlogPost): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('blog_posts').upsert({ ...row, updated_at: new Date().toISOString() })
  return !error
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  return !error
}

export async function saveLicitacion(row: DbLicitacion): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('licitaciones').upsert({ ...row, updated_at: new Date().toISOString() })
  return !error
}

export async function deleteLicitacion(id: string): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('licitaciones').delete().eq('id', id)
  return !error
}

export type { DbProject, DbService, DbBlogPost, DbLicitacion }
