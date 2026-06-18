/**
 * Verificación de infraestructura Portal Proveedores + APIs.
 *   npx tsx scripts/verify-portal-audit.ts
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'

function loadEnv() {
  const p = resolve(process.cwd(), '.env.local')
  if (!existsSync(p)) return
  for (const line of readFileSync(p, 'utf-8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 0) continue
    const k = t.slice(0, i).trim()
    if (process.env[k] === undefined) process.env[k] = t.slice(i + 1).trim()
  }
}

loadEnv()

const url = process.env.VITE_SUPABASE_URL!
const svc = process.env.SUPABASE_SERVICE_ROLE_KEY!
const dbUrl = process.env.DATABASE_URL

async function main() {
  const admin = createClient(url, svc)
  let pass = 0
  let fail = 0

  const check = (name: string, ok: boolean, detail = '') => {
    if (ok) {
      pass++
      console.log(`✓ ${name}${detail ? ': ' + detail : ''}`)
    } else {
      fail++
      console.log(`✗ ${name}${detail ? ': ' + detail : ''}`)
    }
  }

  const tables = ['organizaciones', 'proveedor_miembros', 'licitacion_requisitos', 'licitacion_ofertas', 'oferta_documentos']
  for (const t of tables) {
    const { error, count } = await admin.from(t).select('*', { count: 'exact', head: true })
    check(`Tabla ${t}`, !error, error ? error.message : `count=${count ?? 0}`)
  }

  if (dbUrl) {
    const { default: pg } = await import('pg')
    const c = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } })
    await c.connect()
    const { rows: funcs } = await c.query(`
      select proname from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public'
        and proname in ('register_proveedor','submit_licitacion_oferta','my_organizacion_id','is_org_approved','is_provider')
      order by proname
    `)
    check('RPCs portal', funcs.length === 5, funcs.map((r) => r.proname).join(', '))

    const { rows: buckets } = await c.query(`select id, public from storage.buckets where id = 'oferta-privada'`)
    check('Bucket oferta-privada', buckets.length === 1 && buckets[0].public === false, JSON.stringify(buckets[0]))

    const { rows: roles } = await c.query(`
      select pg_get_constraintdef(oid) as def
      from pg_constraint
      where conname = 'profiles_role_check'
    `)
    check('Rol provider en profiles', roles[0]?.def?.includes('provider') ?? false, roles[0]?.def)

    const { rows: reqs } = await c.query(`select count(*)::int as n from licitacion_requisitos`)
    check('Requisitos default licitaciones', (reqs[0]?.n ?? 0) > 0, `n=${reqs[0]?.n}`)

    const { rows: grants } = await c.query(`
      select table_name, privilege_type
      from information_schema.role_table_grants
      where grantee = 'authenticated' and table_schema = 'public'
        and table_name in ('organizaciones','proveedor_miembros','licitacion_ofertas','oferta_documentos')
      order by table_name, privilege_type
    `)
    const grantTables = [...new Set(grants.map((r) => r.table_name))]
    check('GRANT authenticated en tablas portal', grantTables.length >= 2, grantTables.join(', ') || 'NINGUNO')

    await c.end()
  } else {
    console.log('⚠ DATABASE_URL no configurado — omitiendo checks PG')
  }

  const { data: orgs } = await admin.from('organizaciones').select('id, razon_social, status')
  console.log(`\nOrganizaciones registradas: ${orgs?.length ?? 0}`)
  orgs?.forEach((o) => console.log(`  - ${o.razon_social} (${o.status})`))

  const { data: providers } = await admin.from('profiles').select('email, role').eq('role', 'provider')
  console.log(`Perfiles provider: ${providers?.length ?? 0}`)

  // CORS preflight
  const corsRes = await fetch('https://grupo.emprenor.com/api/reply', {
    method: 'OPTIONS',
    headers: { Origin: 'https://www.emprenor.com.ar' },
  })
  check('CORS preflight /api/reply', corsRes.status === 204, `status=${corsRes.status}`)

  // Legacy route
  const legacy = await fetch('https://grupo.emprenor.com/api/admin/reply', { method: 'OPTIONS', headers: { Origin: 'https://grupo.emprenor.com' } })
  check('Ruta legacy /api/admin/reply', legacy.status === 204 || legacy.status === 405, `status=${legacy.status}`)

  const { data: settings } = await admin.from('site_settings').select('pages').maybeSingle()
  const ctaUrl = settings?.pages?.licitaciones?.provider?.ctaPrimaryUrl
  check('CTA licitaciones → portal', !ctaUrl || ctaUrl === '/proveedor/registro', ctaUrl ?? 'default /proveedor/registro')

  console.log(`\n${pass} OK, ${fail} FAIL`)
  if (fail > 0) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
