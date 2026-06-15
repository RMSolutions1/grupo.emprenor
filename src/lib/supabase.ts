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
  { id: 'projects', title: 'Proyectos', description: 'Agregar, editar y destacar proyectos', icon: 'ri-building-2-line', path: '/admin/proyectos', status: 'soon' },
  { id: 'services', title: 'Servicios', description: 'Divisiones, textos e imágenes de servicios', icon: 'ri-tools-line', path: '/admin/servicios', status: 'soon' },
  { id: 'blog', title: 'Blog', description: 'Artículos, categorías y autores', icon: 'ri-article-line', path: '/admin/blog', status: 'soon' },
  { id: 'licitaciones', title: 'Licitaciones', description: 'Llamados, pliegos y estados', icon: 'ri-file-list-3-line', path: '/admin/licitaciones', status: 'soon' },
  { id: 'empresa', title: 'Empresa', description: 'Equipo, historia, valores y regiones', icon: 'ri-team-line', path: '/admin/empresa', status: 'soon' },
  { id: 'home', title: 'Inicio', description: 'Estadísticas, testimonios y certificaciones', icon: 'ri-home-4-line', path: '/admin/inicio', status: 'soon' },
  { id: 'contact', title: 'Contacto', description: 'Teléfonos, dirección y áreas de email', icon: 'ri-phone-line', path: '/admin/contacto', status: 'soon' },
  { id: 'media', title: 'Medios', description: 'Subir imágenes y logos al sitio', icon: 'ri-image-line', path: '/admin/medios', status: 'soon' },
  { id: 'messages', title: 'Consultas', description: 'Formularios recibidos desde Contacto', icon: 'ri-mail-line', path: '/admin/consultas', status: 'soon' },
]
