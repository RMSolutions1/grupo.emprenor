/**
 * Build estático para Ferozo (Apache/cPanel).
 * Usa .env.ferozo — no modifica el deploy de Vercel.
 *
 *   cp .env.ferozo.example .env.ferozo
 *   npm run build:ferozo
 */
import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = process.cwd()
const ENV_FILE = resolve(ROOT, '.env.ferozo')
const HTACCESS = resolve(ROOT, 'deploy/ferozo/.htaccess')
const DEFAULT_ORIGIN = 'https://grupo.emprenor.com'

function loadEnvFile(path: string): boolean {
  if (!existsSync(path)) return false
  for (const line of readFileSync(path, 'utf-8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 0) continue
    const key = t.slice(0, i).trim()
    const value = t.slice(i + 1).trim()
    if (key && process.env[key] === undefined) process.env[key] = value
  }
  return true
}

function patchDistSeo(siteUrl: string) {
  const origin = siteUrl.replace(/\/$/, '')
  const dist = resolve(ROOT, 'dist')

  for (const file of ['sitemap.xml', 'robots.txt', 'index.html'] as const) {
    const filePath = resolve(dist, file)
    if (!existsSync(filePath)) {
      console.warn(`⚠ No se encontró dist/${file}`)
      continue
    }
    const updated = readFileSync(filePath, 'utf-8').replaceAll(DEFAULT_ORIGIN, origin)
    writeFileSync(filePath, updated)
    console.log(`✓ dist/${file} → ${origin}`)
  }
}

if (!loadEnvFile(ENV_FILE)) {
  console.error('❌ Falta .env.ferozo')
  console.error('   Copie .env.ferozo.example → .env.ferozo y complete las variables.')
  process.exit(1)
}

const siteUrl = process.env.VITE_SITE_URL?.trim()
const supabaseUrl = process.env.VITE_SUPABASE_URL?.trim()
const anonKey = process.env.VITE_SUPABASE_ANON_KEY?.trim()

if (!siteUrl) {
  console.error('❌ VITE_SITE_URL es obligatorio en .env.ferozo')
  process.exit(1)
}
if (!supabaseUrl || !anonKey) {
  console.error('❌ VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY son obligatorios en .env.ferozo')
  process.exit(1)
}

console.log('Build Ferozo')
console.log(`  Sitio:   ${siteUrl}`)
console.log(`  Supabase: ${supabaseUrl}`)
console.log('')

execSync('npm run build', { stdio: 'inherit', env: process.env, cwd: ROOT })

if (!existsSync(HTACCESS)) {
  console.error('❌ Falta deploy/ferozo/.htaccess')
  process.exit(1)
}
copyFileSync(HTACCESS, resolve(ROOT, 'dist/.htaccess'))
console.log('✓ dist/.htaccess (Apache/Ferozo)')

patchDistSeo(siteUrl)

console.log('')
console.log('✅ Build listo en dist/')
console.log('   Subir automáticamente: npm run deploy:ferozo')
console.log('   Solo FTP (sin rebuild):  npm run upload:ferozo')
