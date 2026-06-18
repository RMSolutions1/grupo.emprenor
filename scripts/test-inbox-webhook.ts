import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env.local')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 0) continue
    const k = t.slice(0, i).trim()
    if (!process.env[k]) process.env[k] = t.slice(i + 1).trim()
  }
}

loadEnv()

const url = process.env.VITE_SUPABASE_URL!
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
const admin = createClient(url, key, { auth: { persistSession: false } })

const email = `webhook-test-${Date.now()}@local.dev`
const { error } = await admin.from('contact_submissions').insert({
  type: 'contact',
  name: 'Prueba webhook',
  email,
  message: 'Test automático bandeja — puede ignorar',
})

if (error) {
  console.error('Insert error:', error.message)
  process.exit(1)
}

console.log('✓ Insert OK — webhook disparado. Revise info@emprenor.com.ar en ~30s')
await new Promise((r) => setTimeout(r, 5000))

const { error: delErr } = await admin.from('contact_submissions').delete().eq('email', email)
if (delErr) console.warn('Limpieza:', delErr.message)
else console.log('✓ Registro de prueba eliminado')
