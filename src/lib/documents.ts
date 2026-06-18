import { supabase } from './supabase'

const BUCKET = 'licitacion-docs'
const MAX_SIZE = 50 * 1024 * 1024
const ALLOWED = new Set([
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'dwg', 'dxf', 'jpg', 'jpeg', 'png',
])

export type DocType = 'pliego' | 'anexo' | 'plano' | 'acta' | 'otro'

const DOC_TYPE_LABELS: Record<DocType, string> = {
  pliego: 'Pliego',
  anexo: 'Anexo',
  plano: 'Plano',
  acta: 'Acta de consultas',
  otro: 'Documento',
}

export function docTypeLabel(type: string): string {
  return DOC_TYPE_LABELS[type as DocType] ?? 'Documento'
}

export function formatFileSize(bytes?: number | null): string {
  if (!bytes || bytes <= 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export async function uploadLicitacionDocument(
  file: File,
  licitacionId: string,
): Promise<{ url: string | null; error: string | null }> {
  if (!supabase) {
    return { url: null, error: 'Supabase no está configurado.' }
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED.has(ext)) {
    return { url: null, error: 'Formato no permitido. Use PDF, DOCX, XLSX, ZIP, DWG o imágenes.' }
  }
  if (file.size > MAX_SIZE) {
    return { url: null, error: 'El archivo no puede superar 50 MB.' }
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase()
  const path = `${licitacionId}/${Date.now()}-${safeName}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  })

  if (error) {
    if (error.message.toLowerCase().includes('bucket')) {
      return { url: null, error: 'Ejecute scripts/migrate-licitaciones-portal.sql en Supabase para crear el bucket licitacion-docs.' }
    }
    return { url: null, error: error.message }
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}
