import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const envPath = resolve(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 0) continue
    process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
  }
}

const url = process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@emprenor.com.ar'
const password = process.env.SEED_ADMIN_PASSWORD

if (!url || !key) {
  console.error('❌ Configure VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}

if (!password) {
  console.error('❌ Configure SEED_ADMIN_PASSWORD en .env.local (contraseña obligatoria, sin valor por defecto)')
  process.exit(1)
}

const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

const { data: list, error: listErr } = await admin.auth.admin.listUsers()
if (listErr) {
  console.error(listErr.message)
  process.exit(1)
}

const existing = list.users.find((u) => u.email === email)
if (existing) {
  const { error } = await admin.auth.admin.updateUserById(existing.id, { password })
  if (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
  await admin.from('profiles').upsert({ id: existing.id, email, role: 'admin' })
  console.log(`Usuario actualizado: ${email} (rol admin)`)
} else {
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true })
  if (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
  if (data.user) {
    await admin.from('profiles').upsert({ id: data.user.id, email, role: 'admin' })
  }
  console.log(`Usuario creado: ${data.user?.email} (rol admin)`)
}
