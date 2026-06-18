import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!)
  : null

export type AdminModule = {
  id: string
  title: string
  description: string
  icon: string
  path: string
  status: 'ready' | 'soon'
}

export const adminModules: AdminModule[] = [
  { id: 'messages', title: 'Bandeja', description: 'Consultas, callbacks y licitaciones', icon: 'ri-inbox-line', path: '/admin/consultas', status: 'ready' },
  { id: 'projects', title: 'Proyectos', description: 'Agregar, editar y destacar proyectos', icon: 'ri-building-2-line', path: '/admin/proyectos', status: 'ready' },
  { id: 'services', title: 'Servicios', description: 'Divisiones, textos e imágenes de servicios', icon: 'ri-tools-line', path: '/admin/servicios', status: 'ready' },
  { id: 'blog', title: 'Blog', description: 'Artículos, categorías y autores', icon: 'ri-article-line', path: '/admin/blog', status: 'ready' },
  { id: 'licitaciones', title: 'Licitaciones', description: 'Llamados, pliegos y estados', icon: 'ri-file-list-3-line', path: '/admin/licitaciones', status: 'ready' },
  { id: 'empresa', title: 'Empresa', description: 'Equipo, historia, valores y regiones', icon: 'ri-team-line', path: '/admin/empresa', status: 'ready' },
  { id: 'pages', title: 'Textos del sitio', description: 'Títulos, párrafos, héroes y CTAs por página', icon: 'ri-file-text-line', path: '/admin/paginas', status: 'ready' },
  { id: 'home', title: 'Inicio', description: 'Estadísticas, testimonios y certificaciones', icon: 'ri-home-4-line', path: '/admin/inicio', status: 'ready' },
  { id: 'contact', title: 'Contacto', description: 'Teléfonos, dirección y áreas de email', icon: 'ri-phone-line', path: '/admin/contacto', status: 'ready' },
  { id: 'media', title: 'Medios', description: 'Rutas de imágenes del sitio', icon: 'ri-image-line', path: '/admin/medios', status: 'ready' },
]
