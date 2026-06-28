/**
 * Backend serverless en Vercel (grupo.emprenor.com).
 * Ferozo (.com.ar) y localhost usan el mismo origen de API que Vercel.
 */
const DEFAULT_API_ORIGIN = 'https://grupo.emprenor.com'

/** Lógica testeable de resolución del origen API. */
export function resolveApiBase(hostname: string | undefined, envOrigin?: string): string {
  if (envOrigin?.trim()) return envOrigin.trim().replace(/\/$/, '')
  if (hostname) {
    const h = hostname.toLowerCase()
    if (h.endsWith('.com.ar') || h === 'localhost' || h === '127.0.0.1') {
      return DEFAULT_API_ORIGIN
    }
  }
  return ''
}

/** Base URL del backend Vercel, o '' si el sitio ya corre en Vercel (mismo origen). */
export function vercelApiBase(): string {
  const env = import.meta.env.VITE_API_ORIGIN as string | undefined
  const host = typeof window !== 'undefined' ? window.location.hostname : undefined
  return resolveApiBase(host, env)
}

/** Ruta absoluta o relativa hacia /api/* en Vercel. */
export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const base = vercelApiBase()
  return base ? `${base}${normalized}` : normalized
}
