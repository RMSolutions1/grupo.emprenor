import { isSupabaseConfigured } from '../lib/supabase'
import { formDemoNotice } from '../data/site'

export default function FormNotice({ variant = 'default' }: { variant?: 'default' | 'inverse' }) {
  if (isSupabaseConfigured) return null

  return (
    <p className={`text-xs font-body leading-relaxed mt-3 ${variant === 'inverse' ? 'text-white/40' : 'text-foreground-400'}`}>
      {formDemoNotice}
    </p>
  )
}
