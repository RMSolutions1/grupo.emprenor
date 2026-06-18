/**
 * Prueba E2E del flujo proveedor: registro → pendiente → aprobación admin → dashboard.
 *   npx tsx scripts/test-proveedor-flow.ts
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
const anon = process.env.VITE_SUPABASE_ANON_KEY!
const svc = process.env.SUPABASE_SERVICE_ROLE_KEY!

const ts = Date.now()
const testEmail = `audit-proveedor-${ts}@emprenor.com.ar`
const testPassword = 'Audit-Proveedor-2026!'
const testCuit = `30-${String(ts).slice(-8)}-9`

async function main() {
  const admin = createClient(url, svc)
  const client = createClient(url, anon)

  console.log('1. Crear usuario proveedor vía admin:', testEmail)
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
    user_metadata: { role: 'provider' },
  })
  if (createErr || !created.user) {
    console.error('✗ createUser falló:', createErr?.message)
    process.exit(1)
  }
  const { error: siErr } = await client.auth.signInWithPassword({ email: testEmail, password: testPassword })
  if (siErr) {
    console.error('✗ Login falló:', siErr.message)
    process.exit(1)
  }
  console.log('✓ Usuario creado y logueado')

  console.log('2. RPC register_proveedor')
  const { data: orgId, error: regErr } = await client.rpc('register_proveedor', {
    p_razon_social: `Empresa Audit ${ts}`,
    p_cuit: testCuit,
    p_email: testEmail,
    p_phone: '3876000000',
    p_address: 'Test 123',
    p_city: 'Salta',
    p_province: 'Salta',
    p_rubros: ['Obra Civil'],
    p_contact_name: 'Auditor',
    p_website: null,
  })
  if (regErr) {
    console.error('✗ register_proveedor:', regErr.message)
    process.exit(1)
  }
  console.log('✓ Org creada:', orgId)

  const { data: members } = await admin.from('proveedor_miembros').select('*').eq('organizacion_id', orgId)
  console.log('  miembros (service):', members?.length, members?.[0]?.user_id)
  const { data: { user: me } } = await client.auth.getUser()
  console.log('  auth.uid():', me?.id)

  const { data: myMember, error: memErr } = await client.from('proveedor_miembros').select('organizacion_id').maybeSingle()
  console.log('  proveedor_miembros read:', myMember, memErr?.message ?? 'ok')

  console.log('3. Verificar estado pendiente')
  const { data: allOrgs, error: allErr } = await client.from('organizaciones').select('id, status')
  console.log('  orgs visibles:', allOrgs?.length, allErr?.message, allOrgs)
  const { data: rpcOrgId } = await client.rpc('my_organizacion_id')
  console.log('  my_organizacion_id():', rpcOrgId)

  const { data: org, error: orgReadErr } = await client.from('organizaciones').select('status').eq('id', orgId).maybeSingle()
  if (orgReadErr) console.log('  org read error:', orgReadErr.message)
  if (org?.status !== 'pendiente') {
    console.error('✗ Estado esperado pendiente, got:', org?.status)
    process.exit(1)
  }
  console.log('✓ Estado pendiente OK')

  console.log('4. Guard bloquea dashboard (sin aprobación)')
  const { data: licitaciones } = await client.from('licitaciones').select('id').eq('published', true).limit(1)
  console.log('  Licitaciones publicadas accesibles:', licitaciones?.length ?? 0)

  console.log('5. Admin aprueba organización')
  const { error: updErr } = await admin.from('organizaciones').update({ status: 'aprobado', reviewed_at: new Date().toISOString() }).eq('id', orgId)
  if (updErr) {
    console.error('✗ Aprobación admin falló:', updErr.message)
    process.exit(1)
  }

  const { data: org2 } = await client.from('organizaciones').select('status').eq('id', orgId).single()
  if (org2?.status !== 'aprobado') {
    console.error('✗ Proveedor no ve aprobación:', org2?.status)
    process.exit(1)
  }
  console.log('✓ Aprobación visible para proveedor')

  console.log('6. Perfil role=provider')
  const { data: { user } } = await client.auth.getUser()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user!.id).single()
  if (profile?.role !== 'provider') {
    console.error('✗ Rol incorrecto:', profile?.role)
    process.exit(1)
  }
  console.log('✓ Rol provider OK')

  console.log('7. Admin staff puede listar organizaciones')
  const adminAuth = createClient(url, anon)
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@emprenor.com.ar'
  const adminPass = process.env.SEED_ADMIN_PASSWORD ?? 'Emprenor-Admin-2026!'
  await adminAuth.auth.signInWithPassword({ email: adminEmail, password: adminPass })
  const { data: orgs, error: listErr } = await adminAuth.from('organizaciones').select('id, razon_social, status')
  if (listErr || !orgs?.some((o) => o.id === orgId)) {
    console.error('✗ Admin no lista org:', listErr?.message)
    process.exit(1)
  }
  console.log('✓ Admin ve', orgs.length, 'organizaciones')

  console.log('8. Limpieza datos de prueba')
  await admin.from('proveedor_miembros').delete().eq('organizacion_id', orgId)
  await admin.from('organizaciones').delete().eq('id', orgId)
  if (user) await admin.auth.admin.deleteUser(user.id)
  console.log('✓ Limpieza OK')

  console.log('\n✅ Flujo proveedor E2E completado')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
