import { existsSync, readFileSync } from 'node:fs'

/** Carga variables KEY=VALUE desde un archivo .env (no sobrescribe las ya definidas). */
export function loadEnvFile(path: string, overwrite = false): boolean {
  if (!existsSync(path)) return false
  for (const line of readFileSync(path, 'utf-8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 0) continue
    const key = t.slice(0, i).trim()
    let value = t.slice(i + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (key && (overwrite || process.env[key] === undefined)) {
      process.env[key] = value
    }
  }
  return true
}
