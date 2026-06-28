/**
 * Verifica que el sitio desplegado en Ferozo responda correctamente.
 *   npm run verify:ferozo
 */
import { resolve } from 'node:path'
import { loadEnvFile } from './lib/load-env-file.js'

const ENV_FILE = resolve(process.cwd(), '.env.ferozo')

type Check = { name: string; ok: boolean; detail: string }

async function fetchCheck(url: string, expectStatus = 200): Promise<{ ok: boolean; detail: string }> {
  try {
    const res = await fetch(url, { redirect: 'follow' })
    if (res.status !== expectStatus) {
      return { ok: false, detail: `HTTP ${res.status}` }
    }
    const text = await res.text()
    return { ok: true, detail: `HTTP ${res.status}, ${text.length} bytes` }
  } catch (e) {
    return { ok: false, detail: e instanceof Error ? e.message : 'Error de red' }
  }
}

export async function verifyFerozoSite(siteUrl?: string): Promise<{ ok: boolean; checks: Check[] }> {
  loadEnvFile(ENV_FILE, true)
  const base = (siteUrl ?? process.env.VITE_SITE_URL ?? '').replace(/\/$/, '')
  if (!base) {
    throw new Error('VITE_SITE_URL no definido en .env.ferozo')
  }

  const paths = [
    { name: 'Home', path: '/' },
    { name: 'Contacto (SPA)', path: '/contacto' },
    { name: 'Admin login (SPA)', path: '/admin/login' },
    { name: 'robots.txt', path: '/robots.txt' },
  ]

  const checks: Check[] = []
  for (const { name, path } of paths) {
    const result = await fetchCheck(`${base}${path}`)
    checks.push({ name, ok: result.ok, detail: result.detail })
  }

  const homeHtml = await fetchCheck(base)
  if (homeHtml.ok) {
    const res = await fetch(base)
    const html = await res.text()
    const hasBrand = html.includes('EMPRENOR')
    checks.push({
      name: 'Contenido EMPRENOR en home',
      ok: hasBrand,
      detail: hasBrand ? 'Marca encontrada' : 'HTML sin "EMPRENOR"',
    })
  }

  return { ok: checks.every((c) => c.ok), checks }
}

async function main() {
  console.log('\n=== Verificación sitio Ferozo ===\n')
  const { ok, checks } = await verifyFerozoSite()
  for (const c of checks) {
    console.log(`  ${c.ok ? '✓' : '✗'} ${c.name}: ${c.detail}`)
  }
  console.log('')
  if (!ok) {
    console.error('⚠ Algunas comprobaciones fallaron')
    process.exit(1)
  }
  console.log('✅ Sitio Ferozo verificado')
}

const isMain = process.argv[1]?.includes('verify-ferozo-site')
if (isMain) {
  main().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
