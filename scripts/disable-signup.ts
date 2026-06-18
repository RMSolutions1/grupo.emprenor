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
    process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
  }
}

loadEnv()

const url = process.env.VITE_SUPABASE_URL!
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
}

const get = await fetch(`${url}/auth/v1/settings`, { headers })
console.log('GET /auth/v1/settings →', get.status)
console.log(await get.text())

const put = await fetch(`${url}/auth/v1/settings`, {
  method: 'PATCH',
  headers,
  body: JSON.stringify({ disable_signup: true }),
})
console.log('PATCH disable_signup →', put.status)
console.log(await put.text())
