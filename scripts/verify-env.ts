/**
 * Verifica .env.local y conexión a Supabase (solo local).
 * Uso: npx tsx scripts/verify-env.ts
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env.local')
  if (!existsSync(envPath)) {
    console.error('❌ No existe .env.local en la raíz del proyecto')
    process.exit(1)
  }
  const lines = readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
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

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split('.')[1]
    return JSON.parse(Buffer.from(part, 'base64url').toString('utf-8'))
  } catch {
    return null
  }
}

loadEnv()

const url = process.env.VITE_SUPABASE_URL
const anonKey = process.env.VITE_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const siteUrl = process.env.VITE_SITE_URL

console.log('\n=== Verificación .env.local ===\n')

const checks: { name: string; ok: boolean; detail: string }[] = []

checks.push({
  name: 'Ubicación',
  ok: existsSync(resolve(process.cwd(), '.env.local')),
  detail: 'Archivo en raíz del proyecto (grupoemprenor/.env.local)',
})

checks.push({
  name: 'VITE_SUPABASE_URL',
  ok: Boolean(url && url.startsWith('https://') && url.includes('.supabase.co') && !url.includes('/rest/')),
  detail: url ? `${url.slice(0, 40)}…` : 'Falta o vacío',
})

if (anonKey) {
  const payload = decodeJwtPayload(anonKey)
  const ref = payload?.ref as string | undefined
  const role = payload?.role as string | undefined
  const urlRef = url?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
  checks.push({
    name: 'VITE_SUPABASE_ANON_KEY',
    ok: role === 'anon' && ref === urlRef,
    detail: role === 'anon' ? `JWT válido, rol=anon, ref=${ref}` : `JWT inválido o rol incorrecto (${role})`,
  })
} else {
  checks.push({ name: 'VITE_SUPABASE_ANON_KEY', ok: false, detail: 'Falta' })
}

if (serviceKey) {
  const payload = decodeJwtPayload(serviceKey)
  const role = payload?.role as string | undefined
  checks.push({
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    ok: role === 'service_role',
    detail: role === 'service_role' ? 'JWT válido, rol=service_role' : `Rol incorrecto: ${role}`,
  })
} else {
  checks.push({ name: 'SUPABASE_SERVICE_ROLE_KEY', ok: false, detail: 'Falta (necesaria para npm run seed)' })
}

checks.push({
  name: 'VITE_SITE_URL',
  ok: Boolean(siteUrl),
  detail: siteUrl ?? 'Opcional pero recomendado',
})

for (const c of checks) {
  console.log(`${c.ok ? '✓' : '✗'} ${c.name}: ${c.detail}`)
}

const allOk = checks.every((c) => c.ok || c.name === 'VITE_SITE_URL')
if (!url || !anonKey) {
  console.error('\n❌ Variables mínimas incompletas.')
  process.exit(1)
}

async function testDb() {
  console.log('\n=== Consultas a Supabase ===\n')
  const client = createClient(url!, serviceKey || anonKey!, { auth: { persistSession: false } })

  const tables = ['site_settings', 'projects', 'services', 'blog_posts', 'licitaciones', 'contact_submissions'] as const

  for (const table of tables) {
    const { count, error } = await client.from(table).select('*', { count: 'exact', head: true })
    if (error) {
      console.log(`✗ ${table}: ${error.message}`)
      if (error.message.includes('does not exist') || error.code === '42P01') {
        console.log('  → Ejecute scripts/supabase-schema.sql en el SQL Editor de Supabase')
      }
    } else {
      console.log(`✓ ${table}: ${count ?? 0} registros`)
    }
  }

  const { data: settings, error: settingsErr } = await client.from('site_settings').select('id, updated_at').eq('id', 'main').maybeSingle()
  if (!settingsErr && settings) {
    console.log(`✓ site_settings/main actualizado: ${settings.updated_at}`)
  }

  const anonClient = createClient(url!, anonKey!, { auth: { persistSession: false } })
  const { error: rpcErr } = await anonClient.rpc('submit_contact_submission', {
    p_type: 'newsletter',
    p_email: 'test-verify@local.dev',
    p_name: 'Test verificación',
  })
  if (!rpcErr) {
    console.log('✓ Formulario público (RPC): OK')
    await client.from('contact_submissions').delete().eq('email', 'test-verify@local.dev')
  } else {
    console.log(`✗ Formulario público (RPC): ${rpcErr.message}`)
    console.log('  → Ejecute: npm run migrate:contact  (o scripts/migrate-contact-hardening.sql en Supabase)')
  }
}

testDb()
  .then(() => {
    console.log('\n=== Resultado ===')
    if (allOk) console.log('✅ .env.local está correctamente configurado.')
    else console.log('⚠ Revise los ítems marcados con ✗ arriba.')
    console.log('')
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
