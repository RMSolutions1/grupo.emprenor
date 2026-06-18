/**
 * Aplica migrate-portal-proveedores.sql en Supabase.
 * Requiere DATABASE_URL en .env.local
 *
 *   npm run migrate:proveedores
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env.local')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 0) continue
    if (!process.env[t.slice(0, i).trim()]) {
      process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
    }
  }
}

loadEnv()

const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL
if (!databaseUrl) {
  console.error('❌ Configure DATABASE_URL en .env.local')
  process.exit(1)
}

const sqlPath = resolve(process.cwd(), 'scripts/migrate-portal-proveedores.sql')
const sql = readFileSync(sqlPath, 'utf-8')

async function main() {
  const { default: pg } = await import('pg')
  const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } })
  await client.connect()
  try {
    await client.query(sql)
    console.log('✅ migrate-portal-proveedores.sql aplicado')
    const { rows } = await client.query(
      `select count(*)::int as n from information_schema.tables where table_schema = 'public' and table_name = 'organizaciones'`,
    )
    console.log(`✓ Tabla organizaciones: ${rows[0]?.n === 1 ? 'OK' : 'FALTA'}`)
  } finally {
    await client.end()
  }
}

main().catch((e) => {
  console.error('❌', e.message)
  process.exit(1)
})
