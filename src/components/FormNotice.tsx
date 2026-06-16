import { isSupabaseConfigured } from '../lib/supabase'
import { formDemoNotice } from '../data/site'

export default function FormNotice({ variant = 'default' }: { variant?: 'default' | 'inverse' }) {
  // En producción el envío usa /api/contact; el aviso solo aplica en desarrollo sin Supabase.
  if (isSupabaseConfigured || import.meta.env.PROD) return null

  return (
    <p className={`text-xs font-body leading-relaxed mt-3 ${variant === 'inverse' ? 'text-white/40' : 'text-foreground-400'}`}>
      {formDemoNotice}
    </p>
  )
}
