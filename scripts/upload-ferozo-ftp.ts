/**
 * Sube dist/ al hosting Ferozo vía FTP/FTPS.
 * Requiere FTP_* en .env.ferozo (ver .env.ferozo.example).
 *
 *   npm run upload:ferozo
 *   npm run upload:ferozo -- --clean-remote
 */
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { Client } from 'basic-ftp'
import { loadEnvFile } from './lib/load-env-file.js'

const ROOT = process.cwd()
const ENV_FILE = resolve(ROOT, '.env.ferozo')
const DIST = resolve(ROOT, 'dist')

export type FtpConfig = {
  host: string
  user: string
  password: string
  port: number
  secure: boolean
  remoteDir: string
}

export function readFtpConfig(): FtpConfig {
  loadEnvFile(ENV_FILE, true)

  const host = process.env.FTP_HOST?.trim()
  const user = process.env.FTP_USER?.trim()
  const password = process.env.FTP_PASS?.trim()
  const remoteDir = process.env.FTP_REMOTE_DIR?.trim() || '/public_html'

  if (!host || !user || !password) {
    throw new Error(
      'Faltan credenciales FTP en .env.ferozo (FTP_HOST, FTP_USER, FTP_PASS). Ver .env.ferozo.example',
    )
  }

  return {
    host,
    user,
    password,
    port: Number(process.env.FTP_PORT || 21),
    secure: process.env.FTP_SECURE === 'true',
    remoteDir,
  }
}

export async function uploadDistViaFtp(options: { cleanRemote?: boolean; distPath?: string } = {}) {
  const distPath = options.distPath ?? DIST
  if (!existsSync(distPath)) {
    throw new Error(`No existe ${distPath}. Ejecute npm run build:ferozo primero.`)
  }

  const cfg = readFtpConfig()
  const client = new Client(60_000)
  client.ftp.verbose = process.env.FTP_VERBOSE === 'true'

  console.log(`Conectando FTP → ${cfg.host}:${cfg.port} (${cfg.secure ? 'FTPS' : 'FTP'})`)
  console.log(`Destino remoto: ${cfg.remoteDir}`)

  await client.access({
    host: cfg.host,
    user: cfg.user,
    password: cfg.password,
    port: cfg.port,
    secure: cfg.secure,
  })

  await client.ensureDir(cfg.remoteDir)
  await client.cd(cfg.remoteDir)

  if (options.cleanRemote) {
    console.log('→ Limpiando directorio remoto…')
    await client.clearWorkingDir()
  }

  console.log('→ Subiendo archivos de dist/ …')
  await client.uploadFromDir(distPath)
  client.close()

  console.log('✓ Upload FTP completado')
}

async function main() {
  const cleanRemote = process.argv.includes('--clean-remote')
  await uploadDistViaFtp({ cleanRemote })
}

const isMain = process.argv[1]?.includes('upload-ferozo-ftp')
if (isMain) {
  main().catch((e) => {
    console.error('✗ FTP:', e instanceof Error ? e.message : e)
    process.exit(1)
  })
}
