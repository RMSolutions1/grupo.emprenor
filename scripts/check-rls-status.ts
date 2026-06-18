import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'

function loadEnv() {
  for (const line of readFileSync(resolve('.env.local'), 'utf-8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 0) continue
    process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
  }
}

loadEnv()

const { default: pg } = await import('pg')
const c = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
})
await c.connect()
await c.query("NOTIFY pgrst, 'reload schema'")
const fn = await c.query(
  "select count(*)::int as n from pg_proc p join pg_namespace ns on ns.oid=p.pronamespace where ns.nspname='public' and p.proname='is_staff'",
)
const pol = await c.query(
  "select count(*)::int as n from pg_policies where schemaname='public' and policyname like '%staff%'",
)
console.log('is_staff en PostgreSQL:', fn.rows[0].n > 0 ? 'SI' : 'NO')
console.log('Politicas staff:', pol.rows[0].n)
await c.end()

await new Promise((r) => setTimeout(r, 2000))
const admin = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
})
const rls = await admin.rpc('is_staff')
console.log('RPC is_staff:', rls.error ? `NO (${rls.error.message})` : 'OK')

const auth = await fetch(`${process.env.VITE_SUPABASE_URL}/auth/v1/settings`, {
  headers: {
    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
  },
})
const settings = (await auth.json()) as { disable_signup?: boolean }
console.log('Registro publico:', settings.disable_signup ? 'desactivado' : 'ACTIVO')
