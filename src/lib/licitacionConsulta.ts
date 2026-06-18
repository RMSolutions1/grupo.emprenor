import { isSupabaseConfigured, supabase } from './supabase'

export type LicitacionConsultaForm = {
  licitacionId: string
  name: string
  email: string
  organization?: string
  question: string
  _hp?: string
}

export async function submitLicitacionConsulta(data: LicitacionConsultaForm): Promise<{ ok: boolean; error?: string }> {
  if (data._hp?.trim()) return { ok: true }

  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: 'Servicio no disponible' }
  }

  const { error } = await supabase.rpc('submit_licitacion_consulta', {
    p_licitacion_id: data.licitacionId,
    p_name: data.name.trim(),
    p_email: data.email.trim(),
    p_organization: data.organization?.trim() || null,
    p_question: data.question.trim(),
  })

  if (error) {
    if (error.message.includes('Licitación no encontrada')) {
      return { ok: false, error: 'Esta licitación no está disponible.' }
    }
    return { ok: false, error: 'No se pudo enviar la consulta. Intente nuevamente.' }
  }

  return { ok: true }
}
