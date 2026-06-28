/**
 * Auditoría completa de rutas y funcionalidades en producción.
 * Verifica páginas públicas, panel admin, portal proveedor y APIs.
 *   npx tsx scripts/audit-all-pages.ts
 */
import { resolve } from 'node:path'
import { loadEnvFile } from './lib/load-env-file.js'

loadEnvFile(resolve(process.cwd(), '.env.ferozo'), true)

const VERCEL = 'https://grupo.emprenor.com'
const FEROZO = process.env.VITE_SITE_URL?.replace(/\/$/, '') || 'https://www.emprenor.com.ar'

type Result = { site: string; name: string; ok: boolean; detail: string }
const results: Result[] = []

async function get(url: string, opts: RequestInit = {}): Promise<{ status: number; body: string }> {
  try {
    const res = await fetch(url, { redirect: 'follow', ...opts })
    const body = await res.text()
    return { status: res.status, body }
  } catch (e) {
    return { status: 0, body: e instanceof Error ? e.message : 'Error de red' }
  }
}

function push(site: string, name: string, ok: boolean, detail: string) {
  results.push({ site, name, ok, detail })
  const icon = ok ? '  ✓' : '  ✗'
  console.log(`${icon} [${site}] ${name}: ${detail}`)
}

async function checkSpa(site: string, base: string, path: string, label: string, mustContain?: string) {
  const { status, body } = await get(`${base}${path}`)
  const hasContent = mustContain ? body.includes(mustContain) : true
  const ok = (status === 200) && hasContent
  const detail = status === 200
    ? (mustContain ? (hasContent ? `HTTP 200 + "${mustContain}"` : `HTTP 200 pero sin "${mustContain}"`) : `HTTP 200, ${body.length}b`)
    : `HTTP ${status}`
  push(site, label, ok, detail)
}

async function checkApi(method: string, url: string, label: string, expectStatus: number | number[], body?: object, headers?: Record<string, string>) {
  const { status } = await get(url, {
    method,
    headers: { 'Content-Type': 'application/json', 'Origin': FEROZO, ...headers },
    body: body ? JSON.stringify(body) : undefined,
  })
  const expected = Array.isArray(expectStatus) ? expectStatus : [expectStatus]
  const ok = expected.includes(status)
  push('API', label, ok, `HTTP ${status} (esperado ${expected.join('|')})`)
}

async function main() {
  console.log('\n══════════════════════════════════════════════')
  console.log('  AUDITORÍA COMPLETA — GRUPOEMPRENOR')
  console.log(`  ${new Date().toLocaleString('es-AR')}`)
  console.log('══════════════════════════════════════════════\n')

  // ── PÁGINAS PÚBLICAS — VERCEL ────────────────────────────────────────────
  console.log('── Páginas públicas [Vercel] ──')
  const publicPagesVercel = [
    ['/', 'Home', 'EMPRENOR'],
    ['/empresa', 'Empresa', 'EMPRENOR'],
    ['/servicios', 'Servicios'],
    ['/proyectos', 'Proyectos'],
    ['/blog', 'Blog'],
    ['/licitaciones', 'Licitaciones'],
    ['/contacto', 'Contacto'],
    ['/terminos', 'Términos'],
    ['/privacidad', 'Privacidad'],
    ['/no-existe-404', '404 NotFound'],
  ] as [string, string, string?][]

  for (const [path, label, contains] of publicPagesVercel) {
    await checkSpa('Vercel', VERCEL, path, label, contains)
  }

  // ── PÁGINAS PÚBLICAS — FEROZO ────────────────────────────────────────────
  console.log('\n── Páginas públicas [Ferozo] ──')
  for (const [path, label, contains] of publicPagesVercel) {
    await checkSpa('Ferozo', FEROZO, path, label, contains)
  }

  // ── RUTAS ESPECIALES — FEROZO ────────────────────────────────────────────
  console.log('\n── Archivos especiales [Ferozo] ──')
  await checkSpa('Ferozo', FEROZO, '/robots.txt', 'robots.txt', 'Sitemap')
  await checkSpa('Ferozo', FEROZO, '/sitemap.xml', 'sitemap.xml', 'urlset')

  // ── PANEL ADMIN (SPA, no autenticado) ────────────────────────────────────
  console.log('\n── Panel Admin (rutas SPA) ──')
  const adminRoutes = [
    ['/admin', 'Admin root → redirect login'],
    ['/admin/login', 'Admin Login'],
    ['/admin/dashboard', 'Admin Dashboard (SPA)'],
    ['/admin/consultas', 'Admin Consultas (SPA)'],
    ['/admin/proveedores', 'Admin Proveedores (SPA)'],
    ['/admin/blog', 'Admin Blog (SPA)'],
    ['/admin/licitaciones', 'Admin Licitaciones (SPA)'],
    ['/admin/servicios', 'Admin Servicios (SPA)'],
    ['/admin/proyectos', 'Admin Proyectos (SPA)'],
  ] as [string, string][]

  for (const [path, label] of adminRoutes) {
    // Admin está solo en Vercel (SPA) — Ferozo no tiene backend para redirigir admin
    await checkSpa('Vercel', VERCEL, path, label)
  }

  // ── PORTAL PROVEEDOR (SPA) ───────────────────────────────────────────────
  console.log('\n── Portal Proveedor (rutas SPA) ──')
  const proveedorRoutes = [
    ['/proveedor/login', 'Proveedor Login'],
    ['/proveedor/registro', 'Proveedor Registro'],
    ['/proveedor/dashboard', 'Proveedor Dashboard (SPA)'],
    ['/proveedor/licitaciones', 'Proveedor Licitaciones (SPA)'],
  ] as [string, string][]

  for (const [path, label] of proveedorRoutes) {
    await checkSpa('Vercel', VERCEL, path, label)
    await checkSpa('Ferozo', FEROZO, path, label)
  }

  // ── APIS (Vercel serverless) ─────────────────────────────────────────────
  console.log('\n── APIs serverless [Vercel] ──')

  // OPTIONS preflight
  await checkApi('OPTIONS', `${VERCEL}/api/contact`, 'API contact OPTIONS (CORS preflight)', [204, 200, 405])
  await checkApi('OPTIONS', `${VERCEL}/api/reply`, 'API reply OPTIONS (CORS preflight)', [204, 200, 405])

  // POST contact con honeypot (debe ignorar silenciosamente)
  await checkApi('POST', `${VERCEL}/api/contact`, 'API contact POST honeypot (spam silenciado)', [200, 400], {
    type: 'empresa', name: 'Test', email: 'spam@test.com', message: 'test', honeypot: 'SPAM',
  })

  // POST contact sin datos requeridos (debe retornar 4xx)
  await checkApi('POST', `${VERCEL}/api/contact`, 'API contact POST sin datos (debe rechazar)', [400, 422, 500], {
    type: '', name: '', email: '', message: '',
  })

  // POST reply sin auth (debe retornar 401 o 403)
  await checkApi('POST', `${VERCEL}/api/reply`, 'API reply sin auth (debe rechazar)', [401, 403, 400])

  // ── ARCHIVOS ESTÁTICOS ───────────────────────────────────────────────────
  console.log('\n── Archivos estáticos ──')
  const staticFiles = [
    [`${VERCEL}/favicon.ico`, 'Vercel favicon'],
    [`${FEROZO}/favicon.ico`, 'Ferozo favicon'],
    [`${FEROZO}/.htaccess`, 'Ferozo .htaccess (puede ser 403)'],
  ]
  for (const [url, label] of staticFiles) {
    const { status } = await get(url)
    const ok = [200, 403, 404].includes(status) // 404 favicon es warning menor
    push('Static', label, ok, `HTTP ${status}`)
  }

  // ── RESUMEN ───────────────────────────────────────────────────────────────
  const totalOk = results.filter((r) => r.ok).length
  const totalFail = results.filter((r) => !r.ok).length
  const total = results.length

  console.log('\n══════════════════════════════════════════════')
  console.log(`  RESULTADO: ${totalOk}/${total} OK  |  ${totalFail} fallos`)
  console.log('══════════════════════════════════════════════')

  if (totalFail > 0) {
    console.log('\n✗ FALLOS:')
    results.filter((r) => !r.ok).forEach((r) => {
      console.log(`  ✗ [${r.site}] ${r.name}: ${r.detail}`)
    })
    console.log('')
    process.exit(1)
  } else {
    console.log('\n✅ Todas las páginas y APIs auditadas correctamente.\n')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
