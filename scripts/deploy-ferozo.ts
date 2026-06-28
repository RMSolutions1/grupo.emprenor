/**
 * Deploy completo a Ferozo: verificaciones → build → FTP → comprobación HTTP.
 *
 *   npm run deploy:ferozo
 *   npm run deploy:ferozo -- --clean-remote
 *   npm run deploy:ferozo -- --skip-upload     (solo build + checks)
 *   npm run deploy:ferozo -- --skip-checks     (solo build + upload)
 */
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadEnvFile } from './lib/load-env-file.js'
import { uploadDistViaFtp } from './upload-ferozo-ftp.js'
import { verifyFerozoSite } from './verify-ferozo-site.js'

const ROOT = process.cwd()
const ENV_FEROZO = resolve(ROOT, '.env.ferozo')
const ENV_LOCAL = resolve(ROOT, '.env.local')

function run(cmd: string, label: string) {
  console.log(`\n→ ${label}`)
  execSync(cmd, { stdio: 'inherit', cwd: ROOT })
  console.log(`✓ ${label}`)
}

async function main() {
  const skipChecks = process.argv.includes('--skip-checks')
  const skipUpload = process.argv.includes('--skip-upload')
  const cleanRemote = process.argv.includes('--clean-remote')

  console.log('\n=== Deploy EMPRENOR → Ferozo (FTP) ===\n')

  if (!existsSync(ENV_FEROZO)) {
    console.error('❌ Falta .env.ferozo')
    console.error('   cp .env.ferozo.example .env.ferozo')
    console.error('   Complete VITE_* y FTP_* (ver deploy/ferozo/CHECKLIST.md)')
    process.exit(1)
  }

  loadEnvFile(ENV_FEROZO, true)

  if (!skipChecks) {
    run('npm run lint', 'ESLint')
    run('npm run test', 'Tests unitarios')
    if (existsSync(ENV_LOCAL)) {
      try {
        run('npm run verify:env', 'Variables Supabase (.env.local)')
      } catch {
        console.warn('⚠ verify:env falló — revise .env.local (deploy continúa)')
      }
    } else {
      console.log('\nℹ Sin .env.local — omitiendo verify:env')
    }
  }

  run('npm run build:ferozo', 'Build estático Ferozo')

  if (!skipUpload) {
    try {
      await uploadDistViaFtp({ cleanRemote })
    } catch (e) {
      console.error('\n✗ Upload FTP falló:', e instanceof Error ? e.message : e)
      console.error('  Configure FTP_HOST, FTP_USER, FTP_PASS en .env.ferozo')
      process.exit(1)
    }

    console.log('\n→ Verificación HTTP post-deploy')
    const { ok, checks } = await verifyFerozoSite()
    for (const c of checks) {
      console.log(`  ${c.ok ? '✓' : '✗'} ${c.name}: ${c.detail}`)
    }
    if (!ok) {
      console.warn('\n⚠ El upload terminó pero algunas URLs no respondieron como se esperaba.')
      console.warn('  Puede ser caché DNS/CDN — reintente npm run verify:ferozo en unos minutos.')
    } else {
      console.log('\n✅ Deploy Ferozo completado y verificado')
    }
  } else {
    console.log('\n✅ Build listo en dist/ (--skip-upload)')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
