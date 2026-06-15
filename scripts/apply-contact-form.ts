/**
 * Aplica el fix de formularios de contacto en Supabase.
 * Uso: npx tsx scripts/apply-contact-form.ts
 *
 * Requiere DATABASE_URL en .env.local (Connection string de Supabase → Settings → Database)
 * o ejecute scripts/fix-contact-form.sql manualmente en el SQL Editor.
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
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    process.env[key] = val
  }
}

loadEnv()

const url = process.env.VITE_SUPABASE_URL
const anonKey = process.env.VITE_SUPABASE_ANON_KEY
const databaseUrl = process.env.DATABASE_URL
const sqlPath = resolve(process.cwd(), 'scripts/fix-contact-form.sql')
const sql = readFileSync(sqlPath, 'utf-8')

async function applyWithPg() {
  const { default: pg } = await import('pg')
  const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } })
  await client.connect()
  await client.query(sql)
  await client.end()
  console.log('✓ SQL aplicado vía DATABASE_URL')
}

async function testAnonInsert() {
  if (!url || !anonKey) return false
  const client = createClient(url, anonKey, { auth: { persistSession: false } })
  const { error: rpcError } = await client.rpc('submit_contact_submission', {
    p_type: 'newsletter',
    p_email: 'test-fix@local.dev',
    p_name: 'Test fix',
  })
  if (!rpcError) {
    console.log('✓ RPC submit_contact_submission: OK')
    const svc = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } })
    await svc.from('contact_submissions').delete().eq('email', 'test-fix@local.dev')
    return true
  }
  const { error: insertError } = await client.from('contact_submissions').insert({
    email: 'test-fix@local.dev',
    type: 'newsletter',
    name: 'Test fix',
  })
  if (!insertError) {
    console.log('✓ Insert anónimo directo: OK')
    const svc = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } })
    await svc.from('contact_submissions').delete().eq('email', 'test-fix@local.dev')
    return true
  }
  console.log('✗ Formulario anónimo:', insertError?.message ?? rpcError.message)
  return false
}

async function main() {
  console.log('\n=== Fix formularios de contacto ===\n')

  if (databaseUrl) {
    try {
      await applyWithPg()
    } catch (e) {
      console.error('✗ Error aplicando SQL:', e instanceof Error ? e.message : e)
    }
  } else {
    console.log('ℹ DATABASE_URL no está en .env.local')
    console.log('  Copie la connection string en Supabase → Settings → Database → URI')
    console.log('  O pegue el contenido de scripts/fix-contact-form.sql en el SQL Editor.\n')
  }

  const ok = await testAnonInsert()
  if (!ok && !databaseUrl) {
    console.log('\nPegue esto en Supabase → SQL Editor → Run:\n')
    console.log('---')
    console.log(sql)
    console.log('---\n')
  } else if (ok) {
    console.log('\n✅ Formularios listos para visitantes anónimos.\n')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
