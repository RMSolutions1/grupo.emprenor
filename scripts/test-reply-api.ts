/**
 * Prueba POST /api/reply con sesión admin real.
 *   npx tsx scripts/test-reply-api.ts [origin]
 * origin default: https://grupo.emprenor.com
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'

function loadEnv(path: string) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf-8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 0) continue
    const key = t.slice(0, i).trim()
    if (process.env[key] === undefined) process.env[key] = t.slice(i + 1).trim()
  }
}

loadEnv(resolve(process.cwd(), '.env.local'))

const url = process.env.VITE_SUPABASE_URL!
const anon = process.env.VITE_SUPABASE_ANON_KEY!
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!
const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@emprenor.com.ar'
const password = process.env.SEED_ADMIN_PASSWORD ?? 'Emprenor-Admin-2026!'
const origin = (process.argv[2] ?? 'https://grupo.emprenor.com').replace(/\/$/, '')

async function main() {
  const auth = createClient(url, anon)
  const { data: signIn, error: signErr } = await auth.auth.signInWithPassword({ email, password })
  if (signErr || !signIn.session) {
    console.error('Login falló:', signErr?.message ?? 'sin sesión')
    process.exit(1)
  }
  const token = signIn.session.access_token
  console.log('✓ Login OK:', email)

  const admin = createClient(url, service)
  let row = (await admin
    .from('contact_submissions')
    .select('id, email, name')
    .not('email', 'is', null)
    .neq('email', '')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()).data

  if (!row?.id) {
    const { data: created, error: createErr } = await admin
      .from('contact_submissions')
      .insert({
        type: 'contact',
        name: 'Prueba Reply API',
        email: 'info@emprenor.com.ar',
        message: 'Consulta de prueba para verificar /api/reply',
        read: false,
      })
      .select('id, email, name')
      .single()
    if (createErr || !created) {
      console.error('No se pudo crear consulta de prueba:', createErr?.message)
      process.exit(1)
    }
    row = created
    console.log('✓ Consulta de prueba creada')
  }
  console.log(`✓ Consulta de prueba: ${row.name} <${row.email}> (${row.id})`)

  const apiUrl = `${origin}/api/reply`
  const body = {
    kind: 'contact' as const,
    id: row.id,
    message: `[Prueba automática ${new Date().toISOString()}] Verificación del fix /api/reply. Puede ignorar este mensaje.`,
    subject: 'Re: Prueba sistema EMPRENOR',
  }

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
  console.log(`→ POST ${apiUrl}`)
  console.log(`  Status: ${res.status}`)
  console.log(`  Body:`, JSON.stringify(data))

  if (!res.ok) {
    process.exit(1)
  }
  console.log('✅ Respuesta enviada correctamente')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
