/**
 * Aplica endurecimiento de formularios + trigger auth seguro en Supabase.
 * Uso: npm run migrate:contact
 *
 * Requiere DATABASE_URL en .env.local
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env.local')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
  }
}

loadEnv()

const url = process.env.VITE_SUPABASE_URL
const anonKey = process.env.VITE_SUPABASE_ANON_KEY
const databaseUrl = process.env.DATABASE_URL
const sql = readFileSync(resolve(process.cwd(), 'scripts/migrate-contact-hardening.sql'), 'utf-8')

async function main() {
  if (!databaseUrl) {
    console.error('❌ Falta DATABASE_URL en .env.local')
    console.error('   O ejecute scripts/migrate-contact-hardening.sql en el SQL Editor de Supabase')
    process.exit(1)
  }

  const { default: pg } = await import('pg')
  const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } })
  await client.connect()
  await client.query(sql)
  await client.end()
  console.log('✓ migrate-contact-hardening.sql aplicado')

  if (url && anonKey) {
    const anon = createClient(url, anonKey, { auth: { persistSession: false } })
    const testEmail = `hardening-test-${Date.now()}@local.dev`
    const { error } = await anon.rpc('submit_contact_submission', {
      p_type: 'newsletter',
      p_email: testEmail,
      p_honeypot: null,
    })
    if (error) {
      console.error('✗ Verificación RPC:', error.message)
      process.exit(1)
    }
    console.log('✓ RPC submit_contact_submission verificado')
    const svc = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } })
    await svc.from('contact_submissions').delete().eq('email', testEmail)
  }

  console.log('\n✅ Formularios endurecidos (honeypot + rate limit, sin insert directo)')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
