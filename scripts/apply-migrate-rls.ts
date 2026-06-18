/**
 * Aplica scripts/migrate-rls-roles.sql en Supabase.
 * Requiere DATABASE_URL en .env.local (Supabase → Settings → Database → URI)
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
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL
const sqlPath = resolve(process.cwd(), 'scripts/migrate-rls-roles.sql')
const sql = readFileSync(sqlPath, 'utf-8')

async function applyWithPg() {
  const { default: pg } = await import('pg')
  const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } })
  await client.connect()
  await client.query(sql)
  await client.end()
  console.log('✓ Migración RLS aplicada vía DATABASE_URL')
}

async function verifyMigration() {
  if (!url || !serviceKey) return false
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } })
  const { error } = await admin.rpc('is_staff')
  if (error) {
    console.log(`ℹ Verificación is_staff(): ${error.message}`)
    return false
  }
  console.log('✓ Función is_staff() disponible')
  return true
}

async function main() {
  console.log('\n=== Migración RLS (roles staff) ===\n')

  if (await verifyMigration()) {
    console.log('✅ La migración ya parece aplicada.\n')
    return
  }

  if (!databaseUrl) {
    console.log('✗ Falta DATABASE_URL en .env.local')
    console.log('  Supabase → Project Settings → Database → Connection string (URI)')
    console.log('  Agregue: DATABASE_URL=postgresql://postgres.[ref]:[password]@...\n')
    process.exit(1)
  }

  try {
    await applyWithPg()
    await verifyMigration()
    console.log('\n✅ Migración completada.\n')
  } catch (e) {
    console.error('✗ Error:', e instanceof Error ? e.message : e)
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
