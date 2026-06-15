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

const url = process.env.VITE_SUPABASE_URL!
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@emprenor.com.ar'
const password = process.env.SEED_ADMIN_PASSWORD ?? 'AdminEmprenor2026!'

const { data: list, error: listErr } = await admin.auth.admin.listUsers()
if (listErr) {
  console.error(listErr.message)
  process.exit(1)
}

const existing = list.users.find((u) => u.email === email)
if (existing) {
  const { error } = await admin.auth.admin.updateUserById(existing.id, { password })
  console.log(error ? `Error: ${error.message}` : `Usuario actualizado: ${email}`)
} else {
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true })
  console.log(error ? `Error: ${error.message}` : `Usuario creado: ${data.user?.email}`)
}
