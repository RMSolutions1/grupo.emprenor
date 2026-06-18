import { supabase } from './supabase'

export type OrgStatus = 'pendiente' | 'aprobado' | 'rechazado' | 'suspendido'

export type Organizacion = {
  id: string
  razon_social: string
  cuit: string
  email: string
  phone: string | null
  address: string | null
  city: string | null
  province: string | null
  rubros: string[]
  website: string | null
  contact_name: string | null
  status: OrgStatus
  status_note: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

export type RegisterProveedorInput = {
  razonSocial: string
  cuit: string
  email: string
  phone?: string
  address?: string
  city?: string
  province?: string
  rubros: string[]
  contactName?: string
  website?: string
}

export const PROVEEDOR_RUBROS = [
  'Obra Civil',
  'Energía',
  'Infraestructura',
  'Equipamiento',
  'Mantenimiento',
  'Instalaciones Eléctricas',
  'Instalaciones Sanitarias',
  'Hormigón / Estructuras',
  'Otros',
] as const

export const ORG_STATUS_LABELS: Record<OrgStatus, string> = {
  pendiente: 'Pendiente de aprobación',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
  suspendido: 'Suspendido',
}

export async function fetchMyOrganizacion(): Promise<Organizacion | null> {
  if (!supabase) return null
  const orgId = await fetchMyOrganizacionId()
  if (!orgId) return null
  const { data, error } = await supabase.from('organizaciones').select('*').eq('id', orgId).maybeSingle()
  if (error || !data) return null
  return data as Organizacion
}

export async function fetchMyOrganizacionId(): Promise<string | null> {
  if (!supabase) return null
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return null
  const { data } = await supabase
    .from('proveedor_miembros')
    .select('organizacion_id')
    .eq('user_id', userData.user.id)
    .maybeSingle()
  return data?.organizacion_id ?? null
}

export async function registerProveedor(input: RegisterProveedorInput): Promise<{ ok: boolean; orgId?: string; error?: string }> {
  if (!supabase) return { ok: false, error: 'Supabase no configurado' }

  const { data, error } = await supabase.rpc('register_proveedor', {
    p_razon_social: input.razonSocial.trim(),
    p_cuit: input.cuit.trim(),
    p_email: input.email.trim(),
    p_phone: input.phone?.trim() || null,
    p_address: input.address?.trim() || null,
    p_city: input.city?.trim() || null,
    p_province: input.province?.trim() || null,
    p_rubros: input.rubros,
    p_contact_name: input.contactName?.trim() || null,
    p_website: input.website?.trim() || null,
  })

  if (error) {
    const msg = error.message.includes('Ya tiene una empresa')
      ? 'Su cuenta ya tiene una empresa registrada.'
      : error.message.includes('CUIT')
        ? 'CUIT inválido o ya registrado.'
        : error.message
    return { ok: false, error: msg }
  }

  return { ok: true, orgId: data as string }
}

export async function fetchOrganizaciones(status?: OrgStatus): Promise<Organizacion[]> {
  if (!supabase) return []
  let q = supabase.from('organizaciones').select('*').order('created_at', { ascending: false })
  if (status) q = q.eq('status', status)
  const { data, error } = await q
  if (error) return []
  return (data as Organizacion[]) ?? []
}

export async function updateOrganizacionStatus(
  id: string,
  status: OrgStatus,
  statusNote?: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: 'Supabase no configurado' }
  const { data: userData } = await supabase.auth.getUser()
  const { error } = await supabase
    .from('organizaciones')
    .update({
      status,
      status_note: statusNote?.trim() || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: userData.user?.id ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function checkPortalProveedoresReady(): Promise<'ready' | 'missing'> {
  if (!supabase) return 'missing'
  const { error } = await supabase.from('organizaciones').select('id').limit(1)
  if (error?.message?.includes('does not exist') || error?.code === '42P01') return 'missing'
  return 'ready'
}
