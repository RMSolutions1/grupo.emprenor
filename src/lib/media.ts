import { supabase } from './supabase'

const BUCKET = 'media'
const MAX_SIZE = 8 * 1024 * 1024
const ALLOWED = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'])

export function isValidImageUrl(url: string): boolean {
  const v = url.trim()
  if (!v) return false
  if (v.startsWith('/')) return true
  try {
    const u = new URL(v)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export async function uploadMedia(file: File, folder = 'uploads'): Promise<{ url: string | null; error: string | null }> {
  if (!supabase) {
    return { url: null, error: 'Supabase no está configurado. No se pueden subir archivos.' }
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED.has(ext)) {
    return { url: null, error: 'Formato no permitido. Use JPG, PNG, WebP, GIF o SVG.' }
  }
  if (file.size > MAX_SIZE) {
    return { url: null, error: 'La imagen no puede superar 8 MB.' }
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase()
  const path = `${folder}/${Date.now()}-${safeName}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  })

  if (error) {
    if (error.message.toLowerCase().includes('bucket')) {
      return { url: null, error: 'El almacén de imágenes no está creado. Ejecute el SQL de Storage en Supabase (scripts/supabase-schema.sql).' }
    }
    return { url: null, error: error.message }
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}
