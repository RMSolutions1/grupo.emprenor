/**
 * Verifica que ambos frontends en producción respondan correctamente.
 *   npm run verify:sites
 */
import { resolve } from 'node:path'
import { loadEnvFile } from './lib/load-env-file.js'
import { verifyFerozoSite } from './verify-ferozo-site.js'

const VERCEL_URL = 'https://grupo.emprenor.com'

type Check = { site: string; name: string; ok: boolean; detail: string }

async function fetchCheck(url: string, expectStatus = 200): Promise<{ ok: boolean; detail: string; body?: string }> {
  try {
    const res = await fetch(url, { redirect: 'follow' })
    const body = await res.text()
    if (res.status !== expectStatus) return { ok: false, detail: `HTTP ${res.status}`, body }
    return { ok: true, detail: `HTTP ${res.status}, ${body.length} bytes`, body }
  } catch (e) {
    return { ok: false, detail: e instanceof Error ? e.message : 'Error de red' }
  }
}

async function verifyVercel(): Promise<Check[]> {
  const checks: Check[] = []
  const paths = [
    { name: 'Home', path: '/' },
    { name: 'Contacto (SPA)', path: '/contacto' },
    { name: 'API contact (OPTIONS)', path: '/api/contact', method: 'OPTIONS' as const },
  ]

  for (const { name, path } of paths) {
    const url = `${VERCEL_URL}${path}`
    if (path.includes('api/contact')) {
      try {
        const res = await fetch(url, { method: 'OPTIONS' })
        checks.push({
          site: 'Vercel',
          name,
          ok: res.status === 204 || res.status === 405 || res.status === 200,
          detail: `HTTP ${res.status}`,
        })
      } catch (e) {
        checks.push({ site: 'Vercel', name, ok: false, detail: e instanceof Error ? e.message : 'Error' })
      }
      continue
    }
    const r = await fetchCheck(url)
    checks.push({ site: 'Vercel', name, ok: r.ok, detail: r.detail })
  }

  const home = await fetchCheck(VERCEL_URL)
  if (home.ok && home.body) {
    checks.push({
      site: 'Vercel',
      name: 'Contenido EMPRENOR',
      ok: home.body.includes('EMPRENOR'),
      detail: home.body.includes('EMPRENOR') ? 'OK' : 'Sin marca en HTML',
    })
  }

  return checks
}

async function main() {
  loadEnvFile(resolve(process.cwd(), '.env.ferozo'), true)

  console.log('\n=== Verificación de ambos sitios en producción ===\n')

  const vercel = await verifyVercel()
  for (const c of vercel) {
    console.log(`  ${c.ok ? '✓' : '✗'} [Vercel] ${c.name}: ${c.detail}`)
  }

  console.log('')
  const ferozo = await verifyFerozoSite()
  for (const c of ferozo.checks) {
    console.log(`  ${c.ok ? '✓' : '✗'} [Ferozo] ${c.name}: ${c.detail}`)
  }

  const allOk = vercel.every((c) => c.ok) && ferozo.ok
  console.log('')
  if (allOk) {
    console.log('✅ Ambos sitios responden correctamente')
    console.log(`   Vercel:  ${VERCEL_URL}`)
    console.log(`   Ferozo:  ${process.env.VITE_SITE_URL ?? 'https://www.emprenor.com.ar'}`)
  } else {
    console.log('⚠ Revisar ítems marcados con ✗')
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
