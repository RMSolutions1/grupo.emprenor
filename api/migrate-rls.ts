import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

type Req = { method?: string; headers?: Record<string, string | string[] | undefined> }
type Res = { status: (code: number) => { json: (body: unknown) => void } }

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const secret = process.env.MIGRATE_SECRET
  const auth = req.headers?.authorization
  const token = typeof auth === 'string' && auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!secret || token !== secret) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL
  if (!databaseUrl) {
    return res.status(503).json({ error: 'DATABASE_URL no configurada en el servidor' })
  }

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return res.status(503).json({ error: 'Supabase no configurado' })
  }

  const sqlPath = resolve(process.cwd(), 'scripts/migrate-rls-roles.sql')
  const sql = readFileSync(sqlPath, 'utf-8')

  try {
    const { default: pg } = await import('pg')
    const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } })
    await client.connect()
    await client.query(sql)
    await client.end()
  } catch (e) {
    console.error('migrate-rls:', e)
    return res.status(500).json({ error: e instanceof Error ? e.message : 'Error SQL' })
  }

  const admin: SupabaseClient = createClient(url, serviceKey, { auth: { persistSession: false } })
  const { error } = await admin.rpc('is_staff')
  if (error) {
    return res.status(500).json({ error: `Migración ejecutada pero verificación falló: ${error.message}` })
  }

  return res.status(200).json({ ok: true, message: 'Migración RLS aplicada' })
}
